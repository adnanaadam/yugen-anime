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
import DragonIcon from "@/assets/icons/dragon.svg";
import MagicIcon from "@/assets/icons/magic.svg";
import ScrollIcon from "@/assets/icons/scroll.svg";

const socialLinks = [
  { name: "Twitter", icon: TwitterIcon, href: "#", color: "#1DA1F2" },
  { name: "GitHub", icon: GithubIcon, href: "#", color: "#6e5494" },
  { name: "Discord", icon: DiscordIcon, href: "#", color: "#5865F2" },
];

export default function Footer() {
  const cardColors = ["#d8d5cc", "#e5b23c", "#ff5b47", "#6C5CE7"];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t" style={{ borderColor: "var(--glass-border)" }}>
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div 
          className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full blur-3xl"
          style={{ backgroundColor: `${cardColors[1]}05` }}
        />
        <div 
          className="absolute top-20 right-0 h-[200px] w-[200px] rounded-full blur-3xl"
          style={{ backgroundColor: `${cardColors[2]}05` }}
        />
      </div>

      {/* Animated floating icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[5%] top-[20%] opacity-10"
        >
          <SwordIcon className="h-16 w-16" style={{ color: cardColors[1] }} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute right-[8%] bottom-[30%] opacity-10"
        >
          <DragonIcon className="h-20 w-20" style={{ color: cardColors[2] }} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute left-[15%] bottom-[10%] opacity-10"
        >
          <MagicIcon className="h-12 w-12" style={{ color: cardColors[3] }} />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Simple footer content - single row on desktop */}
        <div className="flex flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
          {/* Brand */}
          <Link href="/" className="group inline-flex items-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
              <ScrollIcon className="h-6 w-6" style={{ color: cardColors[1] }} />
            </div>
            <h2 
              className={`text-xl font-bold tracking-wide ${lordJuusai.className}`}
              style={{ color: "var(--color-foreground)" }}
            >
              Yugen
            </h2>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="#features"
              className="text-sm transition-all duration-300 hover:translate-x-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Features
            </Link>
            <Link
              href="/explore"
              className="text-sm transition-all duration-300 hover:translate-x-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              className="text-sm transition-all duration-300 hover:translate-x-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="text-sm transition-all duration-300 hover:translate-x-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Pricing
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
          style={{ borderColor: "var(--glass-border)" }}
        >
          <div className="flex items-center gap-2">
            <SwordIcon className="h-3 w-3" style={{ color: cardColors[1] }} />
            <p 
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              &copy; {currentYear} Yugen Anime. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/privacy" 
              className="text-xs transition-all duration-300 hover:translate-x-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-xs transition-all duration-300 hover:translate-x-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Terms
            </Link>
            {/* <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 animate-pulse" style={{ color: cardColors[2] }} />
              <span 
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Made with anime love
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}