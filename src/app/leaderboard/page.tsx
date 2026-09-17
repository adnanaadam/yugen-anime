// src/app/leaderboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Navii } from "@usenavii/react";
import { Trophy, Shield, Lock, ChevronDown } from "lucide-react";
import { xpToNextLevel } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

interface LeaderboardEntry {
  rank: number;
  id: string | null;
  username: string | null;
  image: string | null;
  xp: number;
  level: number;
  isProfilePublic: boolean;
}

// ============================================================
// CONSTANTS & HELPERS
// ============================================================

const CARD_BG = "var(--surface)";
const CARD_BORDER = "var(--border)";
const XP_BAR_BG = "var(--border)";
const XP_BAR_FILL = "#f9c846";
const HEX_CLIP = "polygon(50% 3%, 93% 28%, 93% 72%, 50% 97%, 7% 72%, 7% 28%)";

// Column template shared by the desktop header row and the desktop data
// rows so the data always lines up under the column labels.
const GRID_COLS = "grid-cols-[56px_1fr_96px_176px]";

const rankMeta: Record<number, { medal: string; label: string; title: string }> = {
  1: { medal: "#f9c846", label: "🥇", title: "Champion" },
  2: { medal: "#c0c0c0", label: "🥈", title: "Runner-up" },
  3: { medal: "#cd7f32", label: "🥉", title: "3rd Place" },
};

// ============================================================
// SHARED PIECES
// ============================================================

function EntryAvatar({
  entry,
  displayName,
  w,
  h,
  naviiSize,
}: {
  entry: LeaderboardEntry;
  displayName: string;
  w: number;
  h: number;
  naviiSize: number;
}) {
  if (entry.isProfilePublic && entry.image && entry.image.includes("cloudinary")) {
    return (
      <div className="shrink-0 overflow-hidden" style={{ width: w, height: h, clipPath: HEX_CLIP }}>
        <Image
          src={entry.image}
          alt={displayName}
          width={w}
          height={h}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ width: w, height: h, clipPath: HEX_CLIP }}
    >
      <Navii
        seed={entry.isProfilePublic ? (entry.username ?? entry.id ?? String(entry.rank)) : String(entry.rank)}
        size={naviiSize}
        title={displayName}
        animated
      />
    </div>
  );
}

function PlayerName({
  entry,
  displayName,
  isMe = false,
  large = false,
}: {
  entry: LeaderboardEntry;
  displayName: string;
  isMe?: boolean;
  large?: boolean;
}) {
  const youBadge = isMe ? (
    <span className="shrink-0 rounded-full bg-[#f9c846] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1a1a2e]">
      You
    </span>
  ) : null;

  if (entry.isProfilePublic && entry.username) {
    return (
      <div className="flex items-center gap-1.5 min-w-0">
        <Link
          href={`/u/${entry.username}`}
          className={`${large ? "text-base md:text-lg" : "text-sm"} font-medium text-foreground hover:text-[#f9c846] transition-colors truncate`}
        >
          {displayName}
        </Link>
        {youBadge}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span className={`${large ? "text-base md:text-lg" : "text-sm"} font-medium text-muted truncate`}>
        {displayName}
      </span>
      <Lock size={11} className="shrink-0 text-muted" />
      {youBadge}
    </div>
  );
}

function LevelBadge({ level }: { level: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-md border text-[11px] font-bold px-2 py-0.5 whitespace-nowrap"
      style={{
        borderColor: "rgba(249,200,70,0.2)",
        backgroundColor: "rgba(249,200,70,0.08)",
        color: "#f9c846",
      }}
    >
      Lv.{level}
    </span>
  );
}

function XpBar({ progress, className = "" }: { progress: number; className?: string }) {
  return (
    <div className={`h-1.5 rounded-full overflow-hidden ${className}`} style={{ backgroundColor: XP_BAR_BG }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${progress}%`, background: XP_BAR_FILL }}
      />
    </div>
  );
}

// ============================================================
// PODIUM (TOP 3)
// ============================================================

function PodiumCard({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) {
  const meta = rankMeta[entry.rank];
  const medal = meta?.medal ?? "#f9c846";
  const xpInfo = xpToNextLevel(entry.xp);
  const displayName = entry.username || "Anonymous";
  const isFirst = entry.rank === 1;
  const avatarW = isFirst ? 80 : 56;
  const avatarH = isFirst ? 92 : 64;

  return (
    <div
      id={isMe ? "my-rank-card" : undefined}
      className="relative rounded-xl overflow-hidden"
      style={{
        background: "var(--surface)",
        border: `1px solid ${medal}2e`,
        boxShadow: isFirst ? `0 8px 30px ${medal}14` : "none",
      }}
    >
      {/* Bottom accent strip */}
      <div className="absolute bottom-0 inset-x-0 h-[3px]" style={{ background: medal, opacity: 0.35 }} />

      <div className={`flex flex-col items-center text-center ${isFirst ? "p-5 pt-4" : "p-4 pt-3"}`}>
        {/* Medal + title */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className={isFirst ? "text-xl" : "text-base"}>{meta?.label ?? `#${entry.rank}`}</span>
          {meta?.title && (
            <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: medal }}>
              {meta.title}
            </span>
          )}
        </div>

        {/* Avatar + level overlay */}
        <div className="relative mb-4">
          <EntryAvatar entry={entry} displayName={displayName} w={avatarW} h={avatarH} naviiSize={isFirst ? 72 : 52} />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10">
            <div
              className="rounded-full bg-background border px-2.5 py-0.5 whitespace-nowrap"
              style={{ borderColor: `${medal}4d` }}
            >
              <span className="text-[10px] font-bold" style={{ color: medal }}>
                Lv.{entry.level}
              </span>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="flex justify-center w-full min-w-0 mb-1.5 mt-1">
          <PlayerName entry={entry} displayName={displayName} isMe={isMe} large={isFirst} />
        </div>

        {/* XP */}
        <p className="text-sm font-semibold text-foreground tabular-nums">
          {entry.xp.toLocaleString()}{" "}
          <span className="text-[10px] font-medium text-muted">XP</span>
        </p>

        {/* XP progress */}
        <XpBar progress={xpInfo.progress} className="w-full mt-3" />
      </div>
    </div>
  );
}

// ============================================================
// RANK ROW (FULL RANKINGS, RANKS 4+)
// ============================================================

function LeaderboardRow({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) {
  const xpInfo = xpToNextLevel(entry.xp);
  const displayName = entry.username || "Anonymous";

  return (
    <div
      id={isMe ? "my-rank-card" : undefined}
      className="transition-colors hover:bg-surface"
      style={
        isMe
          ? { backgroundColor: "rgba(249,200,70,0.07)", boxShadow: "inset 2px 0 0 #f9c846" }
          : undefined
      }
    >
      {/* Mobile: two-line layout so the data gets room to breathe */}
      <div className="md:hidden px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-8 text-center">
            <span className="text-xs font-bold text-muted tabular-nums">#{entry.rank}</span>
          </div>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <EntryAvatar entry={entry} displayName={displayName} w={36} h={40} naviiSize={36} />
            <PlayerName entry={entry} displayName={displayName} isMe={isMe} />
          </div>
        </div>
        <div className="mt-2.5 pl-[92px] flex items-center gap-3">
          <LevelBadge level={entry.level} />
          <span className="text-xs font-semibold text-foreground tabular-nums whitespace-nowrap">
            {entry.xp.toLocaleString()}
            <span className="ml-1 text-[10px] font-medium text-muted">XP</span>
          </span>
          <XpBar progress={xpInfo.progress} className="flex-1 min-w-8" />
        </div>
      </div>

      {/* Desktop: grid columns aligned with the header row */}
      <div className={`hidden md:grid ${GRID_COLS} gap-3 items-center px-4 py-3`}>
        <div className="text-center">
          <span className="text-xs font-bold text-muted tabular-nums">#{entry.rank}</span>
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <EntryAvatar entry={entry} displayName={displayName} w={36} h={40} naviiSize={36} />
          <PlayerName entry={entry} displayName={displayName} isMe={isMe} />
        </div>
        <div className="text-center">
          <LevelBadge level={entry.level} />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {entry.xp.toLocaleString()}
          </span>
          <XpBar progress={xpInfo.progress} className="w-full" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchLeaderboard = async () => {
      try {
        const [res, meRes] = await Promise.all([
          fetch("/api/leaderboard"),
          session?.user?.id ? fetch("/api/leaderboard/me") : null,
        ]);

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) setEntries(data);

        if (meRes && meRes.ok) {
          const meData = await meRes.json();
          if (!cancelled) {
            setMyRank({
              ...meData,
              isProfilePublic: meData.isProfilePublic ?? true,
            } as LeaderboardEntry);
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLeaderboard();
    return () => { cancelled = true; };
  }, [session?.user?.id]);

  // ============================================================
  // Loading state
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-[#f9c846] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-[#f9c846] font-medium tracking-wider uppercase">Loading Rankings...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Derived data
  // ============================================================

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);
  const first = podium.find((e) => e.rank === 1) ?? null;
  const second = podium.find((e) => e.rank === 2) ?? null;
  const third = podium.find((e) => e.rank === 3) ?? null;

  // The current user's row is matched by rank so the highlight also works
  // for private profiles (whose entries carry a null id in the payload).
  const myRankInTop100 = !!myRank && myRank.rank <= 100;
  const showMyRankCard = !!myRank && !myRankInTop100;
  const isMe = (entry: LeaderboardEntry) => myRankInTop100 && myRank?.rank === entry.rank;

  const scrollToMyRank = () => {
    const el = document.getElementById("my-rank-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ======================================================== */}
      {/* DECORATIVE TOP ORNAMENT */}
      {/* ======================================================== */}
      <div className="relative h-2 overflow-hidden">
        <div className="absolute inset-0 bg-[#f9c846]/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: "none",
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Leaderboard
            </h1>
          </div>
          <p className="text-sm text-muted max-w-md mx-auto">
            Top 100 adventurers ranked by experience points. Earn XP by tracking anime, completing series, and collecting badges.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CONTENT */}
      {/* ======================================================== */}
      <div className="mx-auto max-w-4xl px-4 pb-16 -mt-2">
        {/* ------------------------------------------------------ */}
        {/* MY RANK CARD (only when outside the top 100)           */}
        {/* ------------------------------------------------------ */}
        {showMyRankCard && myRank && (
          <button
            onClick={scrollToMyRank}
            id="my-rank-card"
            className="w-full mb-5 rounded-xl border border-[#f9c846]/30 bg-[#f9c846]/[0.08] p-4 text-left transition-all hover:bg-[#f9c846]/[0.12] hover:border-[#f9c846]/50 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-full bg-[#f9c846]/20 px-3 py-1 text-sm font-bold text-[#f9c846]">
                #{myRank.rank}
              </div>
              <EntryAvatar
                entry={myRank}
                displayName={myRank.username || "Anonymous"}
                w={36}
                h={40}
                naviiSize={36}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {myRank.username || "Anonymous"}
                </p>
                <p className="text-xs text-muted">
                  {myRank.xp.toLocaleString()} XP · Level {myRank.level}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-xs text-[#f9c846]">
                <span className="hidden sm:inline">Your position</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </button>
        )}

        {entries.length === 0 ? (
          /* ---------------------------------------------------- */
          /* EMPTY STATE                                          */
          /* ---------------------------------------------------- */
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <Shield size={36} className="mx-auto mb-3 text-muted" />
            <p className="text-sm text-muted">No adventurers have registered yet.</p>
            <Link
              href="/signup"
              className="inline-block mt-3 text-xs text-[#f9c846] hover:text-[#f5bd29] transition-colors"
            >
              Be the first to join →
            </Link>
          </div>
        ) : (
          <>
            {/* ------------------------------------------------ */}
            {/* PODIUM (TOP 3)                                   */}
            {/* ------------------------------------------------ */}
            {podium.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-5 md:grid-cols-3 md:items-end">
                {first && (
                  <div className="col-span-2 md:col-span-1 md:order-2">
                    <PodiumCard entry={first} isMe={isMe(first)} />
                  </div>
                )}
                {second && (
                  <div className="md:order-1">
                    <PodiumCard entry={second} isMe={isMe(second)} />
                  </div>
                )}
                {third && (
                  <div className="md:order-3">
                    <PodiumCard entry={third} isMe={isMe(third)} />
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------ */}
            {/* FULL RANKINGS (RANKS 4+)                         */}
            {/* ------------------------------------------------ */}
            {rest.length > 0 && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="h-px flex-1" style={{ backgroundColor: CARD_BORDER }} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Full Rankings
                  </span>
                  <div className="h-px flex-1" style={{ backgroundColor: CARD_BORDER }} />
                </div>

                <div
                  className="relative rounded-xl overflow-hidden"
                  style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                >
                  {/* Column headers - desktop only, aligned with data rows */}
                  <div
                    className={`hidden md:grid ${GRID_COLS} gap-3 px-4 py-3 border-b text-[10px] text-muted uppercase tracking-wider font-semibold`}
                    style={{ borderColor: CARD_BORDER }}
                  >
                    <span className="text-center">Rank</span>
                    <span>Player</span>
                    <span className="text-center">Level</span>
                    <span className="text-right">XP</span>
                  </div>

                  <div className="divide-y divide-border">
                    {rest.map((entry) => (
                      <LeaderboardRow
                        key={entry.id ?? `rank-${entry.rank}`}
                        entry={entry}
                        isMe={isMe(entry)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Footer note */}
        <p className="mt-4 text-[10px] text-muted text-center">
          Rankings update in real-time as XP changes
        </p>
      </div>
    </div>
  );
}
