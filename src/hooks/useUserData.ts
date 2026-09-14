// src/hooks/useUserData.ts
"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const userConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60_000,
};

export function useUserStats(userId?: string) {
  const url = userId ? `/api/user/stats?userId=${userId}` : "/api/user/stats";
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, userConfig);
  return { data, error, loading: isLoading, mutate };
}

export function useAnimeList(status?: string) {
  const url = status ? `/api/tracking/list?status=${status}` : "/api/tracking/list";
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    ...userConfig,
    dedupingInterval: 30_000,
    // Show the previous tab's data while the next tab loads instead of
    // flashing skeletons on every library tab switch.
    keepPreviousData: true,
  });
  return { data, error, loading: isLoading, mutate };
}

export interface AnimeStatusInfo {
  status: string;
  progress: number;
}

/**
 * Shared, cached view of the user's tracking statuses (animeId -> status).
 *
 * Uses the same SWR key as `useAnimeList(undefined)`, so the library page,
 * profile page and explore page all share ONE request and ONE cache entry
 * instead of each refetching `/api/tracking/list` on every navigation.
 */
export function useAnimeStatusMap() {
  const { data: session } = useSession();
  const { data, isLoading, mutate } = useSWR(
    session ? "/api/tracking/list" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
      keepPreviousData: true,
    }
  );

  const statusMap = useMemo(() => {
    const map: Record<number, AnimeStatusInfo> = {};
    if (Array.isArray(data)) {
      for (const item of data as Array<{
        animeId: number;
        status: string;
        progress: number;
      }>) {
        map[item.animeId] = { status: item.status, progress: item.progress || 0 };
      }
    }
    return map;
  }, [data]);

  return { statusMap, loaded: !session ? true : !isLoading, mutate };
}

export function useCurrentUser() {
  const { data: session } = useSession();
  return session?.user;
}