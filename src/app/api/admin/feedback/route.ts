// src/app/api/admin/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
  const offset = parseInt(searchParams.get("offset") || "0");

  const where = category ? { category } : {};

  const [items, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        email: true,
        category: true,
        rating: true,
        context: true,
        message: true,
        screenshot: true,
        pagePath: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    }),
    prisma.feedback.count({ where }),
  ]);

  return NextResponse.json({ items, total, limit, offset });
}