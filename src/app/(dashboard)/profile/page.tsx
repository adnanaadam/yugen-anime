// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useUserStats } from "@/hooks/useUserData";
import { useTrendingAnime } from "@/hooks/useAnimeData";
import { xpToNextLevel } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Plus, Check } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { addToAnimeList } from "@/features/tracking/api";
import AnimeCard from "@/components/anime/AnimeCard";
import FavoriteButton from "@/components/anime/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import Image from "next/image";
import BadgeCard from "@/components/badges/BadgeCard";

const COLORS = ["#00e8fc", "#97cc04", "#f9c846", "#f96e46", "#ff4444", "#c084fc"];

const statusLabels: Record<string, string> = {
  WATCHING: "Watching",
  COMPLETED: "Completed",
  PLAN_TO_WATCH: "Plan to Watch",
  PAUSED: "Paused",
  DROPPED: "Dropped",
  REWATCHING: "Rewatching",
};

const statusOptions = [
  { label: "Watching", value: "WATCHING" as const, color: "#00e8fc" },
  { label: "Completed", value: "COMPLETED" as const, color: "#97cc04" },
  { label: "Plan to Watch", value: "PLAN_TO_WATCH" as const, color: "#f9c846" },
  { label: "Paused", value: "PAUSED" as const, color: "#f96e46" },
  { label: "Dropped", value: "DROPPED" as const, color: "#ff4444" },
  { label: "Rewatching", value: "REWATCHING" as const, color: "#c084fc" },
];

const hexClipPath =
  "polygon(50% 3%, 93% 28%, 93% 72%, 50% 97%, 7% 72%, 7% 28%)";
const hexClipPathInner =
  "polygon(50% 8%, 88% 30%, 88% 70%, 50% 92%, 12% 70%, 12% 30%)";

export default function DashboardPage() {
  const { data: stats, loading } = useUserStats();
  const { data: trending } = useTrendingAnime(6);
  const { data: session } = useSession();

  const [statusMap, setStatusMap] = useState<Record<number, { status: string; progress: number }>>({});
  const [statusesLoaded, setStatusesLoaded] = useState(() => !session);

  // Global favorites
  const { favoriteIds, loaded: favoritesLoaded, toggleFavorite } = useFavorites();

  const xpInfo = stats?.user ? xpToNextLevel(stats.user.xp) : null;
  const totalAnime = stats?.stats.totalAnime || 0;
  const totalEpisodes = stats?.stats.totalEpisodes || 0;
  const badgeCount = stats?.badges?.length || 0;
  const favoritesCount = stats?.stats.favoritesCount || 0;

  // Fetch user's anime statuses
  useEffect(() => {
    if (!session) return;

    let cancelled = false;
    const fetchStatuses = async () => {
      try {
        const response = await fetch("/api/tracking/list");
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data) && !cancelled) {
          const map: Record<number, { status: string; progress: number }> = {};
          data.forEach(
            (item: { animeId: number; status: string; progress: number }) => {
              map[item.animeId] = {
                status: item.status,
                progress: item.progress || 0,
              };
            },
          );
          setStatusMap(map);
        }
      } catch (error) {
        console.error("Error fetching anime statuses:", error);
      } finally {
        if (!cancelled) {
          setStatusesLoaded(true);
        }
      }
    };

    fetchStatuses();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const updateStatus = (animeId: number, status: string) => {
    setStatusMap((prev) => ({
      ...prev,
      [animeId]: { status, progress: prev[animeId]?.progress || 0 },
    }));
  };

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
    <div className="space-y-24">
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

            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#ececec]">
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
              <div className="text-center">
                <p className="text-lg font-bold text-[#f96e46]">{favoritesCount}</p>
                <p className="text-[10px] text-[#7b7f89]">Favorites</p>
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
        <h3 className="text-xs font-semibold text-[#545863] mb-4 uppercase tracking-[0.15em]">
          Badges · {badgeCount}/8
        </h3>
        {stats?.badges && stats.badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {stats.badges.map((ub: { id: string; badge: { id: string; name: string; description: string | null; icon: string | null; category: string | null } }, index: number) => {
              const badgeColors: Record<string, { color: string; rarityColor: string; glow: string }> = {
                first_anime: { color: "#00e8fc", rarityColor: "bg-slate-100 text-slate-500 border-slate-200", glow: "rgba(0,232,252,0.15)" },
                episode_master: { color: "#97cc04", rarityColor: "bg-[#97cc04]/10 text-[#97cc04] border-[#97cc04]/20", glow: "rgba(151,204,4,0.2)" },
                anime_veteran: { color: "#f9c846", rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20", glow: "rgba(249,200,70,0.25)" },
                completionist: { color: "#f96e46", rarityColor: "bg-[#f96e46]/10 text-[#f96e46] border-[#f96e46]/20", glow: "rgba(249,110,70,0.15)" },
                anime_lover: { color: "#f96e46", rarityColor: "bg-gradient-to-r from-[#f9c846]/20 via-[#f96e46]/20 to-[#c084fc]/20 text-[#f96e46] border-[#f96e46]/30", glow: "rgba(249,110,70,0.3)" },
                binge_watcher: { color: "#f9c846", rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20", glow: "rgba(249,200,70,0.2)" },
                collector: { color: "#00e8fc", rarityColor: "bg-slate-100 text-slate-500 border-slate-200", glow: "rgba(0,232,252,0.15)" },
                favorite_curator: { color: "#c084fc", rarityColor: "bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/20", glow: "rgba(192,132,252,0.2)" },
              };

              const badgeKey = ub.badge.id;
              const badgeData = badgeColors[badgeKey] || badgeColors.first_anime;
              const rarityLabel = ub.badge.category ? ub.badge.category.charAt(0).toUpperCase() + ub.badge.category.slice(1) : "Common";

              // Unique icon per badge
              const badgeIcons: Record<string, string> = {
                first_anime: "/icons/scroll.png",
                episode_master: "/icons/spellbook.png",
                anime_veteran: "/icons/c-cat.png",
                completionist: "/icons/trophy.png",
                anime_lover: "/icons/medal.png",
                binge_watcher: "/icons/fire-crystal.png",
                collector: "/icons/gold-chest.png",
                favorite_curator: "/icons/golden-bookmark.png",
              };

              return (
                <BadgeCard
                  key={ub.id}
                  badge={{
                    id: badgeKey,
                    name: ub.badge.name,
                    description: ub.badge.description || "No description available.",
                    icon: badgeIcons[badgeKey] || "/icons/trophy.png",
                    category: ub.badge.category || "Common",
                  }}
                  color={badgeData.color}
                  rarityColor={badgeData.rarityColor}
                  glow={badgeData.glow}
                  index={index}
                />
              );
            })}
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
              <TrendingAnimeCard
                key={anime.id}
                anime={anime}
                session={session}
                initialStatus={statusesLoaded ? statusMap[anime.id]?.status || null : null}
                initialProgress={statusesLoaded ? statusMap[anime.id]?.progress || 0 : 0}
                initialFavorited={favoritesLoaded ? favoriteIds.has(anime.id) : false}
                onStatusChange={updateStatus}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TrendingAnimeCard({
  anime,
  session,
  initialStatus,
  initialProgress,
  initialFavorited,
  onStatusChange,
  onFavoriteToggle,
}: {
  anime: { id: number; title: { english: string | null; romaji: string }; coverImage: { large: string }; averageScore: number | null; episodes: number | null; seasonYear: number | null; type: string | null };
  session: ReturnType<typeof useSession>["data"];
  initialStatus: string | null;
  initialProgress: number;
  initialFavorited: boolean;
  onStatusChange: (animeId: number, status: string) => void;
  onFavoriteToggle: (animeId: number, favorited: boolean) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const title = anime.title.english || anime.title.romaji;
  const activeStatus = statusOptions.find((s) => s.value === initialStatus);

  const handleAddToList = async (
    e: React.MouseEvent,
    status: (typeof statusOptions)[number]["value"],
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdating) return;

    if (!session) {
      signIn();
      return;
    }

    setIsUpdating(true);
    try {
      await addToAnimeList(anime.id, status);
      onStatusChange(anime.id, status);
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to add to list:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative group">
      <div className="block">
        <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors duration-200 group-hover:border-white/[0.15]">
          {/* Cover Image */}
          <Link href={`/anime/${anime.id}`} className="block">
            <div className="relative aspect-[2/3] overflow-hidden">
              <Image
                src={anime.coverImage.large}
                alt={title}
                fill
                sizes="(max-width: 768px) 140px, 200px"
                className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
              />

              {/* Favorite button */}
              <div className="absolute top-2 right-2 z-20">
                <FavoriteButton
                  animeId={anime.id}
                  initialFavorited={initialFavorited}
                  onToggle={(f) => onFavoriteToggle(anime.id, f)}
                />
              </div>

              {/* Score badge */}
              {anime.averageScore && (
                <div className="absolute top-2 left-2 z-10 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-[#f9c846] backdrop-blur-sm">
                  ★ {(anime.averageScore / 10).toFixed(1)}
                </div>
              )}

              {/* Episode count */}
              {anime.episodes && (
                <div className="absolute top-10 right-2 z-10 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] text-gray-300 backdrop-blur-sm">
                  {anime.episodes} eps
                </div>
              )}

              {/* Add to list button */}
              <div className="absolute bottom-2 right-2 z-20">
                {initialStatus ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDropdown(!showDropdown);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#f9c846] hover:text-black hover:border-transparent"
                    disabled={isUpdating}
                  >
                    <Check size={14} />
                  </button>
                ) : (
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
                    disabled={isUpdating}
                  >
                    <Plus size={14} />
                  </button>
                )}

                {showDropdown && session && (
                  <div className="absolute bottom-full right-0 mb-1.5 overflow-hidden rounded-lg border border-white/10 bg-black/95 backdrop-blur-md shadow-xl text-nowrap">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => handleAddToList(e, option.value)}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-[11px] transition-colors ${
                          initialStatus === option.value
                            ? "bg-white/10 font-semibold text-white"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: option.color }}
                        />
                        <span>{option.label}</span>
                        {initialStatus === option.value && (
                          <Check size={12} className="ml-auto text-[#97cc04]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Title below */}
        <div className="p-2">
          <h3 className="text-[13px] font-medium text-gray-500 line-clamp-2 leading-tight group-hover:text-gray-800 transition-colors">
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
    </div>
  );
}