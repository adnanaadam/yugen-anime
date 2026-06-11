// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useUserStats } from "@/hooks/useUserData";
import { useTrendingAnime } from "@/hooks/useAnimeData";
import { xpToNextLevel } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimeCard from "@/components/anime/AnimeCard";
import { Navii } from '@usenavii/react';

const statusColors: Record<string, string> = {
  WATCHING: "#00e8fc",
  COMPLETED: "#97cc04",
  PLAN_TO_WATCH: "#f9c846",
  PAUSED: "#f96e46",
  DROPPED: "#ff4444",
  REWATCHING: "#c084fc",
};

const statusLabels: Record<string, string> = {
  WATCHING: "Watching",
  COMPLETED: "Completed",
  PLAN_TO_WATCH: "Plan to Watch",
  PAUSED: "Paused",
  DROPPED: "Dropped",
  REWATCHING: "Rewatching",
};

export default function DashboardPage() {
  const { data: stats, loading } = useUserStats();
  const { data: trending } = useTrendingAnime(6);

  const xpInfo = stats?.user ? xpToNextLevel(stats.user.xp) : null;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-40 rounded-2xl bg-[#f7f7f7] animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-[#f7f7f7] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile header card */}
      <div className="rounded-2xl border border-[#ececec] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {/* {stats?.user?.image ? (
            <Navii seed={stats.user?.email ?? ""} size={24} title={stats.user?.name ?? ""} animated />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f9c846] text-[#545863] font-bold text-xl">
              {stats?.user?.name?.charAt(0) || "?"}
            </div>
          )} */}
          <div>
            <h1 className="text-xl font-bold text-[#545863]">
              {stats?.user?.name || "User"}
            </h1>
            <p className="text-sm text-[#7b7f89]">
              Level {stats?.user?.level || 1} · {stats?.user?.xp || 0} XP
            </p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#7b7f89]">Progress to Level {(stats?.user?.level || 1) + 1}</span>
            <span className="text-[#f9c846] font-medium">
              {xpInfo?.progress.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#f7f7f7] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f9c846] to-[#f96e46] transition-all duration-700"
              style={{ width: `${xpInfo?.progress || 0}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-[#7b7f89]">
            {xpInfo?.next && xpInfo.current !== undefined
              ? `${xpInfo.next - xpInfo.current} XP until next level`
              : "Max level!"}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div>
        <h2 className="text-sm font-semibold text-[#545863] mb-3 uppercase tracking-wider">
          Your Stats
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#ececec] bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#545863]">
              {stats?.stats.totalAnime || 0}
            </p>
            <p className="text-xs text-[#7b7f89] mt-0.5">Total Anime</p>
          </div>
          <div className="rounded-xl border border-[#ececec] bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#545863]">
              {stats?.stats.totalEpisodes || 0}
            </p>
            <p className="text-xs text-[#7b7f89] mt-0.5">Episodes</p>
          </div>
          <div className="rounded-xl border border-[#ececec] bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#545863]">
              {stats?.badges?.length || 0}
            </p>
            <p className="text-xs text-[#7b7f89] mt-0.5">Badges</p>
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-[#545863] mb-3 uppercase tracking-wider">
          Status Breakdown
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(statusLabels).map(([key, label]) => {
            const count = key === "WATCHING" ? stats?.stats.watching :
              key === "COMPLETED" ? stats?.stats.completed :
              key === "PLAN_TO_WATCH" ? stats?.stats.planToWatch :
              key === "PAUSED" ? stats?.stats.paused :
              key === "DROPPED" ? stats?.stats.dropped :
              stats?.stats.reWatching;
            const color = statusColors[key];

            return (
              <Link
                key={key}
                href={`/library?status=${key}`}
                className="rounded-xl border border-[#ececec] bg-white p-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-[#7b7f89] group-hover:text-[#545863] transition-colors">
                    {label}
                  </span>
                </div>
                <p className="text-xl font-bold text-[#545863]">{count || 0}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      {stats?.badges && stats.badges.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#545863] mb-3 uppercase tracking-wider">
            Badges Earned
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((ub: { id: string; badge: { name: string } }) => (
              <div
                key={ub.id}
                className="flex items-center gap-2 rounded-lg border border-[#ececec] bg-white px-3 py-2 shadow-sm"
              >
                <span className="text-sm">🏆</span>
                <span className="text-xs font-medium text-[#545863]">
                  {ub.badge.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending preview */}
      {trending && trending.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#545863] uppercase tracking-wider">
              Trending Now
            </h2>
            <Link
              href="/explore"
              className="flex items-center gap-1 text-xs text-[#f96e46] hover:text-[#e55d3a] transition-colors"
            >
              View all
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {trending.slice(0, 6).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}