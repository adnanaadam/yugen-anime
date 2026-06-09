// src/app/api/anime/trending/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchTrendingAnime } from "@/services/jikan.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  try {
    const data = await fetchTrendingAnime(page, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Trending fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending anime" },
      { status: 500 }
    );
  }
}