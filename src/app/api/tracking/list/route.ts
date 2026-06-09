// src/app/api/tracking/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnimeStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth();
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

  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  const session = await auth();
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