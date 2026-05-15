"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Info, ListChecks, Menu, Telescope, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Features", href: "#features", icon: ListChecks },
  { label: "Explore", href: "/explore", icon: Telescope },
  { label: "About", href: "#about", icon: Info },
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
      {/* Desktop nav — vertical side panel */}
      <nav
        className={`hidden items-center gap-3 md:flex fixed top-2/5 -translate-y-1/2 z-30 flex-col transition-all duration-300 ${
          scrolled
            ? "rounded-full left-4 p-2"
            : "left-18"
        }`}
        style={{
          backgroundColor: scrolled ? "var(--surface)" : "transparent",
          border: scrolled ? "1px solid var(--border)" : "none",
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex size-12 items-center justify-center rounded-full shadow-sm transition-transform hover:scale-110"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            title={link.label}
          >
            <link.icon className="size-5" style={{ color: "var(--color-foreground)" }} />
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 right-4 z-50 flex size-12 items-center justify-center rounded-full shadow-md md:hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={22} style={{ color: "var(--color-foreground)" }} /> : <Menu size={22} style={{ color: "var(--color-foreground)" }} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ backgroundColor: "var(--color-background)" }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-6 py-4 shadow-sm"
                  style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <link.icon className="size-6" style={{ color: "var(--color-foreground)" }} />
                  <span className="text-lg font-medium" style={{ color: "var(--color-foreground)" }}>
                    {link.label}
                  </span>
                </Link>
              ))}

              <hr className="w-32" style={{ borderColor: "var(--border)" }} />

              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-full px-6 py-3 text-lg font-medium"
                  style={{ backgroundColor: "var(--color-accent)", color: "#000" }}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); signIn(); }}
                  className="flex items-center gap-3 rounded-full px-6 py-3 text-lg font-medium"
                  style={{ backgroundColor: "var(--color-accent)", color: "#000" }}
                >
                  Log in
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}