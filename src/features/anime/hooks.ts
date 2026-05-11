"use client";

import { useState, useEffect, useCallback } from "react";
import type { Anime, AnimeListResponse } from "./types";
import { fetchAnimeList, fetchAnimeById, searchAnime } from "./api";

export function useAnimeList(page: number = 1) {
  const [state, setState] = useState<{
    data: AnimeListResponse | null;
    loading: boolean;
    error: Error | null;
  }>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    fetchAnimeList(page)
      .then((result) => {
        if (!cancelled) {
          setState({ data: result, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  return state;
}

export function useAnime(id: number) {
  const [state, setState] = useState<{
    anime: Anime | null;
    loading: boolean;
    error: Error | null;
  }>({ anime: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    fetchAnimeById(id)
      .then((result) => {
        if (!cancelled) {
          setState({ anime: result, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ anime: null, loading: false, error: err });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}

export function useSearch() {
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchAnime(query);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Search failed"));
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}