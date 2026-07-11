// src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiClient } from "@/lib/api-client";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Enrich with anime details from Tenrai API
  const enriched: unknown[] = [];
  for (const fav of favorites) {
    try {
      const data = await apiClient.getAnimeById(fav.animeId);
      const anime = data.data as Record<string, unknown>;
      const images = (anime.images as Record<string, Record<string, string>>)?.jpg;
      enriched.push({
        ...fav,
        anime: {
          id: anime.mal_id as number,
          title: {
            english: anime.title_english as string | null,
            romaji: anime.title as string,
          },
          coverImage: {
            large: images?.large_image_url,
            medium: images?.image_url,
          },
          averageScore: anime.score ? (anime.score as number) * 10 : null,
          episodes: anime.episodes as number | null,
          genres: ((anime.genres as { name: string }[]) || []).map((g: { name: string }) => g.name),
        },
      });
    } catch {
      enriched.push({ ...fav, anime: null });
    }
  }

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { animeId } = body;

  if (!animeId) {
    return NextResponse.json({ error: "Missing animeId" }, { status: 400 });
  }

  // Check current count
  const currentCount = await prisma.favorite.count({
    where: { userId: session.user.id },
  });

  if (currentCount >= 10) {
    return NextResponse.json(
      { error: "You can only have up to 10 favorite anime" },
      { status: 400 }
    );
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_animeId: { userId: session.user.id, animeId } },
  });

  if (existing) {
    return NextResponse.json(existing);
  }

  const created = await prisma.favorite.create({
    data: { userId: session.user.id, animeId },
  });

  // Award XP
  let totalXpEarned = 10;
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { xp: { increment: 10 } },
  });
  const { calculateLevel } = await import("@/lib/utils");
  const previousLevel = user.level;
  let newLevel = calculateLevel(user.xp);

  // Check favorite_curator badge (5 favorites)
  let newBadge: { name: string; xpReward: number } | null = null;
  const favCount = await prisma.favorite.count({
    where: { userId: session.user.id },
  });
  if (favCount >= 5) {
    const badge = await prisma.badge.upsert({
      where: { id: "favorite_curator" },
      update: {
        name: "Favorite Curator",
        description: "Added 5 anime to your favorites",
        icon: "bookmark",
        xpReward: 100,
        category: "collection",
      },
      create: {
        id: "favorite_curator",
        name: "Favorite Curator",
        description: "Added 5 anime to your favorites",
        icon: "bookmark",
        xpReward: 100,
        category: "collection",
      },
    });

    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId: session.user.id, badgeId: badge.id } },
    });

    if (!existing) {
      await prisma.userBadge.create({
        data: { userId: session.user.id, badgeId: badge.id },
      });
      await prisma.user.update({
        where: { id: session.user.id },
        data: { xp: { increment: badge.xpReward } },
      });
      totalXpEarned += badge.xpReward;
      newBadge = { name: badge.name, xpReward: badge.xpReward };
    }
  }

  // Recalculate level with all XP included
  const finalUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { xp: true },
  });
  if (finalUser) {
    newLevel = calculateLevel(finalUser.xp);
    if (newLevel !== user.level) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { level: newLevel },
      });
    }
  }

  return NextResponse.json({
    ...created,
    feedback: {
      xpEarned: totalXpEarned,
      previousLevel,
      newLevel,
      newBadges: newBadge ? [newBadge] : [],
    },
  });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const animeId = searchParams.get("animeId");

  if (!animeId) {
    return NextResponse.json({ error: "Missing animeId" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, animeId: parseInt(animeId) },
  });

  return NextResponse.json({ success: true });
}