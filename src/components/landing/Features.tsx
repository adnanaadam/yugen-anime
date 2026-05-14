"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ListTodo,
  User,
  Trophy,
} from "lucide-react";
import Image from "next/image";

const cards = [
  {
    title: "Track Anime",
    subtitle: "watch progress",
    level: "Level 15",
    bg: "#d8d5cc",
    circle: "#c8c5bc",
    icon: ListTodo,
    image: "/images/anime-char1.png",
  },
  {
    title: "Build Profile",
    subtitle: "anime identity",
    level: "Level 17",
    bg: "#e5b23c",
    circle: "#111111",
    icon: User,
    image: "/images/anime-char2.png",
  },
  {
    title: "Earn XP",
    subtitle: "level system",
    level: "Level 25",
    bg: "#ff5b47",
    circle: "#f3f3f3",
    icon: Trophy,
    image: "/images/anime-char3.png",
  },
];

export default function Features() {
  return (
    <section className="relative overflow-hidden px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* heading */}
        <div className="mb-20 text-center">
          <p
            className="mb-3 text-sm uppercase tracking-[0.3em]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Features
          </p>

          <h2
            className="text-5xl font-black uppercase md:text-7xl"
            style={{ color: "var(--color-foreground)" }}
          >
            Anime
            <br />
            Experience
          </h2>
        </div>

        {/* cards */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
              }}
              whileHover={{
                y: -10,
                rotate: i === 1 ? 0 : i % 2 === 0 ? -1 : 1,
              }}
              className="group"
            >
              <div
                className="relative h-[650px] w-[340px] overflow-hidden rounded-[2.5rem] p-5 shadow-2xl"
                style={{
                  background: card.bg,
                }}
              >
                {/* top */}
                <div className="flex items-center justify-between">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 backdrop-blur-xl">
                    <ArrowLeft size={18} color="#111" />
                  </button>

                  <div className="text-right">
                    <p className="text-xs font-semibold text-black">
                      My profile
                    </p>
                    <p className="text-[10px] text-black/50">Store</p>
                  </div>
                </div>

                {/* character area */}
                <div className="relative mt-4 flex justify-center">
                  {/* circle */}
                  <div
                    className="absolute top-6 h-[260px] w-[260px] rounded-full"
                    style={{
                      background: card.circle,
                    }}
                  />

                  {/* character */}
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={320}
                    height={420}
                    className="relative z-10 h-[360px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* small dots */}
                <div className="mt-2 flex items-center gap-2 px-2">
                  <div className="h-2 w-2 rounded-full bg-black" />
                  <div className="h-2 w-2 rounded-full bg-black/30" />
                </div>

                {/* content */}
                <div className="mt-5 px-2">
                  <p className="text-xs text-black/60">{card.level}</p>

                  <h3 className="mt-2 text-5xl font-black leading-none tracking-tight text-black">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-3xl font-light leading-none text-black/75">
                    {card.subtitle}
                  </p>

                  {/* divider */}
                  <div className="mt-6 h-[1px] w-28 bg-black/40" />

                  {/* update */}
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-black/50">Update</p>

                      <div className="mt-4">
                        <p className="text-xs text-black/50">Team</p>

                        <h4 className="text-lg font-bold text-black">
                          Yugen
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="mb-3 text-xs text-black/50">
                        All team
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/40">
                          <Image
                            src="/images/anime-avatar1.jpg"
                            alt=""
                            width={50}
                            height={50}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/40">
                          <Image
                            src="/images/anime-avatar2.jpg"
                            alt=""
                            width={50}
                            height={50}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/40">
                          <Image
                            src="/images/anime-avatar3.jpg"
                            alt=""
                            width={50}
                            height={50}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* bottom button */}
                <div className="absolute bottom-5 left-5 right-5">
                  <button className="flex h-16 w-full items-center justify-between rounded-2xl bg-[#111111] px-5 text-white transition-all duration-300 group-hover:scale-[1.02]">
                    <span className="text-sm">
                      Explore feature
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2c94c]">
                      <ArrowUpRight size={18} color="#000" />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}