"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpRight, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { lordJuusai } from "@/fonts/fonts";
import { useTheme } from "@/lib/theme";

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

  return (
    <section
      className="relative h-screen overflow-hidden p-0"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
      }}
    >
      {/* Blurred Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/kakashi.png"
          alt="anime bg"
          fill
          className="h-full w-full object-cover"
        />
        {/* <div
          className="absolute inset-0 backdrop-blur-[2px]"
          style={{ backgroundColor: "var(--glass-surface)" }}
        /> */}
      </div>

      <div className="relative h-full z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative overflow-hidden h-full"
          // className="relative overflow-hidden h-full rounded-4xl md:rounded-[50px] shadow-[0_20px_80px_rgba(0,0,0,0.15)] backdrop-blur-2xl"
          // style={{
          //   backgroundColor: "var(--glass-surface)",
          //   border: "1px solid var(--glass-border)",
          // }}
        >
          {/* decorative lines */}
          {/* <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f0d46b_1px,transparent_1px)] [bg-size:140px_140px]" />
          </div> */}

        

          <div className="relative p-4 md:p-8 flex flex-col justify-between h-full">
            {/* CENTER CHARACTER */}
            {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                src="/images/itachi.jpg"
                alt="anime character"
                className="h-50 md:h-80 lg:h-200 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              />
            </div> */}

            {/* TOP BAR */}
            <header className="flex items-center justify-between">
              {/* title with gradient */}
              <h1
                className="text-xl md:text-2xl font-bold tracking-wide bg-gradient-to-r from-[#d8d5cc] via-[#e5b23c] to-[#ff5b47] bg-clip-text text-transparent"
                style={{ color: "var(--color-foreground)" }}
              >
                Yugen
              </h1>

              <div className="flex items-center gap-2 md:gap-4">
                {/* Search — hidden on very small screens */}
                <div
                  className="hidden sm:flex h-10 md:h-12 items-center rounded-full px-4 md:px-5 backdrop-blur-xl"
                  style={{ backgroundColor: "var(--glass-surface)" }}
                >
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
                {/* <button
                  onClick={handleToggle}
                  className="relative flex h-8 w-20 md:h-10 md:w-24 items-center rounded-full backdrop-blur-xl overflow-hidden"
                  style={{ backgroundColor: "var(--glass-surface)" }}
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

                    <motion.div
                      className="flex-1 flex items-center justify-center rounded-full z-10 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{
                          scale: theme === "light" ? 1 : 0.85,
                          opacity: theme === "light" ? 1 : 0.5,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      >
                        <Sun
                          className="h-2.5 w-2.5 md:h-3 md:w-3"
                          style={{
                            color:
                              theme === "light"
                                ? "white"
                                : "var(--color-foreground)",
                          }}
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="flex-1 flex items-center justify-center rounded-full z-10 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{
                          scale: theme === "dark" ? 1 : 0.85,
                          opacity: theme === "dark" ? 1 : 0.5,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      >
                        <Moon
                          className="h-2.5 w-2.5 md:h-3 md:w-3"
                          style={{
                            color:
                              theme === "dark"
                                ? "white"
                                : "var(--color-foreground)",
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </button> */}



                {/* profile */}
                <div className="flex items-center gap-2 md:gap-3">
                  {status === "loading" ? (
                    <div className="h-8 w-20 animate-pulse rounded-full bg-zinc-300" />
                  ) : session ? (
                    <Link href="/dashboard">
                      <div
                        className="flex cursor-pointer items-center gap-2 md:gap-3 rounded-full px-2 md:px-3 py-1.5 md:py-2 backdrop-blur-xl transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: "var(--glass-surface)" }}
                      >
                        <p
                          className="hidden sm:block text-xs md:text-sm font-medium"
                          style={{ color: "var(--color-foreground)" }}
                        >
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
                      className="flex h-10 px-4 md:h-12 md:px-6 cursor-pointer rounded-full items-center justify-center backdrop-blur-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: "var(--glass-surface)",
                        color: "var(--color-foreground)",
                      }}
                    >
                      Log in
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* TEXT LEFT — adjusted for mobile with gradient */}
            <div className="pl-4 md:pl-28 pt-4 md:pt-8 z-20">
              <h1
                className={`uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide leading-tight ${lordJuusai.className}`}
                style={{ color: "var(--color-foreground)" }}
              >
                your
                <br />
                anime
                <br />
                universe
              </h1>
            </div>

            {/* bottom cards — stack vertically on mobile */}
            <div className="w-full z-20 mt-auto flex flex-col md:flex-row gap-4 relative justify-between items-stretch md:items-end">
              {/* LEFT CARD - Color 1 */}
              <div
                className="flex-1 rounded-4xl md:rounded-[40px] py-4 px-5 md:px-6 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: `${cardColors[0]}20`,
                  border: `1px solid ${cardColors[0]}40`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <p
                  className="text-lg md:text-xl font-medium"
                  style={{ color: cardColors[1] }}
                >
                  Build your
                </p>
                <h2
                  className={`mt-2 text-3xl md:text-5xl uppercase tracking-widest ${lordJuusai.className}`}
                  style={{ color: "var(--color-foreground)" }}
                >
                  watchlist
                </h2>
                <Link
                  href="/explore"
                  className="group mt-4 md:mt-6 gap-2 flex w-full items-center justify-between rounded-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: "var(--glass-surface)",
                    color: "var(--color-foreground)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    Explore Anime
                  </span>
                  <span
                    className="flex size-8 md:size-10 items-center justify-center rounded-full transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
                    style={{ backgroundColor: cardColors[0] }}
                  >
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: "#000" }}
                    />
                  </span>
                </Link>
              </div>

              {/* CENTER STATS */}
              <div className="flex-1 flex items-end justify-center flex-col md:flex-row gap-4">
                {/* Stats Card 1 - Color 2 */}
                <div
                  className="flex-1 rounded-4xl md:rounded-[40px] p-4 md:p-5 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: `${cardColors[1]}20`,
                    border: `1px solid ${cardColors[1]}40`,
                  }}
                >
                  <p
                    className="text-base md:text-lg font-medium"
                    style={{ color: cardColors[1] }}
                  >
                    Watched
                  </p>
                  <div className="mt-4 md:mt-6 flex items-end justify-between gap-4 md:gap-6">
                    <div>
                      <h3
                        className="text-3xl md:text-4xl font-black"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        1.2k
                      </h3>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        Episodes
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 hover:rotate-12"
                      style={{ backgroundColor: cardColors[1] }}
                    >
                      <ArrowUpRight
                        className="h-3.5 w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ color: "#000" }}
                      />
                    </Link>
                  </div>
                </div>

                {/* Stats Card 2 - Color 3 */}
                <div
                  className="flex-1 rounded-4xl md:rounded-[40px] p-4 md:p-5 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: `${cardColors[2]}20`,
                    border: `1px solid ${cardColors[2]}40`,
                  }}
                >
                  <div className="mt-4 md:mt-6 flex items-end justify-between gap-4 md:gap-6">
                    <div>
                      <h3
                        className="text-3xl md:text-4xl font-black"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        850
                      </h3>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        Chapters Read
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 hover:rotate-12"
                      style={{ backgroundColor: cardColors[2] }}
                    >
                      <ArrowUpRight
                        className="h-3.5 w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ color: "#000" }}
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* RIGHT CARD - Gradient of all colors */}
              <div
                className="flex flex-col justify-between rounded-4xl md:rounded-[40px] px-5 md:px-6 py-4 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: `${cardColors[0]}20`,
                  border: `1px solid ${cardColors[0]}40`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div>
                  <p
                    className="text-lg md:text-xl font-medium"
                    style={{ color: cardColors[1] }}
                  >
                    Continue
                  </p>
                  <h2
                    className={`mt-2 text-3xl md:text-5xl uppercase leading-none ${lordJuusai.className}`}
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Watching
                  </h2>
                </div>

                <Link
                  href="/explore"
                  className="group mt-4 md:mt-6 flex gap-2 w-full items-center justify-between rounded-full px-4 md:px-6 py-3 md:py-5 text-base md:text-lg font-medium shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
                  style={{
                    backgroundColor: "var(--glass-surface)",
                    color: "var(--color-foreground)",
                  }}
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    Watch Now
                  </span>
                  <span
                    className="flex size-8 md:size-10 items-center justify-center rounded-full transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  >
                    <ArrowUpRight
                      className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: "#000" }}
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}