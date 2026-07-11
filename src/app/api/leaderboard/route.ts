// src/app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: 100,
    select: {
      id: true,
      username: true,
      image: true,
      xp: true,
      level: true,
      isProfilePublic: true,
    },
  });

  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    id: user.isProfilePublic ? user.id : null,
    username: user.isProfilePublic ? user.username : null,
    image: user.isProfilePublic ? user.image : null,
    xp: user.xp,
    level: user.level,
    isProfilePublic: user.isProfilePublic,
  }));

  return NextResponse.json(leaderboard);
}