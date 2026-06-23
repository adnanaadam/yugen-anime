// src/components/anime/AnimeCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { Plus, Play, BookMarked, Check } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { addToAnimeList } from "@/features/tracking/api";
import type { TransformedAnime } from "@/services/jikan.service";

interface AnimeCardProps {
  anime: TransformedAnime;
  size?: "sm" | "md" | "lg";
}

export default function AnimeCard({ anime, size = "md" }: AnimeCardProps) {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: "w-[140px]",
    md: "w-[170px]",
    lg: "w-[200px]",
  };

  const handleAddToList = useCallback(
    async (e: React.MouseEvent, status: "PLAN_TO_WATCH" | "WATCHING") => {
      e.preventDefault();
      e.stopPropagation();
      if (!session) {
        signIn();
        return;
      }

      try {
        await addToAnimeList(anime.id, status);
        setAdded(true);
        setShowDropdown(false);
      } catch (error) {
        console.error("Failed to add to list:", error);
      }
    },
    [anime.id, session]
  );

  const title = anime.title.english || anime.title.romaji;

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 group`}>
      <Link href={`/anime/${anime.id}`} className="block">
        <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors duration-200 group-hover:border-white/[0.15]">
          {/* Cover Image */}
          <div className="relative aspect-[2/3] overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-white/[0.03] animate-pulse" />
            )}
            <Image
              src={anime.coverImage.large}
              alt={title}
              fill
              sizes="(max-width: 768px) 140px, 200px"
              className={`object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Score badge */}
            {anime.averageScore && (
              <div className="absolute top-2 left-2 z-10 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-[#f9c846] backdrop-blur-sm">
                ★ {(anime.averageScore / 10).toFixed(1)}
              </div>
            )}

            {/* Episode count */}
            {anime.episodes && (
              <div className="absolute top-2 right-2 z-10 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] text-gray-300 backdrop-blur-sm">
                {anime.episodes} eps
              </div>
            )}

            {/* Hover overlay with genres */}
            <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <div className="flex flex-wrap gap-1">
                {anime.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] text-white backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Add to list button */}
            <div className="absolute bottom-2 right-2 z-20">
              {added ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#97cc04] text-black shadow-lg">
                  <Check size={14} />
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!session) {
                        signIn();
                        return;
                      }
                      setShowDropdown(!showDropdown);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#f9c846] hover:text-black hover:border-transparent"
                  >
                    <Plus size={14} />
                  </button>

                  {showDropdown && session && (
                    <div className="absolute bottom-full right-0 mb-1.5 overflow-hidden rounded-lg border border-white/10 bg-black/95 backdrop-blur-md shadow-xl text-nowrap">
                      <button
                        onClick={(e) => handleAddToList(e, "WATCHING")}
                        className="flex w-full items-center gap-2 px-3 py-2 text-[11px] text-white hover:bg-white/10 transition-colors"
                      >
                        <Play size={12} className="text-[#f9c846]" />
                        Watching
                      </button>
                      <button
                        onClick={(e) => handleAddToList(e, "PLAN_TO_WATCH")}
                        className="flex w-full items-center gap-2 px-3 py-2 text-[11px] text-white hover:bg-white/10 transition-colors"
                      >
                        <BookMarked size={12} className="text-[#00e8fc]" />
                        Plan to Watch
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Title below */}
          <div className="p-2">
            <h3 className="text-[13px] font-medium text-gray-500 line-clamp-2 leading-tight group-hover:text-white transition-colors">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
              {anime.seasonYear && <span>{anime.seasonYear}</span>}
              {anime.type && (
                <>
                  <span className="text-gray-600">·</span>
                  <span>{anime.type === "TV" ? "TV" : anime.type}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}