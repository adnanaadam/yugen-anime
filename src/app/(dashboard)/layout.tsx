// src/app/(dashboard)/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Library, User, Settings, LogOut, Heart, Globe, Lock, Share2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { Navii } from "@usenavii/react";
import { CldImage } from "next-cloudinary";
import { useUserStats } from "@/hooks/useUserData";
import { addGlobalToast } from "@/components/Toast";

const navTabs = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Library", href: "/library", icon: Library },
  { label: "Favorites", href: "/favorites", icon: Heart },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const { data: stats, loading } = useUserStats();
  const router = useRouter();
  const pathname = usePathname();

  const isProfilePublic = stats?.user?.isProfilePublic ?? true;
  const [copied, setCopied] = useState(false);

  const handleShareProfile = async () => {
    const username = session?.user?.username;
    if (!username) return;

    const url = `${window.location.origin}/u/${username}`;

    // Try Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title: `${username}'s Profile`, url });
        return;
      } catch {
        // User cancelled or failed - fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      addGlobalToast({
        type: "success",
        message: "Profile link copied to clipboard!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addGlobalToast({
        type: "error",
        message: "Failed to copy link",
      });
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated" && session?.user?.needsOnboarding) {
      router.push("/onboarding");
    }
  }, [status, router, session]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  // Still needs onboarding — render loading while redirecting
  if (session.user.needsOnboarding) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav Bar */}
      <header className="sticky top-14 z-40 bg-surface border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:py-0">
          <div className="flex items-center justify-between sm:h-12 flex-col sm:flex-row gap-4">
            {/* User pill */}
            <div className="flex items-center gap-2">
              {/* {session.user?.image &&
              session.user.image.includes("cloudinary") ? (
                <div className="relative size-7 rounded-full overflow-hidden">
                  <CldImage
                    src={session.user.image}
                    alt={session.user?.name || "Avatar"}
                    fill
                    className="object-cover"
                    crop="fill"
                    gravity="face"
                  />
                </div>
              ) : (
                <Navii
                  seed={session.user?.email ?? ""}
                  size={24}
                  title={session.user?.name ?? ""}
                  animated
                />
              )}
              <span className="text-sm font-medium text-foreground">
                {session.user?.username || "User"}
              </span> */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                  isProfilePublic
                    ? "bg-[#97cc04]/10 text-[#97cc04]"
                    : "bg-surface-hover text-muted"
                }`}
              >
                {isProfilePublic ? <Globe size={12} /> : <Lock size={12} />}
                {isProfilePublic ? "Profile is public" : "Profile is private"}
              </span>
              {/* <button
                onClick={handleShareProfile}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-[#f9c846] bg-[#f9c846]/10 hover:bg-[#f9c846]/20 transition-colors cursor-pointer"
              >
                <Share2 size={12} />
                Share Profile
              </button> */}
            </div>

            {/* Nav tabs */}
            <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {navTabs.map((tab) => {
                const isActive =
                  pathname === tab.href ||
                  (tab.href === "/profile" && pathname.startsWith("/profile"));
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? "bg-[#f9c846]/10 text-[#f9c846]"
                        : "text-muted hover:text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    <tab.icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Link>
                );
              })}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center cursor-pointer gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-[#f96e46] hover:bg-[#fef2f2] transition-colors flex-shrink-0"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 sm:py-6">{children}</main>
    </div>
  );
}
