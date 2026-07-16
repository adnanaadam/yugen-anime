// src/app/api/tracking/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiClient } from "@/lib/api-client";
import { AnimeStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") as AnimeStatus | null;

  const list = await prisma.animeList.findMany({
    where: {
      userId: session.user.id,
      ...(status ? { status } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch anime details from Tenrai API for each entry
  const enrichedList = await Promise.all(
    list.map(async (entry) => {
      try {
        const data = await apiClient.getAnimeById(entry.animeId);
        const anime = data.data as Record<string, unknown>;
        
        return {
          ...entry,
          anime: {
            title: {
              english: anime.title_english as string | null,
              romaji: anime.title as string,
            },
            coverImage: {
              large: (anime.images as Record<string, Record<string, string>>)?.jpg?.large_image_url,
            },
            averageScore: anime.score ? (anime.score as number) * 10 : null,
            episodes: anime.episodes as number | null,
            status: anime.status as string | null,
          },
        };
      } catch {
        return { ...entry, anime: null };
      }
    })
  );

  return NextResponse.json(enrichedList);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify user still exists in DB (handles stale sessions after DB reset)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found. Please sign in again." }, { status: 401 });
  }

  const body = await request.json();
  const { animeId, status, progress, score } = body;

  if (!animeId || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.animeList.findUnique({
    where: { userId_animeId: { userId: session.user.id, animeId } },
  });

  if (existing) {
    const updated = await prisma.animeList.update({
      where: { id: existing.id },
      data: {
        status,
        progress: progress ?? existing.progress,
        score: score ?? existing.score,
      },
    });
    return NextResponse.json(updated);
  }

  const created = await prisma.animeList.create({
    data: {
      userId: session.user.id,
      animeId,
      status,
      progress: progress || 0,
      score: score || null,
      startedAt: status === "WATCHING" ? new Date() : null,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  return NextResponse.json(created);
}