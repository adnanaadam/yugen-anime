"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { lordJuusai } from "@/fonts/fonts";
import { useState, useEffect } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const isLandingPage = pathname === "/";

  const getNavbarBg = () => {
    if (scrolled || !isLandingPage) {
      return "bg-white/95 backdrop-blur-sm border-b border-gray-200";
    }
    return "bg-transparent";
  };

  const getNavbarTextColor = () => {
    return "text-gray-900";
  };

  const getNavbarLinkColor = (isActive: boolean) => {
    if (isActive) return "text-tuscan-sun-500";
    return "text-gray-600 hover:text-gray-900";
  };

  return (
    <>
      <header
        className={`hidden md:block fixed top-0 z-50 w-full transition-all duration-300 ${getNavbarBg()}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <h1
              className={`text-2xl tracking-wide ${lordJuusai.className} ${getNavbarTextColor()}`}
            >
              Yugen
            </h1>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/explore"
              className={`text-sm font-medium transition-colors ${getNavbarLinkColor(pathname === "/explore")}`}
            >
              Explore
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1.5 transition-all hover:bg-gray-50"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="avatar"
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white"
                      style={{
                        background: `linear-gradient(135deg, var(--card-bg-1), var(--card-bg-2))`,
                      }}
                    >
                      {session.user?.name?.charAt(0) ?? "?"}
                    </div>
                  )}
                  <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                    >
                      <div className="border-b border-gray-100 p-3">
                        <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-xs truncate text-gray-500">{session.user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={() => { signOut({ callbackUrl: "/" }); setShowUserMenu(false); }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-burnt-peach-500 transition-colors hover:bg-orange-50"
                        >
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex h-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 transition-all hover:bg-gray-50"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </header>

      <header
        className={`md:hidden fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled || !isLandingPage
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200"
            : "bg-transparent"
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <h1
              className={`text-xl tracking-wide ${lordJuusai.className} ${getNavbarTextColor()}`}
            >
              Yugen
            </h1>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
              <Link
                href="/explore"
                onClick={() => setMobileOpen(false)}
                className="flex w-full max-w-xs items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg font-medium text-gray-900 transition-all hover:scale-105"
              >
                Explore
              </Link>

              <form onSubmit={handleSearch} className="w-full max-w-xs">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-3">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>
              </form>

              <hr className="w-32 border-gray-200" />

              {status === "loading" ? (
                <div className="h-12 w-32 animate-pulse rounded-full bg-gray-200" />
              ) : session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-tuscan-sun-500 px-6 py-3 text-lg font-medium text-black transition-all hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                    className="flex w-full max-w-xs items-center justify-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-6 py-3 text-lg font-medium text-burnt-peach-500 transition-all hover:scale-105"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); signIn(); }}
                  className="flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-tuscan-sun-500 px-6 py-3 text-lg font-medium text-black transition-all hover:scale-105"
                >
                  Log in
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16 md:h-14" />
    </>
  );
}