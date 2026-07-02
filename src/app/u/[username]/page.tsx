// src/app/u/[username]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Globe, Lock, ArrowLeft, Trophy, Star, Heart, BookOpen, Calendar, Play, Check, Clock, Pause, X, RotateCcw } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  earnedAt: string;
}

interface PublicProfile {
  username: string;
  image: string | null;
  xp: number;
  level: number;
  createdAt: string;
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
  favorites: number[];
}

const statusItems = [
  { key: "watching", label: "Watching", icon: Play, color: "#00e8fc" },
  { key: "completed", label: "Completed", icon: Check, color: "#97cc04" },
  { key: "planToWatch", label: "Plan to Watch", icon: Clock, color: "#f9c846" },
  { key: "paused", label: "Paused", icon: Pause, color: "#f96e46" },
  { key: "dropped", label: "Dropped", icon: X, color: "#ff4444" },
  { key: "reWatching", label: "Rewatching", icon: RotateCcw, color: "#c084fc" },
];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center">
        <div className="text-[#7b7f89]">Loading...</div>
      </div>
    );
  }

  if (error === "not_found") {
    return (
      <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#545863]">User not found</h2>
          <p className="mt-2 text-sm text-[#7b7f89]">
            The user {username} doesn&apos;t exist.
          </p>
          <Link href="/explore" className="mt-4 inline-block text-[#f96e46] hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  if (error === "private") {
    return (
      <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center">
        <div className="text-center">
          <Lock className="mx-auto mb-4 text-[#7b7f89]" size={48} />
          <h2 className="text-2xl font-bold text-[#545863]">This profile is private</h2>
          <p className="mt-2 text-sm text-[#7b7f89]">
            @{username} has set their profile to private.
          </p>
          <Link href="/explore" className="mt-4 inline-block text-[#f96e46] hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#fffdf8]">
      {/* Header */}
      <div className="bg-white border-b border-[#ececec]">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center cursor-pointer gap-1.5 text-sm text-[#7b7f89] hover:text-[#f96e46] transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden bg-[#f7f7f7]">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f9c846]/10">
                  <span className="text-3xl font-bold text-[#f9c846]">
                    {profile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#545863]">
                  {profile.username}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#97cc04]/10 px-2.5 py-1 text-xs font-medium text-[#97cc04]">
                  <Globe size={12} />
                  Public Profile
                </span>
              </div>

              <div className="mt-2 flex items-center gap-4 text-sm text-[#7b7f89]">
                <span className="inline-flex items-center gap-1">
                  <Star size={14} className="text-[#f9c846]" />
                  Level {profile.level}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} />
                  Joined {joinDate}
                </span>
              </div>

              {/* XP Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-[#7b7f89] mb-1">
                  <span>{profile.xp.toLocaleString()} XP</span>
                  <span>Level {profile.level}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f7f7f7] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#f9c846] to-[#f96e46]"
                    style={{ width: `${Math.min((profile.xp % 1000) / 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statusItems.map((item) => (
            <div key={item.key} className="rounded-2xl border border-[#ececec] bg-white p-4 text-center">
              <item.icon size={20} className="mx-auto mb-2" style={{ color: item.color }} />
              <p className="text-xl font-bold text-[#545863]">
                {profile.stats[item.key as keyof typeof profile.stats] as number}
              </p>
              <p className="text-[11px] text-[#7b7f89] mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#ececec] bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-[#00e8fc]" />
              <p className="text-sm font-medium text-[#545863]">Total Episodes</p>
            </div>
            <p className="text-2xl font-bold text-[#545863]">{profile.stats.totalEpisodes}</p>
          </div>
          <div className="rounded-2xl border border-[#ececec] bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} className="text-[#f9c846]" />
              <p className="text-sm font-medium text-[#545863]">Badges</p>
            </div>
            <p className="text-2xl font-bold text-[#545863]">{profile.stats.totalBadges}</p>
          </div>
        </div>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div className="rounded-2xl border border-[#ececec] bg-white p-6">
            <h2 className="text-sm font-semibold text-[#545863] mb-4 uppercase tracking-[0.15em]">
              Badges · {profile.badges.length}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {profile.badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#ececec] bg-[#fffdf8]">
                  <div className="relative h-10 w-10 shrink-0">
                    <Image src="/icons/trophy.png" alt={badge.name} fill className="object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#545863] truncate">{badge.name}</p>
                    <p className="text-[10px] text-[#7b7f89] capitalize">{badge.category || "Common"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        <div className="rounded-2xl border border-[#ececec] bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={18} className="text-[#f96e46]" />
            <h2 className="text-sm font-semibold text-[#545863] uppercase tracking-[0.15em]">
              Favorites · {profile.stats.totalFavorites}
            </h2>
          </div>
          {profile.favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {profile.favorites.slice(0, 12).map((animeId) => (
                <Link
                  key={animeId}
                  href={`/anime/${animeId}`}
                  className="block rounded-xl border border-[#ececec] bg-[#fffdf8] p-3 text-center hover:border-[#f9c846]/50 transition-colors"
                >
                  <p className="text-xs font-medium text-[#545863]">Anime #{animeId}</p>
                  <p className="text-[10px] text-[#7b7f89] mt-1">View details</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7b7f89]">No favorites yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}