// src/hooks/useUserData.ts
"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUserStats(userId?: string) {
  const url = userId ? `/api/user/stats?userId=${userId}` : "/api/user/stats";
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return { data, error, loading: isLoading, mutate };
}

export function useAnimeList(status?: string) {
  const url = status ? `/api/tracking/list?status=${status}` : "/api/tracking/list";
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return { data, error, loading: isLoading, mutate };
}

export function useCurrentUser() {
  const { data: session } = useSession();
  return session?.user;
}