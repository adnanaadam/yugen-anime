// src/app/(dashboard)/dashboard/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVGs
import SwordIcon from "@/assets/icons/sword.svg";
import ScrollIcon from "@/assets/icons/scroll.svg";
import CrownIcon from "@/assets/icons/crown.svg";
import BookIcon from "@/assets/icons/book.svg";
import EyeIcon from "@/assets/icons/eye.svg";
import PlayIcon from "@/assets/icons/play.svg";

export default function DashboardPage() {
  const { data: session } = useSession();
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47"];

  const stats = [
    { 
      label: "Watching", 
      value: "3", 
      icon: PlayIcon,
      color: cardColors[1],
      bgColor: `${cardColors[1]}20`,
    },
    { 
      label: "Completed", 
      value: "12", 
      icon: CrownIcon,
      color: cardColors[0],
      bgColor: `${cardColors[0]}20`,
    },
    { 
      label: "Plan to Watch", 
      value: "24", 
      icon: BookIcon,
      color: cardColors[2],
      bgColor: `${cardColors[2]}20`,
    },
    { 
      label: "Total Episodes", 
      value: "1,247", 
      icon: EyeIcon,
      color: "#6C5CE7",
      bgColor: "#6C5CE720",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">
        Welcome back, {session?.user?.name?.split(" ")[0] ?? "Anime Fan"}
      </h1>
      <p className="mt-1 text-sm text-gray-400">
        Track your progress and continue watching
      </p>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-xl p-4 transition-all duration-300"
            style={{
              backgroundColor: stat.bgColor,
              border: `1px solid ${stat.color}40`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 h-1 w-full opacity-50"
              style={{ backgroundColor: stat.color }}
            />
          </motion.div>
        ))}
      </div>

      {/* Recently Updated */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Continue Watching</h2>
        <div className="rounded-xl border border-gray-800 bg-[#0A0A0A] p-6 text-center">
          <p className="text-gray-400">
            Start tracking anime to see your progress here.
          </p>
          <Link
            href="/explore"
            className="mt-3 inline-block text-sm text-[#e5b23c] hover:text-[#ff5b47] transition-colors"
          >
            Explore Anime →
          </Link>
        </div>
      </div>
    </div>
  );
}