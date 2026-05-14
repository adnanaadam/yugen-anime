"use client";

import { motion } from "framer-motion";
import {
  Play,
  CheckCircle,
  Pause,
  Bookmark,
  Clock,
  Eye,
  ListTodo,
  TrendingUp,
  Flame,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { lordJuusai } from "@/fonts/fonts";

const animeList = [
  {
    title: "Solo Leveling",
    episode: "Episode 16",
    image: "/images/anime-char3.png",
    status: "Watching",
    progress: 16,
    total: 20,
    statusColor: "#e5b23c",
    barColor: "#e5b23c",
    nextEpisode: "2 days",
  },
  {
    title: "Attack on Titan",
    episode: "Final Season",
    image: "/images/anime-char3.png",
    status: "Completed",
    progress: 87,
    total: 87,
    statusColor: "#d8d5cc",
    barColor: "#d8d5cc",
    nextEpisode: null,
  },
  {
    title: "Demon Slayer",
    episode: "Episode 18",
    image: "/images/anime-char3.png",
    status: "Watching",
    progress: 18,
    total: 26,
    statusColor: "#e5b23c",
    barColor: "#e5b23c",
    nextEpisode: "Tomorrow",
  },
  {
    title: "Hells Paradise",
    episode: "Episode 12",
    image: "/images/anime-char3.png",
    status: "Paused",
    progress: 12,
    total: 26,
    statusColor: "#ff5b47",
    barColor: "#ff5b47",
    nextEpisode: null,
  },
];

const trendingStats = [
  {
    icon: Eye,
    label: "Total Views",
    value: "12.4K",
    change: "+23%",
    changeColor: "#e5b23c",
  },
  {
    icon: Flame,
    label: "Watch Streak",
    value: "8",
    unit: "days",
    change: "+2",
    changeColor: "#ff5b47",
  },
  {
    icon: TrendingUp,
    label: "Completion Rate",
    value: "94",
    unit: "%",
    change: "+5%",
    changeColor: "#e5b23c",
  },
  {
    icon: Calendar,
    label: "This Week",
    value: "23",
    unit: "eps",
    change: "+8",
    changeColor: "#ff5b47",
  },
];

const statusIcons: Record<string, React.ElementType> = {
  Watching: Play,
  Completed: CheckCircle,
  Paused: Pause,
  "Plan to Watch": Bookmark,
};

export default function TrackingPreview() {
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47"];

  return (
    <section className="relative overflow-hidden px-4 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-3xl"
          style={{ backgroundColor: `${cardColors[1]}10` }}
        />
        <div
          className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: `${cardColors[2]}10` }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p
            className="mb-3 text-sm uppercase tracking-[0.3em]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Tracking Dashboard
          </p>
          <h2
            className={`text-5xl uppercase md:text-8xl tracking-wider ${lordJuusai.className}`}
            style={{ color: "var(--color-foreground)" }}
          >
            Your Anime
            <br />
            Journey
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {trendingStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-3xl p-5 backdrop-blur-2xl transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: "var(--glass-surface)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "var(--color-text-secondary)" }}
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
                    {stat.unit && (
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  {stat.change && (
                    <p
                      className="mt-1 text-xs font-medium"
                      style={{ color: stat.changeColor }}
                    >
                      {stat.change} from last week
                    </p>
                  )}
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{
                    backgroundColor: `${cardColors[1]}20`,
                    color: cardColors[1],
                  }}
                >
                  <stat.icon size={22} />
                </div>
              </div>

              {/* Decorative bar */}
              <div
                className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: cardColors[1] }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Tracking Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative overflow-hidden rounded-4xl md:rounded-[50px] backdrop-blur-2xl shadow-2xl"
          style={{
            backgroundColor: "var(--glass-surface)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {/* Decorative header bar - solid color */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: cardColors[1] }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between border-b px-6 py-4 md:px-8 md:py-5"
            style={{ borderColor: "var(--glass-border)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${cardColors[1]}20` }}
              >
                <ListTodo size={18} style={{ color: cardColors[1] }} />
              </div>
              <div>
                <h3
                  className="font-semibold"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Currently Tracking
                </h3>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {animeList.length} active series
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:gap-3"
              style={{
                backgroundColor: "var(--glass-surface)",
                color: "var(--color-foreground)",
                border: "1px solid var(--glass-border)",
              }}
            >
              View All
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Anime List */}
          <div
            className="divide-y"
            style={{ borderColor: "var(--glass-border)" }}
          >
            {animeList.map((anime, i) => {
              const Icon = statusIcons[anime.status];
              return (
                <motion.div
                  key={anime.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="group relative overflow-hidden transition-all duration-300 hover:bg-white/[0.02]"
                >
                  <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:p-6">
                    {/* Anime Image */}
                    <div className="relative flex-shrink-0">
                      <div className="relative h-24 w-16 overflow-hidden rounded-xl md:h-28 md:w-20">
                        <Image
                          src={anime.image}
                          alt={anime.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      {/* Status Badge */}
                      <div
                        className="absolute -bottom-2 -right-2 rounded-full p-1.5 shadow-lg"
                        style={{ backgroundColor: anime.statusColor }}
                      >
                        {Icon && <Icon size={12} style={{ color: "#000" }} />}
                      </div>
                    </div>

                    {/* Anime Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4
                            className="text-lg font-bold"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            {anime.title}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {anime.episode}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs font-medium px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: `${anime.statusColor}20`,
                              color: anime.statusColor,
                            }}
                          >
                            {anime.status}
                          </span>
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            {anime.progress}/{anime.total}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            Progress
                          </span>
                          <span style={{ color: anime.statusColor }}>
                            {Math.round((anime.progress / anime.total) * 100)}%
                          </span>
                        </div>
                        <div
                          className="h-2 overflow-hidden rounded-full"
                          style={{ backgroundColor: `${anime.statusColor}20` }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${(anime.progress / anime.total) * 100}%`,
                            }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: anime.statusColor }}
                          />
                        </div>
                      </div>

                      {/* Next Episode Info */}
                      {anime.nextEpisode && (
                        <div className="mt-3 flex items-center gap-2">
                          <div
                            className="h-1.5 w-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: anime.statusColor }}
                          />
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            Next episode in{" "}
                            <span style={{ color: anime.statusColor }}>
                              {anime.nextEpisode}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/watch/${anime.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:gap-3 md:self-center"
                      style={{
                        backgroundColor: `${anime.statusColor}20`,
                        color: anime.statusColor,
                        border: `1px solid ${anime.statusColor}40`,
                      }}
                    >
                      {anime.status === "Completed" ? "Rewatch" : "Continue"}
                      <Play size={14} className="fill-current" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Call to Action */}
          <div
            className="border-t px-6 py-5 md:px-8"
            style={{ borderColor: "var(--glass-border)" }}
          >
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Ready to expand your collection?
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Discover new anime and track your progress
                </p>
              </div>

              <Link
                href="/explore"
                className="group flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-all duration-300 hover:gap-3 hover:scale-105"
                style={{
                  backgroundColor: "var(--glass-surface)",
                  color: "var(--color-foreground)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                Explore More Anime
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}