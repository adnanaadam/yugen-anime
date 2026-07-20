// src/components/home/FAQSection.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { lordJuusai } from "@/fonts/fonts";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is OtakuProfile?",
    answer:
      "OtakuProfile is a minimalist anime tracking platform that lets you keep track of what you're watching, plan your next binge, and discover new series. It features progress tracking, gamification through badges and XP, and shareable public profiles so you can show off your anime journey.",
  },
  {
    question: "How do I track my anime?",
    answer:
      "Simply search for any anime on the Explore page, click \"Add to Library,\" and choose your status — Watching, Completed, Plan to Watch, Paused, Dropped, or Rewatching. You can update your progress episode by episode, rate shows, and see everything organized in your Library.",
  },
  {
    question: "What are badges and how do I earn them?",
    answer:
      "Badges are achievements you unlock by reaching milestones in your anime journey. Add your first anime, complete 50 episodes, build up your favorites list, and more. Each badge rewards you with XP and a unique collectible icon to display on your profile.",
  },
  {
    question: "Is my profile public by default?",
    answer:
      "Yes, your profile is public by default so others can discover your anime activity. You can change this anytime in your Settings page by toggling the \"Public Profile\" option off. When set to private, your profile page will show a locked state to visitors.",
  },
  {
    question: "Can I change my username?",
    answer:
      "Absolutely! Go to your Settings page and click the Edit button next to your username. You'll need to choose a unique name between 3-20 characters using letters, numbers, and underscores. We'll check availability in real-time before you save.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 px-4 bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />

      <div className="relative mx-auto max-w-3xl">
        {/* Section heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#f9c846]/50" />
              <span className="text-[#f9c846]/50 text-[6px]">◆</span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#7b7f89] font-semibold">
              Got Questions?
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[#f9c846]/50 text-[6px]">◆</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#f9c846]/50" />
            </div>
          </div>

          <h2
            className={`text-4xl md:text-5xl text-[#545863] ${lordJuusai.className}`}
          >
            Frequently Asked{" "}
            <span className="text-[#f9c846]">Questions</span>
          </h2>
          <p className="mt-3 text-sm text-[#7b7f89] max-w-lg mx-auto leading-relaxed">
            Everything you need to know about tracking your anime journey.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-xl border border-[#ececec] bg-[#fffdf8] overflow-hidden transition-all duration-200 hover:border-[#f9c846]/30"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-[#545863] leading-snug pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-[#7b7f89] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-4 pt-0">
                    <div className="h-px bg-[#f9c846]/20 mb-3" />
                    <p className="text-sm text-[#7b7f89] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative ornaments */}
        <div className="mt-12 flex justify-center items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#97cc04]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#f9c846]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#f96e46]" />
          <span className="h-1 w-1 rounded-full bg-[#f9c846]/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#f9c846]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#97cc04]" />
        </div>
      </div>
    </section>
  );
}