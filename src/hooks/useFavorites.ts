// src/hooks/useFavorites.ts
"use client";

import { useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFavorites() {
  const { data: session } = useSession();

  // Shared SWR cache: every component using this hook (AnimeRow, pages)
  // reads the same cache entry instead of firing duplicate requests.
  const { data, isLoading, mutate } = useSWR<number[]>(
    session ? "/api/favorites/ids" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    }
  );

  const favoriteIds = useMemo(() => new Set(data ?? []), [data]);

  // Optimistic toggle — updates the shared cache without a refetch.
  const toggleFavorite = useCallback(
    (animeId: number, isFavorited: boolean) => {
      mutate(
        (current) => {
          const ids = new Set(current ?? []);
          if (isFavorited) {
            ids.add(animeId);
          } else {
            ids.delete(animeId);
          }
          return Array.from(ids);
        },
        { revalidate: false }
      );
    },
    [mutate]
  );

  const refetch = useCallback(() => {
    void mutate();
  }, [mutate]);

  return { favoriteIds, loaded: !session ? true : !isLoading, toggleFavorite, refetch };
}