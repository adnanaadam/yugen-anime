// src/components/home/CTASection.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { lordJuusai } from "@/fonts/fonts";

export default function CTASection() {
  const { data: session } = useSession();

  return (
    <section className="py-24 px-4 bg-black">
      <div className="mx-auto max-w-2xl text-center">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-10 md:p-14">
          <h2
            className={`text-2xl md:text-4xl text-white ${lordJuusai.className}`}
          >
            Ready to Begin Your Journey?
          </h2>
          <p className="mt-3 text-sm text-gray-400 max-w-sm mx-auto">
            {session
              ? "Head to your dashboard to track anime and earn badges."
              : "Track your first anime, earn your first badge, and reach Level 2 today."}
          </p>

          <div className="mt-8">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#f9c846] px-7 py-3.5 text-sm font-medium text-black hover:bg-[#f5bd29] transition-colors"
              >
                Go to Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 rounded-full bg-[#f9c846] px-7 py-3.5 text-sm font-medium text-black hover:bg-[#f5bd29] transition-colors"
              >
                Start Tracking
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {!session && (
            <p className="mt-4 text-[11px] text-gray-600">
              Free forever · No credit card required
            </p>
          )}
        </div>
      </div>
    </section>
  );
}