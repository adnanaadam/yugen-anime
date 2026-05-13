"use client";

import { motion } from "framer-motion";
import { Film, Play, CheckCircle, Pause, Bookmark, Clock, Eye, ListTodo } from "lucide-react";

const animeList = [
  {
    title: "Solo Leveling",
    image: "https://placehold.co/60x80/1e1b4b/818cf8?text=SL&font=inter",
    status: "Watching",
    progress: 16,
    total: 20,
    statusColor: "text-green-400",
    barColor: "bg-green-500",
  },
  {
    title: "Attack on Titan",
    image: "https://placehold.co/60x80/1a1a2e/e94560?text=AOT&font=inter",
    status: "Completed",
    progress: 87,
    total: 87,
    statusColor: "text-blue-400",
    barColor: "bg-blue-500",
  },
  {
    title: "Demon Slayer",
    image: "https://placehold.co/60x80/1e3a5f/38bdf8?text=DS&font=inter",
    status: "Watching",
    progress: 18,
    total: 26,
    statusColor: "text-green-400",
    barColor: "bg-green-500",
  },
  {
    title: "One Piece",
    image: "https://placehold.co/60x80/3f1d2e/f97316?text=OP&font=inter",
    status: "Paused",
    progress: 510,
    total: 1100,
    statusColor: "text-amber-400",
    barColor: "bg-amber-500",
  },
  {
    title: "Steins;Gate",
    image: "https://placehold.co/60x80/1e293b/a78bfa?text=SG&font=inter",
    status: "Plan to Watch",
    progress: 0,
    total: 24,
    statusColor: "text-zinc-500",
    barColor: "bg-zinc-600",
  },
];

const statusIcons: Record<string, React.ElementType> = {
  Watching: Play,
  Completed: CheckCircle,
  Paused: Pause,
  "Plan to Watch": Bookmark,
};

const stats = [
  { icon: Film, label: "Anime Watched", value: "48" },
  { icon: Eye, label: "Episodes Watched", value: "1,247" },
  { icon: Clock, label: "Hours Watched", value: "520" },
];

export default function TrackingPreview() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Beautiful Tracking Dashboard
          </h2>
          <p className="mt-3 text-zinc-400">
            Organize your anime with a clean, intuitive interface.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#111111] px-5 py-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Anime list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-white/5 bg-[#111111]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/5 px-5 py-3">
            <ListTodo size={16} className="text-zinc-500" />
            <span className="text-sm font-medium text-zinc-400">
              Currently Tracking
            </span>
          </div>

          {/* List */}
          <div className="divide-y divide-white/5">
            {animeList.map((anime, i) => {
              const Icon = statusIcons[anime.status];
              return (
                <motion.div
                  key={anime.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="h-12 w-9 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {anime.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Icon && <Icon size={12} className={anime.statusColor} />}
                        <span className={`text-xs ${anime.statusColor}`}>
                          {anime.status}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-600">
                        {anime.progress}/{anime.total}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${anime.barColor} transition-all`}
                        style={{
                          width: `${(anime.progress / anime.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}