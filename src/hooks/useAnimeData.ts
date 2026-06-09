// src/hooks/useAnimeData.ts
"use client";

import { useEffect, useState } from "react";
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

export function useTrendingAnime(limit = 7) {
  const [data, setData] = useState<TransformedAnime[]>([]);  // Start with empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    async function fetchData() {
      try {
        const res = await fetch(`/api/anime/trending?limit=${limit}`);
        const json: AnimeDataResponse = await res.json();
        if (!cancelled) {
          setData(json.media || []);
        }
      } catch (error) {
        console.error("Failed to fetch trending:", error);
        if (!cancelled) {
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchData();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { data, loading };
}

export function usePopularAnime(limit = 15) {
  const [data, setData] = useState<TransformedAnime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch(`/api/anime/popular?limit=${limit}`);
        const json: AnimeDataResponse = await res.json();
        if (!cancelled) {
          setData(json.media || []);
        }
      } catch (error) {
        console.error("Failed to fetch popular:", error);
        if (!cancelled) {
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchData();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { data, loading };
}

export function useSeasonalAnime(limit = 15) {
  const [data, setData] = useState<TransformedAnime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch(`/api/anime/seasonal?limit=${limit}`);
        const json: AnimeDataResponse = await res.json();
        if (!cancelled) {
          setData(json.media || []);
        }
      } catch (error) {
        console.error("Failed to fetch seasonal:", error);
        if (!cancelled) {
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchData();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { data, loading };
}

export function useAnimeDetail(id: number) {
  const [data, setData] = useState<TransformedAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/anime/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json: TransformedAnime = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    if (id) fetchData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, loading, error };
}