// src/features/tracking/api.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession, authOptions } from "@/lib/auth";
import { apiClient } from "@/lib/api-client";
import { createBadgeNotification, createLevelUpNotification } from "@/lib/notifications";
import { calculateLevel } from "@/lib/utils";
import { AnimeStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ============================================================
// FEEDBACK TYPES
// ============================================================

export interface FeedbackData {
  xpEarned: number;
  newBadges: { name: string; xpReward: number }[];
  previousLevel: number;
  newLevel: number;
}

// ============================================================
// BADGE DEFINITIONS (8 badges for MVP)
// ============================================================

const BADGE_DEFINITIONS: Record<string, { name: string; description: string; icon: string; xpReward: number; category: string }> = {
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
  ADD_TO_LIST: 5,
  ADD_TO_FAVORITES: 10,
  EPISODE_WATCHED: 10,
  COMPLETE_BASE: 20,
  COMPLETE_PER_EPISODE: 1,
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

async function awardXP(userId: string, amount: number, reason: string): Promise<{ xpEarned: number; previousLevel: number; newLevel: number }> {
  if (amount <= 0) return { xpEarned: 0, previousLevel: 1, newLevel: 1 };

  const user = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
  });

  const previousLevel = user.level;
  const newLevel = calculateLevel(user.xp);
  if (newLevel !== user.level) {
    await prisma.user.update({
      where: { id: userId },
      data: { level: newLevel },
    });
    // Fire-and-forget level up notification (errors are logged)
    createLevelUpNotification(userId, newLevel);
  }

  console.log(`[XP] User ${userId}: +${amount} XP (${reason}) - Level ${newLevel}`);
  return { xpEarned: amount, previousLevel, newLevel };
}

// ============================================================
// VALIDATION
// ============================================================

function validateProgressUpdate(
  currentProgress: number,
  newProgress: number,
  totalEpisodes: number | null
): { valid: boolean; episodesWatched: number; reason?: string } {
  if (totalEpisodes && newProgress > totalEpisodes) {
    return { valid: false, episodesWatched: 0, reason: `Cannot exceed ${totalEpisodes} episodes` };
  }

  const jump = newProgress - currentProgress;
  
  if (jump === 0) {
    return { valid: true, episodesWatched: 0 };
  }

  const episodesWatched = jump > 0 ? jump : 0;
  
  return { valid: true, episodesWatched };
}

// ============================================================
// BADGE FUNCTIONS
// ============================================================

async function checkAndAwardBadge(userId: string, badgeKey: string): Promise<{ name: string; xpReward: number } | null> {
  const definition = BADGE_DEFINITIONS[badgeKey];
  if (!definition) return null;

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
    // Fire-and-forget badge notification (errors are logged)
    createBadgeNotification(userId, definition.name);
    console.log(`[BADGE] User ${userId} earned: ${definition.name} (${definition.category})`);
    return { name: definition.name, xpReward: definition.xpReward };
  }

  return null;
}

async function checkFirstAnimeBadge(userId: string): Promise<{ name: string; xpReward: number } | null> {
  const count = await prisma.animeList.count({ where: { userId } });
  if (count >= 1) {
    return checkAndAwardBadge(userId, "first_anime");
  }
  return null;
}

async function checkCompletionBadges(userId: string): Promise<{ name: string; xpReward: number }[]> {
  const completedCount = await prisma.animeList.count({
    where: { userId, status: "COMPLETED" },
  });

  const results: { name: string; xpReward: number }[] = [];
  if (completedCount >= 50) {
    const r = await checkAndAwardBadge(userId, "anime_veteran");
    if (r) results.push(r);
  }
  if (completedCount >= 20) {
    const r = await checkAndAwardBadge(userId, "completionist");
    if (r) results.push(r);
  }
  return results;
}

async function checkEpisodeMilestones(userId: string): Promise<{ name: string; xpReward: number }[]> {
  const totalProgress = await prisma.animeList.aggregate({
    where: { 
      userId,
      status: { not: "REWATCHING" }
    },
    _sum: { progress: true },
  });

  const totalEpisodes = totalProgress._sum.progress || 0;
  const results: { name: string; xpReward: number }[] = [];

  if (totalEpisodes >= 500) {
    const r = await checkAndAwardBadge(userId, "anime_lover");
    if (r) results.push(r);
  }
  if (totalEpisodes >= 1000) {
    const r = await checkAndAwardBadge(userId, "episode_master");
    if (r) results.push(r);
  }

  return results;
}

async function checkCollectorBadge(userId: string): Promise<{ name: string; xpReward: number } | null> {
  const count = await prisma.animeList.count({ where: { userId } });
  if (count >= 25) {
    return checkAndAwardBadge(userId, "collector");
  }
  return null;
}

async function checkFavoriteCuratorBadge(userId: string): Promise<{ name: string; xpReward: number } | null> {
  const count = await prisma.favorite.count({ where: { userId } });
  if (count >= 5) {
    return checkAndAwardBadge(userId, "favorite_curator");
  }
  return null;
}

// ============================================================
// ANIME LIST CRUD
// ============================================================

export async function addToAnimeList(
  animeId: number,
  status: AnimeStatus,
  progress?: number,
  score?: number
): Promise<{ entry: unknown; feedback: FeedbackData }> {
  const userId = await getCurrentUser();
  let totalXpEarned = 0;
  const earnedBadges: { name: string; xpReward: number }[] = [];
  let previousLevel = 1;
  let newLevel = 1;

  const existing = await prisma.animeList.findUnique({
    where: { userId_animeId: { userId, animeId } },
  });

  if (existing) {
    const wasAlreadyCompleted = existing.status === "COMPLETED";
    
    let updatedProgress = progress ?? existing.progress;
    if (status === "COMPLETED" && !progress && existing.progress === 0) {
      try {
        const data = await apiClient.getAnimeById(animeId);
        const totalEpisodes = (data.data as { episodes?: number })?.episodes;
        if (totalEpisodes) {
          updatedProgress = totalEpisodes;
        }
      } catch {
        console.warn("Could not fetch episode count from Tenrai when updating to completed");
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

    if (status === "COMPLETED" && !wasAlreadyCompleted) {
      const xpResult = await awardCompletionXP(userId, updated.progress);
      totalXpEarned += xpResult.xpEarned;
      previousLevel = xpResult.previousLevel;
      newLevel = xpResult.newLevel;
      const badgeResults = await checkCompletionBadges(userId);
      badgeResults.forEach(b => {
        if (!earnedBadges.find(eb => eb.name === b.name)) earnedBadges.push(b);
      });
    }

    revalidatePath("/library");
    revalidatePath("/profile");
    return { entry: updated, feedback: { xpEarned: totalXpEarned, newBadges: earnedBadges, previousLevel, newLevel } };
  }

  let finalProgress = progress || 0;
  
  if (status === "COMPLETED" && !progress) {
    try {
      const data = await apiClient.getAnimeById(animeId);
      const totalEpisodes = (data.data as { episodes?: number })?.episodes;
      if (totalEpisodes) {
        finalProgress = totalEpisodes;
      }
    } catch {
      console.warn("Could not fetch episode count from Tenrai for completed anime");
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

  const addXpResult = await awardXP(userId, XP_CONFIG.ADD_TO_LIST, "Added anime to list");
  totalXpEarned += addXpResult.xpEarned;
  previousLevel = addXpResult.previousLevel;
  newLevel = addXpResult.newLevel;

  if (status === "COMPLETED") {
    const compXpResult = await awardCompletionXP(userId, created.progress);
    totalXpEarned += compXpResult.xpEarned;
    newLevel = compXpResult.newLevel;
  }

  const badge1 = await checkFirstAnimeBadge(userId);
  if (badge1 && !earnedBadges.find(eb => eb.name === badge1.name)) earnedBadges.push(badge1);
  
  const badge2 = await checkCollectorBadge(userId);
  if (badge2 && !earnedBadges.find(eb => eb.name === badge2.name)) earnedBadges.push(badge2);
  
  if (status === "COMPLETED") {
    const badgeResults = await checkCompletionBadges(userId);
    badgeResults.forEach(b => {
      if (!earnedBadges.find(eb => eb.name === b.name)) earnedBadges.push(b);
    });
  }

  revalidatePath("/library");
  revalidatePath("/profile");
  return { entry: created, feedback: { xpEarned: totalXpEarned, newBadges: earnedBadges, previousLevel, newLevel } };
}

export async function updateProgress(animeId: number, progress: number): Promise<{ entry: unknown; feedback: FeedbackData }> {
  const userId = await getCurrentUser();
  let totalXpEarned = 0;
  const earnedBadges: { name: string; xpReward: number }[] = [];
  let previousLevel = 1;
  let newLevel = 1;

  const entry = await prisma.animeList.findUnique({
    where: { userId_animeId: { userId, animeId } },
  });

  if (!entry) {
    return addToAnimeList(animeId, "WATCHING", progress);
  }

  let totalEpisodes: number | null = null;
  try {
    const data = await apiClient.getAnimeById(animeId);
    totalEpisodes = (data.data as { episodes?: number })?.episodes || null;
  } catch {
    console.warn("Could not fetch episode count from Tenrai");
  }

  const validation = validateProgressUpdate(entry.progress, progress, totalEpisodes);
  if (!validation.valid) {
    console.warn(`[XP BLOCKED] User ${userId}: ${validation.reason} for anime ${animeId}`);
    return { entry, feedback: { xpEarned: 0, newBadges: [], previousLevel: 1, newLevel: 1 } };
  }

  const { episodesWatched } = validation;

  if (episodesWatched === 0 && progress === entry.progress) {
    return { entry, feedback: { xpEarned: 0, newBadges: [], previousLevel: 1, newLevel: 1 } };
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

  if (episodesWatched > 0) {
    const xpResult = await awardXP(
      userId,
      episodesWatched * XP_CONFIG.EPISODE_WATCHED,
      `Watched ${episodesWatched} episode${episodesWatched > 1 ? "s" : ""}`
    );
    totalXpEarned += xpResult.xpEarned;
    previousLevel = xpResult.previousLevel;
    newLevel = xpResult.newLevel;

    if (episodesWatched >= 10) {
      const badgeResult = await checkAndAwardBadge(userId, "binge_watcher");
      if (badgeResult && !earnedBadges.find(eb => eb.name === badgeResult.name)) {
        earnedBadges.push(badgeResult);
      }
    }
  }

  if (totalEpisodes && progress >= totalEpisodes && entry.status !== "COMPLETED") {
    await prisma.animeList.update({
      where: { id: entry.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    const compXpResult = await awardCompletionXP(userId, progress);
    totalXpEarned += compXpResult.xpEarned;
    newLevel = compXpResult.newLevel;
    const badgeResults = await checkCompletionBadges(userId);
    badgeResults.forEach(b => {
      if (!earnedBadges.find(eb => eb.name === b.name)) earnedBadges.push(b);
    });
  }

  const milestoneBadges = await checkEpisodeMilestones(userId);
  milestoneBadges.forEach(b => {
    if (!earnedBadges.find(eb => eb.name === b.name)) earnedBadges.push(b);
  });

  revalidatePath("/profile");
  return { entry: updated, feedback: { xpEarned: totalXpEarned, newBadges: earnedBadges, previousLevel, newLevel } };
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
// COMPLETION XP
// ============================================================

async function awardCompletionXP(userId: string, episodesWatched: number) {
  const xpAmount = XP_CONFIG.COMPLETE_BASE + (episodesWatched * XP_CONFIG.COMPLETE_PER_EPISODE);
  return awardXP(userId, xpAmount, `Completed anime (${episodesWatched} episodes)`);
}

// ============================================================
// FAVORITES
// ============================================================

export async function addToFavorites(animeId: number) {
  const userId = await getCurrentUser();

  const existing = await prisma.favorite.findUnique({
    where: { userId_animeId: { userId, animeId } },
  });

  if (existing) {
    return existing;
  }

  const created = await prisma.favorite.create({
    data: { userId, animeId },
  });

  await awardXP(userId, XP_CONFIG.ADD_TO_FAVORITES, "Added anime to favorites");
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

export async function checkEarlyAdopterBadge(userId: string) {
  const userCount = await prisma.user.count();
  if (userCount <= EARLY_ADOPTER_LIMIT) {
    await checkAndAwardBadge(userId, "early_adopter");
  }
}

// ============================================================
// USER STATS & BADGES
// ============================================================

export async function getUserStats(userId?: string) {
  const id = userId || (await getCurrentUser());

  const [listCounts, totalEpisodes, ratedCount, user, favoritesCount, badges] = await Promise.all([
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
    prisma.userBadge.findMany({
      where: { userId: id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
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
    badges,
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