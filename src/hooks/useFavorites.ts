// src/hooks/useFavorites.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export function useFavorites() {
  const { data: session } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(!session);

  const fetchFavorites = useCallback(async () => {
    if (!session) {
      setFavoriteIds(new Set());
      setLoaded(true);
      return;
    }

    try {
      const res = await fetch("/api/favorites/ids");
      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data: number[] = await res.json();
      setFavoriteIds(new Set(data));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoaded(true);
    }
  }, [session]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

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

  return { favoriteIds, loaded, toggleFavorite, refetch: fetchFavorites };
}