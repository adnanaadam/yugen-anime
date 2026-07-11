// src/app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ============================================================
// GET — Fetch notifications for current user
// ============================================================

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "20");
  const includeRead = searchParams.get("includeRead") === "true";

  const where = { userId: session.user.id, ...(includeRead ? {} : { read: false }) };

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 50),
    }),
    prisma.notification.count({
      where: { userId: session.user.id, read: false },
    }),
  ]);

  return NextResponse.json(
    { notifications, unreadCount },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    }
  );
}

// ============================================================
// PATCH — Mark notification(s) as read
// ============================================================

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, all } = body;

  if (all) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  } else if (id) {
    await prisma.notification.updateMany({
      where: { id, userId: session.user.id },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: "Must provide either 'id' or 'all'" },
    { status: 400 }
  );
}

// ============================================================
// POST — Create a notification (internal use from server actions)
// ============================================================

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, type, title, message, link } = body;

  if (!userId || !type || !title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const notification = await prisma.notification.create({
    data: { userId, type, title, message, link },
  });

  return NextResponse.json(notification);
}