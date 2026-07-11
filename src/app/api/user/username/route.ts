// src/app/api/user/username/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username } = await request.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Validate username format
    const trimmed = username.trim().toLowerCase();
    if (trimmed.length < 3 || trimmed.length > 20) {
      return NextResponse.json(
        { error: "Username must be between 3 and 20 characters" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    // Check if username is taken
    const existing = await prisma.user.findUnique({
      where: { username: trimmed },
    });

    if (existing && existing.id !== session.user.id) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    try {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { username: trimmed },
      });
    } catch (error: unknown) {
      // Handle Prisma unique constraint violation (race condition)
      if ((error as { code?: string })?.code === "P2002") {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ username: trimmed, message: "Username updated" });
  } catch (error) {
    console.error("Username update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}