// src/components/home/AchievementsPreview.tsx
"use client";

import Image from "next/image";
import { lordJuusai } from "@/fonts/fonts";
import BadgeCard from "@/components/badges/BadgeCard";

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
    description: "Watched 500 episodes total",
    icon: "/icons/spellbook.png",
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
    icon: "/icons/c-cat.png",
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
    description: "Completed 100 anime",
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
    name: "Anime Lover",
    description: "Added 100 anime to your list",    
    icon: "/icons/medal.png",
    color: "#f9c846",
    rarity: "Legendary",
    rarityLabel: "Legendary",
    rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20",
    glow: "rgba(249,200,70,0.25)",
    frame: "from-[#f9c846] via-[#e5a83e] to-[#c8841e]",
    rune: "⬖",
  },
  {
    name: "Binge Watcher",
    description: "Watched 100 episodes in a week",
    icon: "/icons/fire-crystal.png",
    color: "#f9c846",
    rarity: "Legendary",
    rarityLabel: "Legendary",
    rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20",
    glow: "rgba(249,200,70,0.25)",
    frame: "from-[#f9c846] via-[#e5a83e] to-[#c8841e]",
    rune: "⬖",
  },
  {
    name: "Collector",
    description: "Collected 50 badges",
    icon: "/icons/gold-chest.png",
    color: "#f9c846",
    rarity: "Legendary",
    rarityLabel: "Legendary",
    rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20",
    glow: "rgba(249,200,70,0.25)",
    frame: "from-[#f9c846] via-[#e5a83e] to-[#c8841e]",
    rune: "⬖",
  },
  {
    name: "Favorite Curator",
    description: "Followed 10 curators",
    icon: "/icons/golden-bookmark.png",    
    color: "#f9c846",
    rarity: "Legendary",
    rarityLabel: "Legendary",
    rarityColor: "bg-[#f9c846]/10 text-[#b8901e] border-[#f9c846]/20",
    glow: "rgba(249,200,70,0.25)",
    frame: "from-[#f9c846] via-[#e5a83e] to-[#c8841e]",
    rune: "⬖",
  },
];

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
            <BadgeCard
              key={badge.name}
              badge={{
                id: badge.name,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                category: badge.rarity,
              }}
              color={badge.color}
              rarityColor={badge.rarityColor}
              glow={badge.glow}
              index={index}
            />
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