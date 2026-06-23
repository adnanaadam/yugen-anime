// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useUserStats } from "@/hooks/useUserData";
import { useTrendingAnime } from "@/hooks/useAnimeData";
import { xpToNextLevel } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle, Bookmark, PauseCircle, XCircle, Repeat } from "lucide-react";
import AnimeCard from "@/components/anime/AnimeCard";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#00e8fc", "#97cc04", "#f9c846", "#f96e46", "#ff4444", "#c084fc"];

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
  const totalAnime = stats?.stats.totalAnime || 0;
  const totalEpisodes = stats?.stats.totalEpisodes || 0;
  const badgeCount = stats?.badges?.length || 0;

  const pieData = [
    { name: "Watching", value: stats?.stats.watching || 0 },
    { name: "Completed", value: stats?.stats.completed || 0 },
    { name: "Plan to Watch", value: stats?.stats.planToWatch || 0 },
    { name: "Paused", value: stats?.stats.paused || 0 },
    { name: "Dropped", value: stats?.stats.dropped || 0 },
    { name: "Rewatching", value: stats?.stats.reWatching || 0 },
  ].filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 rounded-2xl bg-[#f7f7f7] animate-pulse" />
        <div className="h-48 rounded-xl bg-[#f7f7f7] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Level Card + Pie Chart side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Level Card */}
        <div className="rounded-2xl border border-[#ececec] bg-white overflow-hidden">
          <div className="p-5">
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-[#545863]">
                Lv. {stats?.user?.level || 1}
              </span>
              <span className="text-xs text-[#7b7f89]">
                {stats?.user?.xp?.toLocaleString() || 0} XP
              </span>
            </div>

            {/* XP Bar */}
            <div className="mt-4 mb-1.5">
              <div className="relative h-2 w-full rounded-full bg-[#f7f7f7] overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#f9c846] to-[#f96e46] transition-all duration-700"
                  style={{ width: `${xpInfo?.progress || 0}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] text-[#7b7f89]">
              {xpInfo?.next && xpInfo.current !== undefined
                ? `${(xpInfo.next - xpInfo.current).toLocaleString()} XP to Level ${(stats?.user?.level || 1) + 1}`
                : "Max level"}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#ececec]">
              <div className="text-center">
                <p className="text-lg font-bold text-[#545863]">{totalAnime}</p>
                <p className="text-[10px] text-[#7b7f89]">Anime</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#545863]">{totalEpisodes}</p>
                <p className="text-[10px] text-[#7b7f89]">Episodes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#545863]">{badgeCount}/8</p>
                <p className="text-[10px] text-[#7b7f89]">Badges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Library Breakdown */}
        <div className="rounded-2xl border border-[#ececec] bg-white overflow-hidden p-5">
          <h3 className="text-xs font-semibold text-[#545863] mb-1 uppercase tracking-[0.15em]">
            Library Breakdown
          </h3>
          <div className="flex items-center gap-4">
            {/* Donut */}
            <div className="w-[140px] h-[140px] shrink-0">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={60}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-[80px] h-[80px] rounded-full border-[5px] border-[#f7f7f7]" />
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-1.5">
              {Object.entries(statusLabels).map(([key, label], i) => {
                const count = key === "WATCHING" ? (stats?.stats.watching || 0) :
                  key === "COMPLETED" ? (stats?.stats.completed || 0) :
                  key === "PLAN_TO_WATCH" ? (stats?.stats.planToWatch || 0) :
                  key === "PAUSED" ? (stats?.stats.paused || 0) :
                  key === "DROPPED" ? (stats?.stats.dropped || 0) :
                  (stats?.stats.reWatching || 0);

                return (
                  <Link
                    key={key}
                    href={`/library?status=${key}`}
                    className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-[#f7f7f7] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[i] }}
                      />
                      <span className="text-[11px] text-[#7b7f89] group-hover:text-[#545863] transition-colors">
                        {label}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#545863] tabular-nums">{count}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-2xl border border-[#ececec] bg-white overflow-hidden p-5">
        <h3 className="text-xs font-semibold text-[#545863] mb-3 uppercase tracking-[0.15em]">
          Badges · {badgeCount}/8
        </h3>
        {stats?.badges && stats.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((ub: { id: string; badge: { name: string; icon: string | null; category: string | null } }) => (
              <div
                key={ub.id}
                className="flex items-center gap-2 rounded-lg border border-[#ececec] bg-[#fffdf8] px-3 py-1.5"
              >
                <span className="text-sm">🏆</span>
                <span className="text-[11px] font-medium text-[#545863]">
                  {ub.badge.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#7b7f89]">
            Start tracking anime to earn your first badge!
          </p>
        )}
      </div>

      {/* Trending */}
      {trending && trending.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-[#545863] uppercase tracking-[0.15em]">
              Trending Now
            </h2>
            <Link
              href="/explore"
              className="flex items-center gap-1 text-[11px] text-[#f96e46] hover:text-[#e55d3a] transition-colors font-medium"
            >
              View all
              <ArrowRight size={11} />
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