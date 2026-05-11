export type WatchStatus =
  | "WATCHING"
  | "COMPLETED"
  | "ON_HOLD"
  | "DROPPED"
  | "PLAN_TO_WATCH";

export interface AnimeTrackingEntry {
  id: string;
  animeId: number;
  userId: string;
  status: WatchStatus;
  progress: number;
  totalEpisodes: number;
  score: number | null;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface TrackingStats {
  watching: number;
  completed: number;
  onHold: number;
  dropped: number;
  planToWatch: number;
  totalEpisodes: number;
}