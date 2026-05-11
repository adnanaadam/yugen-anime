export function formatEpisodeCount(episodes: number | null): string {
  if (episodes === null) return "Unknown";
  return `${episodes} episodes`;
}

export function formatScore(score: number): string {
  return `${(score / 10).toFixed(1)}`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    FINISHED: "Finished",
    RELEASING: "Currently Airing",
    NOT_YET_RELEASED: "Not Yet Released",
    CANCELLED: "Cancelled",
    HIATUS: "On Hiatus",
  };

  return labels[status] ?? status;
}

export function getSeasonLabel(season: string, year: number): string {
  const seasons: Record<string, string> = {
    WINTER: "Winter",
    SPRING: "Spring",
    SUMMER: "Summer",
    FALL: "Fall",
  };

  return `${seasons[season] ?? season} ${year}`;
}