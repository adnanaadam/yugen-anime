"use client";

import { motion } from "framer-motion";
import { 
  ArrowUpRight,
  TrendingUp,
  Gift,
  Target
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVG icons
import SwordIcon from "@/assets/icons/sword.svg";
import NinjaIcon from "@/assets/icons/ninja.svg";
import MagicIcon from "@/assets/icons/magic.svg";
import AchievementIcon from "@/assets/icons/achievements.svg";
import InventoryIcon from "@/assets/icons/inventory.svg";
import BattleIcon from "@/assets/icons/battle.svg";
import QuestsIcon from "@/assets/icons/quests.svg";
import DragonIcon from "@/assets/icons/dragon.svg";
import ScrollIcon from "@/assets/icons/scroll.svg";
import CrownIcon from "@/assets/icons/crown.svg";

const badges = [
  {
    label: "First Anime",
    icon: ScrollIcon,
    color: "#e5b23c",
    description: "Started your journey",
    rarity: "Common",
    image: "/images/anime-char3.png",
  },
  {
    label: "Episode Master",
    icon: SwordIcon,
    color: "#6C5CE7",
    description: "100 episodes watched",
    rarity: "Epic",
    image: "/images/anime-char3.png",
  },
  {
    label: "Anime Veteran",
    icon: CrownIcon,
    color: "#d8d5cc",
    description: "50 anime completed",
    rarity: "Legendary",
    image: "/images/anime-char3.png",
  },
  {
    label: "Genre Explorer",
    icon: MagicIcon,
    color: "#00b894",
    description: "10 genres explored",
    rarity: "Rare",
    image: "/images/anime-char3.png",
  },
  {
    label: "Completionist",
    icon: CrownIcon,
    color: "#ff5b47",
    description: "Complete 10 anime",
    rarity: "Epic",
    image: "/images/anime-char3.png",
  },
  {
    label: "Anime Lover",
    icon: NinjaIcon,
    color: "#ff7675",
    description: "Watch 500 episodes",
    rarity: "Mythic",
    image: "/images/anime-char3.png",
  },
];

const recentActivity = [
  { action: "Completed Solo Leveling", xp: "+50 XP", time: "2 hours ago", icon: CrownIcon, image: "/images/anime-char3.png" },
  { action: "Watched 3 episodes", xp: "+30 XP", time: "Yesterday", icon: SwordIcon, image: "/images/anime-char3.png" },
  { action: "Rated 5 anime", xp: "+25 XP", time: "2 days ago", icon: MagicIcon, image: "/images/anime-char3.png" },
];

const levelBadges = [
  { level: 1, icon: NinjaIcon, color: "#d8d5cc" },
  { level: 5, icon: SwordIcon, color: "#e5b23c" },
  { level: 10, icon: DragonIcon, color: "#ff5b47" },
  { level: 25, icon: CrownIcon, color: "#6C5CE7" },
];

export default function Gamification() {
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47", "#6C5CE7"];

  return (
    <section id="gamification" className="relative overflow-hidden px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header - kept same */}
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
            Earn XP and unlock achievements as you watch anime.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Level/XP Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-4xl md:rounded-[50px] shadow-2xl"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="p-6 sm:p-8">
              {/* Level Header with Image */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div 
                      className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                      style={{ backgroundColor: cardColors[1] }}
                    />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src="/images/anime-char3.png"
                        alt="Level character"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/40"
                      >
                        <span className="text-2xl font-bold text-white">7</span>
                      </div>
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
                      <SwordIcon className="h-3 w-3" style={{ fill: cardColors[1], color: cardColors[1] }} />
                      <p 
                        className="text-xs"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        1,240 XP earned
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-full px-3 py-1.5 text-xs font-medium"
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
                    style={{ backgroundColor: cardColors[1] }}
                  />
                </div>
              </div>

              {/* Level Badges */}
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                  <InventoryIcon className="h-4 w-4" style={{ fill: cardColors[1], color: cardColors[1] }} />
                  <h4 className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                    Level Rewards
                  </h4>
                </div>
                <div className="flex gap-3">
                  {levelBadges.map((badge) => (
                    <div
                      key={badge.level}
                      className="flex flex-col items-center gap-2 rounded-xl p-3 flex-1"
                      style={{
                        backgroundColor: `${badge.color}15`,
                        border: `1px solid ${badge.color}30`,
                      }}
                    >
                      <badge.icon className="h-6 w-6" style={{ fill: badge.color, color: badge.color }} />
                      <span className="text-xs font-medium" style={{ color: badge.color }}>
                        Level {badge.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* XP Milestones - removed streak */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <BattleIcon className="h-4 w-4" style={{ fill: cardColors[1], color: cardColors[1] }} />
                  <h4 className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                    Ways to Earn XP
                  </h4>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Watching episodes", xp: "+10 XP", icon: SwordIcon },
                    { label: "Completing anime", xp: "+50 XP", icon: CrownIcon },
                    { label: "Rating anime", xp: "+5 XP", icon: MagicIcon },
                  ].map((milestone, i) => (
                    <motion.div
                      key={milestone.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-300"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${cardColors[1]}15` }}
                        >
                          <milestone.icon className="h-4 w-4" style={{ fill: cardColors[1], color: cardColors[1] }} />
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
              className="relative overflow-hidden rounded-4xl md:rounded-[50px] shadow-2xl"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
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
                  <AchievementIcon className="h-6 w-6" style={{ fill: cardColors[1], color: cardColors[1] }} />
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
                          backgroundColor: `${badge.color}15`,
                          border: `1px solid ${badge.color}30`,
                        }}
                      >
                        <div className="relative">
                          <div 
                            className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: `${badge.color}20` }}
                          >
                            <badge.icon className="h-6 w-6" style={{ fill: badge.color, color: badge.color }} />
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
                    border: "1px solid var(--border)",
                  }}
                >
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {badges.length} achievements • More to unlock as you watch
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
              className="relative overflow-hidden rounded-4xl md:rounded-[50px] shadow-2xl"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QuestsIcon className="h-5 w-5" style={{ fill: cardColors[1], color: cardColors[1] }} />
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
                      className="flex items-center justify-between rounded-xl p-3 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                          <Image
                            src={activity.image}
                            alt={activity.action}
                            fill
                            className="object-cover"
                          />
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
                      <div className="flex items-center gap-2">
                        <activity.icon className="h-4 w-4" style={{ fill: cardColors[1], color: cardColors[1] }} />
                        <span className="text-xs font-medium" style={{ color: cardColors[1] }}>
                          {activity.xp}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Level Up Preview */}
                <div className="mt-6 rounded-xl p-3 text-center"
                  style={{
                    backgroundColor: `${cardColors[1]}10`,
                    border: `1px solid ${cardColors[1]}30`,
                  }}
                >
                  <p className="text-xs flex gap-1 items-center justify-center" style={{ color: "var(--color-text-secondary)" }}>
                  <span><Target className="text-[#ff5b47] size-4" /></span> Next milestone: <span style={{ color: cardColors[1] }}>Level 8</span> unlocks new badge
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