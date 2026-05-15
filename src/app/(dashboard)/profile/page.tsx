// src/app/(dashboard)/profile/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";

// Import game-icons.net SVGs
import SwordIcon from "@/assets/icons/sword.svg";
import CrownIcon from "@/assets/icons/crown.svg";
import ScrollIcon from "@/assets/icons/scroll.svg";
import StarIcon from "@/assets/icons/star.svg";

export default function ProfilePage() {
  const { data: session } = useSession();
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47"];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      <p className="mt-1 text-sm text-gray-400">
        Your public profile and stats
      </p>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-xl border border-gray-800 bg-[#0A0A0A] p-6"
      >
        <div className="flex items-center gap-6">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt=""
              className="h-20 w-20 rounded-full object-cover"
              width={80}
              height={80}
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#e5b23c] to-[#ff5b47] text-3xl font-bold text-black">
              {session?.user?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div>
            <p className="text-xl font-semibold text-white">
              {session?.user?.name ?? "User"}
            </p>
            <p className="text-sm text-gray-400">
              {session?.user?.email ?? ""}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <CrownIcon className="h-4 w-4" style={{ color: cardColors[1] }} />
                <span className="text-sm text-white">Level 7 Otaku</span>
              </div>
              <div className="flex items-center gap-1">
                <ScrollIcon className="h-4 w-4" style={{ color: cardColors[0] }} />
                <span className="text-sm text-gray-400">1,240 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-800 pt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">48</p>
            <p className="text-xs text-gray-500">Anime Watched</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">1,247</p>
            <p className="text-xs text-gray-500">Episodes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">6</p>
            <p className="text-xs text-gray-500">Badges</p>
          </div>
        </div>
      </motion.div>

      {/* Badges Section */}
      <div className="mt-6 rounded-xl border border-gray-800 bg-[#0A0A0A] p-6">
        <h3 className="mb-4 font-semibold text-white">Recent Badges</h3>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5b23c20]">
              <ScrollIcon className="h-6 w-6" style={{ color: cardColors[1] }} />
            </div>
            <span className="text-xs text-gray-400">First Anime</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C5CE720]">
              <SwordIcon className="h-6 w-6" style={{ color: "#6C5CE7" }} />
            </div>
            <span className="text-xs text-gray-400">Episode Master</span>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="mt-6 rounded-xl border border-gray-800 bg-[#0A0A0A] p-6 text-center">
        <p className="text-sm text-gray-400">
          Profile settings and activity feed coming soon.
        </p>
      </div>
    </div>
  );
}