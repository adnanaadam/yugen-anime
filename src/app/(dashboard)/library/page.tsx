// src/app/(dashboard)/library/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAnimeList } from "@/hooks/useUserData";

const tabs = [
  { label: "Watching", value: "WATCHING", color: "#00e8fc" },
  { label: "Completed", value: "COMPLETED", color: "#97cc04" },
  { label: "Plan to Watch", value: "PLAN_TO_WATCH", color: "#f9c846" },
  { label: "Paused", value: "PAUSED", color: "#f96e46" },
  { label: "Dropped", value: "DROPPED", color: "#ff4444" },
  { label: "Rewatching", value: "REWATCHING", color: "#c084fc" },
  { label: "All", value: "", color: "#545863" },
];

export default function LibraryPage() {
  const [activeStatus, setActiveStatus] = useState("");
  const { data: animeList, loading } = useAnimeList(activeStatus || undefined);

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

      {/* Anime list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-[#f7f7f7] animate-pulse" />
          ))}
        </div>
      ) : animeList && animeList.length > 0 ? (
        <div className="space-y-2">
          {animeList.map((entry: { id: string; animeId: number; status: string; progress: number; score?: number; updatedAt?: string }) => (
            <Link
              key={entry.id}
              href={`/anime/${entry.animeId}`}
              className="flex items-center justify-between rounded-xl border border-[#ececec] bg-white p-4 shadow-sm hover:shadow-md hover:border-[#f9c846]/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: statusColors[entry.status] || "#545863" }}
                />
                <div>
                  <p className="text-sm font-medium text-[#545863]">
                    Anime #{entry.animeId}
                  </p>
                  <p className="text-xs text-[#7b7f89]">
                    {entry.progress > 0 && `${entry.progress} eps · `}
                    {entry.status.replace(/_/g, " ")}
                    {entry.score && ` · Rated ${entry.score}/10`}
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#7b7f89]">
                {entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString() : ""}
              </span>
            </Link>
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

const statusColors: Record<string, string> = {
  WATCHING: "#00e8fc",
  COMPLETED: "#97cc04",
  PLAN_TO_WATCH: "#f9c846",
  PAUSED: "#f96e46",
  DROPPED: "#ff4444",
  REWATCHING: "#c084fc",
};