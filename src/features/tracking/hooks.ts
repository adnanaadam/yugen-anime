"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { AnimeTrackingEntry, WatchStatus, TrackingStats } from "./types";
import {
  addToAnimeList,
  updateProgress,
  removeFromList,
  getUserAnimeList,
} from "./api";

export function useTrackingList(userId: string) {
  const [entries, setEntries] = useState<AnimeTrackingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const cancelledRef = useRef(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await getUserAnimeList() as any[];
    if (!userId || cancelledRef.current) return;
    setEntries(data as AnimeTrackingEntry[]);
    if (!cancelledRef.current) setLoading(false);
  }, [userId]);

  useEffect(() => {
    cancelledRef.current = false;
    // setLoading(true) only fires after await, so it's not synchronous
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch(() => {
      if (!cancelledRef.current) setLoading(false);
    });
    return () => { cancelledRef.current = true; };
  }, [refresh]);

  return { entries, loading, refresh };
}

export function useTrackingStats(entries: AnimeTrackingEntry[]): TrackingStats {
  return {
    watching: entries.filter((e) => e.status === "WATCHING").length,
    completed: entries.filter((e) => e.status === "COMPLETED").length,
    onHold: entries.filter((e) => e.status === "ON_HOLD").length,
    dropped: entries.filter((e) => e.status === "DROPPED").length,
    planToWatch: entries.filter((e) => e.status === "PLAN_TO_WATCH").length,
    totalEpisodes: entries.reduce((sum, e) => sum + e.progress, 0),
  };
}

export function useTrackingActions(_userId: string) {
  const updateStatus = useCallback(
    async (animeId: number, status: WatchStatus) => {
      await addToAnimeList(animeId, status as import("@prisma/client").AnimeStatus);
    },
    []
  );

  const updateProgressAction = useCallback(
    async (animeId: number, progress: number) => {
      await updateProgress(animeId, progress);
    },
    []
  );

  const addToTracking = useCallback(
    async (animeId: number, status: WatchStatus) => {
      await addToAnimeList(animeId, status as import("@prisma/client").AnimeStatus);
    },
    []
  );

  const removeFromTracking = useCallback(
    async (animeId: number) => {
      await removeFromList(animeId);
    },
    []
  );

  return { updateStatus, updateProgress: updateProgressAction, addToTracking, removeFromTracking };
}