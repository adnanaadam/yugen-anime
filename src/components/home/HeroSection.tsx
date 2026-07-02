// src/components/home/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { lordJuusai } from "@/fonts/fonts";

const badges = [
  {
    title: "First Episode",
    xp: "+10 XP",
    icon: "/icons/battle.png",
    color: "#00e8fc",
    bg: "rgba(0,232,252,0.12)",
    position:
      "top-[10%] left-[6%] md:top-[14%] md:left-[10%]",
    delay: "0s",
  },
  {
    title: "Series Complete",
    xp: "+50 XP",
    icon: "/icons/achievements.png",
    color: "#f9c846",
    bg: "rgba(249,200,70,0.12)",
    position:
      "top-[18%] right-[6%] md:top-[16%] md:right-[12%]",
    delay: "1.5s",
  },
  {
    title: "Otaku Rank",
    xp: "Level 8",
    icon: "/icons/fire-eye.png",
    color: "#f96e46",
    bg: "rgba(249,110,70,0.12)",
    position:
      "bottom-[20%] left-[4%] md:bottom-[18%] md:left-[8%]",
    delay: "3s",
  },
  {
    title: "Legend Badge",
    xp: "+100 XP",
    icon: "/icons/dagger-fire.png",
    color: "#97cc04",
    bg: "rgba(151,204,4,0.12)",
    position:
      "bottom-[14%] right-[6%] md:bottom-[16%] md:right-[10%]",
    delay: "4.5s",
  },
];

export default function HeroSection() {
  return (
    <section className="relative max-h-screen overflow-hidden bg-black py-18">
      {/* Full Anime Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/luffy.jpg"
          alt="Anime background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Layered dark overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />

        {/* Brand color glows */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(249,200,70,0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, rgba(249,110,70,0.10) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, rgba(0,232,252,0.06) 0%, transparent 40%)
            `,
          }}
        />

        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />
      </div>

      {/* Floating Badges */}
      {/* <div className="absolute inset-0 hidden md:block pointer-events-none">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className={`absolute ${badge.position}`}
            style={{
              animation: `float 6s ease-in-out ${badge.delay} infinite`,
            }}
          >
            <div
              className="rounded-2xl border border-white/[0.08] p-4 backdrop-blur-xl transition-transform duration-500 hover:scale-105"
              style={{ backgroundColor: badge.bg }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${badge.color}20`,
                  }}
                >
                  <Image
                    src={badge.icon}
                    alt={badge.title}
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-white/90 leading-tight">
                    {badge.title}
                  </p>
                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: badge.color }}
                  >
                    {badge.xp}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {/* Center Content */}
      <div className="relative z-10 flex max-h-screen items-center justify-center px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Top accent line */}
          <div className="mb-10 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/50">
              Track · Level Up · Collect
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />
          </div>

          {/* Main Heading */}
          <h1
            className={`text-5xl uppercase leading-[0.9] tracking-wide text-white md:text-7xl lg:text-8xl ${lordJuusai.className}`}
          >
            Your Anime
            <br />
            <span
              className="bg-gradient-to-r from-[#f9c846] via-[#f96e46] to-[#f9c846] bg-clip-text text-transparent"
              style={{
                backgroundSize: "200% auto",
                animation: "shimmer 3s linear infinite",
              }}
            >
              Journey
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            Discover anime, track every episode, build your profile,
            earn XP, unlock badges, and become the ultimate otaku.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/explore"
              className="group inline-flex items-center gap-2 rounded-full bg-[#f9c846] px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#f5bd29] hover:shadow-lg hover:shadow-[#f9c846]/20 active:scale-[0.97]"
            >
              Explore Anime
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/signin"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/25 active:scale-[0.97]"
            >
              Start Tracking
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Bottom hint */}
          {/* <p className="mt-12 text-xs text-white/25">
            Free forever · No credit card required
          </p> */}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-14px);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </section>
  );
}