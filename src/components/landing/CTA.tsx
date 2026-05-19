"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Sparkles, Crown, Flame } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVGs
import SwordIcon from "@/assets/icons/sword.svg";
import MagicIcon from "@/assets/icons/magic.svg";
import DragonIcon from "@/assets/icons/dragon.svg";

export default function CTA() {
  const { data: session } = useSession();
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47", "#6C5CE7"];

  return (
    <section className="relative overflow-hidden px-4 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div 
          className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${cardColors[1]}10` }}
        />
        <div 
          className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: `${cardColors[2]}10` }}
        />
        <div 
          className="absolute top-20 left-10 h-1 w-1 rounded-full"
          style={{ backgroundColor: cardColors[1] }}
        />
      </div>

      {/* Floating icons decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[20%] opacity-20"
        >
          <SwordIcon className="h-16 w-16" style={{ color: cardColors[1] }} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-[15%] top-[30%] opacity-20"
        >
          <DragonIcon className="h-20 w-20" style={{ color: cardColors[2] }} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute left-[20%] bottom-[20%] opacity-20"
        >
          <MagicIcon className="h-14 w-14" style={{ color: cardColors[3] }} />
        </motion.div>
      </div>

      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-4xl md:rounded-[50px] shadow-2xl"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Decorative header bar */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: cardColors[1] }}
          />

          {/* Animated gradient overlay */}
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${cardColors[1]}10, transparent 70%)`,
            }}
          />

          <div className="relative p-8 md:p-12 text-center">
            {/* Mini badges */}
            <div className="mb-6 flex justify-center gap-2">
              <div 
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${cardColors[1]}20`,
                  color: cardColors[1],
                  border: `1px solid ${cardColors[1]}40`,
                }}
              >
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Join Now
                </span>
              </div>
              <div 
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${cardColors[2]}20`,
                  color: cardColors[2],
                  border: `1px solid ${cardColors[2]}40`,
                }}
              >
                <span className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Free Forever
                </span>
              </div>
            </div>

            {/* Main heading */}
            <h2 
              className={`text-4xl uppercase md:text-6xl lg:text-7xl tracking-wider ${lordJuusai.className}`}
              style={{ color: "var(--color-foreground)" }}
            >
              Start Building
              <br />
              Your Anime Journey
            </h2>

            {/* Description */}
            <p 
              className="mx-auto mt-4 max-w-md text-sm md:text-base"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Track anime, earn achievements, and discover your next favorite series. 
              Join anime fans already using Yugen.
            </p>

            {/* Stats row */}
            <div className="mx-auto mt-8 flex max-w-lg justify-center gap-6 md:gap-10">
              <div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4" style={{ color: cardColors[1] }} />
                  <span className="text-xl font-bold" style={{ color: "var(--color-foreground)" }}>
                    10K+
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Active Users
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <SwordIcon className="h-4 w-4" style={{ color: cardColors[2] }} />
                  <span className="text-xl font-bold" style={{ color: "var(--color-foreground)" }}>
                    50K+
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Anime Tracked
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <DragonIcon className="h-4 w-4" style={{ color: cardColors[3] }} />
                  <span className="text-xl font-bold" style={{ color: "var(--color-foreground)" }}>
                    1M+
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Episodes Watched
                </p>
              </div>
            </div>

            {/* CTA Buttons - All working */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {session ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-300 hover:gap-3"
                    style={{
                      background: `${cardColors[1]}`,
                      color: "#000",
                    }}
                  >
                    Go to Dashboard
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => signIn()}
                      className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-300 hover:gap-3 cursor-pointer"
                      style={{
                        background: `${cardColors[1]}`,
                        color: "#000",
                      }}
                    >
                      Get Started Free
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/explore"
                      className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-300 hover:gap-3"
                      style={{
                        backgroundColor: "var(--surface)",
                        color: "var(--color-foreground)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      Explore Anime
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}