// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { lordJuusai } from "@/fonts/fonts";
import { ChevronDown, Menu, Search, X, Bell, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Navii } from "@usenavii/react";
import { CldImage } from "next-cloudinary";
import { useNotifications } from "@/hooks/useNotifications";
import DiscordIcon from "@/assets/icons/discord.svg";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading: notifLoading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close notification menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close mobile menu on route change (handled by link clicks)
  const closeMobile = () => setMobileOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      closeMobile();
    }
  };

  const handleNotifClick = (notif: { id: string; link: string | null }) => {
    markAsRead(notif.id);
    setShowNotifMenu(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "badge_earned": return "🏆";
      case "level_up": return "⬆️";
      case "xp_gained": return "✨";
      case "system": return "📢";
      default: return "•";
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <>
      {/* Desktop */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-center h-14 bg-[var(--color-secondary)]">
        {/* Grid layout: 3 equal columns so center stays centered */}
        <div className="grid grid-cols-3 items-center w-full text-[var(--color-surface)] px-8 lg:px-16">
          {/* Left: Logo */}
          <Link href="/" className="justify-self-start">
            <h1 className={`text-2xl ${lordJuusai.className}`}>Yugen</h1>
          </Link>

          {/* Center: Nav - always centered in its column */}
          <nav className="flex items-center justify-center gap-8 text-[var(--color-surface)]">
            <Link
              href="/explore"
              className="hover:underline underline-offset-4"
            >
              Explore
            </Link>
            <Link
              href="/leaderboard"
              className="hover:underline underline-offset-4"
            >
              Leaderboard
            </Link>
            <a
              href="https://discord.gg/your-invite"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 transition-colors hover:bg-[var(--color-surface-hover)]"
            >
            <DiscordIcon className="size-6" />
            </a>
          </nav>

          {/* Right: Notifications + Search + User - always right-aligned in its column */}
          <div className="flex items-center justify-end gap-3">
            {/* Search */}
            <div ref={searchRef} className="flex items-center">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search anime..."
                    className="h-9 w-48 lg:w-56 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="ml-1 flex size-8 items-center cursor-pointer justify-center rounded-lg text-[var(--color-surface)] hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex size-9 items-center justify-center cursor-pointer rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-surface-hover)]"
                >
                  <Search
                    className="text-[var(--color-foreground)]"
                    size={18}
                  />
                </button>
              )}
            </div>

            {/* Notifications */}
            {session && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifMenu((prev) => !prev)}
                  className="relative flex size-9 items-center justify-center cursor-pointer rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-surface-hover)]"
                >
                  <Bell
                    className="text-[var(--color-foreground)]"
                    size={18}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#f96e46] text-[9px] font-bold text-white shadow-sm">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div
                    className="absolute right-0 mt-2 w-80 rounded-2xl border border-[var(--color-border)] bg-white shadow-lg overflow-hidden"
                    style={{ maxHeight: "400px" }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
                      <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            markAllAsRead();
                          }}
                          className="text-xs cursor-pointer text-[var(--color-secondary)] hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto" style={{ maxHeight: "340px" }}>
                      {notifLoading ? (
                        <div className="p-4 text-center text-xs text-[var(--color-text-secondary)]">
                          Loading...
                        </div>
                      ) : error ? (
                        <div className="p-4 text-center text-xs text-red-500">
                          {error}
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell size={24} className="mx-auto mb-2 text-[var(--color-text-secondary)]" />
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            No notifications yet
                          </p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => handleNotifClick(notif)}
                            className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-surface)] ${
                              !notif.read ? "bg-[var(--color-primary)]/5" : ""
                            }`}
                          >
                            <span className="text-base shrink-0 mt-0.5">
                              {getNotifIcon(notif.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${notif.read ? "text-[var(--color-text-secondary)]" : "text-[var(--color-foreground)] font-medium"}`}>
                                {notif.title}
                              </p>
                              {notif.message && (
                                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                                  {notif.message}
                                </p>
                              )}
                              <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">
                                {formatTime(notif.createdAt)}
                              </p>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#f96e46] shrink-0 mt-1.5" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User */}
            {status === "loading" ? (
              <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
            ) : session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="flex items-center cursor-pointer gap-2 rounded-md border border-[var(--color-border)] bg-white px-1 py-1 transition-colors hover:bg-[var(--color-surface-hover)]"
                >
                  {session.user?.image && session.user.image.includes("cloudinary") ? (
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
                  <ChevronDown
                    size={14}
                    className={`text-[var(--color-foreground)] transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--color-border)] bg-white p-2 shadow-lg transition-all duration-200 ${
                    showUserMenu
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="border-b border-[var(--color-border)] p-3">
                    <p className="font-medium text-[var(--color-foreground)]">
                      {session.user?.username || session.user?.name}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="block rounded-xl px-3 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/library"
                      className="block rounded-xl px-3 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Library
                    </Link>
                  </div>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full rounded-xl cursor-pointer px-3 py-2 text-left text-sm text-[var(--color-secondary)] hover:bg-[var(--color-surface)]"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="rounded-md cursor-pointer bg-white/50 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-[var(--color-secondary)]">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" onClick={closeMobile}>
            <h1
              className={`text-xl text-[var(--color-surface)] ${lordJuusai.className}`}
            >
              Yugen
            </h1>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notifications bell */}
            {session && (
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setMobileOpen(false);
                }}
                className="relative flex size-9 items-center justify-center rounded-lg text-[var(--color-surface)]"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-[#f96e46] text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile search toggle */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                setMobileOpen(false);
                setShowNotifMenu(false);
              }}
              className="flex size-9 items-center justify-center rounded-lg text-[var(--color-surface)]"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>


            {/* Hamburger */}
            <button
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setSearchOpen(false);
                setShowNotifMenu(false);
              }}
              className="flex size-9 items-center justify-center rounded-lg text-[var(--color-surface)]"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>

        {/* Mobile notifications panel */}
        <div
          className={`overflow-hidden border-t border-[var(--color-surface)]/10 transition-all duration-300 ${
            showNotifMenu ? "max-h-80" : "max-h-0"
          }`}
        >
          <div className="bg-[var(--color-secondary)]">
            <div className="flex items-center justify-between px-4 py-3">
              <h3 className="text-sm font-semibold text-[var(--color-surface)]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs text-[var(--color-primary)] hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="overflow-y-auto max-h-60">
              {notifLoading ? (
                <div className="p-4 text-center text-xs text-[var(--color-surface)]/60">
                  Loading...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-xs text-red-400">
                  {error}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-xs text-[var(--color-surface)]/60">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-surface)]/10 ${
                      !notif.read ? "bg-[var(--color-surface)]/5" : ""
                    }`}
                  >
                    <span className="text-base shrink-0 mt-0.5">
                      {getNotifIcon(notif.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${notif.read ? "text-[var(--color-surface)]/60" : "text-[var(--color-surface)] font-medium"}`}>
                        {notif.title}
                      </p>
                      {notif.message && (
                        <p className="text-[11px] text-[var(--color-surface)]/50 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                      )}
                      <p className="text-[10px] text-[var(--color-surface)]/40 mt-1">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#f96e46] shrink-0 mt-1.5" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            searchOpen ? "max-h-16" : "max-h-0"
          }`}
        >
          <form onSubmit={handleSearch} className="px-4 pb-3">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime..."
              className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-text-secondary)]"
            />
          </form>
        </div>


        {/* Mobile nav menu */}
        <div
          className={`overflow-hidden border-t border-[var(--color-surface)]/10 transition-all duration-300 ${
            mobileOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col p-4 bg-[var(--color-secondary)]">
            <Link
              href="/explore"
              className="rounded-xl px-3 py-3 text-[var(--color-surface)] hover:bg-[var(--color-surface)]/10 transition-colors"
              onClick={closeMobile}
            >
              Explore
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-xl px-3 py-3 text-[var(--color-surface)] hover:bg-[var(--color-surface)]/10 transition-colors"
              onClick={closeMobile}
            >
              Leaderboard
            </Link>

            {session && (
              <>
                <Link
                  href="/profile"
                  className="rounded-xl px-3 py-3 text-[var(--color-surface)] hover:bg-[var(--color-surface)]/10 transition-colors"
                  onClick={closeMobile}
                >
                  Profile
                </Link>

                <Link
                  href="/library"
                  className="rounded-xl px-3 py-3 text-[var(--color-surface)] hover:bg-[var(--color-surface)]/10 transition-colors"
                  onClick={closeMobile}
                >
                  Library
                </Link>
              </>
            )}

            <div className="mt-3 pt-3 border-t border-[var(--color-surface)]/10">
              {session ? (
                <button
                  onClick={() => {
                    closeMobile();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full rounded-xl px-3 py-3 text-left text-[var(--color-surface)] hover:bg-[var(--color-surface)]/10 transition-colors"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    closeMobile();
                    signIn();
                  }}
                  className="w-full rounded-xl bg-[var(--color-primary)] px-3 py-3 text-center font-medium text-[var(--color-foreground)]"
                >
                  Login
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer so content doesn't sit behind fixed navbar */}
      <div className="h-14" />
    </>
  );
}