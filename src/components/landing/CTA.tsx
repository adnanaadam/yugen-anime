"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {
  const { data: session } = useSession();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-4 text-center sm:px-6"
      >
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Start Building Your Anime Journey Today
        </h2>
        <p className="mt-4 text-zinc-400">
          Track anime, earn achievements, and discover your next favorite series.
        </p>

        <div className="mt-8">
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-500"
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </Link>
          ) : (
            <button
              onClick={() => signIn()}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-500"
            >
              Get Started
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}