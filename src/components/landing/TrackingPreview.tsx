"use client";

import { motion } from "framer-motion";
import {
  Play,
  CheckCircle,
  Pause,
  Bookmark,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVGs
import SwordIcon from "@/assets/icons/sword.svg";
import ScrollIcon from "@/assets/icons/scroll.svg";
import CrownIcon from "@/assets/icons/crown.svg";
import DragonIcon from "@/assets/icons/dragon.svg";
import MagicIcon from "@/assets/icons/magic.svg";
import AchievementIcon from "@/assets/icons/achievements.svg";
import BookIcon from "@/assets/icons/book.svg";
import ListIcon from "@/assets/icons/list.svg";

const animeList = [
  {
    title: "Solo Leveling",
    episode: "Episode 16",
    image: "/images/anime-char3.png",
    status: "Watching",
    progress: 16,
    total: 20,
    color: "var(--color-tuscan-sun-500)",
  },
  {
    title: "Attack on Titan",
    episode: "Final Season",
    image: "/images/anime-char3.png",
    status: "Completed",
    progress: 87,
    total: 87,
    color: "var(--color-charcoal-200)",
  },
  {
    title: "Demon Slayer",
    episode: "Episode 18",
    image: "/images/anime-char3.png",
    status: "Watching",
    progress: 18,
    total: 26,
    color: "var(--color-tuscan-sun-500)",
  },
];

// Stats with game-icons.net SVG icons
const stats = [
  { 
    icon: ScrollIcon, 
    label: "Anime Watched", 
    value: "48", 
    unit: "anime",
    color: "var(--color-charcoal-200)",
    bgColor: "rgba(200, 202, 208, 0.1)",
  },
  { 
    icon: BookIcon, 
    label: "Episodes Watched", 
    value: "1,247", 
    unit: "eps",
    color: "var(--color-tuscan-sun-500)",
    bgColor: "rgba(247, 183, 8, 0.1)",
  },
  { 
    icon: CrownIcon, 
    label: "Current Level", 
    value: "7", 
    unit: "Otaku",
    color: "var(--color-burnt-peach-500)",
    bgColor: "rgba(247, 60, 8, 0.1)",
  },
];

const statusIcons: Record<string, React.ElementType> = {
  Watching: Play,
  Completed: CheckCircle,
  Paused: Pause,
  "Plan to Watch": Bookmark,
};

export default function TrackingPreview() {
  const cardColors = [
    "var(--color-charcoal-200)",
    "var(--color-tuscan-sun-500)",
    "var(--color-burnt-peach-500)",
  ];

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p
            className="mb-2 text-sm uppercase tracking-[0.3em]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Your Progress
          </p>
          <h2
            className={`text-4xl uppercase md:text-6xl tracking-wider ${lordJuusai.className}`}
            style={{ color: "var(--color-foreground)" }}
          >
            Anime Journey
          </h2>
        </motion.div>

        {/* Colorful Stats with Game Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 grid gap-4 sm:grid-cols-3"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300"
              style={{
                backgroundColor: stat.bgColor,
                border: `1px solid ${stat.color}40`,
              }}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ color: stat.color }}
                  >
                    {stat.label}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: stat.color }}
                    >
                      {stat.unit}
                    </span>
                  </div>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{
                    backgroundColor: `${stat.color}20`,
                    color: stat.color,
                  }}
                >
                  <stat.icon className="h-6 w-6" style={{ fill: stat.color, color: stat.color }} />
                </div>
              </div>

              {/* Decorative bar */}
              <div
                className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: stat.color }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Simple Tracking List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Header with Game Icon */}
          <div
            className="flex items-center justify-between border-b px-5 py-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" style={{ fill: cardColors[1], color: cardColors[1] }} />
              <span className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                Currently Watching
              </span>
            </div>
            <Link
              href="/dashboard"
              className="text-xs transition-colors hover:opacity-70"
              style={{ color: "var(--color-text-secondary)" }}
            >
              View All →
            </Link>
          </div>

          {/* List */}
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {animeList.map((anime, i) => {
              const Icon = statusIcons[anime.status];
              const progressPercent = (anime.progress / anime.total) * 100;
              
              return (
                <motion.div
                  key={anime.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Image */}
                  <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={anime.image}
                      alt={anime.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium truncate" style={{ color: "var(--color-foreground)" }}>
                        {anime.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {Icon && <Icon size={12} style={{ color: anime.color }} />}
                        <span className="text-xs" style={{ color: anime.color }}>
                          {anime.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {anime.progress}/{anime.total} episodes
                      </span>
                      <span style={{ color: anime.color }}>
                        {Math.round(progressPercent)}%
                      </span>
                    </div>
                    
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%`, backgroundColor: anime.color }}
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/watch/${anime.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105"
                    style={{ backgroundColor: `${anime.color}20`, color: anime.color }}
                  >
                    <Play size={14} className="fill-current" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div
            className="border-t px-5 py-4 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 text-sm transition-all hover:gap-2"
              style={{ color: cardColors[1] }}
            >
              Discover more anime
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}