// src/app/api/anime/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchAnime } from "@/services/jikan.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "24");

  if (!query.trim()) {
    return NextResponse.json(
      { error: "Search query required" },
      { status: 400 }
    );
  }

  try {
    const data = await searchAnime(query, page, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search anime" },
      { status: 500 }
    );
  }
}