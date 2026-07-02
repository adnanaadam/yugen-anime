// src/app/api/anime/seasonal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchSeasonalAnime } from "@/services/jikan.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");
  const year = searchParams.get("year")
    ? parseInt(searchParams.get("year")!)
    : undefined;
  const season = searchParams.get("season") || undefined;

  try {
    const data = await fetchSeasonalAnime(year, season, page, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Seasonal fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch seasonal anime" },
      { status: 500 }
    );
  }
}