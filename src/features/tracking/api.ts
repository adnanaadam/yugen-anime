import type { AnimeTrackingEntry, WatchStatus } from "./types";

export async function fetchUserTrackingList(
  userId: string
): Promise<AnimeTrackingEntry[]> {
  // TODO: Implement with API integration
  return [];
}

export async function updateTrackingEntry(
  animeId: number,
  data: Partial<Pick<AnimeTrackingEntry, "status" | "progress" | "score">>
): Promise<AnimeTrackingEntry> {
  // TODO: Implement with API integration
  throw new Error("Not implemented");
}

export async function addTrackingEntry(
  animeId: number,
  status: WatchStatus
): Promise<AnimeTrackingEntry> {
  // TODO: Implement with API integration
  throw new Error("Not implemented");
}

export async function removeTrackingEntry(animeId: number): Promise<void> {
  // TODO: Implement with API integration
}