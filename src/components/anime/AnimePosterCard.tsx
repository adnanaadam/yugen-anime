"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  Play,
  BookMarked,
} from "lucide-react";

import type { TransformedAnime } from "@/services/jikan.service";

interface Props {
  anime: TransformedAnime;
}

export default function AnimePosterCard({ anime }: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [actionStatus, setActionStatus] = useState<
    "idle" | "plan" | "watching"
  >("idle");

  const handleAction = (
    e: React.MouseEvent,
    action: "plan" | "watching"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setActionStatus(action);
    setShowDropdown(false);
  };

  return (
    <div className="group w-[180px] flex-shrink-0">
      <div className="relative">
        <Link href={`/anime/${anime.id}`}>
          <div className="overflow-hidden rounded-2xl bg-[#0A0A0A]">
            <Image
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              width={300}
              height={450}
              className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105"
            />

            {anime.averageScore && (
              <div className="absolute left-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-[#e5b23c] backdrop-blur-sm">
                ★ {(anime.averageScore / 10).toFixed(1)}
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute bottom-0 left-0 right-0 translate-y-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex flex-wrap gap-1">
                {anime.genres?.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>

        <div className="absolute bottom-3 right-3">
          {actionStatus === "idle" ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-[#e5b23c] hover:text-black"
              >
                <Plus size={16} />
              </button>

              {showDropdown && (
                <div className="absolute bottom-full right-0 mb-2 overflow-hidden rounded-xl border border-white/10 bg-black/95 backdrop-blur-md">
                  <button
                    onClick={(e) => handleAction(e, "plan")}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs text-white hover:bg-white/10"
                  >
                    <BookMarked size={14} />
                    Plan To Watch
                  </button>

                  <button
                    onClick={(e) => handleAction(e, "watching")}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs text-white hover:bg-white/10"
                  >
                    <Play size={14} />
                    Watching
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                actionStatus === "plan"
                  ? "bg-violet-500 text-white"
                  : "bg-[#e5b23c] text-black"
              }`}
            >
              {actionStatus === "plan" ? (
                <BookMarked size={14} />
              ) : (
                <Play size={14} />
              )}
            </div>
          )}
        </div>
      </div>

      <Link href={`/anime/${anime.id}`}>
        <div className="mt-3">
          <h3 className="line-clamp-1 text-sm font-medium text-white transition hover:text-[#e5b23c]">
            {anime.title.english || anime.title.romaji}
          </h3>

          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            {anime.episodes && <span>{anime.episodes} eps</span>}
            {anime.seasonYear && <span>• {anime.seasonYear}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}