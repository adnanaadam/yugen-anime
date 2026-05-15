"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ListTodo,
  User,
  Trophy,
  ArrowRight,
  Compass,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { lordJuusai } from "@/fonts/fonts";

const cards = [
  {
    title: "Track Anime",
    subtitle: "Watch progress",
    bg: "#d8d5cc",
    circle: "#c8c5bc",
    icon: ListTodo,
    image: "/images/anime-char3.png",
    link: "/dashboard",
    linkTitle: "Track now",
    tooltip: "Keep track of your anime watchlist, mark episodes as watched, and never miss a release.",
  },
  {
    title: "Build Profile",
    subtitle: "Anime identity",
    bg: "#e5b23c",
    circle: "#111111",
    icon: User,
    image: "/images/anime-char3.png",
    link: "/dashboard",
    linkTitle: "Create profile",
    tooltip: "Create your unique anime profile with custom avatars, favorites, and personalized stats.",
  },
  {
    title: "Earn XP & Badges",
    subtitle: "Level system",
    bg: "#ff5b47",
    circle: "#f3f3f3",
    icon: Trophy,
    image: "/images/jiraiya.png",
    link: "/dashboard",
    linkTitle: "Start earning",
    tooltip: "Earn XP points and badges by watching anime, completing challenges, and being active.",
  },
  {
    title: "Discover Anime",
    subtitle: "New releases",
    bg: "#6C5CE7",
    circle: "#5B4BC7",
    icon: Compass,
    image: "/images/sasuke.png",
    link: "/explore",
    linkTitle: "Discover more",
    tooltip: "Explore trending anime, seasonal releases, and get personalized recommendations.",
  },
];

export default function Features() {
  return (
    <section className="relative overflow-hidden px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* heading */}
        <div className="mb-20 text-center">
          <p
            className="mb-3 text-sm uppercase tracking-[0.3em]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Features
          </p>

          <h2
            className={`text-5xl uppercase md:text-8xl tracking-wider ${lordJuusai.className}`}
            style={{ color: "var(--color-foreground)" }}
          >
            Anime
            <br />
            Experience
          </h2>
        </div>

        {/* cards - now fits in one line on large screens */}
        <div className="flex flex-nowrap items-center justify-center gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
              }}
              whileHover={{
                y: -10,
                rotate: i === 1 ? 0 : i % 2 === 0 ? -1 : 1,
              }}
              className="group"
            >
              <div
                className="relative h-[550px] w-[300px] overflow-visible rounded-[2.5rem] p-5 shadow-2xl"
                style={{
                  background: card.bg,
                }}
              >
                {/* top */}
                <div className="flex items-center justify-between">
                  {/* small dots */}
                  <div className="flex items-center gap-2 px-2">
                    <div className="h-2 w-2 rounded-full bg-black" />
                    <div className="h-2 w-2 rounded-full bg-black/30" />
                  </div>

                  {/* Tooltip Container */}
                  <div className="relative">
                    <p className="text-xs font-semibold text-black cursor-help">
                      Yugen
                    </p>
                    
                    {/* Tooltip - fixed to not affect card blur */}
                    <div className="absolute right-0 top-6 z-50 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none">
                      <div className="relative">
                        {/* Tooltip arrow */}
                        <div className="absolute -top-1 right-4 w-2 h-2 rotate-45 bg-black"></div>
                        {/* Tooltip content */}
                        <div className="mt-2 rounded-lg bg-black/95 backdrop-blur-sm p-3 shadow-xl">
                          <p className="text-xs text-white leading-relaxed">
                            {card.tooltip}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* character area */}
                <div className="relative mt-4 flex justify-center">
                  {/* circle */}
                  <div
                    className="absolute -top-4 h-[260px] w-[260px] rounded-full"
                    style={{
                      background: card.circle,
                    }}
                  />

                  {/* character */}
                    <Image
                      src={card.image}
                      alt={card.title}
                      width={320}
                      height={420}
                      className="relative -mt-14 z-10 h-[360px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* content */}
                <div className="-mt-8 px-2">
                  <p className="text-xs text-black/60">{card.subtitle}</p>

                  <h3 className="mt-2 text-5xl font-black leading-none tracking-tight text-black">
                    {card.title}
                  </h3>

                  {/* divider */}
                  <div className="mt-1 h-[1px] w-28 bg-black/40" />
                </div>

                {/* bottom button - Glassmorphism with Link */}
                <div className="absolute bottom-5 left-5 right-5">
                  <Link
                    href={card.link}
                    className="flex h-16 w-full items-center justify-between rounded-2xl px-5 text-white transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-xl"
                    style={{
                      background: "rgba(17, 17, 17, 0.7)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <span className="text-sm">{card.linkTitle}</span>

                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:rotate-12"
                      style={{
                        background: "rgba(242, 201, 76, 0.9)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <ArrowUpRight size={18} color="#000" />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}