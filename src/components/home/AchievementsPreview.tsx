// src/components/home/AchievementsPreview.tsx
"use client";

import Image from "next/image";
import { lordJuusai } from "@/fonts/fonts";

const previewBadges = [
  {
    name: "First Anime",
    description: "Added your first anime to your list",
    icon: "/icons/scroll.png",
    color: "#00e8fc",
    rarity: "Common",
    rarityLabel: "Common",
    rarityColor: "bg-slate-100 text-slate-500 border-slate-200",
    glow: "rgba(0,232,252,0.15)",
    frame: "from-slate-300 to-slate-400",
    rune: "◆",
  },
  {
    name: "Episode Master",
    description: "Watched 100 episodes total",
    icon: "/icons/ghost8.png",
    color: "#97cc04",
    rarity: "Epic",
    rarityLabel: "Epic",
    rarityColor: "bg-[#97cc04]/10 text-[#97cc04] border-[#97cc04]/20",
    glow: "rgba(151,204,4,0.2)",
    frame: "from-[#97cc04] to-[#6a9e02]",
    rune: "⬥",
  },
  {
    name: "Anime Veteran",
    description: "Completed 50 anime",
    icon: "/icons/trophy.png",
    color: "#f9c846",
    rarity: "Legendary",
    rarityLabel: "Legendary",
    rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20",
    glow: "rgba(249,200,70,0.25)",
    frame: "from-[#f9c846] via-[#e5a83e] to-[#c8841e]",
    rune: "⬖",
  },
  {
    name: "Completionist",
    description: "Completed 10 anime",
    icon: "/icons/achievements.png",
    color: "#f96e46",
    rarity: "Rare",
    rarityLabel: "Rare",
    rarityColor: "bg-[#f96e46]/10 text-[#f96e46] border-[#f96e46]/20",
    glow: "rgba(249,110,70,0.15)",
    frame: "from-[#f96e46] to-[#d45a3a]",
    rune: "◆",
  },
  {
    name: "Anime Lover",
    description: "Watched 500 episodes",
    icon: "/icons/fire-eye.png",
    color: "#f96e46",
    rarity: "Mythic",
    rarityLabel: "Mythic",
    rarityColor:
      "bg-gradient-to-r from-[#f9c846]/20 via-[#f96e46]/20 to-[#c084fc]/20 text-[#f96e46] border-[#f96e46]/30",
    glow: "rgba(249,110,70,0.3)",
    frame: "from-[#f9c846] via-[#f96e46] to-[#c084fc]",
    rune: "⬗",
  },
  {
    name: "Binge Watcher",
    description: "10 episodes in one day",
    icon: "/icons/battle.png",
    color: "#f9c846",
    rarity: "Epic",
    rarityLabel: "Epic",
    rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20",
    glow: "rgba(249,200,70,0.2)",
    frame: "from-[#f9c846] to-[#c8841e]",
    rune: "⬥",
  },
];

const hexClipPath =
  "polygon(50% 3%, 93% 28%, 93% 72%, 50% 97%, 7% 72%, 7% 28%)";
const hexClipPathInner =
  "polygon(50% 8%, 88% 30%, 88% 70%, 50% 92%, 12% 70%, 12% 30%)";

export default function AchievementsPreview() {
  return (
    <section className="relative py-24 px-4 bg-[#545863]/10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-8 -left-8 md:bottom-0 md:left-0 w-48 h-48 md:w-64 md:h-64">
          <Image
            src="/images/pain.png"
            alt="Pain"
            fill
            className="object-contain object-left-bottom"
            sizes="(max-width: 768px) 192px, 256px"
          />
        </div>
        <div className="absolute -bottom-8 -right-8 md:-bottom-16 md:right-0 w-48 h-48 md:w-64 md:h-64">
          <Image
            src="/images/denji.png"
            alt="Denji"
            fill
            className="object-contain object-right-bottom"
            sizes="(max-width: 768px) 192px, 256px"
          />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full animate-pulse"
          style={{
            backgroundColor: "rgba(249,200,70,0.3)",
            animationDuration: "3s",
          }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-0.5 h-0.5 rounded-full animate-pulse"
          style={{
            backgroundColor: "rgba(249,110,70,0.25)",
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full animate-pulse"
          style={{
            backgroundColor: "rgba(0,232,252,0.2)",
            animationDuration: "5s",
          }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-0.5 h-0.5 rounded-full animate-pulse"
          style={{
            backgroundColor: "rgba(151,204,4,0.3)",
            animationDuration: "3.5s",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#f9c846]/50" />
              <span className="text-[#f9c846]/50 text-[6px]">◆</span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#7b7f89] font-semibold">
              Badge Collection
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[#f9c846]/50 text-[6px]">◆</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#f9c846]/50" />
            </div>
          </div>

          <h2
            className={`text-4xl md:text-5xl text-[#545863] ${lordJuusai.className}`}
          >
            Collect{" "}
            <span
              className="bg-gradient-to-r from-[#f9c846] via-[#f96e46] to-[#f9c846] bg-clip-text text-transparent"
              style={{
                backgroundSize: "200% auto",
                animation: "shimmer 3s linear infinite",
              }}
            >
              Badges
            </span>
          </h2>
          <p className="mt-3 text-sm text-[#7b7f89] max-w-lg mx-auto leading-relaxed">
            Unlock achievements as you watch. Like in-game trophies, but for
            your anime journey. Each badge tells a story.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-7">
          {previewBadges.map((badge, index) => (
            <div
              key={badge.name}
              className="group relative cursor-crosshair"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative transition-all duration-500 group-hover:-translate-y-3">
                {/* Outer glow with chamfered clip */}
                <div
                  className="absolute -inset-[2px] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-md"
                  style={{
                    background: `linear-gradient(135deg, ${badge.color}60, ${badge.color}10, ${badge.color}60, ${badge.color}10)`,
                    backgroundSize: "400% 400%",
                    animation: "borderGlow 2s ease-in-out infinite",
                    clipPath:
                      "polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)",
                  }}
                />

                {/* Card body with chamfered corners */}
                <div
                  className="relative bg-white overflow-hidden shadow-sm transition-shadow duration-300 group-hover:shadow-2xl"
                  style={{
                    clipPath:
                      "polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)",
                  }}
                >
                  {/* Parchment texture */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      backgroundSize: "200px 200px",
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.015]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, #545863, #545863 1px, transparent 1px, transparent 3px)",
                    }}
                  />

                  {/* Top ornament bar */}
                  <div className="relative h-1.5 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${badge.color}, ${badge.color}, transparent)`,
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${badge.color}, ${badge.color}, ${badge.color}, transparent)`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 left-1/4 -translate-y-1/2 text-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: badge.color }}
                    >
                      {badge.rune}
                    </div>
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: badge.color }}
                    >
                      {badge.rune}
                    </div>
                    <div
                      className="absolute top-1/2 right-1/4 -translate-y-1/2 text-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: badge.color }}
                    >
                      {badge.rune}
                    </div>
                  </div>

                  <div className="p-2 md:p-3 text-center">
                    {/* Hexagonal icon container */}
                    <div className="relative mx-auto mb-2 w-48 h-48">
                      <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ animation: "spin 25s linear infinite" }}
                      >
                        <polygon
                          points="60,2 108,30 108,90 60,118 12,90 12,30"
                          fill="none"
                          stroke={badge.color}
                          strokeWidth="0.5"
                          strokeDasharray="3 4"
                          opacity="0.4"
                        />
                      </svg>
                      <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 w-full h-full"
                      >
                        <polygon
                          points="60,5 104,31 104,89 60,115 16,89 16,31"
                          fill="none"
                          stroke={badge.color}
                          strokeWidth="1"
                          className="opacity-25 transition-all duration-500 group-hover:opacity-70"
                        />
                      </svg>
                      <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 w-full h-full"
                        style={{
                          animation: "spin 15s linear infinite reverse",
                        }}
                      >
                        <polygon
                          points="60,10 98,32 98,88 60,110 22,88 22,32"
                          fill="none"
                          stroke={badge.color}
                          strokeWidth="0.75"
                          strokeDasharray="2 3"
                          className="opacity-15 transition-all duration-500 group-hover:opacity-50"
                        />
                      </svg>
                      <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 w-full h-full"
                      >
                        <polygon
                          points="60,14 93,33 93,87 60,106 27,87 27,33"
                          fill="none"
                          stroke={badge.color}
                          strokeWidth="2.5"
                          className="opacity-35 transition-all duration-500 group-hover:opacity-100"
                        />
                      </svg>
                      <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 w-full h-full"
                      >
                        <polygon
                          points="60,20 87,35 87,85 60,100 33,85 33,35"
                          fill="none"
                          stroke={badge.color}
                          strokeWidth="0.5"
                          className="opacity-10 transition-all duration-500 group-hover:opacity-40"
                        />
                      </svg>
                      <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 w-full h-full"
                      >
                        <text
                          x="60"
                          y="8"
                          textAnchor="middle"
                          fontSize="7"
                          fill={badge.color}
                          className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                        >
                          {badge.rune}
                        </text>
                        <text
                          x="103"
                          y="36"
                          textAnchor="middle"
                          fontSize="7"
                          fill={badge.color}
                          className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                        >
                          {badge.rune}
                        </text>
                        <text
                          x="103"
                          y="90"
                          textAnchor="middle"
                          fontSize="7"
                          fill={badge.color}
                          className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                        >
                          {badge.rune}
                        </text>
                        <text
                          x="60"
                          y="118"
                          textAnchor="middle"
                          fontSize="7"
                          fill={badge.color}
                          className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                        >
                          {badge.rune}
                        </text>
                        <text
                          x="17"
                          y="90"
                          textAnchor="middle"
                          fontSize="7"
                          fill={badge.color}
                          className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                        >
                          {badge.rune}
                        </text>
                        <text
                          x="17"
                          y="36"
                          textAnchor="middle"
                          fontSize="7"
                          fill={badge.color}
                          className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                        >
                          {badge.rune}
                        </text>
                      </svg>
                      <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 w-full h-full"
                      >
                        <clipPath id={`hex-bg-${index}`}>
                          <polygon points="60,14 93,33 93,87 60,106 27,87 27,33" />
                        </clipPath>
                        <rect
                          x="0"
                          y="0"
                          width="120"
                          height="120"
                          fill={`${badge.color}08`}
                          clipPath={`url(#hex-bg-${index})`}
                          className="transition-all duration-500 group-hover:opacity-100"
                        />
                      </svg>
                      <div
                        className="absolute inset-0 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        style={{
                          background: `radial-gradient(ellipse at center, ${badge.glow} 0%, transparent 65%)`,
                          clipPath: hexClipPath,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="flex items-center justify-center z-10 transition-all duration-500 group-hover:scale-110"
                          style={{
                            width: "204px",
                            height: "204px",
                            backgroundColor: `${badge.color}10`,
                            clipPath: hexClipPathInner,
                          }}
                        >
                          <div
                            className="absolute inset-0 opacity-0 z-10 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                              clipPath: hexClipPathInner,
                              boxShadow: `inset 0 0 35px ${badge.glow}`,
                            }}
                          />
                          <Image
                            src={badge.icon}
                            alt={badge.name}
                            width={66}
                            height={66}
                            className="relative z-40 object-contain transition-all duration-500 group-hover:scale-115 group-hover:brightness-110"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Badge name */}
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="flex items-center gap-1">
                        <div
                          className="h-[1px] w-6 transition-all duration-500 group-hover:w-8"
                          style={{ backgroundColor: `${badge.color}30` }}
                        />
                        <span
                          className="text-[6px] opacity-0 group-hover:opacity-60 transition-all duration-300"
                          style={{ color: badge.color }}
                        >
                          {badge.rune}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-[#545863] group-hover:text-[#f96e46] transition-all duration-300 uppercase tracking-[0.15em]">
                        {badge.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span
                          className="text-[6px] opacity-0 group-hover:opacity-60 transition-all duration-300"
                          style={{ color: badge.color }}
                        >
                          {badge.rune}
                        </span>
                        <div
                          className="h-[1px] w-6 transition-all duration-500 group-hover:w-8"
                          style={{ backgroundColor: `${badge.color}30` }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="relative mb-2">
                      <div
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ backgroundColor: `${badge.color}03` }}
                      />
                      <p className="relative text-[10px] text-[#7b7f89] leading-relaxed max-w-[180px] mx-auto">
                        {badge.description}
                      </p>
                    </div>

                    {/* Rarity gem */}
                    <div className="relative inline-block">
                      <div
                        className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                        style={{ backgroundColor: `${badge.color}40` }}
                      />
                      <span
                        className={`relative inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] ${badge.rarityColor} overflow-hidden`}
                      >
                        <div
                          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${badge.color}20, transparent)`,
                          }}
                        />
                        <span className="relative">{badge.rarityLabel}</span>
                      </span>
                    </div>

                    {/* Chamfered corner brackets */}
                    <div className="absolute top-2 left-2 flex items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div
                        className="w-5 h-5"
                        style={{
                          borderTop: `2px solid ${badge.color}`,
                          borderLeft: `2px solid ${badge.color}`,
                          clipPath: "polygon(0% 0%, 60% 0%, 0% 60%)",
                        }}
                      />
                      <span
                        className="text-[6px] mt-0.5 -ml-1"
                        style={{ color: badge.color }}
                      >
                        {badge.rune}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex-row-reverse">
                      <div
                        className="w-5 h-5"
                        style={{
                          borderTop: `2px solid ${badge.color}`,
                          borderRight: `2px solid ${badge.color}`,
                          clipPath: "polygon(100% 0%, 40% 0%, 100% 60%)",
                        }}
                      />
                      <span
                        className="text-[6px] mt-0.5 -mr-1"
                        style={{ color: badge.color }}
                      >
                        {badge.rune}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-end gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div
                        className="w-5 h-5"
                        style={{
                          borderBottom: `2px solid ${badge.color}`,
                          borderLeft: `2px solid ${badge.color}`,
                          clipPath: "polygon(0% 100%, 60% 100%, 0% 40%)",
                        }}
                      />
                      <span
                        className="text-[6px] mb-0.5 -ml-1"
                        style={{ color: badge.color }}
                      >
                        {badge.rune}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-end gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex-row-reverse">
                      <div
                        className="w-5 h-5"
                        style={{
                          borderBottom: `2px solid ${badge.color}`,
                          borderRight: `2px solid ${badge.color}`,
                          clipPath: "polygon(100% 100%, 40% 100%, 100% 40%)",
                        }}
                      />
                      <span
                        className="text-[6px] mb-0.5 -mr-1"
                        style={{ color: badge.color }}
                      >
                        {badge.rune}
                      </span>
                    </div>
                  </div>

                  {/* Bottom ornament bar */}
                  <div className="relative h-1.5 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${badge.color}, ${badge.color}, transparent)`,
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${badge.color}, ${badge.color}, ${badge.color}, transparent)`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 left-1/4 -translate-y-1/2 text-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: badge.color }}
                    >
                      {badge.rune}
                    </div>
                    <div
                      className="absolute top-1/2 right-1/4 -translate-y-1/2 text-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: badge.color }}
                    >
                      {badge.rune}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#ececec] bg-white px-5 py-2.5 shadow-sm">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#97cc04]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#f9c846]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#f96e46]" />
            </div>
            <span className="text-xs text-[#7b7f89]">
              8 unique badges available · More coming soon
            </span>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f96e46]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#f9c846]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#97cc04]" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        @keyframes borderGlow {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
