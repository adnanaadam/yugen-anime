// src/app/api/tracking/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  // Fetch anime details from Jikan for each entry
  const enrichedList = await Promise.all(
    list.map(async (entry) => {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${entry.animeId}`);
        if (!res.ok) return { ...entry, anime: null };
        const data = await res.json();
        const anime = data.data;
        
        return {
          ...entry,
          anime: {
            title: {
              english: anime.title_english,
              romaji: anime.title,
            },
            coverImage: {
              large: anime.images.jpg.large_image_url,
            },
            averageScore: anime.score ? anime.score * 10 : null,
            episodes: anime.episodes,
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