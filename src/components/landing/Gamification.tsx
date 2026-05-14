"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Flame, 
  Star, 
  Shield, 
  Target, 
  Crown, 
  ArrowUpRight,
  TrendingUp,
  Award,
  Sparkles,
  Gift
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { lordJuusai } from "@/fonts/fonts";

const badges = [
  {
    label: "First Anime",
    icon: Star,
    color: "#e5b23c",
    bgGradient: "from-amber-500/20 to-yellow-500/10",
    description: "Started your journey",
    rarity: "Common",
  },
  {
    label: "7-Day Streak",
    icon: Flame,
    color: "#ff5b47",
    bgGradient: "from-orange-500/20 to-red-500/10",
    description: "7 days of watching",
    rarity: "Rare",
  },
  {
    label: "Episode Master",
    icon: Zap,
    color: "#6C5CE7",
    bgGradient: "from-cyan-500/20 to-blue-500/10",
    description: "100 episodes watched",
    rarity: "Epic",
  },
  {
    label: "Anime Veteran",
    icon: Crown,
    color: "#d8d5cc",
    bgGradient: "from-purple-500/20 to-pink-500/10",
    description: "50 anime completed",
    rarity: "Legendary",
  },
  {
    label: "Genre Explorer",
    icon: Target,
    color: "#00b894",
    bgGradient: "from-green-500/20 to-emerald-500/10",
    description: "10 genres explored",
    rarity: "Rare",
  },
  {
    label: "No Lif3r",
    icon: Shield,
    color: "#ff7675",
    bgGradient: "from-rose-500/20 to-red-500/10",
    description: "500+ hours watched",
    rarity: "Mythic",
  },
];

const recentActivity = [
  { action: "Completed Solo Leveling", xp: "+50 XP", time: "2 hours ago", icon: Crown },
  { action: "Watched 3 episodes", xp: "+30 XP", time: "Yesterday", icon: Zap },
  { action: "Maintained streak", xp: "+25 XP", time: "Yesterday", icon: Flame },
  { action: "Rated 5 anime", xp: "+25 XP", time: "2 days ago", icon: Star },
];

export default function Gamification() {
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47"];

  return (
    <section className="relative overflow-hidden px-4 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 right-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full blur-3xl" 
          style={{ backgroundColor: `${cardColors[2]}10` }} 
        />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full blur-3xl" 
          style={{ backgroundColor: `${cardColors[1]}10` }} 
        />
        <div className="absolute top-20 left-1/2 h-1 w-1 rounded-full opacity-50" 
          style={{ backgroundColor: cardColors[1] }}
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
            Gamification
          </p>
          <h2 
            className={`text-5xl uppercase md:text-8xl tracking-wider ${lordJuusai.className}`}
            style={{ color: "var(--color-foreground)" }}
          >
            Level Up Your
            <br />
            Anime Journey
          </h2>
          <p 
            className="mx-auto mt-4 max-w-2xl text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Earn XP, build streaks, and unlock achievements as you watch.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Level/XP Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-4xl md:rounded-[50px] backdrop-blur-2xl shadow-2xl"
            style={{
              backgroundColor: "var(--glass-surface)",
              border: "1px solid var(--glass-border)",
            }}
          >
            {/* Decorative gradient bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
              style={{ background: `linear-gradient(90deg, ${cardColors[0]}, ${cardColors[1]}, ${cardColors[2]})` }}
            />

            <div className="p-6 sm:p-8">
              {/* Level Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div 
                      className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                      style={{ backgroundColor: cardColors[1] }}
                    />
                    <div 
                      className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${cardColors[1]}, ${cardColors[2]})`,
                        color: "#000",
                      }}
                    >
                      7
                    </div>
                  </div>
                  <div>
                    <h3 
                      className="text-xl font-bold"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      Level 7 Otaku
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Sparkles size={12} style={{ color: cardColors[1] }} />
                      <p 
                        className="text-xs"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        1,240 XP earned
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: `${cardColors[1]}20`,
                    color: cardColors[1],
                    border: `1px solid ${cardColors[1]}40`,
                  }}
                >
                  Top 15%
                </div>
              </div>

              {/* XP Progress */}
              <div className="mb-8">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span style={{ color: "var(--color-text-secondary)" }}>XP to next level</span>
                  <span className="font-medium" style={{ color: cardColors[1] }}>760 XP remaining</span>
                </div>
                <div 
                  className="relative h-3 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: `${cardColors[1]}20` }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "62%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="relative h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${cardColors[1]}, ${cardColors[2]})`,
                    }}
                  >
                    <div className="absolute inset-0 animate-pulse bg-white/20" />
                  </motion.div>
                </div>
              </div>

              {/* Current Streak */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative mb-8 overflow-hidden rounded-2xl p-4 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${cardColors[1]}15, ${cardColors[2]}15)`,
                  border: `1px solid ${cardColors[1]}30`,
                }}
              >
                <div className="absolute top-0 right-0 opacity-10">
                  <Flame size={80} />
                </div>
                <div className="relative flex items-center gap-4">
                  <div 
                    className="flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${cardColors[1]}20` }}
                  >
                    <Flame size={28} style={{ color: cardColors[1] }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                      Current Streak
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold" style={{ color: cardColors[1] }}>12</span>
                      <span className="text-sm" style={{ color: "var(--color-foreground)" }}>Days</span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      You watched anime for 12 days in a row! 🔥
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* XP Milestones */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp size={14} style={{ color: cardColors[1] }} />
                  <h4 className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                    Ways to Earn XP
                  </h4>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Watching episodes", xp: "+10 XP", icon: Zap },
                    { label: "Completing anime", xp: "+50 XP", icon: Crown },
                    { label: "Daily login streak", xp: "+25 XP", icon: Flame },
                    { label: "Rating anime", xp: "+5 XP", icon: Star },
                  ].map((milestone, i) => (
                    <motion.div
                      key={milestone.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-white/[0.03]"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${cardColors[1]}15` }}
                        >
                          <milestone.icon size={14} style={{ color: cardColors[1] }} />
                        </div>
                        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                          {milestone.label}
                        </span>
                      </div>
                      <span className="text-xs font-medium" style={{ color: cardColors[1] }}>
                        {milestone.xp}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Badges & Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Badges Grid */}
            <div 
              className="relative overflow-hidden rounded-4xl md:rounded-[50px] backdrop-blur-2xl shadow-2xl"
              style={{
                backgroundColor: "var(--glass-surface)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: "var(--color-foreground)" }}>
                      Achievements
                    </h3>
                    <p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      Badges earned through your anime journey
                    </p>
                  </div>
                  <Award size={24} style={{ color: cardColors[1] }} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {badges.map((badge, i) => (
                    <motion.div
                      key={badge.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="group relative text-center"
                    >
                      <div 
                        className="relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:shadow-xl"
                        style={{
                          background: `linear-gradient(135deg, ${badge.color}15, ${badge.color}05)`,
                          border: `1px solid ${badge.color}30`,
                        }}
                      >
                        {/* Glow effect on hover */}
                        <div 
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background: `radial-gradient(circle at center, ${badge.color}20, transparent 70%)`,
                          }}
                        />
                        
                        <div className="relative">
                          <div 
                            className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: `${badge.color}20` }}
                          >
                            <badge.icon size={20} style={{ color: badge.color }} />
                          </div>
                          <p 
                            className="text-xs font-medium"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            {badge.label}
                          </p>
                          <p 
                            className="mt-0.5 text-[10px]"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {badge.description}
                          </p>
                          <div 
                            className="mt-1 inline-block rounded-full px-1.5 py-0.5 text-[8px] font-medium"
                            style={{ 
                              backgroundColor: `${badge.color}20`,
                              color: badge.color
                            }}
                          >
                            {badge.rarity}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl p-3 text-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {badges.length} achievements earned • 3 locked • Next reward at 10 badges
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative overflow-hidden rounded-4xl md:rounded-[50px] backdrop-blur-2xl shadow-2xl"
              style={{
                backgroundColor: "var(--glass-surface)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div className="p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift size={18} style={{ color: cardColors[1] }} />
                    <h4 className="font-semibold" style={{ color: "var(--color-foreground)" }}>
                      Recent Activity
                    </h4>
                  </div>
                  <Link
                    href="/dashboard/activity"
                    className="group flex items-center gap-1 text-xs transition-all duration-300 hover:gap-2"
                    style={{ color: cardColors[1] }}
                  >
                    View all
                    <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={activity.action}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-white/[0.03]"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${cardColors[1]}15` }}
                        >
                          <activity.icon size={16} style={{ color: cardColors[1] }} />
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: "var(--color-foreground)" }}>
                            {activity.action}
                          </p>
                          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: cardColors[1] }}>
                        {activity.xp}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Level Up Preview */}
                <div className="mt-6 rounded-xl p-3 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${cardColors[1]}10, ${cardColors[2]}10)`,
                    border: `1px solid ${cardColors[1]}30`,
                  }}
                >
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                     Next milestone: <span style={{ color: cardColors[1] }}>Level 8</span> unlocks &quot;Anime Master&quot; badge
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}