// src/app/api/user/username/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username || typeof username !== "string") {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  const trimmed = username.trim().toLowerCase();

  // Validate format (same rules as the PATCH endpoint)
  if (trimmed.length < 3 || trimmed.length > 20) {
    return NextResponse.json({ available: false, reason: "length" });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return NextResponse.json({ available: false, reason: "format" });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { username: trimmed },
      select: { id: true },
    });

    return NextResponse.json({ available: !existing });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}