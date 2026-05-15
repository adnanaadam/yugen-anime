// src/app/(dashboard)/library/page.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Import game-icons.net SVGs
import PlayIcon from "@/assets/icons/play.svg";
import CrownIcon from "@/assets/icons/crown.svg";
import BookIcon from "@/assets/icons/book.svg";
import PauseIcon from "@/assets/icons/pause.svg";
import SkullIcon from "@/assets/icons/skull.svg";

const tabs = [
  { label: "Watching", icon: PlayIcon, color: "#e5b23c" },
  { label: "Completed", icon: CrownIcon, color: "#d8d5cc" },
  { label: "Plan to Watch", icon: BookIcon, color: "#ff5b47" },
  { label: "Paused", icon: PauseIcon, color: "#6C5CE7" },
  { label: "Dropped", icon: SkullIcon, color: "#ff7675" },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">My Library</h1>
      <p className="mt-1 text-sm text-gray-400">
        All your tracked anime in one place
      </p>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-800">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? `border-b-2 text-white`
                    : "text-gray-500 hover:text-gray-300"
                }`}
                style={{
                  borderBottomColor: isActive ? tab.color : "transparent",
                }}
              >
                <Icon className="h-4 w-4" style={{ color: isActive ? tab.color : undefined }} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-xl border border-gray-800 bg-[#0A0A0A] p-12 text-center"
      >
        <BookIcon className="mx-auto h-12 w-12 text-gray-600" />
        <p className="mt-4 text-gray-400">
          No anime in {activeTab.toLowerCase()} yet.
        </p>
        <Link
          href="/explore"
          className="mt-3 inline-block text-sm text-[#e5b23c] hover:text-[#ff5b47] transition-colors"
        >
          Explore Anime →
        </Link>
      </motion.div>
    </div>
  );
}