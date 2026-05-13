"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Bookmark, Search, Bell, ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features", icon: Home },
  { label: "Explore", href: "/explore", icon: Search },
  { label: "About", href: "#about", icon: Bookmark },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop nav */}
      <nav className={`hidden items-center text-black gap-4 md:flex fixed top-2/5 -translate-y-1/2 z-30 flex-col ${scrolled ? "bg-white/80 p-4 rounded-full left-6" : "left-16"} transition-all`}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex size-14 items-center justify-center rounded-full bg-white"
          >
            <link.icon className="size-5" />
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger */}
      {/* <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-zinc-400 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button> */}

      {/* Mobile menu */}
      {/* <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/5 bg-[#0a0a0a] md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-white/5" />
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-white"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); signIn(); }}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); signIn(); }}
                    className="mt-2 w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  );
}
