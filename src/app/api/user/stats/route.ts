// src/app/api/user/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") || session.user.id;

  const [listCounts, totalEpisodes, ratedCount, user, badges, favoritesCount] =
    await Promise.all([
      prisma.animeList.groupBy({
        by: ["status"],
        where: { userId },
        _count: true,
      }),
      prisma.animeList.aggregate({
        where: { userId },
        _sum: { progress: true },
      }),
      prisma.animeList.count({
        where: { userId, score: { not: null } },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          xp: true,
          level: true,
          createdAt: true,
          isProfilePublic: true,
        },
      }),
      prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      }),
      prisma.favorite.count({
        where: { userId },
      }),
    ]);

  const statusCounts: Record<string, number> = {};
  listCounts.forEach((group) => {
    statusCounts[group.status] = group._count;
  });

  return NextResponse.json({
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
  });
}