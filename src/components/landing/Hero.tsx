"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpRight, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { lordJuusai } from "@/fonts/fonts";
import { useTheme } from "@/lib/theme";

// Import game-icons.net SVGs
import SwordIcon from "@/assets/icons/sword.svg";
import CrownIcon from "@/assets/icons/crown.svg";
import DragonIcon from "@/assets/icons/dragon.svg";

export default function Hero() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const [ripple, setRipple] = useState(false);

  const handleToggle = () => {
    setRipple(true);
    toggleTheme();
    setTimeout(() => setRipple(false), 300);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Card colors from features section
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47"];

  // Features data with different icon colors
  const features = [
    // {
    //   title: "Track Anime",
    //   subtitle: "Watch progress",
    //   icon: SwordIcon,
    //   bgColor: cardColors[0],
    //   iconColor: "#6C5CE7",
    // },
    {
      title: "Earn XP",
      subtitle: "Level system",
      icon: CrownIcon,
      bgColor: cardColors[1],
      iconColor: "#ff5b47",
    },
    {
      title: "Build Profile",
      subtitle: "Anime identity",
      icon: DragonIcon,
      bgColor: cardColors[2],
      iconColor: "#e5b23c",
    },
  ];

  return (
    <section
      className="relative h-screen overflow-hidden p-0"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/kakashi.png"
          alt="anime bg"
          fill
          className="h-full w-full object-cover opacity-50"
        />
      </div>

      <div className="relative h-full z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative overflow-hidden h-full"
        >
          <div className="relative p-4 md:p-8 flex flex-col justify-between h-full">
            {/* TOP BAR */}
            <header className="flex items-center justify-between">
              <h1 className={`md:text-4xl tracking-wide ${lordJuusai.className}`} style={{ color: "var(--color-foreground)" }}>
                Yugen
              </h1>

              <div className="flex items-center gap-2 md:gap-4">
                {/* Search */}
                <div className="hidden sm:flex h-10 md:h-12 items-center rounded-full px-4 md:px-5 bg-black/5 dark:bg-white/10 border border-white/40">
                  <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <input
                    placeholder="Search"
                    className="ml-2 bg-transparent text-sm outline-none w-20 md:w-auto"
                    style={{
                      color: "var(--color-foreground)",
                      caretColor: "var(--color-foreground)",
                    }}
                  />
                </div>

                {/* Theme toggle */}
                <button
                  onClick={handleToggle}
                  className="relative flex h-10 w-20 md:h-12 md:w-24 items-center rounded-full overflow-hidden bg-black/5 dark:bg-white/10 border border-white/40"
                  aria-label="Toggle theme"
                >
                  {ripple && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ scale: 4, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-current"
                    />
                  )}

                  <div className="flex w-full h-full relative">
                    <motion.div
                      layout
                      animate={{
                        x: theme === "dark" ? "100%" : "0%",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        mass: 0.8,
                      }}
                      className="absolute inset-y-0 w-1/2 rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />

                    <motion.div className="flex-1 flex items-center justify-center rounded-full z-10 cursor-pointer">
                      <motion.div
                        animate={{
                          scale: theme === "light" ? 1 : 0.85,
                          opacity: theme === "light" ? 1 : 0.5,
                        }}
                      >
                        <Sun className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      </motion.div>
                    </motion.div>

                    <motion.div className="flex-1 flex items-center justify-center rounded-full z-10 cursor-pointer">
                      <motion.div
                        animate={{
                          scale: theme === "dark" ? 1 : 0.85,
                          opacity: theme === "dark" ? 1 : 0.5,
                        }}
                      >
                        <Moon className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      </motion.div>
                    </motion.div>
                  </div>
                </button>

                {/* profile */}
                <div className="flex items-center gap-2 md:gap-3">
                  {status === "loading" ? (
                    <div className="h-8 w-20 animate-pulse rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  ) : session ? (
                    <Link href="/dashboard">
                      <div className="flex cursor-pointer items-center gap-2 md:gap-3 rounded-full px-2 md:px-3 py-1.5 md:py-2 transition-all duration-300 hover:scale-105 bg-black/5 dark:bg-white/10 border border-white/40">
                        <p className="hidden sm:block text-xs md:text-sm font-medium">
                          Hi, {session.user?.name?.split(" ")[0] ?? "User"}
                        </p>
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt="avatar"
                            width={32}
                            height={32}
                            className="h-7 w-7 md:h-9 md:w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full text-[10px] font-medium"
                            style={{
                              background: `linear-gradient(135deg, ${cardColors[0]}, ${cardColors[1]})`,
                              color: "#000",
                            }}
                          >
                            {session.user?.name?.charAt(0) ?? "?"}
                          </div>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <button
                      onClick={() => signIn()}
                      className="flex h-10 px-4 md:h-12 md:px-6 cursor-pointer rounded-full items-center justify-center text-sm font-medium transition-all duration-300 hover:scale-105 bg-black/5 dark:bg-white/10 border border-white/40"
                    >
                      Log in
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* TEXT LEFT */}
            <div className="pl-4 md:pl-38 pt-4 md:pt-18 z-20">
              <h1
                className={`uppercase text-4xl md:text-3xl font-bold tracking-wide leading-tight`}
              >
                your anime universe
              </h1>

              <p className="mt-6 max-w-md text-lg md:text-lg">
                Track, gamify, and share your anime journey with Yugen - the
                ultimate anime tracker for fans who want more than just lists.
              </p>
            </div>

            {/* bottom cards */}
            <div className="w-full z-20 mt-auto flex flex-col md:flex-row gap-4 relative justify-between items-stretch md:items-end">
              {/* LEFT CARD - Build Watchlist */}
              <div
                className="flex-1 rounded-4xl md:rounded-[40px] py-4 px-5 md:px-6 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: cardColors[0],
                }}
              >
                <p className="text-lg md:text-xl font-medium text-black/70">
                  Build your
                </p>
                <h2
                  className={`mt-2 text-3xl md:text-5xl uppercase tracking-widest text-black ${lordJuusai.className}`}
                >
                  watchlist
                </h2>
                <Link
                  href="/explore"
                  className="group mt-4 md:mt-6 gap-2 flex w-full items-center justify-between rounded-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] bg-white/80 text-black"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    Get Started
                  </span>
                  <span className="flex size-8 md:size-10 items-center justify-center rounded-full transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 bg-black">
                    <ArrowUpRight className="size-4 text-white" />
                  </span>
                </Link>
              </div>

              {/* FEATURE CARDS */}
              <div className="flex-1 flex items-end justify-center flex-row gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex-1 relative rounded-4xl md:rounded-[40px] p-4 md:p-5 transition-all duration-300 hover:scale-[1.02] group"
                    style={{
                      backgroundColor: feature.bgColor,
                    }}
                  >
                    <div>
                      <Link
                        href="/dashboard"
                        className="group absolute bottom-5 right-4 flex items-center justify-between text-black"
                      >
                        <span className="flex size-8 md:size-10 items-center justify-center rounded-full transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 bg-black/40">
                          <ArrowUpRight className="size-4 text-white" />
                        </span>
                      </Link>
                    </div>
                    <div className="flex flex-col items-start gap-3">
                      <div
                        className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                        style={{ backgroundColor: `${feature.iconColor}20` }}
                      >
                        <feature.icon
                          className="h-5 w-5 md:h-6 md:w-6"
                          style={{
                            color: feature.iconColor,
                            fill: feature.iconColor,
                            stroke: feature.iconColor,
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-medium text-black/70">
                          {feature.subtitle}
                        </p>
                        <h3 className="text-lg md:text-xl font-bold mt-1 text-black">
                          {feature.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
