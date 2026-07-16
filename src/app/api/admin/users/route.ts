// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  const where = query
    ? {
        OR: [
          { username: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        image: true,
        xp: true,
        level: true,
        isProfilePublic: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            animeList: true,
            favorites: true,
            badges: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, limit, offset });
}