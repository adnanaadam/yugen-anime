// src/app/api/user/profile-visibility/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { isProfilePublic } = await request.json();

    if (typeof isProfilePublic !== "boolean") {
      return NextResponse.json({ error: "isProfilePublic must be a boolean" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { isProfilePublic },
      select: { id: true, username: true, isProfilePublic: true },
    });

    return NextResponse.json({
      ...user,
      message: isProfilePublic
        ? "Your profile is now public. Others can see your activity."
        : "Your profile is now private. Other users won't be able to view your activity.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to update profile visibility" }, { status: 500 });
  }
}