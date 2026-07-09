// src/app/api/notifications/system/route.ts
// Broadcast a system notification to all users (or a specific user)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST — Broadcast system notification
// Body: { title: string, message?: string, userId?: string }
// If userId is provided, only that user gets it. Otherwise all users.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // For now, any authenticated user can send system notifications.
  // In production, restrict this to admin users.
  const body = await request.json();
  const { title, message, userId } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (userId) {
    // Send to a specific user
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: "system",
        title,
        message: message || null,
      },
    });
    return NextResponse.json({ created: 1, notification });
  }

  // Broadcast to all users
  const users = await prisma.user.findMany({ select: { id: true } });
  
  if (users.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  const result = await prisma.notification.createMany({
    data: users.map((u) => ({
      userId: u.id,
      type: "system",
      title,
      message: message || null,
    })),
  });

  return NextResponse.json({ created: result.count });
}