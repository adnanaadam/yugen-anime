// src/app/(dashboard)/library/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAnimeList } from "@/hooks/useUserData";
import { useSession, signIn } from "next-auth/react";
import { addToAnimeList } from "@/features/tracking/api";
import { Plus, Check, ChevronDown, Grid, List, Minus } from "lucide-react";
import Image from "next/image";

const tabs = [
  { label: "Watching", value: "WATCHING", color: "#00e8fc" },
  { label: "Completed", value: "COMPLETED", color: "#97cc04" },
  { label: "Plan to Watch", value: "PLAN_TO_WATCH", color: "#f9c846" },
  { label: "Paused", value: "PAUSED", color: "#f96e46" },
  { label: "Dropped", value: "DROPPED", color: "#ff4444" },
  { label: "Rewatching", value: "REWATCHING", color: "#c084fc" },
  { label: "All", value: "", color: "#545863" },
];

const statusOptions = [
  { label: "Watching", value: "WATCHING" as const, color: "#00e8fc" },
  { label: "Completed", value: "COMPLETED" as const, color: "#97cc04" },
  { label: "Plan to Watch", value: "PLAN_TO_WATCH" as const, color: "#f9c846" },
  { label: "Paused", value: "PAUSED" as const, color: "#f96e46" },
  { label: "Dropped", value: "DROPPED" as const, color: "#ff4444" },
  { label: "Rewatching", value: "REWATCHING" as const, color: "#c084fc" },
];

const statusColors: Record<string, string> = {
  WATCHING: "#00e8fc",
  COMPLETED: "#97cc04",
  PLAN_TO_WATCH: "#f9c846",
  PAUSED: "#f96e46",
  DROPPED: "#ff4444",
  REWATCHING: "#c084fc",
};

interface LibraryEntry {
  id: string;
  animeId: number;
  status: string;
  progress: number;
  score?: number;
  updatedAt?: string;
  anime?: {
    title: {
      english: string | null;
      romaji: string;
    };
    coverImage: {
      large: string;
    };
    averageScore: number | null;
    episodes: number | null;
  };
}

export default function LibraryPage() {
  const [activeStatus, setActiveStatus] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: animeList, loading, mutate } = useAnimeList(activeStatus || undefined);
  const { data: session } = useSession();

  const handleStatusUpdate = async (animeId: number, newStatus: string) => {
    if (!session) {
      signIn();
      return;
    }

    try {
      await addToAnimeList(animeId, newStatus as "WATCHING" | "COMPLETED" | "PLAN_TO_WATCH" | "PAUSED" | "DROPPED" | "REWATCHING");
      mutate();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleProgressUpdate = async (animeId: number, newProgress: number) => {
    if (!session) {
      signIn();
      return;
    }

    try {
      await addToAnimeList(animeId, "WATCHING", newProgress);
      mutate();
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#545863]">My Library</h1>
        <p className="mt-1 text-sm text-[#7b7f89]">
          {animeList?.length || 0} anime tracked
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveStatus(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeStatus === tab.value
                ? "bg-[#545863] text-white"
                : "bg-white border border-[#ececec] text-[#7b7f89] hover:bg-[#f7f7f7]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#7b7f89]">
          {animeList?.length || 0} {animeList?.length === 1 ? 'anime' : 'anime'}
        </div>
        <div className="flex items-center gap-1 bg-white border border-[#ececec] rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "grid"
                ? "bg-[#545863] text-white"
                : "text-[#7b7f89] hover:text-[#545863]"
            }`}
          >
            <Grid size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "list"
                ? "bg-[#545863] text-white"
                : "text-[#7b7f89] hover:text-[#545863]"
            }`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Anime list */}
      {loading ? (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
          : "space-y-2"
        }>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={viewMode === "grid" 
              ? "h-48 rounded-xl bg-[#f7f7f7] animate-pulse"
              : "h-16 rounded-xl bg-[#f7f7f7] animate-pulse"
            } />
          ))}
        </div>
      ) : animeList && animeList.length > 0 ? (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
          : "space-y-2"
        }>
          {animeList.map((entry: LibraryEntry) => (
            <LibraryAnimeCard
              key={entry.id}
              entry={entry}
              viewMode={viewMode}
              onStatusUpdate={handleStatusUpdate}
              onProgressUpdate={handleProgressUpdate}
              session={session}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#ececec] bg-white p-12 text-center shadow-sm">
          <p className="text-[#7b7f89] text-sm">No anime found in this category.</p>
          <Link
            href="/explore"
            className="mt-2 inline-block text-sm text-[#f96e46] hover:underline"
          >
            Explore Anime →
          </Link>
        </div>
      )}
    </div>
  );
}

function LibraryAnimeCard({
  entry,
  viewMode,
  onStatusUpdate,
  onProgressUpdate,
  session,
}: {
  entry: LibraryEntry;
  viewMode: "grid" | "list";
  onStatusUpdate: (animeId: number, status: string) => void;
  onProgressUpdate: (animeId: number, progress: number) => void;
  session: ReturnType<typeof useSession>["data"];
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    await onStatusUpdate(entry.animeId, newStatus);
    setShowDropdown(false);
    setIsUpdating(false);
  };

  const handleProgressChange = async (delta: number) => {
    if (isUpdating) return;
    const newProgress = Math.max(0, entry.progress + delta);
    setIsUpdating(true);
    await onProgressUpdate(entry.animeId, newProgress);
    setIsUpdating(false);
  };

  const currentStatusColor = statusColors[entry.status] || "#545863";
  const currentStatusLabel = statusOptions.find(s => s.value === entry.status)?.label || entry.status;
  const title = entry.anime?.title?.english || entry.anime?.title?.romaji || `Anime #${entry.animeId}`;

  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[#ececec] bg-white p-3 shadow-sm hover:shadow-md hover:border-[#f9c846]/30 transition-all">
        {/* Cover Image */}
        <Link href={`/anime/${entry.animeId}`} className="relative w-12 h-16 flex-shrink-0">
          {entry.anime?.coverImage?.large ? (
            <Image
              src={entry.anime.coverImage.large}
              alt={title}
              fill
              className="object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-[#f7f7f7] rounded flex items-center justify-center">
              <span className="text-xs text-[#7b7f89]">No img</span>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/anime/${entry.animeId}`}>
            <h3 className="text-sm font-medium text-[#545863] truncate hover:text-[#f96e46] transition-colors">
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: currentStatusColor }}
            />
            <span className="text-xs text-[#7b7f89]">
              {currentStatusLabel}
              {entry.score && ` · ${entry.score}/10`}
            </span>
          </div>
        </div>

        {/* Episode Update */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleProgressChange(-1)}
            className="p-1 rounded border border-[#ececec] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
            disabled={isUpdating || !entry.progress}
          >
            <Minus size={12} />
          </button>
          <span className="text-xs font-medium text-[#545863] w-12 text-center">
            {entry.progress}/{entry.anime?.episodes || "?"}
          </span>
          <button
            onClick={() => handleProgressChange(1)}
            className="p-1 rounded border border-[#ececec] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
            disabled={isUpdating || Boolean(entry.anime?.episodes && entry.progress >= entry.anime.episodes)}
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Update Status Button */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 px-2 py-1 rounded border border-[#ececec] text-xs font-medium text-[#545863] hover:bg-[#f7f7f7] transition-colors"
            disabled={isUpdating}
          >
            <ChevronDown size={12} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-40 rounded-lg border border-[#ececec] bg-white shadow-lg z-10">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors ${
                    entry.status === option.value
                      ? "bg-[#f7f7f7] font-semibold text-[#545863]"
                      : "text-[#7b7f89] hover:bg-[#f7f7f7]"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  {option.label}
                  {entry.status === option.value && (
                    <Check size={12} className="ml-auto text-[#97cc04]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid view - smaller cards
  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02] transition-colors duration-200 group-hover:border-white/[0.15]">
        {/* Cover Image */}
        <Link href={`/anime/${entry.animeId}`} className="block">
          <div className="relative aspect-[2/3] overflow-hidden">
            {entry.anime?.coverImage?.large ? (
              <Image
                src={entry.anime.coverImage.large}
                alt={title}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
              />
            ) : (
              <div className="w-full h-full bg-[#f7f7f7] flex items-center justify-center">
                <span className="text-xs text-[#7b7f89]">No image</span>
              </div>
            )}

            {/* Score badge */}
            {entry.anime?.averageScore && (
              <div className="absolute top-1 left-1 z-10 rounded bg-black/70 px-1 py-0.5 text-[10px] font-medium text-[#f9c846] backdrop-blur-sm">
                ★ {(entry.anime.averageScore / 10).toFixed(1)}
              </div>
            )}

            {/* Episode count */}
            {entry.anime?.episodes && (
              <div className="absolute top-1 right-1 z-10 rounded bg-black/70 px-1 py-0.5 text-[9px] text-gray-300 backdrop-blur-sm">
                {entry.progress}/{entry.anime.episodes}
              </div>
            )}

            {/* Update button */}
            <div className="absolute bottom-1 right-1 z-20">
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
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#f9c846] hover:text-black hover:border-transparent"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus size={10} />
                )}
              </button>

              {showDropdown && (
                <div className="absolute bottom-full right-0 mb-1 w-40 overflow-hidden rounded-lg border border-white/10 bg-black/95 backdrop-blur-md shadow-xl">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStatusChange(option.value);
                      }}
                      className={`flex w-full items-center gap-2 px-2 py-1.5 text-[10px] transition-colors ${
                        entry.status === option.value
                          ? "bg-white/10 font-semibold text-white"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: option.color }}
                      />
                      <span>{option.label}</span>
                      {entry.status === option.value && (
                        <Check size={10} className="ml-auto text-[#97cc04]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Title and episode update below */}
        <div className="p-1.5">
          <Link href={`/anime/${entry.animeId}`}>
            <h3 className="text-[11px] font-medium text-gray-500 line-clamp-2 leading-tight group-hover:text-white transition-colors">
              {title}
            </h3>
          </Link>
          
          {/* Episode update controls */}
          {entry.status === "WATCHING" || entry.status === "REWATCHING" ? (
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleProgressChange(-1)}
                  className="p-0.5 rounded border border-[#ececec] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
                  disabled={isUpdating || !entry.progress}
                >
                  <Minus size={10} />
                </button>
                <span className="text-[10px] font-medium text-[#545863] w-8 text-center">
                  {entry.progress}
                </span>
                <button
                  onClick={() => handleProgressChange(1)}
                  className="p-0.5 rounded border border-[#ececec] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
                  disabled={isUpdating || Boolean(entry.anime?.episodes && entry.progress >= entry.anime.episodes)}
                >
                  <Plus size={10} />
                </button>
              </div>
              {entry.anime?.episodes && (
                <span className="text-[9px] text-[#7b7f89]">
                  /{entry.anime.episodes}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 mt-1">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: currentStatusColor }}
              />
              <span className="text-[10px] text-[#7b7f89]">
                {currentStatusLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}