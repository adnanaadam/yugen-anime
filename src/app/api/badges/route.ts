import { NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALL_BADGE_DEFINITIONS = [
  {
    id: "first_anime",
    name: "First Anime",
    description: "Added your first anime to your list",
    icon: "scroll",
    xpReward: 100,
    category: "beginner",
  },
  {
    id: "episode_master",
    name: "Episode Master",
    description: "Watched 500 episodes total",
    icon: "spellbook",
    xpReward: 300,
    category: "milestone",
  },
  {
    id: "anime_veteran",
    name: "Anime Veteran",
    description: "Completed 50 anime",
    icon: "crown",
    xpReward: 500,
    category: "milestone",
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Completed 20 anime",
    icon: "trophy",
    xpReward: 250,
    category: "achievement",
  },
  {
    id: "anime_lover",
    name: "Anime Lover",
    description: "Watched 1000 episodes",
    icon: "heart",
    xpReward: 750,
    category: "milestone",
  },
  {
    id: "binge_watcher",
    name: "Binge Watcher",
    description: "Watched 10+ episodes in one session",
    icon: "fire",
    xpReward: 150,
    category: "special",
  },
  {
    id: "collector",
    name: "Collector",
    description: "Have 25 anime in your list",
    icon: "inventory",
    xpReward: 200,
    category: "collection",
  },
  {
    id: "favorite_curator",
    name: "Favorite Curator",
    description: "Added 5 anime to your favorites",
    icon: "bookmark",
    xpReward: 100,
    category: "collection",
  },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Ensure all badges exist in database
    for (const badgeDef of ALL_BADGE_DEFINITIONS) {
      await prisma.badge.upsert({
        where: { id: badgeDef.id },
        update: {
          name: badgeDef.name,
          description: badgeDef.description,
          icon: badgeDef.icon,
          xpReward: badgeDef.xpReward,
          category: badgeDef.category,
        },
        create: {
          id: badgeDef.id,
          name: badgeDef.name,
          description: badgeDef.description,
          icon: badgeDef.icon,
          xpReward: badgeDef.xpReward,
          category: badgeDef.category,
        },
      });
    }

    // Fetch all badges
    const badges = await prisma.badge.findMany({
      where: {
        id: {
          in: ALL_BADGE_DEFINITIONS.map((b) => b.id),
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // If user is logged in, fetch their progress
    let userStats = {
      totalAnime: 0,
      totalEpisodes: 0,
      completedAnime: 0,
      totalFavorites: 0,
      earnedBadgeIds: [] as string[],
    };

    if (userId) {
      const [
        listCounts,
        totalEpisodes,
        completedCount,
        favoritesCount,
        userBadges,
      ] = await Promise.all([
        prisma.animeList.count({ where: { userId } }),
        prisma.animeList.aggregate({
          where: { userId, status: { not: "REWATCHING" } },
          _sum: { progress: true },
        }),
        prisma.animeList.count({ where: { userId, status: "COMPLETED" } }),
        prisma.favorite.count({ where: { userId } }),
        prisma.userBadge.findMany({
          where: { userId },
          select: { badgeId: true },
        }),
      ]);

      userStats = {
        totalAnime: listCounts,
        totalEpisodes: totalEpisodes._sum.progress || 0,
        completedAnime: completedCount,
        totalFavorites: favoritesCount,
        earnedBadgeIds: userBadges.map((ub) => ub.badgeId),
      };
    }

    // Calculate progress for each badge
    const badgesWithProgress = badges.map((badge) => {
      const isEarned = userStats.earnedBadgeIds.includes(badge.id);

      let current = 0;
      let required = 0;
      let percentage = 0;

      switch (badge.name) {
        case "First Anime":
          required = 1;
          current = Math.min(userStats.totalAnime, required);
          percentage = Math.min(100, Math.round((current / required) * 100));
          break;
        case "Episode Master":
          required = 500;
          current = Math.min(userStats.totalEpisodes, required);
          percentage = Math.min(100, Math.round((current / required) * 100));
          break;
        case "Anime Veteran":
          required = 50;
          current = Math.min(userStats.completedAnime, required);
          percentage = Math.min(100, Math.round((current / required) * 100));
          break;
        case "Completionist":
          required = 20;
          current = Math.min(userStats.completedAnime, required);
          percentage = Math.min(100, Math.round((current / required) * 100));
          break;
        case "Anime Lover":
          required = 1000;
          current = Math.min(userStats.totalEpisodes, required);
          percentage = Math.min(100, Math.round((current / required) * 100));
          break;
        case "Binge Watcher":
          required = 1;
          current = isEarned ? 1 : 0;
          percentage = isEarned ? 100 : 0;
          break;
        case "Collector":
          required = 25;
          current = Math.min(userStats.totalAnime, required);
          percentage = Math.min(100, Math.round((current / required) * 100));
          break;
        case "Favorite Curator":
          required = 5;
          current = Math.min(userStats.totalFavorites, required);
          percentage = Math.min(100, Math.round((current / required) * 100));
          break;
      }

      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        xpReward: badge.xpReward,
        isEarned,
        progress: {
          current,
          required,
          percentage,
        },
      };
    });

    return NextResponse.json(
      { badges: badgesWithProgress },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching badges:", error);
    return NextResponse.json(
      { error: "Failed to fetch badges" },
      { status: 500 }
    );
  }
}
