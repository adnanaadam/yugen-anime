// src/hooks/useAnimeData.ts
"use client";

import useSWR from "swr";
import type { TransformedAnime } from "@/services/jikan.service";

interface AnimeDataResponse {
  media: TransformedAnime[];
  pageInfo: {
    hasNextPage: boolean;
    total?: number;
    currentPage?: number;
    lastPage?: number;
  };
  season?: { year: number; season: string };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// SWR caches these keys globally, so navigating between home, explore and
// profile renders instantly from cache and revalidates quietly afterwards.
const listConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60_000,
  keepPreviousData: true,
};

function useAnimeListData(key: string) {
  const { data, error, isLoading } = useSWR<AnimeDataResponse>(key, fetcher, listConfig);
  return {
    data: data?.media ?? [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
  };
}

export function useTrendingAnime(limit = 7) {
  return useAnimeListData(`/api/anime/trending?limit=${limit}`);
}

export function usePopularAnime(limit = 15) {
  return useAnimeListData(`/api/anime/popular?limit=${limit}`);
}

export function useSeasonalAnime(limit = 15) {
  return useAnimeListData(`/api/anime/seasonal?limit=${limit}`);
}

export function useAnimeDetail(id: number) {
  const { data, error, isLoading } = useSWR<TransformedAnime>(
    id ? `/api/anime/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300_000,
    }
  );

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
  };
}