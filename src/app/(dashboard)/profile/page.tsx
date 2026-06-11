// src/app/(dashboard)/profile/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useUserStats } from "@/hooks/useUserData";
import { xpToNextLevel } from "@/lib/utils";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { data: stats, loading } = useUserStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 rounded-2xl bg-[#f7f7f7] animate-pulse" />
        <div className="h-32 rounded-xl bg-[#f7f7f7] animate-pulse" />
      </div>
    );
  }

  const xpInfo = stats?.user ? xpToNextLevel(stats.user.xp) : null;

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="rounded-2xl border border-[#ececec] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt=""
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f9c846] text-[#545863] font-bold text-2xl">
              {session?.user?.name?.charAt(0) || "?"}
            </div>
          )}
          <div>
            <p className="text-lg font-bold text-[#545863]">
              {session?.user?.name || "User"}
            </p>
            <p className="text-sm text-[#7b7f89]">
              {session?.user?.email || ""}
            </p>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span className="text-[#f9c846] font-medium">
                Level {stats?.user?.level || 1}
              </span>
              <span className="text-[#7b7f89]">·</span>
              <span className="text-[#7b7f89]">{stats?.user?.xp || 0} XP</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#7b7f89]">Level progress</span>
            <span className="text-[#f96e46] font-medium">
              {xpInfo?.progress.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#f7f7f7] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f9c846] to-[#f96e46]"
              style={{ width: `${xpInfo?.progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats?.stats.totalAnime || 0 },
          { label: "Watching", value: stats?.stats.watching || 0 },
          { label: "Completed", value: stats?.stats.completed || 0 },
          { label: "Episodes", value: stats?.stats.totalEpisodes || 0 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#ececec] bg-white p-4 text-center shadow-sm"
          >
            <p className="text-xl font-bold text-[#545863]">{stat.value}</p>
            <p className="text-[11px] text-[#7b7f89] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      {stats?.badges && stats.badges.length > 0 && (
        <div className="rounded-xl border border-[#ececec] bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#545863] mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((ub: { id: string; badge: { name: string; description?: string } }) => (
              <div
                key={ub.id}
                className="flex items-center gap-2 rounded-lg border border-[#ececec] px-3 py-2"
              >
                <span className="text-sm">🏆</span>
                <div>
                  <p className="text-xs font-medium text-[#545863]">{ub.badge.name}</p>
                  <p className="text-[10px] text-[#7b7f89]">{ub.badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}