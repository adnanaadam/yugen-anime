// src/app/api/leaderboard/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      image: true,
      xp: true,
      level: true,
      isProfilePublic: true,
    },
  });

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const higherCount = await prisma.user.count({
    where: {
      xp: { gt: currentUser.xp },
    },
  });

  const rank = higherCount + 1;

  return NextResponse.json({
    rank,
    id: currentUser.id,
    username: currentUser.username,
    image: currentUser.image,
    xp: currentUser.xp,
    level: currentUser.level,
    isProfilePublic: currentUser.isProfilePublic,
  });
}