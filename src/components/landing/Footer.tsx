import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400">✦</span>
            <span className="text-sm font-bold text-white">Yugen Anime</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Features
            </Link>
            <Link
              href="/explore"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Explore
            </Link>
            <Link
              href="/signin"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Sign In
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-400"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-400"
              aria-label="Twitter"
            >
              Twitter
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-zinc-700 sm:text-left">
          &copy; {new Date().getFullYear()} Yugen Anime. All rights reserved.
        </div>
      </div>
    </footer>
  );
}