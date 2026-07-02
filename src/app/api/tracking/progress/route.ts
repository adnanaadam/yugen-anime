// src/app/api/tracking/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const entry = await prisma.animeList.findUnique({
    where: { userId_animeId: { userId: session.user.id, animeId } },
  });

  if (!entry) {
    return NextResponse.json({ error: "Anime not in list" }, { status: 404 });
  }

  const episodesWatched = progress - entry.progress;

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