// src/services/jikan.service.ts

import { apiClient } from "@/lib/api-client";

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp?: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string | null;
  episodes: number | null;
  status: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  genres: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  year: number | null;
  season: string | null;
  duration: string;
  rating: string;
  type: string;
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  } | null;
  aired: {
    from: string | null;
    to: string | null;
    string: string;
  };
}

export interface TransformedAnime {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    large: string;
    medium: string;
    small: string;
  };
  bannerImage: string | null;
  description: string | null;
  episodes: number | null;
  status: string;
  averageScore: number | null;
  popularity: number | null;
  genres: string[];
  studios: string[];
  seasonYear: number | null;
  season: string | null;
  type: string;
  format: string;
  duration: string;
  trailer: {
    id: string | null;
    site: string;
  } | null;
}

export function transformAnime(anime: JikanAnime): TransformedAnime {
  return {
    id: anime.mal_id,
    title: {
      romaji: anime.title,
      english: anime.title_english,
      native: anime.title_japanese,
    },
    coverImage: {
      large: anime.images.jpg.large_image_url || anime.images.webp?.large_image_url || anime.images.jpg.image_url,
      medium: anime.images.jpg.image_url,
      small: anime.images.jpg.small_image_url || anime.images.webp?.small_image_url || anime.images.jpg.image_url,
    },
    bannerImage: anime.images.jpg.large_image_url || null,
    description: anime.synopsis,
    episodes: anime.episodes,
    status: anime.status,
    averageScore: anime.score ? anime.score * 10 : null,
    popularity: anime.popularity,
    genres: anime.genres?.map((g) => g.name) || [],
    studios: anime.studios?.map((s) => s.name) || [],
    seasonYear: anime.year,
    season: anime.season,
    type: anime.type,
    format: anime.type,
    duration: anime.duration,
    trailer: anime.trailer?.youtube_id
      ? { id: anime.trailer.youtube_id, site: "youtube" }
      : null,
  };
}

export async function fetchTrendingAnime(page = 1, limit = 15) {
  const data = await apiClient.getTopAnime("airing", page, limit);
  return {
  media: (data.data as unknown as JikanAnime[])?.map(transformAnime) || [],
    pageInfo: data.pagination || { has_next_page: false },
  };
}

export async function fetchPopularAnime(page = 1, limit = 15) {
  const data = await apiClient.getTopAnime("bypopularity", page, limit);
  return {
    media: (data.data as unknown as JikanAnime[])?.map(transformAnime) || [],
    pageInfo: data.pagination || { has_next_page: false },
  };
}

export async function fetchSeasonalAnime(
  year?: number,
  season?: string,
  page = 1,
  limit = 15
) {
  const now = new Date();
  const y = year || now.getFullYear();
  const s = season || getCurrentSeason();
  const data = await apiClient.getSeasonalAnime(y, s, page, limit);
  return {
    media: (data.data as unknown as JikanAnime[])?.map(transformAnime) || [],
    pageInfo: data.pagination || { has_next_page: false },
    season: { year: y, season: s },
  };
}

export async function fetchAnimeById(id: number) {
  const data = await apiClient.getAnimeFull(id);
  return transformAnime(data.data as unknown as JikanAnime);
}

export async function searchAnime(query: string, page = 1, limit = 24) {
  const data = await apiClient.searchAnime(query, page, limit);
  return {
    media: (data.data as unknown as JikanAnime[])?.map(transformAnime) || [],
    pageInfo: data.pagination || { has_next_page: false, total: 0, current_page: 1, last_visible_page: 1 },
  };
}

export async function fetchAnimeEpisodes(id: number, page = 1) {
  const data = await apiClient.getAnimeEpisodes(id, page);
  return {
    episodes: data.data || [],
    pageInfo: data.pagination || { has_next_page: false },
  };
}

export function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 0 && month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "fall";
}