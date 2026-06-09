// src/components/home/HowItWorks.tsx
"use client";

import { lordJuusai } from "@/fonts/fonts";
import { Eye, Swords, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Watch Anime",
    description: "Track episodes as you watch. Every episode earns you XP and brings you closer to the next level.",
    icon: Eye,
    color: "#00e8fc",
  },
  {
    number: "02",
    title: "Earn XP & Badges",
    description: "Complete anime, rate shows, and hit milestones to earn badges. Show off your achievements on your profile.",
    icon: Swords,
    color: "#f9c846",
  },
  {
    number: "03",
    title: "Level Up",
    description: "Climb the ranks from Beginner to Anime Legend. Each level unlocks bragging rights and shows your dedication.",
    icon: Crown,
    color: "#f96e46",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-black">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">
            How Yugen Works
          </p>
          <h2
            className={`text-3xl md:text-5xl text-white ${lordJuusai.className}`}
          >
            Watch · Earn · Level Up
          </h2>
          <p className="mt-3 text-sm text-gray-400 max-w-md mx-auto">
            Turn your anime watching into an RPG adventure. Every episode
            counts.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-center group hover:border-white/[0.15] transition-colors duration-200"
            >
              {/* Number */}
              <span className="text-4xl font-bold text-white/5 absolute top-4 right-4">
                {step.number}
              </span>

              {/* Icon */}
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${step.color}15` }}
              >
                <step.icon
                  size={24}
                  style={{ color: step.color }}
                />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {step.description}
              </p>

              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 rounded-full bg-[#f9c846] px-6 py-3 text-sm font-medium text-black hover:bg-[#f5bd29] transition-colors"
          >
            Start Your Journey
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}