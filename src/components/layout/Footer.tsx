// src/components/layout/Footer.tsx
import Link from "next/link";
import { lordJuusai } from "@/fonts/fonts";

const footerLinks = {
  explore: [
    { label: "Trending", href: "/explore?category=trending" },
    { label: "Popular", href: "/explore?category=popular" },
    { label: "Seasonal", href: "/explore?category=seasonal" },
    { label: "Search", href: "/explore" },
  ],
  platform: [
    { label: "Profile", href: "/profile" },
    { label: "Library", href: "/library" },
    { label: "Settings", href: "/settings" },
  ],
  info: [
    { label: "About", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className={`text-2xl text-white ${lordJuusai.className}`}>
              Yugen
            </h3>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed max-w-xs">
              Track anime, earn XP, collect badges, and level up your otaku
              profile. Your anime journey, gamified.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Explore
            </p>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Platform
            </p>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Info
            </p>
            <ul className="space-y-2.5">
              {footerLinks.info.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Yugen. Not affiliated with AniList
            or MyAnimeList.
          </p>
          <p className="text-xs text-gray-600">
            Powered by{" "}
            <a
              href="https://tenrai.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#f9c846] transition-colors"
            >
              Tenrai API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
