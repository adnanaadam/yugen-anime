// src/app/(dashboard)/layout.tsx

"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVGs
import DashboardIcon from "@/assets/icons/dashboard.svg";
import LibraryIcon from "@/assets/icons/library.svg";
import TrophyIcon from "@/assets/icons/trophy.svg";
import UserIcon from "@/assets/icons/user.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import LogoutIcon from "@/assets/icons/logout.svg";
import ScrollIcon from "@/assets/icons/scroll.svg";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Library", href: "/library", icon: LibraryIcon },
  // { label: "Achievements", href: "/achievements", icon: TrophyIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47"];

  return (
    <div className="flex min-h-screen bg-black">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 flex h-full w-[260px] flex-col border-r border-gray-800 bg-[#0A0A0A]">
        {/* LOGO */}
        <div className="flex items-center gap-2 border-b border-gray-800 p-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#e5b23c] to-[#ff5b47]">
            <ScrollIcon className="h-4 w-4 text-black" />
          </div>
          <h1
            className={`text-lg font-bold tracking-wide ${lordJuusai.className} text-white`}
          >
            Yugen
          </h1>
        </div>

        {/* USER PROFILE */}
        <div className="flex flex-col items-center border-b border-gray-800 p-5">
          {/* Avatar */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-md"
              style={{ backgroundColor: cardColors[1] }}
            />
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="avatar"
                className="relative h-20 w-20 rounded-full border-2 border-[#e5b23c] object-cover"
                width={80}
                height={80}
              />
            ) : (
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#e5b23c] bg-gradient-to-br from-[#e5b23c] to-[#ff5b47] text-2xl font-bold text-black">
                {session?.user?.name?.charAt(0) ?? "?"}
              </div>
            )}
          </div>

          {/* Username */}
          <h2 className="mt-4 text-base font-semibold text-white">
            {session?.user?.name ?? "User"}
          </h2>

          {/* Level & XP Stats */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <TrophyIcon
                className="h-3 w-3"
                style={{ color: cardColors[1] }}
              />
              <span className="text-xs text-gray-400">Lvl 7</span>
            </div>
            <div className="flex items-center gap-1">
              <ScrollIcon
                className="h-3 w-3"
                style={{ color: cardColors[0] }}
              />
              <span className="text-xs text-gray-400">1,240 XP</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center h-12 gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#e5b23c] text-black"
                        : "text-gray-400 hover:bg-gray-900 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center justify-center size-6">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-gray-800 p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full cursor-pointer items-center gap-3 h-12 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-gray-900 hover:text-white"
          >
            <span className="flex items-center justify-center size-6">
              <LogoutIcon className="h-5 w-5" />
            </span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-[260px] flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
