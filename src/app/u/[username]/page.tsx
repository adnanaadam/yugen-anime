// src/app/u/[username]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Globe, Lock, ArrowLeft, Trophy, Star, Heart, BookOpen, Calendar } from "lucide-react";

interface PublicProfile {
  username: string;
  image: string | null;
  xp: number;
  level: number;
  createdAt: string;
  stats: {
    totalAnime: number;
    totalFavorites: number;
    totalBadges: number;
  };
}

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
            The user @{username} doesn&apos;t exist.
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
            className="inline-flex items-center gap-1.5 text-sm text-[#7b7f89] hover:text-[#f96e46] transition-colors mb-4"
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
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-[#ececec] bg-white p-5 text-center">
            <BookOpen size={24} className="mx-auto text-[#00e8fc] mb-2" />
            <p className="text-2xl font-bold text-[#545863]">{profile.stats.totalAnime}</p>
            <p className="text-xs text-[#7b7f89] mt-1">Anime</p>
          </div>
          <div className="rounded-2xl border border-[#ececec] bg-white p-5 text-center">
            <Heart size={24} className="mx-auto text-[#f96e46] mb-2" />
            <p className="text-2xl font-bold text-[#545863]">{profile.stats.totalFavorites}</p>
            <p className="text-xs text-[#7b7f89] mt-1">Favorites</p>
          </div>
          <div className="rounded-2xl border border-[#ececec] bg-white p-5 text-center">
            <Trophy size={24} className="mx-auto text-[#f9c846] mb-2" />
            <p className="text-2xl font-bold text-[#545863]">{profile.stats.totalBadges}</p>
            <p className="text-xs text-[#7b7f89] mt-1">Badges</p>
          </div>
        </div>

        {/* XP */}
        <div className="rounded-2xl border border-[#ececec] bg-white p-6">
          <h2 className="text-sm font-semibold text-[#545863] mb-4">Experience</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative h-3 w-full rounded-full bg-[#f7f7f7] overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#f9c846] to-[#f96e46]"
                  style={{ width: `${Math.min((profile.xp / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-[#545863]">{profile.xp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}