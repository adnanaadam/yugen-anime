import type { Anime } from "@/features/anime/types";
import { anilistFetch } from "@/lib/anilist";

const ANIME_LIST_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
        total
      }
      media(type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        description
        episodes
        status
        coverImage {
          large
          medium
        }
        genres
        averageScore
        season
        seasonYear
      }
    }
  }
`;

const ANIME_DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      description
      episodes
      status
      coverImage {
        large
        medium
      }
      genres
      averageScore
      season
      seasonYear
    }
  }
`;

interface AniListResponse {
  Page?: {
    pageInfo: {
      hasNextPage: boolean;
      total: number;
    };
    media: Anime[];
  };
  Media?: Anime;
}

export async function getAnimeList(
  page: number = 1,
  perPage: number = 20
): Promise<{ data: Anime[]; hasNextPage: boolean }> {
  const result = await anilistFetch<AniListResponse>(ANIME_LIST_QUERY, {
    page,
    perPage,
  });

  return {
    data: result.Page?.media ?? [],
    hasNextPage: result.Page?.pageInfo.hasNextPage ?? false,
  };
}

export async function getAnimeById(id: number): Promise<Anime | null> {
  const result = await anilistFetch<AniListResponse>(ANIME_DETAIL_QUERY, {
    id,
  });

  return result.Media ?? null;
}