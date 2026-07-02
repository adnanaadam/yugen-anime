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
      _count: {
        select: {
          animeList: true,
          favorites: true,
          badges: true,
        },
      },
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

  // Remove sensitive fields
  const { id, ...publicData } = user;

  return NextResponse.json({
    ...publicData,
    stats: {
      totalAnime: user._count.animeList,
      totalFavorites: user._count.favorites,
      totalBadges: user._count.badges,
    },
  });
}