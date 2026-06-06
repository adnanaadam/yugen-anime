"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  { label: "Overview", href: "/dashboard", icon: DashboardIcon },
  { label: "Library", href: "/library", icon: LibraryIcon },
  // { label: "Achievements", href: "/achievements", icon: TrophyIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
];

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] p-2">
      <div className="rounded-2xl flex-col bg-charcoal-900 flex h-full w-full border border-charcoal-800">
        {/* LOGO */}
        <div className="flex items-center gap-2 p-3 border-b border-charcoal-800">
          <Link href="/" className="flex items-center gap-2">
            <h1
              className={`text-lg font-bold tracking-wide ${lordJuusai.className} text-white`}
            >
              Yugen
            </h1>
          </Link>
        </div>

        {/* USER PROFILE */}
        <div className="flex flex-col items-center p-4">
          {/* Avatar */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-md"
              style={{ backgroundColor: "var(--card-bg-2)" }}
            />
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="avatar"
                className="relative h-16 w-16 rounded-full border-2 border-tuscan-sun-500 object-cover"
                width={64}
                height={64}
              />
            ) : (
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-tuscan-sun-500 bg-gradient-to-br from-tuscan-sun-500 to-burnt-peach-400 text-2xl font-bold text-black">
                {session?.user?.name?.charAt(0) ?? "?"}
              </div>
            )}
          </div>

          {/* Username */}
          <h2 className="mt-3 text-sm font-semibold text-white">
            {session?.user?.name ?? "User"}
          </h2>

          {/* Level & XP Stats */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <TrophyIcon
                className="h-3 w-3"
                style={{ color: "var(--card-bg-2)" }}
              />
              <span className="text-xs text-charcoal-400">Lvl 7</span>
            </div>
            <div className="flex items-center gap-1">
              <ScrollIcon
                className="h-3 w-3"
                style={{ color: "var(--card-bg-1)" }}
              />
              <span className="text-xs text-charcoal-400">1,240 XP</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center h-10 gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-tuscan-sun-500 text-black"
                        : "text-charcoal-400 hover:bg-charcoal-800 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center justify-center size-5">
                      <Icon
                        className={`size-5 ${isActive ? "text-white" : ""}`}
                      />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* LOGOUT */}
        <div className="p-3 flex items-center justify-center border-t border-charcoal-800">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex cursor-pointer items-center w-fit gap-2 h-10 rounded-lg px-4 py-2 text-sm font-medium text-charcoal-400 transition-all duration-200 hover:bg-charcoal-800 hover:text-white"
          >
            <span className="flex items-center justify-center size-4">
              <LogoutIcon className="text-burnt-peach-400" />
            </span>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}