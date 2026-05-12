"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <section className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight sm:text-6xl">
            Track your anime
            <br />
            journey with{" "}
            <span className="text-purple-600 dark:text-purple-400">Yugen</span>
          </h1>
          <p className="max-w-md text-lg text-zinc-500 dark:text-zinc-400">
            Discover, track, and share your anime progress. Level up as you watch
            and connect with fellow fans.
          </p>
          <div className="flex gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-zinc-50 dark:text-zinc-900"
              >
                Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={() => signIn()}
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-zinc-50 dark:text-zinc-900"
              >
                Get Started
              </button>
            )}
            <Link
              href="/explore"
              className="rounded-full border px-6 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              Explore Anime
            </Link>
          </div>
        </section>

        <section className="mt-24 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Track Progress",
              desc: "Log episodes, score anime, and keep your watch list organized.",
            },
            {
              title: "Level Up",
              desc: "Earn XP for watching anime, unlock achievements as you go.",
            },
            {
              title: "Share & Discover",
              desc: "Create a public profile, find new anime through AniList integration.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border p-6 text-left dark:border-zinc-800"
            >
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}