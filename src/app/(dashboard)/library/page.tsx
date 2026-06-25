// src/app/(dashboard)/library/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useAnimeList } from "@/hooks/useUserData";
import { useSession, signIn } from "next-auth/react";
import { addToAnimeList, updateProgress } from "@/features/tracking/api";
import { ChevronDown, Grid, List } from "lucide-react";
import Image from "next/image";
import UpdateProgressModal from "@/components/anime/UpdateProgressModal";

const tabs = [
  { label: "Watching", value: "WATCHING", color: "#00e8fc" },
  { label: "Completed", value: "COMPLETED", color: "#97cc04" },
  { label: "Plan to Watch", value: "PLAN_TO_WATCH", color: "#f9c846" },
  { label: "Paused", value: "PAUSED", color: "#f96e46" },
  { label: "Dropped", value: "DROPPED", color: "#ff4444" },
  { label: "Rewatching", value: "REWATCHING", color: "#c084fc" },
  { label: "All", value: "", color: "#545863" },
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
    status: string | null;
  };
}

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const [activeStatus, setActiveStatus] = useState(searchParams.get("status") || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: animeList, loading, mutate } = useAnimeList(activeStatus || undefined);
  const { data: session } = useSession();

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
              session={session}
              onUpdate={mutate}
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
  session,
  onUpdate,
}: {
  entry: LibraryEntry;
  viewMode: "grid" | "list";
  session: ReturnType<typeof useSession>["data"];
  onUpdate: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fetchedAnime, setFetchedAnime] = useState<LibraryEntry["anime"] | null>(null);

  // Use entry.anime if available, otherwise use fetched data
  const enrichedAnime = entry.anime || fetchedAnime;

  // Fetch from Jikan if entry.anime is missing
  useEffect(() => {
    if (!entry.anime && !fetchedAnime) {
      let cancelled = false;
      fetch(`https://api.jikan.moe/v4/anime/${entry.animeId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled && data.data) {
            setFetchedAnime({
              title: {
                english: data.data.title_english,
                romaji: data.data.title,
              },
              coverImage: {
                large: data.data.images.jpg.large_image_url,
              },
              averageScore: data.data.score ? data.data.score * 10 : null,
              episodes: data.data.episodes,
              status: data.data.status,
            });
          }
        })
        .catch((err) => console.error("Failed to fetch anime details:", err));
      return () => { cancelled = true; };
    }
  }, [entry.anime, entry.animeId, fetchedAnime]);

  const handleSave = async (status: string, progress: number) => {
    if (!session) {
      signIn();
      return;
    }

    setIsUpdating(true);
    try {
      // If status changed, use addToAnimeList (handles status + progress)
      // If only progress changed, use updateProgress (awards XP)
      if (status !== entry.status) {
        await addToAnimeList(
          entry.animeId,
          status as "WATCHING" | "COMPLETED" | "PLAN_TO_WATCH" | "PAUSED" | "DROPPED" | "REWATCHING",
          progress
        );
      } else {
        await updateProgress(entry.animeId, progress);
      }
      onUpdate();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusColor = statusColors[entry.status] || "#545863";
  const currentStatusLabel = entry.status.charAt(0).toUpperCase() + entry.status.slice(1).toLowerCase();
  const title = enrichedAnime?.title?.english || enrichedAnime?.title?.romaji || `Anime #${entry.animeId}`;
  const isAiring = enrichedAnime?.status?.toLowerCase().includes("currently airing");

  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[#ececec] bg-white p-3 shadow-sm hover:shadow-md hover:border-[#f9c846]/30 transition-all">
        {/* Cover Image */}
        <Link href={`/anime/${entry.animeId}`} className="relative w-12 h-16 flex-shrink-0">
          {!entry.anime && !enrichedAnime ? (
            <div className="w-full h-full bg-[#f7f7f7] rounded animate-pulse" />
          ) : enrichedAnime?.coverImage?.large ? (
            <Image
              src={enrichedAnime.coverImage.large}
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
              {entry.progress > 0 && `${entry.progress} eps · `}
              {currentStatusLabel}
              {entry.score && ` · Rated ${entry.score}/10`}
            </span>
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ececec] text-xs font-medium text-[#545863] hover:bg-[#f7f7f7] transition-colors"
        >
          Update
        </button>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02] transition-colors duration-200 group-hover:border-white/[0.15]">
        {/* Cover Image */}
        <Link href={`/anime/${entry.animeId}`} className="block">
          <div className="relative aspect-[2/3] overflow-hidden">
            {!entry.anime && !enrichedAnime ? (
              <div className="w-full h-full bg-[#f7f7f7] animate-pulse" />
            ) : enrichedAnime?.coverImage?.large ? (
              <Image
                src={enrichedAnime.coverImage.large}
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
            {enrichedAnime?.averageScore && (
              <div className="absolute top-1 left-1 z-10 rounded bg-black/70 px-1 py-0.5 text-[10px] font-medium text-[#f9c846] backdrop-blur-sm">
                ★ {(enrichedAnime.averageScore / 10).toFixed(1)}
              </div>
            )}

            {/* Episode count */}
              <div className="absolute top-1 right-1 z-10 rounded bg-black/70 px-1 py-0.5 text-[9px] text-gray-300 backdrop-blur-sm">
                {entry.progress > 0 && `${entry.progress} eps · `}
              </div>

            {/* Update button - center bottom position */}
            <div className="absolute w-full px-2 bottom-1 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!session) {
                    signIn();
                    return;
                  }
                  setShowModal(true);
                }}
                className="flex w-full cursor-pointer text-xs px-2 py-1 items-center justify-center rounded-sm bg-black/60 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-[#f9c846] hover:text-black hover:border-transparent"
              >
               <p>Update progress</p>
              </button>
            </div>
          </div>
        </Link>

        {/* Title below */}
        <div className="p-1.5">
          <Link href={`/anime/${entry.animeId}`}>
            <h3 className="text-[11px] font-medium text-gray-500 line-clamp-2 leading-tight group-hover:text-[#f96e46] transition-colors">
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: currentStatusColor }}
            />
            <span className="text-[10px] text-[#7b7f89]">
              {currentStatusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <UpdateProgressModal
        key={`modal-${entry.id}`}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        currentStatus={entry.status}
        currentProgress={entry.progress}
        totalEpisodes={enrichedAnime?.episodes || undefined}
        animeTitle={title}
        isAiring={isAiring}
        isUpdating={isUpdating}
      />
    </div>
  );
}