// src/components/anime/AnimeRow.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, Star, Tv } from "lucide-react";
import type { TransformedAnime } from "@/services/jikan.service";

interface AnimeRowProps {
  title: string;
  animeList: TransformedAnime[] | undefined;
  loading?: boolean;
  viewMoreHref?: string;
}

export default function AnimeRow({
  title,
  animeList,
  loading = false,
  viewMoreHref = "/explore",
}: AnimeRowProps) {
  const safeAnimeList = animeList || [];
  const displayList = safeAnimeList.slice(0, 5);

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-4 px-4 md:px-0">
        <div>
          <h2 className="text-base font-bold text-[#545863]">{title}</h2>
        </div>

        <Link
          href={viewMoreHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#f96e46] hover:text-[#e55d3a] transition-colors"
        >
          View More
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid row - 5 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-4 md:px-0">
        {loading || displayList.length === 0
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full">
                <div className="aspect-[2/3] rounded-xl bg-[#545863]/15 animate-pulse" />
                <div className="mt-2 space-y-1.5 p-1">
                  <div className="h-3 w-3/4 rounded bg-[#545863]/15 animate-pulse" />
                  <div className="h-2.5 w-1/2 rounded bg-[#545863]/15 animate-pulse" />
                </div>
              </div>
            ))
          : displayList.map((anime, index) => (
              <RowAnimeCard
                key={anime.id}
                anime={anime}
                index={index}
                totalCards={displayList.length}
              />
            ))}
      </div>
    </div>
  );
}

function RowAnimeCard({
  anime,
  index,
  totalCards,
}: {
  anime: TransformedAnime;
  index: number;
  totalCards: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [detailPosition, setDetailPosition] = useState<"right" | "left">("right");
  const cardRef = useRef<HTMLDivElement>(null);

  const title = anime.title.english || anime.title.romaji;
  const nativeTitle = anime.title.native;

  // Determine if detail box should appear on left or right
  useEffect(() => {
    if (isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceOnRight = window.innerWidth - rect.right;
      const spaceOnLeft = rect.left;

      // Need ~280px for detail box
      if (spaceOnRight < 300 && spaceOnLeft > spaceOnRight) {
        setDetailPosition("left");
      } else {
        setDetailPosition("right");
      }
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card */}
      <Link href={`/anime/${anime.id}`} className="block">
        <div
          className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
            isHovered
              ? "border-[#f9c846]/60 shadow-xl"
              : "border-[#ececec] bg-white shadow-sm"
          }`}
        >
          {/* Cover Image */}
          <div className="relative aspect-[2/3] overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-[#545863]/15 animate-pulse" />
            )}
            <Image
              src={anime.coverImage.large}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              className={`object-cover transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>

        {/* Title below card */}
        <div className="mt-2 px-0.5">
          <h3
            className={`text-[13px] font-semibold line-clamp-2 leading-tight transition-colors duration-200 ${
              isHovered ? "text-[#f96e46]" : "text-[#545863]/70"
            }`}
          >
            {title}
          </h3>
        </div>
      </Link>

      {/* Hover Detail Box - slides out to the side */}
      <div
        className={`absolute top-0 z-50 w-84 transition-all duration-300 pointer-events-none ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2"
        } ${
          detailPosition === "right"
            ? "left-[calc(100%+12px)]"
            : "right-[calc(100%+12px)]"
        }`}
      >
        <div className="rounded-xl border border-[#ececec] bg-[#545863] shadow-xl p-5">
          {/* Title */}
          <h4 className="text-sm font-bold text-white leading-tight">
            {title}
          </h4>

          {nativeTitle && nativeTitle !== title && (
            <p className="mt-0.5 text-[11px] text-white">{nativeTitle}</p>
          )}

          {/* Meta info */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#7b7f89]">
            {anime.type && (
              <span className="flex items-center gap-1 rounded-md bg-[#f7f7f7] px-2 py-0.5">
                <Tv size={11} />
                {anime.type}
              </span>
            )}
            {anime.status && (
              <span className="rounded-md bg-[#f9c846]/10 text-[#f9c846] px-2 py-0.5 font-medium">
                {anime.status}
              </span>
            )}
            {anime.episodes && (
              <span className="rounded-md bg-[#f7f7f7] px-2 py-0.5">
                {anime.episodes} episodes
              </span>
            )}
          </div>

          {/* Score */}
          {anime.averageScore && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-[#f9c846]" fill="#f9c846" />
                <span className="text-sm font-bold text-white">
                  {(anime.averageScore / 10).toFixed(1)}
                </span>
              </div>
              <span className="text-[11px] text-white">
                / 10
              </span>
            </div>
          )}

          {/* Genres */}
          {anime.genres.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1.5">
                {anime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-[#ececec] bg-[#fffdf8] px-2.5 py-1 text-[10px] text-[#545863] font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Studios */}
          {anime.studios.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#ececec]">
              <p className="text-[10px] text-white uppercase tracking-wider mb-1">
                Studio
              </p>
              <p className="text-xs text-white font-medium">
                {anime.studios.slice(0, 2).join(", ")}
              </p>
            </div>
          )}

          {/* Synopsis preview */}
          {anime.description && (
            <div className="mt-3 pt-3 border-t border-[#ececec]">
              <p className="text-[10px] text-white uppercase tracking-wider mb-1">
                Synopsis
              </p>
              <p className="text-[11px] text-white leading-relaxed line-clamp-4">
                {anime.description.replace(/<[^>]*>/g, "").replace(/\\n/g, " ")}
              </p>
            </div>
          )}

          {/* Arrow indicator */}
          <div
            className={`absolute top-6 ${
              detailPosition === "right"
                ? "-left-1.5"
                : "-right-1.5"
            }`}
          >
            <div className={`w-3 h-3 bg-[#545863] border border-[#ececec] rotate-45 ${
              detailPosition === "right"
                ? "border-r-0 border-t-0"
                : "border-l-0 border-b-0"
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
}