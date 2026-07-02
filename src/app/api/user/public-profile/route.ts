// src/app/api/user/public-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      image: true,
      xp: true,
      level: true,
      createdAt: true,
      isProfilePublic: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if viewer is the profile owner
  const isOwner = session?.user?.id === user.id;

  // If profile is private and viewer is not the owner, deny access
  if (!user.isProfilePublic && !isOwner) {
    return NextResponse.json(
      { error: "private", message: "This profile is private" },
      { status: 403 }
    );
  }

  // Fetch detailed stats
  const [listCounts, totalEpisodes, badges, favorites] = await Promise.all([
    prisma.animeList.groupBy({
      by: ["status"],
      where: { userId: user.id },
      _count: true,
    }),
    prisma.animeList.aggregate({
      where: { userId: user.id },
      _sum: { progress: true },
    }),
    prisma.userBadge.findMany({
      where: { userId: user.id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    }),
    prisma.favorite.findMany({
      where: { userId: user.id },
      select: { animeId: true },
    }),
  ]);

  const statusCounts: Record<string, number> = {};
  listCounts.forEach((group) => {
    statusCounts[group.status] = group._count;
  });

  // Remove sensitive fields
  const { id, ...publicData } = user;

  return NextResponse.json({
    ...publicData,
    stats: {
      watching: statusCounts["WATCHING"] || 0,
      completed: statusCounts["COMPLETED"] || 0,
      planToWatch: statusCounts["PLAN_TO_WATCH"] || 0,
      paused: statusCounts["PAUSED"] || 0,
      dropped: statusCounts["DROPPED"] || 0,
      reWatching: statusCounts["REWATCHING"] || 0,
      totalAnime: listCounts.reduce((sum, g) => sum + g._count, 0),
      totalEpisodes: totalEpisodes._sum.progress || 0,
      totalBadges: badges.length,
      totalFavorites: favorites.length,
    },
    badges: badges.map((ub) => ({
      id: ub.badge.id,
      name: ub.badge.name,
      description: ub.badge.description,
      icon: ub.badge.icon,
      category: ub.badge.category,
      earnedAt: ub.earnedAt,
    })),
    favorites: favorites.map((f) => f.animeId),
  });
}
