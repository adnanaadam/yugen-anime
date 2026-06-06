"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVGs for social icons
import TwitterIcon from "@/assets/icons/twitter.svg";
import GithubIcon from "@/assets/icons/github.svg";
import DiscordIcon from "@/assets/icons/discord.svg";

// Import decorative game icons
import SwordIcon from "@/assets/icons/sword.svg";
import ScrollIcon from "@/assets/icons/scroll.svg";

const socialLinks = [
  { name: "Twitter", icon: TwitterIcon, href: "https://twitter.com/yourusername", color: "#1DA1F2" },
  { name: "GitHub", icon: GithubIcon, href: "https://github.com/yourusername", color: "#6e5494" },
  { name: "Discord", icon: DiscordIcon, href: "https://discord.gg/yourserver", color: "#5865F2" },
];

export default function Footer() {
  const cardColors = [
    "var(--color-charcoal-200)",
    "var(--color-tuscan-sun-500)",
    "var(--color-burnt-peach-500)",
    "var(--color-electric-aqua-600)",
  ];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Simple footer content - single row on desktop */}
        <div className="flex flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
          {/* Brand */}
          <Link href="/" className="group inline-flex items-center gap-2">
            <h2 
              className={`text-4xl tracking-widest ${lordJuusai.className}`}
              style={{ color: "#FFFFFF" }}
            >
              Yugen
            </h2>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="#features"
              className="text-sm transition-all duration-300 hover:text-white text-charcoal-400"
            >
              Features
            </Link>
            <Link
              href="/explore"
              className="text-sm transition-all duration-300 hover:text-white text-charcoal-400"
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              className="text-sm transition-all duration-300 hover:text-white text-charcoal-400"
            >
              Dashboard
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: `${social.color}15`,
                  color: social.color,
                  border: `1px solid ${social.color}30`,
                }}
                aria-label={social.name}
              >
                <social.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div 
          className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: "var(--color-charcoal-700)" }}
        >
          <div className="flex items-center gap-2">
            <SwordIcon className="h-3 w-3" style={{ color: cardColors[1] }} />
            <p className="text-xs text-charcoal-500">
              &copy; {currentYear} Yugen Anime. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/privacy" 
              className="text-xs text-charcoal-500 transition-all duration-300 hover:text-charcoal-300"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-xs text-charcoal-500 transition-all duration-300 hover:text-charcoal-300"
            >
              Terms
            </Link>
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com/addy_devx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-charcoal-500 transition-all duration-300 hover:text-charcoal-300"
              >
                Made by @addy_devx 
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}