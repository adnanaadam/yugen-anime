// src/components/layout/Navbar.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { lordJuusai } from "@/fonts/fonts";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47"];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <h1
            className={`md:text-4xl tracking-wide ${lordJuusai.className}`}
            style={{ color: "var(--color-foreground)" }}
          >
            Yugen
          </h1>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Explore Link */}
          <Link
            href="/explore"
            className={`hidden md:flex items-center h-12 gap-2 rounded-full px-8 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
              pathname === "/explore"
                ? "bg-[#e5b23c] text-black"
                : "bg-black/5 dark:bg-white/10 border border-white/40 text-white"
            }`}
          >
            Explore
          </Link>

          {/* Auth Button */}
          {status === "loading" ? (
            <div className="h-10 w-20 animate-pulse rounded-full bg-zinc-800" />
          ) : session ? (
            <Link href="/dashboard">
              <div className="flex cursor-pointer items-center gap-2 md:gap-3 rounded-full px-2 md:px-3 py-1.5 transition-all duration-300 hover:scale-105 bg-black/5 dark:bg-white/10 border border-white/40">
                <p className="hidden sm:block text-xs md:text-sm font-medium text-white">
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
              className="flex h-10 px-4 md:h-12 md:px-6 cursor-pointer rounded-full items-center justify-center text-sm font-medium transition-all duration-300 hover:scale-105 bg-black/5 dark:bg-white/10 border border-white/40 text-white"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
