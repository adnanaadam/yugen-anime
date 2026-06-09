// src/app/api/anime/popular/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchPopularAnime } from "@/services/jikan.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  try {
    const data = await fetchPopularAnime(page, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Popular fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular anime" },
      { status: 500 }
    );
  }
}