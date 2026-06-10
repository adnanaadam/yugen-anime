// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { lordJuusai } from "@/fonts/fonts";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Navii } from '@usenavii/react';
export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
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

  return (
    <>
      {/* Desktop */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-center h-14 bg-[#545863]">
        {/* Grid layout: 3 equal columns so center stays centered */}
        <div className="grid grid-cols-3 items-center w-full text-[var(--color-surface)] px-8 lg:px-16">
          {/* Left: Logo */}
          <Link href="/" className="justify-self-start">
            <h1 className={`text-2xl ${lordJuusai.className}`}>Yugen</h1>
          </Link>

          {/* Center: Nav - always centered in its column */}
          <nav className="flex items-center justify-center gap-8 text-[var(--color-surface)]">
            <Link href="/explore" className="hover:underline underline-offset-4">
              Explore
            </Link>
          </nav>

          {/* Right: Search + User - always right-aligned in its column */}
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
                  <Search className="text-[var(--color-foreground)]" size={18} />
                </button>
              )}
            </div>

            {/* User */}
            {status === "loading" ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
            ) : session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="flex items-center cursor-pointer gap-2 rounded-xl border border-[var(--color-border)] bg-white px-2 py-1.5 transition-colors hover:bg-[var(--color-surface-hover)]"
                >
                  {session.user?.image ? (
                    // <Image
                    //   src={session.user.image}
                    //   alt="Avatar"
                    //   width={32}
                    //   height={32}
                    //   className="rounded-lg object-cover"
                    // />
                    <Navii seed={session.user?.email ?? ""} size={24} title={session.user?.name ?? ""} animated />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-semibold">
                      {session.user?.name?.charAt(0)}
                    </div>
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
                      {session.user?.name}
                    </p>
                    <p className="truncate text-xs text-[var(--color-text-secondary)]">
                      {session.user?.email}
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
            <h1 className={`text-xl text-[var(--color-surface)] ${lordJuusai.className}`}>
              Yugen
            </h1>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                setMobileOpen(false);
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
              }}
              className="flex size-9 items-center justify-center rounded-lg text-[var(--color-surface)]"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
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

            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl px-3 py-3 text-[var(--color-surface)] hover:bg-[var(--color-surface)]/10 transition-colors"
                  onClick={closeMobile}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="rounded-xl px-3 py-3 text-[var(--color-surface)] hover:bg-[var(--color-surface)]/10 transition-colors"
                  onClick={closeMobile}
                >
                  Profile
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