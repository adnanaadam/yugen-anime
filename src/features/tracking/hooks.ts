"use client";

import { useState, useEffect, useCallback } from "react";
import type { AnimeTrackingEntry, WatchStatus, TrackingStats } from "./types";
import {
  fetchUserTrackingList,
  updateTrackingEntry,
  addTrackingEntry,
  removeTrackingEntry,
} from "./api";

export function useTrackingList(userId: string) {
  const [entries, setEntries] = useState<AnimeTrackingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchUserTrackingList(userId)
      .then((data) => {
        if (!cancelled) {
          setEntries(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await fetchUserTrackingList(userId);
    setEntries(data);
    setLoading(false);
  }, [userId]);

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
      await updateTrackingEntry(animeId, { status });
    },
    []
  );

  const updateProgress = useCallback(
    async (animeId: number, progress: number) => {
      await updateTrackingEntry(animeId, { progress });
    },
    []
  );

  const addToTracking = useCallback(
    async (animeId: number, status: WatchStatus) => {
      await addTrackingEntry(animeId, status);
    },
    []
  );

  const removeFromTracking = useCallback(
    async (animeId: number) => {
      await removeTrackingEntry(animeId);
    },
    []
  );

  return { updateStatus, updateProgress, addToTracking, removeFromTracking };
}