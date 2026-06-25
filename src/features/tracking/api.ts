// src/features/tracking/api.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession, authOptions } from "@/lib/auth";
import { calculateLevel } from "@/lib/utils";
import { AnimeStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ============================================================
// BADGE DEFINITIONS (8 badges for MVP)
// ============================================================

const BADGE_DEFINITIONS = {
  first_anime: {
    name: "First Anime",
    description: "Added your first anime to your list",
    icon: "scroll",
    xpReward: 100,
    category: "beginner",
  },
  episode_master: {
    name: "Episode Master",
    description: "Watched 500 episodes total",
    icon: "sword",
    xpReward: 300,
    category: "milestone",
  },
  anime_veteran: {
    name: "Anime Veteran",
    description: "Completed 50 anime",
    icon: "crown",
    xpReward: 500,
    category: "milestone",
  },
  completionist: {
    name: "Completionist",
    description: "Completed 20 anime",
    icon: "trophy",
    xpReward: 250,
    category: "achievement",
  },
  anime_lover: {
    name: "Anime Lover",
    description: "Watched 1000 episodes",
    icon: "heart",
    xpReward: 750,
    category: "milestone",
  },
  binge_watcher: {
    name: "Binge Watcher",
    description: "Watched 10+ episodes in one session",
    icon: "fire",
    xpReward: 150,
    category: "special",
  },
  collector: {
    name: "Collector",
    description: "Have 25 anime in your list",
    icon: "inventory",
    xpReward: 200,
    category: "collection",
  },
  favorite_curator: {
    name: "Favorite Curator",
    description: "Added 5 anime to your favorites",
    icon: "bookmark",
    xpReward: 100,
    category: "collection",
  },
};

const EARLY_ADOPTER_LIMIT = 1000;

// ============================================================
// XP REWARD CONFIG
// ============================================================

const XP_CONFIG = {
  ADD_TO_LIST: 5,             // Adding a new anime to list
  ADD_TO_FAVORITES: 10,       // Adding to favorites (one-time per anime)
  EPISODE_WATCHED: 10,         // Per episode watched
  COMPLETE_BASE: 20,          // Base XP for completing any anime
  COMPLETE_PER_EPISODE: 1,    // Additional XP per episode in the anime
  // Formula: COMPLETE_BASE + (episodes * COMPLETE_PER_EPISODE)
  // 12-ep anime = 20 + (12 * 1) = 32 XP
  // 24-ep anime = 20 + (24 * 1) = 44 XP
};

// ============================================================
// AUTH HELPERS
// ============================================================

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

// ============================================================
// XP & LEVEL SYSTEM
// ============================================================

async function awardXP(userId: string, amount: number, reason: string) {
  if (amount <= 0) return;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
  });

  const newLevel = calculateLevel(user.xp);
  if (newLevel !== user.level) {
    await prisma.user.update({
      where: { id: userId },
      data: { level: newLevel },
    });
  }

  console.log(`[XP] User ${userId}: +${amount} XP (${reason}) - Level ${newLevel}`);
  return user;
}

// ============================================================
// XP EXPLOIT PREVENTION
// ============================================================

// Track one-time XP awards per user per anime
// These are actions that should only give XP once

async function hasReceivedListAddXP(userId: string, animeId: number): Promise<boolean> {
  // List add XP is awarded only when creating a NEW entry (not updating)
  // This is handled in the addToAnimeList function by checking `existing`
  // No additional tracking needed since we only award on creation
  return false;
}

async function hasReceivedFavoriteXP(userId: string, animeId: number): Promise<boolean> {
  // Check if this favorite already exists
  const existing = await prisma.favorite.findUnique({
    where: { userId_animeId: { userId, animeId } },
  });
  return !!existing;
}

// Episode progress validation
function validateProgressUpdate(
  currentProgress: number,
  newProgress: number,
  totalEpisodes: number | null
): { valid: boolean; episodesWatched: number; reason?: string } {
  // Can't exceed total episodes (if known)
  if (totalEpisodes && newProgress > totalEpisodes) {
    return { valid: false, episodesWatched: 0, reason: `Cannot exceed ${totalEpisodes} episodes` };
  }

  const jump = newProgress - currentProgress;
  
  // No change = no XP
  if (jump === 0) {
    return { valid: true, episodesWatched: 0 };
  }

  // Only award XP for increases (negative jump = decrease = 0 XP)
  const episodesWatched = jump > 0 ? jump : 0;
  
  return { valid: true, episodesWatched };
}

// ============================================================
// ANIME LIST CRUD
// ============================================================

export async function addToAnimeList(
  animeId: number,
  status: AnimeStatus,
  progress?: number,
  score?: number
) {
  const userId = await getCurrentUser();

  const existing = await prisma.animeList.findUnique({
    where: { userId_animeId: { userId, animeId } },
  });

  if (existing) {
    const wasAlreadyCompleted = existing.status === "COMPLETED";
    
    // If updating to COMPLETED without progress, fetch total episodes
    let updatedProgress = progress ?? existing.progress;
    if (status === "COMPLETED" && !progress && existing.progress === 0) {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = await res.json();
        const totalEpisodes = data.data?.episodes;
        if (totalEpisodes) {
          updatedProgress = totalEpisodes;
        }
      } catch {
        // If Jikan fails, keep existing progress
        console.warn("Could not fetch episode count from Jikan when updating to completed");
      }
    }

    const updated = await prisma.animeList.update({
      where: { id: existing.id },
      data: {
        status,
        progress: updatedProgress,
        score: score ?? existing.score,
        ...(status === "COMPLETED" && !existing.completedAt
          ? { completedAt: new Date() }
          : {}),
        ...(status === "WATCHING" && !existing.startedAt
          ? { startedAt: new Date() }
          : {}),
      },
    });

    // Award XP for completing (only if newly completed)
    if (status === "COMPLETED" && !wasAlreadyCompleted) {
      await awardCompletionXP(userId, updated.progress);
      await checkCompletionBadges(userId);
    }

    revalidatePath("/library");
    revalidatePath("/profile");
    return updated;
  }

  // Create new entry — award list add XP (one-time)
  let finalProgress = progress || 0;
  
  // If completing anime without progress, fetch total episodes
  if (status === "COMPLETED" && !progress) {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
      const data = await res.json();
      const totalEpisodes = data.data?.episodes;
      if (totalEpisodes) {
        finalProgress = totalEpisodes;
      }
    } catch {
      // If Jikan fails, keep progress at 0
      console.warn("Could not fetch episode count from Jikan for completed anime");
    }
  }
  
  const created = await prisma.animeList.create({
    data: {
      userId,
      animeId,
      status,
      progress: finalProgress,
      score: score || null,
      startedAt: status === "WATCHING" ? new Date() : null,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  // Award XP for adding to list (one-time, only on creation)
  await awardXP(userId, XP_CONFIG.ADD_TO_LIST, "Added anime to list");

  // Award XP if completed immediately
  if (status === "COMPLETED") {
    await awardCompletionXP(userId, created.progress);
  }

  // Check badges
  await checkFirstAnimeBadge(userId);
  await checkCollectorBadge(userId);
  if (status === "COMPLETED") {
    await checkCompletionBadges(userId);
  }

  revalidatePath("/library");
  revalidatePath("/profile");
  return created;
}

export async function updateProgress(animeId: number, progress: number) {
  const userId = await getCurrentUser();

  const entry = await prisma.animeList.findUnique({
    where: { userId_animeId: { userId, animeId } },
  });

  if (!entry) {
    // Create new entry with watching status
    return addToAnimeList(animeId, "WATCHING", progress);
  }

  // Fetch total episodes from Jikan for validation
  let totalEpisodes: number | null = null;
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    const data = await res.json();
    totalEpisodes = data.data?.episodes || null;
  } catch {
    // If Jikan fails, skip total episode validation
    console.warn("Could not fetch episode count from Jikan");
  }

  // Validate progress update
  const validation = validateProgressUpdate(entry.progress, progress, totalEpisodes);
  if (!validation.valid) {
    console.warn(`[XP BLOCKED] User ${userId}: ${validation.reason} for anime ${animeId}`);
    return entry;
  }

  const { episodesWatched } = validation;

  // Only update if there's actual change
  if (episodesWatched === 0 && progress === entry.progress) {
    return entry;
  }

  const updated = await prisma.animeList.update({
    where: { id: entry.id },
    data: {
      progress,
      status: entry.status === "PLAN_TO_WATCH" ? "WATCHING" : entry.status,
      ...(entry.status !== "WATCHING" && entry.status !== "REWATCHING"
        ? { startedAt: new Date() }
        : {}),
    },
  });

  // Award XP for episodes watched
  if (episodesWatched > 0) {
    await awardXP(
      userId,
      episodesWatched * XP_CONFIG.EPISODE_WATCHED,
      `Watched ${episodesWatched} episode${episodesWatched > 1 ? "s" : ""}`
    );

    // Binge watcher check
    if (episodesWatched >= 10) {
      await checkAndAwardBadge(userId, "binge_watcher");
    }
  }

  // Auto-complete when all episodes watched
  if (totalEpisodes && progress >= totalEpisodes && entry.status !== "COMPLETED") {
    const wasAlreadyCompleted = false;
    await prisma.animeList.update({
      where: { id: entry.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    await awardCompletionXP(userId, progress);
    await checkCompletionBadges(userId);
  }

  // Check episode milestone badges
  await checkEpisodeMilestones(userId);

  revalidatePath("/profile");
  return updated;
}

export async function removeFromList(animeId: number) {
  const userId = await getCurrentUser();
  await prisma.animeList.deleteMany({
    where: { userId, animeId },
  });
  revalidatePath("/library");
}

export async function getUserAnimeList(
  status?: AnimeStatus,
  sortBy: "updatedAt" | "score" | "progress" = "updatedAt"
) {
  const userId = await getCurrentUser();
  return prisma.animeList.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    orderBy: { [sortBy]: "desc" },
  });
}

// ============================================================
// COMPLETION XP (based on episode count)
// ============================================================

async function awardCompletionXP(userId: string, episodesWatched: number) {
  const xpAmount = XP_CONFIG.COMPLETE_BASE + (episodesWatched * XP_CONFIG.COMPLETE_PER_EPISODE);
  await awardXP(userId, xpAmount, `Completed anime (${episodesWatched} episodes)`);
}

// ============================================================
// FAVORITES
// ============================================================

export async function addToFavorites(animeId: number) {
  const userId = await getCurrentUser();

  // Check if already favorited (prevents duplicate XP)
  const existing = await prisma.favorite.findUnique({
    where: { userId_animeId: { userId, animeId } },
  });

  if (existing) {
    return existing; // Already favorited, no XP
  }

  const created = await prisma.favorite.create({
    data: { userId, animeId },
  });

  // Award XP for favoriting (one-time per anime)
  await awardXP(userId, XP_CONFIG.ADD_TO_FAVORITES, "Added anime to favorites");

  // Check favorite curator badge
  await checkFavoriteCuratorBadge(userId);

  revalidatePath("/profile");
  return created;
}

export async function removeFromFavorites(animeId: number) {
  const userId = await getCurrentUser();
  await prisma.favorite.deleteMany({
    where: { userId, animeId },
  });
  revalidatePath("/profile");
}

export async function getUserFavorites(userId?: string) {
  const id = userId || (await getCurrentUser());
  return prisma.favorite.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });
}

// ============================================================
// BADGE CHECK FUNCTIONS
// ============================================================

async function checkFirstAnimeBadge(userId: string) {
  const count = await prisma.animeList.count({ where: { userId } });
  if (count >= 1) {
    await checkAndAwardBadge(userId, "first_anime");
  }
}

async function checkCompletionBadges(userId: string) {
  const completedCount = await prisma.animeList.count({
    where: { userId, status: "COMPLETED" },
  });

  if (completedCount >= 50) await checkAndAwardBadge(userId, "anime_veteran");
  if (completedCount >= 20) await checkAndAwardBadge(userId, "completionist");
}

async function checkEpisodeMilestones(userId: string) {
  const totalProgress = await prisma.animeList.aggregate({
    where: { 
      userId,
      status: { not: "REWATCHING" }
    },
    _sum: { progress: true },
  });

  const totalEpisodes = totalProgress._sum.progress || 0;

  if (totalEpisodes >= 500) await checkAndAwardBadge(userId, "anime_lover");
  if (totalEpisodes >= 1000) await checkAndAwardBadge(userId, "episode_master");
}

async function checkCollectorBadge(userId: string) {
  const count = await prisma.animeList.count({ where: { userId } });
  if (count >= 25) await checkAndAwardBadge(userId, "collector");
}

async function checkFavoriteCuratorBadge(userId: string) {
  const count = await prisma.favorite.count({ where: { userId } });
  if (count >= 5) await checkAndAwardBadge(userId, "favorite_curator");
}

export async function checkEarlyAdopterBadge(userId: string) {
  const userCount = await prisma.user.count();
  if (userCount <= EARLY_ADOPTER_LIMIT) {
    await checkAndAwardBadge(userId, "early_adopter");
  }
}

// ============================================================
// BADGE AWARDING
// ============================================================

async function checkAndAwardBadge(userId: string, badgeKey: string) {
  const definition = BADGE_DEFINITIONS[badgeKey as keyof typeof BADGE_DEFINITIONS];
  if (!definition) return;

  const badge = await prisma.badge.upsert({
    where: { id: badgeKey },
    update: {
      name: definition.name,
      description: definition.description,
      icon: definition.icon,
      xpReward: definition.xpReward,
      category: definition.category,
    },
    create: {
      id: badgeKey,
      name: definition.name,
      description: definition.description,
      icon: definition.icon,
      xpReward: definition.xpReward,
      category: definition.category,
    },
  });

  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });

  if (!existing) {
    await prisma.userBadge.create({
      data: { userId, badgeId: badge.id },
    });

    await awardXP(userId, definition.xpReward, `Earned badge: ${definition.name}`);
    console.log(`[BADGE] User ${userId} earned: ${definition.name} (${definition.category})`);
  }
}

// ============================================================
// USER STATS & BADGES
// ============================================================

export async function getUserStats(userId?: string) {
  const id = userId || (await getCurrentUser());

  const [listCounts, totalEpisodes, ratedCount, user, favoritesCount] = await Promise.all([
    prisma.animeList.groupBy({
      by: ["status"],
      where: { userId: id },
      _count: true,
    }),
    prisma.animeList.aggregate({
      where: { 
        userId: id,
        status: { not: "REWATCHING" }
      },
      _sum: { progress: true },
    }),
    prisma.animeList.count({
      where: { userId: id, score: { not: null } },
    }),
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        xp: true,
        level: true,
        username: true,
        name: true,
        image: true,
        createdAt: true,
      },
    }),
    prisma.favorite.count({
      where: { userId: id },
    }),
  ]);

  const statusCounts: Record<string, number> = {};
  listCounts.forEach((group) => {
    statusCounts[group.status] = group._count;
  });

  return {
    user,
    stats: {
      totalAnime: listCounts.reduce((sum, g) => sum + g._count, 0),
      watching: statusCounts["WATCHING"] || 0,
      completed: statusCounts["COMPLETED"] || 0,
      planToWatch: statusCounts["PLAN_TO_WATCH"] || 0,
      paused: statusCounts["PAUSED"] || 0,
      dropped: statusCounts["DROPPED"] || 0,
      reWatching: statusCounts["REWATCHING"] || 0,
      totalEpisodes: totalEpisodes._sum.progress || 0,
      ratedCount,
      favoritesCount,
    },
  };
}

export async function getUserBadges(userId?: string) {
  const id = userId || (await getCurrentUser());
  return prisma.userBadge.findMany({
    where: { userId: id },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });
}