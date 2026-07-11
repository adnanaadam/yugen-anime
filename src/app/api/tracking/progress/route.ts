// src/app/api/tracking/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiClient } from "@/lib/api-client";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { animeId, progress } = body;

  if (!animeId || typeof progress !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (progress < 0) {
    return NextResponse.json({ error: "Progress cannot be negative" }, { status: 400 });
  }

  const entry = await prisma.animeList.findUnique({
    where: { userId_animeId: { userId: session.user.id, animeId } },
  });

  if (!entry) {
    return NextResponse.json({ error: "Anime not in list" }, { status: 404 });
  }

  // Fetch total episodes for validation
  let totalEpisodes: number | null = null;
  try {
    const data = await apiClient.getAnimeById(animeId);
    totalEpisodes = (data.data as { episodes?: number })?.episodes || null;
  } catch {
    console.warn("Could not fetch episode count from Tenrai");
  }

  if (totalEpisodes && progress > totalEpisodes) {
    return NextResponse.json(
      { error: `Cannot exceed ${totalEpisodes} episodes` },
      { status: 400 }
    );
  }

  if (!totalEpisodes && progress > 10000) {
    return NextResponse.json(
      { error: "Progress cannot exceed 10000 episodes without known total" },
      { status: 400 }
    );
  }

  const episodesWatched = progress - entry.progress;

  if (episodesWatched < 0) {
    return NextResponse.json({ error: "Progress cannot be decreased" }, { status: 400 });
  }

  const updated = await prisma.animeList.update({
    where: { id: entry.id },
    data: {
      progress,
      status: entry.status === "PLAN_TO_WATCH" ? "WATCHING" : entry.status,
    },
  });

  // Award XP
  if (episodesWatched > 0) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { xp: { increment: episodesWatched * 10 } },
    });
  }

  return NextResponse.json(updated);
}
