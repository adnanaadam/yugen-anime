// src/app/(dashboard)/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ArrowLeft } from "lucide-react";
import FavoriteButton from "@/components/anime/FavoriteButton";
import { lordJuusai } from "@/fonts/fonts";

interface FavoriteAnime {
  id: string;
  animeId: number;
  createdAt: string;
  anime: {
    id: number;
    title: {
      english: string | null;
      romaji: string;
    };
    coverImage: {
      large: string;
      medium: string;
    };
    averageScore: number | null;
    episodes: number | null;
    genres: string[];
  } | null;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteAnime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFavorites();
    return () => { cancelled = true; };
  }, []);

  const handleRemoveFavorite = (animeId: number) => {
    setFavorites((prev) => prev.filter((f) => f.animeId !== animeId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded bg-[#f7f7f7] animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-[#f7f7f7] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl text-[#545863] ${lordJuusai.className}`}>
            My Favorites
          </h1>
          <p className="text-sm text-[#7b7f89] mt-1">
            {favorites.length} / 10 anime in your favorites
          </p>
        </div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#ececec] bg-white px-4 py-2 text-sm text-[#545863] hover:bg-[#f7f7f7] transition-colors"
        >
          <Heart size={14} className="text-[#f96e46]" />
          Discover More
        </Link>
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f96e46]/10">
            <Heart size={28} className="text-[#f96e46]" />
          </div>
          <h3 className="text-lg font-semibold text-[#545863]">
            No favorites yet
          </h3>
          <p className="mt-1 text-sm text-[#7b7f89] max-w-sm">
            Start adding anime to your favorites by clicking the heart icon on any anime card.
          </p>
          <Link
            href="/explore"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#f9c846] px-5 py-2.5 text-sm font-medium text-[#545863] hover:bg-[#f5bd29] transition-colors"
          >
            <ArrowLeft size={14} />
            Explore Anime
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {favorites.map((fav) => {
            if (!fav.anime) return null;
            const anime = fav.anime;
            const title = anime.title.english || anime.title.romaji;

            return (
              <div key={fav.id} className="group relative">
                <Link href={`/anime/${anime.id}`} className="block">
                  <div className="relative overflow-hidden rounded-xl border border-[#ececec] bg-white shadow-sm transition-all duration-300 group-hover:border-[#f96e46]/60 group-hover:shadow-xl">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={anime.coverImage.large}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                      />

                      {/* Score badge */}
                      {anime.averageScore && (
                        <div className="absolute top-2 left-2 z-10 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-[#f9c846] backdrop-blur-sm">
                          ★ {(anime.averageScore / 10).toFixed(1)}
                        </div>
                      )}

                      {/* Remove favorite - in the heart button */}
                      <div className="absolute top-2 right-2 z-20">
                        <FavoriteButton
                          animeId={anime.id}
                          initialFavorited={true}
                          onToggle={(favorited) => {
                            if (!favorited) handleRemoveFavorite(anime.id);
                          }}
                        />
                      </div>

                      {/* Episode count */}
                      {anime.episodes && (
                        <div className="absolute top-10 right-2 z-10 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] text-gray-300 backdrop-blur-sm">
                          {anime.episodes} eps
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Title */}
                <Link href={`/anime/${anime.id}`}>
                  <div className="mt-2 px-0.5">
                    <h3 className="text-[13px] font-semibold text-[#545863]/70 line-clamp-2 leading-tight group-hover:text-[#f96e46] transition-colors">
                      {title}
                    </h3>
                    {anime.genres.length > 0 && (
                      <p className="mt-0.5 text-[10px] text-[#7b7f89] line-clamp-1">
                        {anime.genres.slice(0, 2).join(" · ")}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}