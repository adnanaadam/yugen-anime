// src/app/u/[username]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Lock,
  ArrowLeft,
  Trophy,
  Heart,
  Calendar,
  Play,
  Check,
  Clock,
  Pause,
  X,
  RotateCcw,
  Star,
  User,
} from "lucide-react";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import BadgeCard from "@/components/badges/BadgeCard";
import { xpToNextLevel } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  earnedAt: string;
}

interface FavoriteAnime {
  id: number;
  title: {
    english: string | null;
    romaji: string;
  };
  coverImage: string | null;
  averageScore: number | null;
  episodes: number | null;
}

interface PublicProfile {
  username: string;
  image: string | null;
  xp: number;
  level: number;
  createdAt: string;
  isProfilePublic: boolean;
  stats: {
    watching: number;
    completed: number;
    planToWatch: number;
    paused: number;
    dropped: number;
    reWatching: number;
    totalAnime: number;
    totalEpisodes: number;
    totalBadges: number;
    totalFavorites: number;
  };
  badges: Badge[];
  favorites: (FavoriteAnime | null)[];
}

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

const statusItems = [
  { key: "watching", label: "Watching", icon: Play, color: "#00e8fc" },
  { key: "completed", label: "Completed", icon: Check, color: "#97cc04" },
  { key: "planToWatch", label: "Plan to Watch", icon: Clock, color: "#f9c846" },
  { key: "paused", label: "Paused", icon: Pause, color: "#f96e46" },
  { key: "dropped", label: "Dropped", icon: X, color: "#ff4444" },
  { key: "reWatching", label: "Rewatching", icon: RotateCcw, color: "#c084fc" },
];


const badgeColors: Record<string, { color: string; rarityColor: string; glow: string }> = {
  first_anime: { color: "#00e8fc", rarityColor: "bg-slate-100 text-slate-500 border-slate-200", glow: "rgba(0,232,252,0.15)" },
  episode_master: { color: "#97cc04", rarityColor: "bg-[#97cc04]/10 text-[#97cc04] border-[#97cc04]/20", glow: "rgba(151,204,4,0.2)" },
  anime_veteran: { color: "#f9c846", rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20", glow: "rgba(249,200,70,0.25)" },
  completionist: { color: "#f96e46", rarityColor: "bg-[#f96e46]/10 text-[#f96e46] border-[#f96e46]/20", glow: "rgba(249,110,70,0.15)" },
  anime_lover: { color: "#f96e46", rarityColor: "bg-gradient-to-r from-[#f9c846]/20 via-[#f96e46]/20 to-[#c084fc]/20 text-[#f96e46] border-[#f96e46]/30", glow: "rgba(249,110,70,0.3)" },
  binge_watcher: { color: "#f9c846", rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20", glow: "rgba(249,200,70,0.2)" },
  collector: { color: "#00e8fc", rarityColor: "bg-slate-100 text-slate-500 border-slate-200", glow: "rgba(0,232,252,0.15)" },
  favorite_curator:  { color: "#f9c846", rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20", glow: "rgba(249,200,70,0.2)" },
};

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

// ============================================================
// COMPONENT
// ============================================================

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/public-profile?username=${encodeURIComponent(username)}`);
        const data = await res.json();

        if (res.status === 404) {
          setError("not_found");
          return;
        }

        if (res.status === 403) {
          setError("private");
          return;
        }

        if (!res.ok) {
          setError("error");
          return;
        }

        setProfile(data);
      } catch {
        setError("error");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  // ============================================================
  // Loading state
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-[#f9c846] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-[#f9c846] font-medium tracking-wider uppercase">Loading Profile...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Error states
  // ============================================================

  if (error === "not_found") {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="relative mx-auto mb-6 w-24 h-24">
            <div
              className="absolute inset-0 bg-[#f96e46]/10"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            />
            <div className="flex items-center justify-center h-full">
              <User size={36} className="text-[#f96e46]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">
            The user <span className="text-[#f9c846] font-medium">@{username}</span> doesn&apos;t exist in our realm.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-lg bg-[#f9c846] px-5 py-2.5 text-sm font-medium text-[#1a1a2e] hover:bg-[#f5bd29] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  if (error === "private") {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="relative mx-auto mb-6 w-24 h-24">
            <div
              className="absolute inset-0 bg-[#7b7f89]/10"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            />
            <div className="flex items-center justify-center h-full">
              <Lock size={36} className="text-[#7b7f89]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Private Profile</h2>
          <p className="text-sm text-gray-400 mb-6">
            <span className="text-[#f9c846] font-medium">@{username}</span> has set their profile to private.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-lg bg-[#f9c846] px-5 py-2.5 text-sm font-medium text-[#1a1a2e] hover:bg-[#f5bd29] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // ============================================================
  // Derived data
  // ============================================================

  const xpInfo = xpToNextLevel(profile.xp);
  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const pieData = [
    { name: "Watching", value: profile.stats.watching },
    { name: "Completed", value: profile.stats.completed },
    { name: "Plan to Watch", value: profile.stats.planToWatch },
    { name: "Paused", value: profile.stats.paused },
    { name: "Dropped", value: profile.stats.dropped },
    { name: "Rewatching", value: profile.stats.reWatching },
  ].filter((d) => d.value > 0);

  const displayName = username.startsWith("@") ? username.slice(1) : username;

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* ======================================================== */}
      {/* DECORATIVE TOP ORNAMENT */}
      {/* ======================================================== */}
      <div className="relative h-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f9c846]/30 to-transparent" />
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(249,200,70,0.05) 20px, rgba(249,200,70,0.05) 21px)",
        }} />
      </div>

      {/* ======================================================== */}
      {/* HEADER / HERO SECTION */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(249,200,70,0.02) 40px, rgba(249,200,70,0.02) 41px)",
        }} />

        <div className="relative mx-auto max-w-5xl px-4 pt-6 pb-10">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center cursor-pointer gap-1.5 text-xs text-gray-500 hover:text-[#f9c846] transition-colors mb-6 group"
          >
            <ArrowLeft size={12} />
            <span className="tracking-wider uppercase">Back</span>
          </button>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* ================================================== */}
            {/* HEXAGONAL AVATAR */}
            {/* ================================================== */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <svg width="140" height="160" viewBox="0 0 140 160" className="absolute inset-0 -z-10">
                <polygon
                  points="70,5 130,42 130,118 70,155 10,118 10,42"
                  fill="none"
                  stroke="#f9c846"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <polygon
                  points="70,12 123,45 123,115 70,148 17,115 17,45"
                  fill="none"
                  stroke="#f9c846"
                  strokeWidth="0.5"
                  strokeDasharray="3 4"
                  opacity="0.2"
                />
              </svg>
              <div
                className="w-[140px] h-[160px] flex items-center justify-center overflow-hidden"
                style={{ clipPath: "polygon(50% 3%, 93% 28%, 93% 72%, 50% 97%, 7% 72%, 7% 28%)" }}
              >
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={displayName}
                    width={140}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#f9c846]/20 to-[#f96e46]/20 flex items-center justify-center">
                    <span className="text-5xl font-bold text-[#f9c846]">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {/* Hex border overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ clipPath: "polygon(50% 3%, 93% 28%, 93% 72%, 50% 97%, 7% 72%, 7% 28%)", boxShadow: "inset 0 0 30px rgba(249,200,70,0.1)" }}
              />
              {/* Level badge */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-[#1a1a2e] border border-[#f9c846]/30 rounded-full px-3 py-0.5 shadow-lg shadow-[#f9c846]/10">
                  <span className="text-xs font-bold text-[#f9c846]">Lv.{profile.level}</span>
                </div>
              </div>
            </div>

            {/* ================================================== */}
            {/* USER INFO */}
            {/* ================================================== */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {displayName}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#97cc04]/10 border border-[#97cc04]/20 px-2.5 py-0.5 text-[11px] font-medium text-[#97cc04]">
                    <Globe size={11} />
                    Public Profile
                  </span>
                </div>
              </div>

              {/* Join date + XP */}
              <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} />
                  Joined {joinDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star size={13} className="text-[#f9c846]" />
                  {profile.xp.toLocaleString()} XP
                </span>
              </div>

              {/* ================================================== */}
              {/* XP BAR (styled like dashboard) */}
              {/* ================================================== */}
              <div className="mt-5 max-w-md mx-auto md:mx-0">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span>Progress</span>
                  <span className="text-[#f9c846] font-medium">
                    {xpInfo?.next && xpInfo.current !== undefined
                      ? `${(xpInfo.next - xpInfo.current).toLocaleString()} XP to Lv.${profile.level + 1}`
                      : "Max Level"}
                  </span>
                </div>
                <div className="relative h-2.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                    style={{
                      width: `${xpInfo?.progress || 0}%`,
                      background: "linear-gradient(90deg, #f9c846, #f96e46)",
                      boxShadow: "0 0 12px rgba(249,200,70,0.3)",
                    }}
                  />
                  {/* Scanline effect */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 5px)",
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN CONTENT */}
      {/* ======================================================== */}
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">


        {/* ====================================================== */}
        {/* LEVEL CARD + LIBRARY BREAKDOWN (side by side) */}
        {/* ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ==================================================== */}
          {/* LEVEL CARD */}
          {/* ==================================================== */}
          <div
            className="relative rounded-xl overflow-hidden group"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }} />
            <div className="relative p-5">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={16} className="text-[#f9c846]" />
                <h3 className="text-[11px] font-semibold text-gray-300 uppercase tracking-[0.15em]">
                  Player Stats
                </h3>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  Lv. {profile.level}
                </span>
                <span className="text-xs text-gray-500">
                  {profile.xp.toLocaleString()} / {xpInfo?.next?.toLocaleString() || "MAX"} XP
                </span>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-4 gap-3 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{profile.stats.totalAnime}</p>
                  <p className="text-[10px] text-gray-500">Anime</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{profile.stats.totalEpisodes}</p>
                  <p className="text-[10px] text-gray-500">Episodes</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#f9c846]">{profile.stats.totalBadges}/8</p>
                  <p className="text-[10px] text-gray-500">Badges</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#f96e46]">{profile.stats.totalFavorites}</p>
                  <p className="text-[10px] text-gray-500">Favorites</p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* LIBRARY BREAKDOWN (pie chart) */}
          {/* ==================================================== */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="p-5">
              <h3 className="text-[11px] font-semibold text-gray-300 uppercase tracking-[0.15em] mb-3">
                Library Breakdown
              </h3>
              <div className="flex items-center gap-4">
                {/* Donut */}
                <div className="w-[130px] h-[130px] shrink-0">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
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
                      <div className="w-[70px] h-[70px] rounded-full border-[4px]" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-1.5">
                  {Object.entries(statusLabels).map(([key, label], i) => {
                    const countMap: Record<string, number> = {
                      WATCHING: profile.stats.watching,
                      COMPLETED: profile.stats.completed,
                      PLAN_TO_WATCH: profile.stats.planToWatch,
                      PAUSED: profile.stats.paused,
                      DROPPED: profile.stats.dropped,
                      REWATCHING: profile.stats.reWatching,
                    };
                    const count = countMap[key] || 0;

                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-md px-2 py-1 transition-colors"
                        style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: COLORS[i] }}
                          />
                          <span className="text-[11px] text-gray-400">{label}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-white tabular-nums">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* BADGES */}
        {/* ====================================================== */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={16} className="text-[#f9c846]" />
              <h3 className="text-[11px] font-semibold text-gray-300 uppercase tracking-[0.15em]">
                Badges · {profile.stats.totalBadges}/8
              </h3>
            </div>

            {profile.badges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {profile.badges.map((badge, index) => {
                  const badgeKey = badge.id;
                  const colorData = badgeColors[badgeKey] || badgeColors.first_anime;
                  const iconPath = badgeIcons[badgeKey] || "/icons/trophy.png";

                  return (
                    <BadgeCard
                      key={badge.id}
                      badge={{
                        id: badgeKey,
                        name: badge.name,
                        description: badge.description || "No description available.",
                        icon: iconPath,
                        category: badge.category || "Common",
                      }}
                      color={colorData.color}
                      rarityColor={colorData.rarityColor}
                      glow={colorData.glow}
                      index={index}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                This adventurer hasn&apos;t earned any badges yet.
              </p>
            )}
          </div>
        </div>

        {/* ====================================================== */}
        {/* FAVORITES */}
        {/* ====================================================== */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Heart size={16} className="text-[#f96e46]" />
              <h3 className="text-[11px] font-semibold text-gray-300 uppercase tracking-[0.15em]">
                Favorites · {profile.stats.totalFavorites}
              </h3>
            </div>

            {profile.favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {profile.favorites.filter(Boolean).map((fav) => {
                  if (!fav) return null;
                  const title = fav.title.english || fav.title.romaji;
                  return (
                    <Link
                      key={fav.id}
                      href={`/anime/${fav.id}`}
                      className="group block rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
                      style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="relative aspect-[2/3] overflow-hidden">
                        {fav.coverImage ? (
                          <Image
                            src={fav.coverImage}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 50vw, 15vw"
                            className="object-cover transition-all duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                            <span className="text-xs text-gray-600">No cover</span>
                          </div>
                        )}
                        {/* Score badge */}
                        {fav.averageScore && (
                          <div className="absolute top-1.5 left-1.5 z-10 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-[#f9c846]" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
                            ★ {(fav.averageScore / 10).toFixed(1)}
                          </div>
                        )}
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                          <span className="text-[10px] text-white font-medium tracking-wider uppercase">View</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-tight group-hover:text-[#f9c846] transition-colors">
                          {title}
                        </p>
                        {fav.episodes && (
                          <p className="text-[9px] text-gray-600 mt-0.5">{fav.episodes} eps</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No favorites yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-16" />
    </div>
  );
}