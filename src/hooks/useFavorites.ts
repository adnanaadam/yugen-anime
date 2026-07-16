// src/hooks/useFavorites.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

export function useFavorites() {
  const { data: session } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(!session);
  const fetchRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!session) {
      return;
    }

    let cancelled = false;

    const doFetch = async () => {
      try {
        const res = await fetch("/api/favorites/ids");
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data: number[] = await res.json();
        if (!cancelled) setFavoriteIds(new Set(data));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    doFetch();
    fetchRef.current = doFetch;

    return () => {
      cancelled = true;
    };
  }, [session]);

  const toggleFavorite = useCallback((animeId: number, isFavorited: boolean) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFavorited) {
        next.add(animeId);
      } else {
        next.delete(animeId);
      }
      return next;
    });
  }, []);

  const refetch = useCallback(() => {
    fetchRef.current();
  }, []);

  return { favoriteIds, loaded, toggleFavorite, refetch };
}