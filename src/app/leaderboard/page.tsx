// src/app/leaderboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navii } from "@usenavii/react";
import { Trophy, Medal, Shield, Lock } from "lucide-react";
import { xpToNextLevel } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string | null;
  image: string | null;
  xp: number;
  level: number;
  isProfilePublic: boolean;
}

// ============================================================
// RANK STYLING
// ============================================================

const rankStyles: Record<number, { bg: string; medal: string; label: string }> = {
  1: { bg: "from-[#f9c846]/20 to-[#f9c846]/5", medal: "#f9c846", label: "🥇" },
  2: { bg: "from-[#c0c0c0]/20 to-[#c0c0c0]/5", medal: "#c0c0c0", label: "🥈" },
  3: { bg: "from-[#cd7f32]/20 to-[#cd7f32]/5", medal: "#cd7f32", label: "🥉" },
};

function getRankStyle(rank: number) {
  return rankStyles[rank] || { bg: "from-transparent to-transparent", medal: "", label: `#${rank}` };
}

// ============================================================
// COMPONENT
// ============================================================

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) setEntries(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLeaderboard();
    return () => { cancelled = true; };
  }, []);

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
          <p className="text-sm text-[#f9c846] font-medium tracking-wider uppercase">Loading Rankings...</p>
        </div>
      </div>
    );
  }

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
      {/* HEADER */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }} />
        <div className="relative mx-auto max-w-4xl px-4 pt-12 pb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy size={28} className="text-[#f9c846]" />
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Leaderboard
            </h1>
          </div>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Top 100 adventurers ranked by experience points. Earn XP by tracking anime, completing series, and collecting badges.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TABLE */}
      {/* ======================================================== */}
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Column headers */}
          <div
            className="grid grid-cols-[48px_1fr_80px_120px] md:grid-cols-[56px_1fr_100px_160px] gap-2 px-4 py-3 border-b text-[10px] text-gray-500 uppercase tracking-wider font-semibold"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <span className="text-center">Rank</span>
            <span>Player</span>
            <span className="text-center">Level</span>
            <span className="text-right">XP</span>
          </div>

          {entries.length === 0 ? (
            <div className="p-12 text-center">
              <Shield size={36} className="mx-auto mb-3 text-gray-600" />
              <p className="text-sm text-gray-500">No adventurers have registered yet.</p>
              <Link
                href="/signup"
                className="inline-block mt-3 text-xs text-[#f9c846] hover:text-[#f5bd29] transition-colors"
              >
                Be the first to join →
              </Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {entries.map((entry) => {
                const rankStyle = getRankStyle(entry.rank);
                const xpInfo = xpToNextLevel(entry.xp);
                const displayName = entry.username || "Anonymous";

                return (
                  <div
                    key={entry.id}
                    className="grid grid-cols-[48px_1fr_80px_120px] md:grid-cols-[56px_1fr_100px_160px] gap-2 px-4 py-3 items-center transition-colors hover:bg-white/[0.02]"
                  >
                    {/* Rank */}
                    <div className="flex justify-center">
                      {entry.rank <= 3 ? (
                        <span className="text-lg md:text-xl">{rankStyle.label}</span>
                      ) : (
                        <span className="text-xs font-bold text-gray-500 tabular-nums">
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Player */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {entry.isProfilePublic && entry.image ? (
                          <div
                            className="w-8 h-9 md:w-10 md:h-11 overflow-hidden"
                            style={{ clipPath: "polygon(50% 3%, 93% 28%, 93% 72%, 50% 97%, 7% 72%, 7% 28%)" }}
                          >
                            <Image
                              src={entry.image}
                              alt={displayName}
                              width={40}
                              height={44}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-8 h-9 md:w-10 md:h-11 flex items-center justify-center"
                            style={{ clipPath: "polygon(50% 3%, 93% 28%, 93% 72%, 50% 97%, 7% 72%, 7% 28%)" }}
                          >
                            <Navii
                              seed={entry.isProfilePublic ? (entry.username ?? entry.id) : entry.rank.toString()}
                              size={36}
                              title={displayName}
                              animated
                            />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <div className="min-w-0">
                        {entry.isProfilePublic ? (
                          <Link
                            href={`/u/${entry.username}`}
                            className="text-sm font-medium text-white hover:text-[#f9c846] transition-colors truncate block"
                          >
                            {displayName}
                          </Link>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-gray-400 truncate">
                              {displayName}
                            </span>
                            <Lock size={11} className="shrink-0 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Level */}
                    <div className="flex justify-center">
                      <span className="inline-flex items-center justify-center rounded-md border text-[11px] font-bold px-2 py-0.5 min-w-[36px] text-center"
                        style={{
                          borderColor: "rgba(249,200,70,0.2)",
                          backgroundColor: "rgba(249,200,70,0.08)",
                          color: "#f9c846",
                        }}
                      >
                        {entry.level}
                      </span>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      <span className="text-sm font-semibold text-white tabular-nums">
                        {entry.xp.toLocaleString()}
                      </span>
                      <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${xpInfo?.progress || 0}%`,
                            background: "linear-gradient(90deg, #f9c846, #f96e46)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-4 text-[10px] text-gray-600 text-center">
          Rankings update in real-time as XP changes
        </p>
      </div>
    </div>
  );
}