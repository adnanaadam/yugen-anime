// src/app/(dashboard)/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Library, User, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Navii } from '@usenavii/react';

const navTabs = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Library", href: "/library", icon: Library },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffdf8]">
        <div className="text-[#7b7f89]">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#fffdf8]">
      {/* Top Nav Bar */}
      <header className="sticky top-14 z-40 bg-white border-b border-[#ececec]">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between h-12">
            {/* User pill */}
            <div className="flex items-center gap-2">
              {session.user?.image ? (
                // <Image
                //   src={session.user.image}
                //   alt=""
                //   width={24}
                //   height={24}
                //   className="rounded-full"
                // />
                      <Navii seed={session.user?.email ?? ""} size={24} title={session.user?.name ?? ""} animated />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f9c846] text-[10px] font-bold text-[#545863]">
                  {session.user?.name?.charAt(0) || "?"}
                </div>
              )}
              <span className="text-sm font-medium text-[#545863]">
                {session.user?.name || "User"}
              </span>
            </div>

            {/* Nav tabs */}
            <nav className="flex items-center gap-1">
              {navTabs.map((tab) => {
                const isActive = pathname === tab.href || 
                  (tab.href === "/dashboard" && pathname.startsWith("/dashboard"));
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#f9c846]/10 text-[#f9c846]"
                        : "text-[#7b7f89] hover:text-[#545863] hover:bg-[#f7f7f7]"
                    }`}
                  >
                    <tab.icon size={15} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Link>
                );
              })}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#7b7f89] hover:text-[#f96e46] hover:bg-[#fef2f2] transition-colors ml-2"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}