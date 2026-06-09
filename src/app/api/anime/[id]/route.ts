// src/app/api/anime/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchAnimeById } from "@/services/jikan.service";

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
    const data = await fetchAnimeById(animeId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Anime detail fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime details" },
      { status: 500 }
    );
  }
}