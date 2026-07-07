// src/app/api/anime/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const animeId = parseInt(id);

  if (isNaN(animeId)) {
    return NextResponse.json({ error: "Invalid anime ID" }, { status: 400 });
  }

  try {
    const [animeData, charsData, recsData] = await Promise.all([
      apiClient.getAnimeById(animeId),
      apiClient.getAnimeCharacters(animeId),
      apiClient.getAnimeRecommendations(animeId),
    ]);

    const anime = animeData.data as Record<string, unknown>;

    return NextResponse.json({
      ...anime,
      characters: charsData.data || [],
      recommendations: recsData.data || [],
    });
  } catch (error) {
    console.error("Anime detail fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime details" },
      { status: 500 }
    );
  }
}