// src/components/home/HomeAnimeRows.tsx
"use client";

import AnimeRow from "@/components/anime/AnimeRow";
import { useTrendingAnime, usePopularAnime, useSeasonalAnime } from "@/hooks/useAnimeData";

export default function HomeAnimeRows() {
  const { data: trending, loading: trendingLoading } = useTrendingAnime(5);
  const { data: popular, loading: popularLoading } = usePopularAnime(5);
  const { data: seasonal, loading: seasonalLoading } = useSeasonalAnime(5);

  return (
    <section className="py-4 bg-[#fffdf8] overflow-hidden">
      <div className="mx-auto max-w-5xl">
        <AnimeRow
          title="Trending Now"
          animeList={trending}
          loading={trendingLoading}
          viewMoreHref="/explore?category=trending"
        />

        <AnimeRow
          title="Popular This Season"
          animeList={seasonal}
          loading={seasonalLoading}
          viewMoreHref="/explore?category=seasonal"
        />

        <AnimeRow
          title="All-Time Popular"
          animeList={popular}
          loading={popularLoading}
          viewMoreHref="/explore?category=popular"
        />
      </div>
    </section>
  );
}