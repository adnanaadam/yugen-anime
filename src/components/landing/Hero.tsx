"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVGs
import StarIcon from "@/assets/icons/star.svg";
import TrophyIcon from "@/assets/icons/trophy.svg";

export default function Hero() {
  // Card colors using CSS variables
  const cardColors = [
    "var(--card-bg-1)",
    "var(--card-bg-2)",
    "var(--card-bg-3)",
  ];

  // Features data with new design
  const features = [
    {
      title: "Earn XP",
      subtitle: "Level system",
      description:
        "Watch anime, complete episodes, and level up your otaku rank",
      icon: TrophyIcon,
      bgColor: cardColors[1],
      iconColor: "var(--color-burnt-peach-500)",
      statLabel: "Current Level",
      statValue: "7",
    },
    {
      title: "Build Profile",
      subtitle: "Anime identity",
      description:
        "Showcase your taste, favorites, and anime achievements",
      icon: StarIcon,
      bgColor: cardColors[2],
      iconColor: "var(--color-tuscan-sun-500)",
      statLabel: "Badges Earned",
      statValue: "6",
    },
  ];

  return (
    <section className="relative h-screen overflow-hidden p-0">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/luffy.jpg"
          alt="anime bg"
          fill
          className="h-full w-full object-cover object-center opacity-50"
        />
      </div>

      <div className="relative h-full z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative overflow-hidden h-full"
        >
          <div className="relative p-4 md:p-8 flex flex-col justify-between h-full">
            {/* TEXT LEFT */}
            <div className="pl-4 md:pl-38 pt-16 md:pt-20 z-20">
              <h1
                className={`uppercase text-4xl md:text-6xl tracking-wide leading-tight ${lordJuusai.className}`}
                style={{ color: "var(--color-foreground)" }}
              >
                your anime universe
              </h1>

              <p
                className="mt-6 max-w-md text-lg md:text-lg"
                style={{ color: "var(--color-foreground)" }}
              >
                Track, gamify, and share your anime journey with Yugen - the
                ultimate anime tracker for fans who want more than just lists.
              </p>
            </div>

            {/* bottom cards */}
            <div className="w-full z-20 mt-auto flex flex-col md:flex-row gap-4 relative justify-between items-stretch md:items-end">
              {/* LEFT CARD - Build Watchlist */}
              <div
                className="flex-1 rounded-4xl md:rounded-[40px] py-4 px-5 md:px-6 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: cardColors[0],
                }}
              >
                <p className="text-lg md:text-xl font-medium text-black/70">
                  Build your
                </p>
                <h2
                  className={`mt-2 text-3xl md:text-5xl uppercase tracking-widest text-black ${lordJuusai.className}`}
                >
                  watchlist
                </h2>
                <Link
                  href="/explore"
                  className="group mt-4 md:mt-6 gap-2 flex w-full items-center justify-between rounded-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] bg-white/80 text-black"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    Get Started
                  </span>
                  <span className="flex size-8 md:size-10 items-center justify-center rounded-full transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 bg-black">
                    <ArrowUpRight className="size-4 text-white" />
                  </span>
                </Link>
              </div>

              {/* FEATURE CARDS - New Design */}
              <div className="flex-1 flex items-end justify-center flex-row gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex-1 relative rounded-4xl md:rounded-[40px] p-4 md:p-5 transition-all duration-300 hover:scale-[1.02] group overflow-hidden"
                    style={{
                      backgroundColor: feature.bgColor,
                    }}
                  >
                    {/* Decorative circle in background */}
                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-black/10" />

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Top section with icon and stat */}
                      <div className="flex items-start justify-between">
                        <div
                          className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg"
                          style={{
                            backgroundColor: `${feature.iconColor}20`,
                          }}
                        >
                          <feature.icon
                            className="h-6 w-6 md:h-7 md:w-7"
                            style={{
                              color: feature.iconColor,
                              fill: feature.iconColor,
                              stroke: feature.iconColor,
                            }}
                          />
                        </div>

                        {/* Stat badge */}
                        <div className="text-right">
                          <p className="text-xs text-white/50 uppercase tracking-wider">
                            {feature.statLabel}
                          </p>
                          <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
                            {feature.statValue}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-4">
                        <p className="text-xs md:text-sm font-medium text-white/60 uppercase tracking-wide">
                          {feature.subtitle}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold mt-1 text-white">
                          {feature.title}
                        </h3>
                      </div>

                      {/* CTA Link */}
                      <div className="mt-4 pt-2">
                        <Link
                          href="#features"
                          className="group inline-flex items-center gap-1 text-sm font-medium text-black/70 hover:text-black transition-all duration-300 hover:gap-2"
                        >
                          Learn More
                          <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}