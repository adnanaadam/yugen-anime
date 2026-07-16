// src/app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      category,
      rating,
      context,
      message,
      screenshot,
      pagePath,
      userAgent,
    } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: session?.user?.id || null,
        email: session?.user?.email || null,
        category: category || "general",
        rating: rating || null,
        context: context || "general",
        message: message.trim(),
        screenshot: screenshot || null,
        pagePath: pagePath || null,
        userAgent: userAgent || null,
      },
    });

    return NextResponse.json({ success: true, id: feedback.id });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}