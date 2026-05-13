"use client";

import { motion } from "framer-motion";
import { ListTodo, User, Trophy, Compass } from "lucide-react";

const features = [
  {
    icon: ListTodo,
    title: "Track Anime",
    desc: "Organize anime into watching, completed, paused, dropped, and plan-to-watch lists.",
    gradient: "from-indigo-500/20 to-indigo-600/10",
    iconColor: "text-indigo-400",
  },
  {
    icon: User,
    title: "Build Your Profile",
    desc: "Create your anime identity with stats, favorites, and personalized tracking.",
    gradient: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-400",
  },
  {
    icon: Trophy,
    title: "Earn XP & Badges",
    desc: "Level up your anime journey with streaks, XP, and achievements.",
    gradient: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-400",
  },
  {
    icon: Compass,
    title: "Discover Anime",
    desc: "Explore trending and seasonal anime curated for modern anime fans.",
    gradient: "from-cyan-500/20 to-cyan-600/10",
    iconColor: "text-cyan-400",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-3 text-zinc-400">
            A complete toolkit for the modern anime fan.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className={`group rounded-xl border border-white/5 bg-gradient-to-b ${feature.gradient} p-6 transition-all hover:border-white/10`}
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ${feature.iconColor}`}
              >
                <feature.icon size={20} />
              </div>
              <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}