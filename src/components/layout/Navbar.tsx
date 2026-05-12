"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Yugen
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/explore"
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Explore
          </Link>

          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ) : session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium dark:bg-zinc-800">
                  {session.user?.name?.charAt(0) ?? "?"}
                </div>
              )}
              Dashboard
            </Link>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-zinc-50 dark:text-zinc-900"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}