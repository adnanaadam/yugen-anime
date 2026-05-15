// src/components/layout/Navbar.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVGs
import SearchIcon from "@/assets/icons/search.svg";
import CompassIcon from "@/assets/icons/compass.svg";
import ScrollIcon from "@/assets/icons/scroll.svg";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47"];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#e5b23c] to-[#ff5b47]">
            <ScrollIcon className="h-4 w-4 text-black" />
          </div>
          <span
            className={`text-xl font-bold tracking-wide ${lordJuusai.className} text-white`}
          >
            Yugen
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/explore"
            className={`flex items-center gap-2 text-sm transition-colors ${
              pathname === "/explore"
                ? "text-[#e5b23c]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="flex items-center justify-center size-6">
              <CompassIcon className="h-4 w-4" />
            </span>
            Explore
          </Link>

          {/* Auth Button */}
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-800" />
          ) : session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition-all hover:border-gray-600 hover:text-white"
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                  width={24}
                  height={24}
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5b23c] text-xs font-bold text-black">
                  {session.user?.name?.charAt(0) ?? "?"}
                </div>
              )}
              Dashboard
            </Link>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-lg bg-[#e5b23c] px-4 py-1.5 text-sm font-medium text-black transition-all hover:scale-105"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
