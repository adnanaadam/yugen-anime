"use client";

import { motion } from "framer-motion";
import { Zap, Flame, Star, Shield, Target, Crown } from "lucide-react";

const badges = [
  {
    label: "First Anime",
    icon: Star,
    color: "text-yellow-400",
    glow: "shadow-yellow-500/20",
  },
  {
    label: "7-Day Streak",
    icon: Flame,
    color: "text-orange-400",
    glow: "shadow-orange-500/20",
  },
  {
    label: "Episode Master",
    icon: Zap,
    color: "text-cyan-400",
    glow: "shadow-cyan-500/20",
  },
  {
    label: "Anime Veteran",
    icon: Crown,
    color: "text-purple-400",
    glow: "shadow-purple-500/20",
  },
  {
    label: "Genre Explorer",
    icon: Target,
    color: "text-green-400",
    glow: "shadow-green-500/20",
  },
  {
    label: "No Lif3r",
    icon: Shield,
    color: "text-rose-400",
    glow: "shadow-rose-500/20",
  },
];

export default function Gamification() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Level Up Your Anime Journey
          </h2>
          <p className="mt-3 text-zinc-400">
            Earn XP, build streaks, and unlock achievements as you watch.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Level/XP card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-white/5 bg-[#111111] p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg">
                7
              </div>
              <div>
                <p className="text-lg font-bold text-white">Level 7 Otaku</p>
                <p className="text-sm text-zinc-500">1,240 XP earned</p>
              </div>
            </div>

            {/* XP progress */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-zinc-400">XP to next level</span>
                <span className="text-zinc-500">760 XP remaining</span>
              </div>
              <div className="h-3 w-full rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "62%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-4 py-3">
              <Flame size={24} className="text-orange-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  12-Day Streak
                </p>
                <p className="text-xs text-zinc-500">
                  You watched anime for 12 days in a row!
                </p>
              </div>
            </div>

            {/* XP milestones */}
            <div className="mt-6 space-y-3">
              {[
                { label: "Watching episodes", xp: "+10 XP" },
                { label: "Completing anime", xp: "+50 XP" },
                { label: "Daily login streak", xp: "+25 XP" },
                { label: "Rating anime", xp: "+5 XP" },
              ].map((milestone) => (
                <div
                  key={milestone.label}
                  className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2"
                >
                  <span className="text-sm text-zinc-400">
                    {milestone.label}
                  </span>
                  <span className="text-xs font-medium text-indigo-400">
                    {milestone.xp}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Badges grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-white/5 bg-[#111111] p-6 sm:p-8"
          >
            <h3 className="mb-2 font-semibold text-white">Achievements</h3>
            <p className="mb-6 text-sm text-zinc-500">
              Badges earned through your anime journey.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className={`group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-4 text-center transition-all hover:border-white/10 hover:shadow-lg ${badge.glow}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ${badge.color}`}
                  >
                    <badge.icon size={18} />
                  </div>
                  <p className="text-[10px] font-medium text-zinc-400 group-hover:text-white">
                    {badge.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-center">
              <p className="text-xs text-zinc-500">
                {badges.length} achievements &bull; 3 locked
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}