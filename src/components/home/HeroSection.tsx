// src/components/home/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Flame, Library, Trophy, Tv } from "lucide-react";
import { Navii } from "@usenavii/react";
import { lordJuusai } from "@/fonts/fonts";

const HEX_CLIP = "polygon(50% 3%, 93% 28%, 93% 72%, 50% 97%, 7% 72%, 7% 28%)";

const stats = [
  { icon: Library, value: "128", label: "Anime" },
  { icon: Tv, value: "2,340", label: "Episodes" },
  { icon: Award, value: "6/8", label: "Badges" },
];

const badgeIcons = [
  "/icons/trophy.png",
  "/icons/medal.png",
  "/icons/fire-crystal.png",
  "/icons/spellbook.png",
];

const BADGE_SLOTS = 8;

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Flat backdrop accents */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[24px] border-[#f9c846]/[0.06]" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full border-[32px] border-[#00e8fc]/[0.05]" />

      <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-4 py-16 md:py-28 lg:grid-cols-2 lg:gap-10">
        {/* ============================================================ */}
        {/* LEFT — copy                                                  */}
        {/* ============================================================ */}
        <div className="animate-fade-in-up text-center lg:text-left">
          <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
            <span className="h-px w-8 bg-[#f9c846]/50" />
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-muted">
              Your Anime · Your Stats · Your Identity
            </span>
            <span className="h-px w-8 bg-[#f9c846]/50" />
          </div>

          <h1
            className={`text-5xl uppercase leading-[0.95] tracking-wide text-foreground md:text-7xl ${lordJuusai.className}`}
          >
            Build Your Otaku
            <br />
            <span className="text-[#f9c846]">Profile</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg lg:mx-0">
            Track what you watch, showcase your favorites, earn badges, and build a profile that represents your anime taste.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link
              href="/signin"
              className="group inline-flex items-center gap-2 rounded-full bg-[#f9c846] px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#f5bd29] active:scale-[0.97]"
            >
              Start Tracking
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-surface-hover active:scale-[0.97]"
            >
              Explore Anime
            </Link>
          </div>

          {/* <p className="mt-6 text-xs text-muted">
            Free forever · XP on every episode · 8 badges to earn
          </p> */}
        </div>

        {/* ============================================================ */}
        {/* RIGHT — player card                                          */}
        {/* ============================================================ */}
        <div
          className="animate-fade-in-up relative mx-auto w-full max-w-md"
          style={{ animationDelay: "0.15s" }}
        >
          {/* Character art peeking behind the card */}
          <Image
            src="/images/anime-char2.png"
            alt=""
            width={736}
            height={1178}
            priority
            sizes="256px"
            className="pointer-events-none absolute -bottom-50 -right-60 z-0 hidden w-56 select-none opacity-90 md:block lg:w-64"
          />

          {/* Floating chip: XP */}
          <div
            className="animate-float absolute -right-3 -top-2 z-20 hidden sm:block"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 shadow-lg">
              <Flame size={16} className="text-[#f96e46]" />
              <span className="text-sm font-bold text-foreground">+120 XP</span>
            </div>
          </div>

          {/* Floating chip: badge */}
          <div
            className="animate-float absolute -left-6 bottom-16 z-20 hidden sm:block"
            style={{ animationDelay: "2.4s" }}
          >
            <div className="flex items-center gap-2 rounded-xl border border-[#97cc04]/30 bg-surface px-3.5 py-2 shadow-lg">
              <Trophy size={16} className="text-[#97cc04]" />
              <span className="text-sm font-semibold text-foreground">Badge unlocked</span>
            </div>
          </div>

          {/* Player card */}
          <div className="relative z-10 rounded-2xl border border-border bg-surface p-5 shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div
                  className="flex h-14 w-12 items-center justify-center overflow-hidden bg-[#f9c846]/15"
                  style={{ clipPath: HEX_CLIP }}
                >
                  <Navii seed="otaku-hero" size={52} title="Adventurer" animated />
                </div>
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#f9c846]/40 bg-surface px-2 py-0.5 text-[10px] font-bold text-foreground">
                  Lv.24
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">Adventurer</p>
                <p className="text-[11px] text-muted">Rank · Rising Star</p>
              </div>

              <span className="shrink-0 rounded-full border border-[#f9c846]/30 bg-[#f9c846]/10 px-2.5 py-1 text-[10px] font-bold text-[#f9c846]">
                STREAK 12
              </span>
            </div>

            {/* XP progress */}
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-foreground">12,480 / 18,000 XP</span>
                <span className="text-muted">Next: Lv.25</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-hover">
                <div className="h-full w-[68%] rounded-full bg-[#f9c846]" />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-surface-hover px-2 py-3 text-center">
                  <s.icon size={14} className="mx-auto text-[#f9c846]" />
                  <p className="mt-1.5 text-sm font-bold text-foreground tabular-nums">{s.value}</p>
                  <p className="mt-0.5 text-[10px] text-muted">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Badge collection */}
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Badges
                </span>
                <span className="text-[10px] font-bold text-[#97cc04]">6/8</span>
              </div>
              <div className="mt-2.5 grid grid-cols-8 gap-1.5">
                {Array.from({ length: BADGE_SLOTS }).map((_, i) => {
                  const earned = i < badgeIcons.length;
                  return (
                    <div
                      key={i}
                      className={`flex h-9 w-full items-center justify-center overflow-hidden ${
                        earned ? "bg-[#f9c846]/10" : "bg-surface-hover"
                      }`}
                      style={{ clipPath: HEX_CLIP }}
                    >
                      {earned ? (
                        <Image
                          src={badgeIcons[i]}
                          alt=""
                          width={24}
                          height={24}
                          className="h-5 w-5 object-contain"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
