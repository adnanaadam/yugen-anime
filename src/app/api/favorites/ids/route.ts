// src/app/api/favorites/ids/route.ts
import { NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json([]);
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { animeId: true },
  });

  return NextResponse.json(favorites.map((f) => f.animeId));
}