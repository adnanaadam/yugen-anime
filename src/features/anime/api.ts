import type { Anime, AnimeListResponse } from "./types";

export async function fetchAnimeList(page: number = 1): Promise<AnimeListResponse> {
  // TODO: Implement with AniList API integration
  return {
    data: [],
    page,
    hasNextPage: false,
  };
}

export async function fetchAnimeById(id: number): Promise<Anime | null> {
  // TODO: Implement with AniList API integration
  return null;
}

export async function searchAnime(query: string): Promise<Anime[]> {
  // TODO: Implement with AniList API integration
  return [];
}