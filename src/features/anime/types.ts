export interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  description: string;
  episodes: number;
  status: string;
  coverImage: {
    large: string;
    medium: string;
  };
  genres: string[];
  averageScore: number;
  season: string;
  seasonYear: number;
}

export interface AnimeListResponse {
  data: Anime[];
  page: number;
  hasNextPage: boolean;
}