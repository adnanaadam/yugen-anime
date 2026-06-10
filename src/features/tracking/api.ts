// src/features/tracking/api.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession, authOptions } from "@/lib/auth";
import { calculateLevel } from "@/lib/utils";
import { AnimeStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Badge definitions
const BADGE_DEFINITIONS = {
  first_anime: {
    name: "First Anime",
    description: "Added your first anime to your list",
    icon: "scroll",
    xpReward: 50,
    category: "beginner",
  },
  episode_master: {
    name: "Episode Master",
    description: "Watched 100 episodes total",
    icon: "sword",
    xpReward: 100,
    category: "milestone",
  },
  anime_veteran: {
    name: "Anime Veteran",
    description: "Completed 50 anime",
    icon: "crown",
    xpReward: 200,
    category: "milestone",
  },
  completionist: {
    name: "Completionist",
    description: "Completed 10 anime",
    icon: "trophy",
    xpReward: 150,
    category: "achievement",
  },
  anime_lover: {
    name: "Anime Lover",
    description: "Watched 500 episodes",
    icon: "heart",
    xpReward: 300,
    category: "milestone",
  },
  binge_watcher: {
    name: "Binge Watcher",
    description: "Watched 10 episodes in a single day",
    icon: "fire",
    xpReward: 75,
    category: "special",
  },
  perfect_scorer: {
    name: "Perfect Scorer",
    description: "Rated 10 anime",
    icon: "star",
    xpReward: 100,
    category: "engagement",
  },
  early_adopter: {
    name: "Early Adopter",
    description: "Joined Yugen in its early days",
    icon: "sparkles",
    xpReward: 25,
    category: "special",
  },
};

// Get current user from session
async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

// Add or update anime in user's list
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
    const updated = await prisma.animeList.update({
      where: { id: existing.id },
      data: {
        status,
        progress: progress ?? existing.progress,
        score: score ?? existing.score,
        ...(status === "COMPLETED" && !existing.completedAt
          ? { completedAt: new Date() }
          : {}),
        ...(status === "WATCHING" && !existing.startedAt
          ? { startedAt: new Date() }
          : {}),
      },
    });

    // Check for completionist badge
    if (status === "COMPLETED") {
      await checkCompletionBadges(userId);
    }

    // Award XP for completing
    if (status === "COMPLETED" && existing.status !== "COMPLETED") {
      await awardXP(userId, 50, "Completed anime");
    }

    revalidatePath("/library");
    revalidatePath("/dashboard");
    return updated;
  }

  const created = await prisma.animeList.create({
    data: {
      userId,
      animeId,
      status,
      progress: progress || 0,
      score: score || null,
      startedAt: status === "WATCHING" ? new Date() : null,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  // Check for first anime badge
  await checkFirstAnimeBadge(userId);

  // Award XP for first anime
  if (status === "COMPLETED") {
    await awardXP(userId, 50, "Completed first anime");
  }

  revalidatePath("/library");
  revalidatePath("/dashboard");
  return created;
}

// Update episode progress
export async function updateProgress(animeId: number, progress: number) {
  const userId = await getCurrentUser();

  const entry = await prisma.animeList.findUnique({
    where: { userId_animeId: { userId, animeId } },
  });

  if (!entry) {
    // Create new entry with watching status
    return addToAnimeList(animeId, "WATCHING", progress);
  }

  const episodesWatched = progress - entry.progress;

  const updated = await prisma.animeList.update({
    where: { id: entry.id },
    data: {
      progress,
      status: entry.status === "PLAN_TO_WATCH" ? "WATCHING" : entry.status,
      ...(entry.status !== "WATCHING" ? { startedAt: new Date() } : {}),
    },
  });

  // Award XP for episodes watched
  if (episodesWatched > 0) {
    await awardXP(userId, episodesWatched * 10, `Watched ${episodesWatched} episodes`);

    // Check binge watcher (10+ episodes in a day)
    if (episodesWatched >= 10) {
      await checkAndAwardBadge(userId, "binge_watcher");
    }
  }

  // Check episode milestone badges
  await checkEpisodeMilestones(userId);

  revalidatePath("/dashboard");
  return updated;
}

// Rate an anime
export async function rateAnime(animeId: number, score: number) {
  const userId = await getCurrentUser();

  const entry = await prisma.animeList.findUnique({
    where: { userId_animeId: { userId, animeId } },
  });

  if (!entry) {
    // Create entry with score
    return addToAnimeList(animeId, "COMPLETED", undefined, score);
  }

  const wasRated = entry.score !== null;

  const updated = await prisma.animeList.update({
    where: { id: entry.id },
    data: { score },
  });

  if (!wasRated) {
    await awardXP(userId, 5, "Rated an anime");

    // Check perfect scorer badge
    const ratedCount = await prisma.animeList.count({
      where: { userId, score: { not: null } },
    });
    if (ratedCount >= 10) {
      await checkAndAwardBadge(userId, "perfect_scorer");
    }
  }

  revalidatePath("/library");
  return updated;
}

// Remove from list
export async function removeFromList(animeId: number) {
  const userId = await getCurrentUser();
  await prisma.animeList.deleteMany({
    where: { userId, animeId },
  });
  revalidatePath("/library");
}

// Get user's anime list
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

// Award XP to user
async function awardXP(userId: string, amount: number, reason: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
  });

  // Update level
  const newLevel = calculateLevel(user.xp);
  if (newLevel !== user.level) {
    await prisma.user.update({
      where: { id: userId },
      data: { level: newLevel },
    });
  }

  return user;
}

// Check and award first anime badge
async function checkFirstAnimeBadge(userId: string) {
  const count = await prisma.animeList.count({ where: { userId } });
  if (count === 1) {
    await checkAndAwardBadge(userId, "first_anime");
  }
}

// Check completion badges
async function checkCompletionBadges(userId: string) {
  const completedCount = await prisma.animeList.count({
    where: { userId, status: "COMPLETED" },
  });

  if (completedCount >= 50) {
    await checkAndAwardBadge(userId, "anime_veteran");
  }
  if (completedCount >= 10) {
    await checkAndAwardBadge(userId, "completionist");
  }
}

// Check episode milestones
async function checkEpisodeMilestones(userId: string) {
  const totalProgress = await prisma.animeList.aggregate({
    where: { userId },
    _sum: { progress: true },
  });

  const totalEpisodes = totalProgress._sum.progress || 0;

  if (totalEpisodes >= 500) {
    await checkAndAwardBadge(userId, "anime_lover");
  }
  if (totalEpisodes >= 100) {
    await checkAndAwardBadge(userId, "episode_master");
  }
}

// Check and award a badge
async function checkAndAwardBadge(userId: string, badgeKey: string) {
  const definition = BADGE_DEFINITIONS[badgeKey as keyof typeof BADGE_DEFINITIONS];
  if (!definition) return;

  // Find or create badge in database
  const badge = await prisma.badge.upsert({
    where: { id: badgeKey }, // Using badge key as ID
    update: {},
    create: {
      id: badgeKey,
      name: definition.name,
      description: definition.description,
      icon: definition.icon,
      xpReward: definition.xpReward,
      category: definition.category,
    },
  });

  // Check if user already has this badge
  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });

  if (!existing) {
    await prisma.userBadge.create({
      data: { userId, badgeId: badge.id },
    });

    // Award bonus XP
    await awardXP(userId, definition.xpReward, `Earned badge: ${definition.name}`);
  }
}

// Get user stats
export async function getUserStats(userId?: string) {
  const id = userId || (await getCurrentUser());

  const [listCounts, totalEpisodes, ratedCount, user] = await Promise.all([
    prisma.animeList.groupBy({
      by: ["status"],
      where: { userId: id },
      _count: true,
    }),
    prisma.animeList.aggregate({
      where: { userId: id },
      _sum: { progress: true },
    }),
    prisma.animeList.count({
      where: { userId: id, score: { not: null } },
    }),
    prisma.user.findUnique({
      where: { id },
      select: { xp: true, level: true, username: true, name: true, image: true, createdAt: true },
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
    },
  };
}

// Get user badges
export async function getUserBadges(userId?: string) {
  const id = userId || (await getCurrentUser());
  return prisma.userBadge.findMany({
    where: { userId: id },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });
}

// Add to favorites
export async function addToFavorites(animeId: number) {
  const userId = await getCurrentUser();
  return prisma.favorite.create({
    data: { userId, animeId },
  });
}

// Remove from favorites
export async function removeFromFavorites(animeId: number) {
  const userId = await getCurrentUser();
  await prisma.favorite.deleteMany({
    where: { userId, animeId },
  });
}

// Get user favorites
export async function getUserFavorites(userId?: string) {
  const id = userId || (await getCurrentUser());
  return prisma.favorite.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });
}