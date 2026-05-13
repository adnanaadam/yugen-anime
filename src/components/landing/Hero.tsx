"use client";

import { motion } from "framer-motion";
import { Home, Bookmark, Search, Bell, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

export default function Hero() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-[#c8ba92] px-4 py-4 text-black">
      {/* Blurred Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/anime-girl-bg.jpg"
          alt="anime bg"
          fill
          className="h-full w-full object-cover blur-xl scale-110"
        />

        <div className="absolute inset-0 bg-[#d4c29c]/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative h-full z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden h-full rounded-[50px] border border-white/40 bg-white/25 shadow-[0_20px_80px_rgba(0,0,0,0.15)] backdrop-blur-2xl"
        >
          {/* decorative lines */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f0d46b_1px,transparent_1px)] [bg-size:140px_140px]" />
          </div>

          <div className="relative p-8 flex flex-col">
            {/* CENTER CHARACTER */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                src="/images/anime-char.png"
                alt="anime character"
                className="h-230 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              />
            </div>

            {/* TOP BAR */}
            <header className="flex items-center justify-between">
              {/* title */}
              <h1 className="text-2xl font-bold">Yugen</h1>

              <div className="flex items-center gap-4">
                <div className="flex h-12 items-center rounded-full bg-white/70 px-5 backdrop-blur-xl">
                  <Search className="h-4 w-4" />
                  <input
                    placeholder="Search"
                    className="ml-2 bg-transparent text-sm outline-none placeholder:text-black/60"
                  />
                </div>

                {/* change to login */}
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 backdrop-blur-xl">
                  <Bell className="h-4 w-4" />
                </button>

                {/* profile */}
                <div className="flex items-center gap-3 rounded-full bg-white/70 px-3 py-2 backdrop-blur-xl">
                  <p className="text-sm font-medium">Hi, Iiza</p>
                  <Image
                    src="/images/anime-girl-bg.jpg"
                    alt="avatar"
                    width={40}
                    height={40}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </div>
              </div>
            </header>

            {/* TEXT LEFT */}
            <div className="pl-28 pt-8 z-20">
              <h1 className="max-w-75 text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl">
                IMMERSE IN
                <br />
                ANIME
                <br />
                MANGA
              </h1>
            </div>

            {/* bottom cards */}
            <div className="w-full z-20 mt-auto flex justify-between ">
              {/* LEFT CARD */}
              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-[40px] border border-white/40 bg-white/30 p-4 backdrop-blur-2xl"
              >
                <p className="text-2xl font-medium">Explore, Read, and</p>

                <h2 className="mt-2 text-6xl font-black uppercase leading-none">
                  ENJOY
                </h2>

                <button className="mt-6 flex w-full items-center justify-between rounded-full bg-white px-6 py-4 text-lg font-medium shadow-lg">
                  Let’s Explore
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#f2c94c]">
                    <ArrowUpRight className="size-4" />
                  </span>
                </button>
              </motion.div>

              {/* CENTER STATS */}
              <motion.div
                whileHover={{ y: -4 }}
                className="flex items-end gap-4"
              >
                <div className="rounded-[40px] border border-white/40 bg-white/35 p-5 backdrop-blur-2xl">
                  <p className="text-lg font-medium">Complete</p>

                  <div className="mt-10 flex items-end justify-between gap-6">
                    <div>
                      <h3 className="text-5xl font-black">120</h3>
                      <p className="text-sm text-black/60">Episodes</p>
                    </div>

                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2c94c]">
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-[40px] border border-white/40 bg-white/35 p-5 backdrop-blur-2xl">
                  <div className="mt-10 flex items-end justify-between gap-6">
                    <div>
                      <h3 className="text-5xl font-black">350</h3>
                      <p className="text-sm text-black/60">Chapters Read</p>
                    </div>

                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2c94c]">
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT CARD */}
              <motion.div
                whileHover={{ y: -4 }}
                className="flex flex-col justify-between rounded-[40px] border border-white/40 bg-white/30 p-6 backdrop-blur-2xl"
              >
                <div>
                  <p className="text-2xl font-medium">Stream Anime and</p>

                  <h2 className="mt-2 text-6xl font-black uppercase leading-none">
                    ENJOY
                  </h2>
                </div>

                <button className="mt-10 flex w-full items-center justify-between rounded-full bg-white px-6 py-5 text-lg font-medium shadow-lg">
                  Watch
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2c94c]">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
