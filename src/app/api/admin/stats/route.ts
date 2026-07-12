// src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalUsers,
    totalLists,
    totalFavorites,
    totalBadges,
    totalFeedback,
    totalNotifications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.animeList.count(),
    prisma.favorite.count(),
    prisma.badge.count(),
    prisma.feedback.count(),
    prisma.notification.count(),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      xp: true,
      level: true,
      createdAt: true,
    },
  });

  const recentFeedback = await prisma.feedback.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      category: true,
      rating: true,
      context: true,
      message: true,
      createdAt: true,
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({
    stats: {
      totalUsers,
      totalLists,
      totalFavorites,
      totalBadges,
      totalFeedback,
      totalNotifications,
    },
    recentUsers,
    recentFeedback,
  });
}