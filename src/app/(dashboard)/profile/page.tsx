// src/app/(dashboard)/profile/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useUserStats, useAnimeStatusMap } from "@/hooks/useUserData";
import { useTrendingAnime } from "@/hooks/useAnimeData";
import { xpToNextLevel } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import useSWR from "swr";
import { CldImage } from "next-cloudinary";
import { Navii } from "@usenavii/react";
import { addToAnimeList } from "@/features/tracking/api";
import FavoriteButton from "@/components/anime/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import BadgeCard from "@/components/badges/BadgeCard";
import { addGlobalToast } from "@/components/Toast";
import {
  Library,
  Tv,
  Award,
  Heart,
  Calendar,
  Globe,
  Lock,
  Share2,
  ArrowRight,
  Plus,
  Check,
} from "lucide-react";

// ============================================================
// CONSTANTS
// ============================================================

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

const HEX_CLIP = "polygon(50% 3%, 93% 28%, 93% 72%, 50% 97%, 7% 72%, 7% 28%)";

interface TrackedEntry {
  id: string;
  animeId: number;
  status: string;
  progress: number;
  updatedAt?: string;
  anime?: {
    title: { english: string | null; romaji: string };
    coverImage: { large: string };
    averageScore: number | null;
    episodes: number | null;
    status: string | null;
  } | null;
}

// ============================================================
// SHARED PIECES
// ============================================================

function ProfileAvatar({
  image,
  seed,
  title,
  level,
}: {
  image: string | null;
  seed: string;
  title: string;
  level: number;
}) {
  return (
    <div className="relative shrink-0">
      <div
        className="relative flex h-24 w-20 items-center justify-center overflow-hidden bg-gradient-to-br from-[#f9c846]/25 to-[#f96e46]/25 sm:h-28 sm:w-24"
        style={{ clipPath: HEX_CLIP }}
      >
        {image && image.includes("cloudinary") ? (
          <CldImage
            src={image}
            alt={title}
            fill
            crop="fill"
            gravity="face"
            className="object-cover"
          />
        ) : (
          <Navii seed={seed} size={72} title={title} animated />
        )}
      </div>
      {/* Level pill */}
      <div className="absolute -bottom-1.5 left-1/2 z-10 -translate-x-1/2">
        <div className="rounded-full border border-[#f9c846]/40 bg-white px-3 py-0.5 shadow-sm">
          <span className="text-[11px] font-bold text-[#545863]">Lv.{level}</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  href,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: number | string;
  accent: string;
  href?: string;
}) {
  const content = (
    <div className="h-full rounded-2xl border border-[#ececec] bg-white p-4 transition-all hover:border-[#f9c846]/50 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}1a` }}
        >
          <Icon size={18} color={accent} />
        </div>
        <div className="min-w-0">
          <p className="text-xl font-bold leading-tight text-[#545863] tabular-nums">{value}</p>
          <p className="text-[11px] text-[#7b7f89]">{label}</p>
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function DashboardPage() {
  const { data: stats, loading } = useUserStats();
  const { data: trending } = useTrendingAnime(6);
  const { data: session } = useSession();

  // Shared, cached tracking statuses — same SWR key as the library page, so
  // this no longer refetches /api/tracking/list on every profile visit.
  const { statusMap: sharedStatusMap, loaded: statusesLoaded } = useAnimeStatusMap();
  const [statusOverrides, setStatusOverrides] = useState<Record<number, { status: string; progress: number }>>({});

  // Raw cached tracking list (same SWR cache entry) for Continue Watching.
  const { data: trackingList } = useSWR(
    session ? "/api/tracking/list" : null,
    (url) => fetch(url).then((res) => res.json()),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    }
  );

  // Global favorites
  const { favoriteIds, loaded: favoritesLoaded, toggleFavorite } = useFavorites();

  const xpInfo = stats?.user ? xpToNextLevel(stats.user.xp) : null;
  const totalAnime = stats?.stats.totalAnime || 0;
  const totalEpisodes = stats?.stats.totalEpisodes || 0;
  const badgeCount = stats?.badges?.length || 0;
  const favoritesCount = stats?.stats.favoritesCount || 0;
  const isProfilePublic = stats?.user?.isProfilePublic ?? true;
  const displayName = stats?.user?.username || session?.user?.name || "Adventurer";
  const profileUsername = stats?.user?.username || session?.user?.username || null;
  const joinDate = stats?.user?.createdAt
    ? new Date(stats.user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  const statusMap = useMemo(
    () => ({ ...sharedStatusMap, ...statusOverrides }),
    [sharedStatusMap, statusOverrides]
  );

  const updateStatus = (animeId: number, status: string) => {
    setStatusOverrides((prev) => ({
      ...prev,
      [animeId]: { status, progress: prev[animeId]?.progress || sharedStatusMap[animeId]?.progress || 0 },
    }));
  };

  // Recently-updated WATCHING entries, read from the shared cache —
  // zero extra requests.
  const continueWatching = useMemo(() => {
    if (!Array.isArray(trackingList)) return [];
    return (trackingList as TrackedEntry[])
      .filter((entry) => entry.status === "WATCHING")
      .sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
      )
      .slice(0, 4);
  }, [trackingList]);

  const handleShareProfile = async () => {
    if (!profileUsername) return;
    const url = `${window.location.origin}/u/${profileUsername}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${profileUsername}'s Profile`, url });
        return;
      } catch {
        // cancelled — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      addGlobalToast({ type: "success", message: "Profile link copied to clipboard!" });
    } catch {
      addGlobalToast({ type: "error", message: "Failed to copy link" });
    }
  };

  const pieData = [
    { name: "Watching", value: stats?.stats.watching || 0 },
    { name: "Completed", value: stats?.stats.completed || 0 },
    { name: "Plan to Watch", value: stats?.stats.planToWatch || 0 },
    { name: "Paused", value: stats?.stats.paused || 0 },
    { name: "Dropped", value: stats?.stats.dropped || 0 },
    { name: "Rewatching", value: stats?.stats.reWatching || 0 },
  ].filter((d) => d.value > 0);

  // ============================================================
  // Loading state
  // ============================================================

  if (loading) {
    return (
      <div className="mt-10 space-y-4">
        <div className="h-40 rounded-2xl bg-[#f7f7f7] animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-[#f7f7f7] animate-pulse" />
          ))}
        </div>
        <div className="h-48 rounded-2xl bg-[#f7f7f7] animate-pulse" />
        <div className="h-56 rounded-2xl bg-[#f7f7f7] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-6">
      {/* ======================================================== */}
      {/* HERO — identity, level & XP, quick actions               */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden rounded-2xl border border-[#ececec] bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-[#f9c846]/15 via-[#f9c846]/[0.04] to-transparent" />
        <div className="relative p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ProfileAvatar
              image={session?.user?.image ?? null}
              seed={stats?.user?.username || session?.user?.email || "adventurer"}
              title={displayName}
              level={stats?.user?.level || 1}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-bold text-[#545863] sm:text-2xl">
                  {displayName}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    isProfilePublic
                      ? "bg-[#97cc04]/10 text-[#97cc04]"
                      : "bg-[#f7f7f7] text-[#7b7f89]"
                  }`}
                >
                  {isProfilePublic ? <Globe size={11} /> : <Lock size={11} />}
                  {isProfilePublic ? "Public" : "Private"}
                </span>
              </div>

              {joinDate && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#7b7f89]">
                  <Calendar size={12} />
                  Member since {joinDate}
                </p>
              )}

              {/* Level + XP progress */}
              <div className="mt-4 max-w-md">
                <div className="mb-1.5 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[#545863]">
                    Level {stats?.user?.level || 1}
                  </span>
                  <span className="text-[11px] text-[#7b7f89]">
                    {(stats?.user?.xp || 0).toLocaleString()} XP total
                  </span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#f7f7f7]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#f9c846] to-[#f96e46] transition-all duration-700"
                    style={{ width: `${xpInfo?.progress || 0}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#7b7f89]">
                  {xpInfo?.next && xpInfo.current !== undefined
                    ? `${(xpInfo.next - xpInfo.current).toLocaleString()} XP to Level ${(stats?.user?.level || 1) + 1}`
                    : "Max level reached"}
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex shrink-0 gap-2 sm:flex-col">
              {isProfilePublic && profileUsername && (
                <Link
                  href={`/u/${profileUsername}`}
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ececec] bg-white px-4 py-2 text-xs font-medium text-[#545863] transition-colors hover:bg-[#f7f7f7]"
                >
                  Public profile
                  <ArrowRight size={13} />
                </Link>
              )}
              <button
                onClick={handleShareProfile}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#f9c846] px-4 py-2 text-xs font-semibold text-[#545863] transition-colors hover:bg-[#f5bd29]"
              >
                <Share2 size={13} />
                Share profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* STAT CARDS                                               */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Library} label="Anime tracked" value={totalAnime} accent="#f9c846" href="/library" />
        <StatCard icon={Tv} label="Episodes watched" value={totalEpisodes} accent="#00e8fc" href="/library" />
        <StatCard icon={Award} label="Badges earned" value={`${badgeCount}/8`} accent="#97cc04" href="#badges" />
        <StatCard icon={Heart} label="Favorites" value={favoritesCount} accent="#f96e46" href="/favorites" />
      </div>
      {/* ======================================================== */}
      {/* CONTINUE WATCHING + LIBRARY BREAKDOWN                    */}
      {/* ======================================================== */}
      <div className={`grid gap-4 ${continueWatching.length > 0 ? "lg:grid-cols-2" : ""}`}>
        {continueWatching.length > 0 && (
          <div className="rounded-2xl border border-[#ececec] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#545863]">
                Continue Watching
              </h3>
              <Link
                href="/library"
                className="flex items-center gap-1 text-[11px] font-medium text-[#f96e46] transition-colors hover:text-[#e55d3a]"
              >
                Library
                <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {continueWatching.map((entry) => {
                const title = entry.anime?.title.english || entry.anime?.title.romaji || `Anime #${entry.animeId}`;
                const episodes = entry.anime?.episodes ?? null;
                const pct =
                  episodes && episodes > 0
                    ? Math.min(100, Math.round((entry.progress / episodes) * 100))
                    : null;
                return (
                  <Link
                    key={entry.id}
                    href={`/anime/${entry.animeId}`}
                    className="group flex items-center gap-3 rounded-xl border border-[#ececec] p-2.5 transition-colors hover:border-[#f9c846]/50 hover:bg-[#fdfaf2]"
                  >
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f7f7f7]">
                      {entry.anime?.coverImage?.large ? (
                        <Image
                          src={entry.anime.coverImage.large}
                          alt={title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[9px] text-[#7b7f89]">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#545863] transition-colors group-hover:text-[#f96e46]">
                        {title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#7b7f89]">
                        {entry.progress} ep{entry.progress === 1 ? "" : "s"} watched
                      </p>
                      {pct !== null && (
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#f7f7f7]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#f9c846] to-[#f96e46]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        {/* Library Breakdown */}
        <div className="rounded-2xl border border-[#ececec] bg-white p-5">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#545863]">
            Library Breakdown
          </h3>
          <div className="flex items-center gap-4">
            {/* Donut */}
            <div className="h-[140px] w-[140px] shrink-0">
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
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-[80px] w-[80px] rounded-full border-[5px] border-[#f7f7f7]" />
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
                    className="group flex items-center justify-between rounded-md px-2 py-1 transition-colors hover:bg-[#f7f7f7]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: COLORS[i] }}
                      />
                      <span className="text-[11px] text-[#7b7f89] transition-colors group-hover:text-[#545863]">
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
      {/* ======================================================== */}
      {/* BADGES                                                   */}
      {/* ======================================================== */}
      <div id="badges" className="scroll-mt-28 rounded-2xl border border-[#ececec] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#545863]">
            Badges
          </h3>
          <span className="rounded-full bg-[#f9c846]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#b8901e]">
            {badgeCount}/8 earned
          </span>
        </div>
        <AllBadgesSection />
      </div>

      {/* ======================================================== */}
      {/* TRENDING                                                 */}
      {/* ======================================================== */}
      {trending && trending.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#545863]">
              Trending Now
            </h2>
            <Link
              href="/explore"
              className="flex items-center gap-1 text-[11px] font-medium text-[#f96e46] transition-colors hover:text-[#e55d3a]"
            >
              View all
              <ArrowRight size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
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
interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  isEarned: boolean;
  progress: {
    current: number;
    required: number;
    percentage: number;
  };
}

function AllBadgesSection() {
  const [allBadges, setAllBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch("/api/badges");
        if (res.ok) {
          const data = await res.json();
          setAllBadges(data.badges || []);
        }
      } catch (error) {
        console.error("Failed to fetch badges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const badgeColors: Record<string, { color: string; rarityColor: string; glow: string }> = {
    "First Anime": { color: "#00e8fc", rarityColor: "bg-slate-100 text-slate-500 border-slate-200", glow: "rgba(0,232,252,0.15)" },
    "Episode Master": { color: "#97cc04", rarityColor: "bg-[#97cc04]/10 text-[#97cc04] border-[#97cc04]/20", glow: "rgba(151,204,4,0.2)" },
    "Anime Veteran": { color: "#f9c846", rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20", glow: "rgba(249,200,70,0.25)" },
    "Completionist": { color: "#f96e46", rarityColor: "bg-[#f96e46]/10 text-[#f96e46] border-[#f96e46]/20", glow: "rgba(249,110,70,0.15)" },
    "Anime Lover": { color: "#f96e46", rarityColor: "bg-gradient-to-r from-[#f9c846]/20 via-[#f96e46]/20 to-[#c084fc]/20 text-[#f96e46] border-[#f96e46]/30", glow: "rgba(249,110,70,0.3)" },
    "Binge Watcher": { color: "#f9c846", rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20", glow: "rgba(249,200,70,0.2)" },
    "Collector": { color: "#00e8fc", rarityColor: "bg-slate-100 text-slate-500 border-slate-200", glow: "rgba(0,232,252,0.15)" },
    "Favorite Curator": { color: "#f9c846", rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20", glow: "rgba(249,200,70,0.2)" },
  };

  const badgeIcons: Record<string, string> = {
    "First Anime": "/icons/scroll.png",
    "Episode Master": "/icons/spellbook.png",
    "Anime Veteran": "/icons/c-cat.png",
    "Completionist": "/icons/trophy.png",
    "Anime Lover": "/icons/medal.png",
    "Binge Watcher": "/icons/fire-crystal.png",
    "Collector": "/icons/gold-chest.png",
    "Favorite Curator": "/icons/golden-bookmark.png",
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="w-full aspect-square rounded-2xl bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {allBadges.map((badge, index) => {
        const badgeData = badgeColors[badge.name] || badgeColors["First Anime"];

        return (
          <BadgeCard
            key={badge.id}
            badge={{
              id: badge.id,
              name: badge.name,
              description: badge.description || "No description available.",
              icon: badgeIcons[badge.name] || "/icons/trophy.png",
              category: badge.category || "Common",
            }}
            color={badgeData.color}
            rarityColor={badgeData.rarityColor}
            glow={badgeData.glow}
            isEarned={badge.isEarned}
            progress={badge.progress}
            index={index}
          />
        );
      })}
    </div>
  );
}
function TrendingAnimeCard({
  anime,
  session,
  initialStatus,
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
                  onToggle={(favorited) => onFavoriteToggle(anime.id, favorited)}
                />
              </div>

              {/* Score badge */}
              {anime.averageScore && (
                <div className="absolute bottom-2 left-2 z-10 rounded bg-black/70 px-1 py-0.5 text-[10px] font-medium text-[#f9c846] backdrop-blur-sm">
                  ★ {(anime.averageScore / 10).toFixed(1)}
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
