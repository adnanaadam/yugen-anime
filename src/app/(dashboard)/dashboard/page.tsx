// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useUserStats } from "@/hooks/useUserData";
import { useTrendingAnime } from "@/hooks/useAnimeData";
import { xpToNextLevel } from "@/lib/utils";
import { lordJuusai } from "@/fonts/fonts";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  CheckCircle,
  BookMarked,
  Pause,
  XCircle,
  RefreshCw,
  Trophy,
  ArrowRight,
  Play,
} from "lucide-react";
import AnimeCard from "@/components/anime/AnimeCard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: stats, loading } = useUserStats();
  const { data: trending } = useTrendingAnime(6);

  const xpInfo = stats?.user ? xpToNextLevel(stats.user.xp) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="h-48 rounded-2xl bg-white/[0.02] animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statusCards = [
    {
      label: "Watching",
      count: stats?.stats.watching || 0,
      icon: Play,
      color: "#00e8fc",
      href: "/library?status=WATCHING",
    },
    {
      label: "Completed",
      count: stats?.stats.completed || 0,
      icon: CheckCircle,
      color: "#97cc04",
      href: "/library?status=COMPLETED",
    },
    {
      label: "Plan to Watch",
      count: stats?.stats.planToWatch || 0,
      icon: BookMarked,
      color: "#f9c846",
      href: "/library?status=PLAN_TO_WATCH",
    },
    {
      label: "Paused",
      count: stats?.stats.paused || 0,
      icon: Pause,
      color: "#f96e46",
      href: "/library?status=PAUSED",
    },
    {
      label: "Dropped",
      count: stats?.stats.dropped || 0,
      icon: XCircle,
      color: "#ff4444",
      href: "/library?status=DROPPED",
    },
    {
      label: "Rewatching",
      count: stats?.stats.reWatching || 0,
      icon: RefreshCw,
      color: "#c084fc",
      href: "/library?status=REWATCHING",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl text-white ${lordJuusai.className}`}>
            Welcome back{stats?.user?.name ? `, ${stats.user.name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Level {stats?.user?.level || 1} · {stats?.user?.xp || 0} XP
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* XP Card */}
          <div className="lg:col-span-1 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <div className="flex items-center gap-3 mb-5">
              {stats?.user?.image ? (
                <Image
                  src={stats.user.image}
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f9c846] text-black font-bold text-lg">
                  {stats?.user?.name?.charAt(0) || "?"}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-white">
                  Level {stats?.user?.level || 1}
                </p>
                <p className="text-xs text-gray-500">
                  {stats?.user?.xp || 0} XP total
                </p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">Progress to next level</span>
                <span className="text-[#f9c846] font-medium">
                  {xpInfo?.progress.toFixed(0)}%
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#f9c846] to-[#f96e46] transition-all duration-700"
                  style={{ width: `${xpInfo?.progress || 0}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-gray-600 mb-6">
              {xpInfo?.next ? `${xpInfo.next - (xpInfo.current || 0)} XP to Level ${(stats?.user?.level || 1) + 1}` : "Max level!"}
            </p>

            {/* Quick stats */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Episodes watched</span>
                <span className="text-white font-medium">
                  {stats?.stats.totalEpisodes || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Anime rated</span>
                <span className="text-white font-medium">
                  {stats?.stats.ratedCount || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Badges earned</span>
                <span className="text-white font-medium">
                  {stats?.badges?.length || 0}
                </span>
              </div>
            </div>

            {/* Badges */}
            {stats?.badges && stats.badges.length > 0 && (
              <div className="mt-5 pt-5 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={14} className="text-[#f9c846]" />
                  <span className="text-xs text-gray-400">Recent Badges</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stats.badges.slice(0, 4).map((ub) => (
                    <div
                      key={ub.id}
                      className="flex items-center gap-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] px-2.5 py-1.5"
                    >
                      <Trophy size={12} className="text-[#f9c846]" />
                      <span className="text-[11px] text-gray-300">
                        {ub.badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status cards grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {statusCards.map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <card.icon size={16} style={{ color: card.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{card.count}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                </Link>
              ))}
            </div>

            {/* Trending preview */}
            {trending && trending.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">
                    Trending Now
                  </h3>
                  <Link
                    href="/explore"
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#f9c846] transition-colors"
                  >
                    View all
                    <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {trending.slice(0, 6).map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}