// src/app/api/admin/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, message, link } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const users = await prisma.user.findMany({
    select: { id: true },
  });

  if (users.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  const notifications = users.map((user) => ({
    userId: user.id,
    type: "system",
    title: title.trim(),
    message: message ? String(message).trim() : null,
    link: link ? String(link).trim() : null,
  }));

  // Batch insert in chunks of 100 to avoid huge queries
  const chunkSize = 100;
  let created = 0;
  for (let i = 0; i < notifications.length; i += chunkSize) {
    const chunk = notifications.slice(i, i + chunkSize);
    const result = await prisma.notification.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    created += result.count;
  }

  return NextResponse.json({ created });
}