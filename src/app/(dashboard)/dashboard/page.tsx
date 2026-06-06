// src/app/(dashboard)/dashboard/page.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Play,
  Trophy,
  BookOpen,
  Eye,
  ChevronRight,
  Clock,
} from "lucide-react";

// Import game-icons.net SVGs
import SwordIcon from "@/assets/icons/sword.svg";
import CrownIcon from "@/assets/icons/crown.svg";
import DragonIcon from "@/assets/icons/dragon.svg";
import AchievementIcon from "@/assets/icons/achievements.svg";

// Helper component for SVG icons to ensure proper sizing
const IconWrapper = ({ icon: Icon, className, style }: { icon: React.ElementType; className?: string; style?: React.CSSProperties }) => {
  return (
    <span className="inline-flex items-center justify-center">
      <Icon className={className} style={style} />
    </span>
  );
};

interface DashboardData {
  watchingCount: number;
  completedCount: number;
  planToWatchCount: number;
  totalEpisodes: number;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streak: number;
  badges: Array<{ name: string; earnedAt: string }>;
  continueWatching: Array<{
    id: number;
    title: string;
    episode: number;
    totalEpisodes: number;
    progress: number;
    image: string;
  }>;
  recentActivity: Array<{
    action: string;
    xp: number;
    time: string;
  }>;
  topAnime: Array<{
    title: string;
    episodes: number;
    progress: number;
    image: string;
  }>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    watchingCount: 0,
    completedCount: 0,
    planToWatchCount: 0,
    totalEpisodes: 0,
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    streak: 0,
    badges: [],
    continueWatching: [],
    recentActivity: [],
    topAnime: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data from your API
    const fetchDashboardData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set demo data while developing
        setDashboardData({
          watchingCount: 3,
          completedCount: 12,
          planToWatchCount: 24,
          totalEpisodes: 1247,
          level: 7,
          currentXP: 1240,
          xpToNextLevel: 760,
          streak: 0,
          badges: [
            { name: "First Anime", earnedAt: "2024-01-15" },
            { name: "Episode Master", earnedAt: "2024-02-20" },
            { name: "Genre Explorer", earnedAt: "2024-03-10" },
            { name: "Anime Veteran", earnedAt: "2024-04-05" },
          ],
          continueWatching: [
            {
              id: 1,
              title: "Solo Leveling",
              episode: 16,
              totalEpisodes: 20,
              progress: 80,
              image: "/images/anime-char3.png",
            },
          ],
          recentActivity: [
            { action: "Completed Solo Leveling", xp: 50, time: "2 hours ago" },
            { action: "Watched 3 episodes", xp: 30, time: "Yesterday" },
            { action: "Rated 5 anime", xp: 25, time: "2 days ago" },
          ],
          topAnime: [
            { title: "Attack on Titan", episodes: 87, progress: 100, image: "/images/anime-char3.png" },
            { title: "Jujutsu Kaisen", episodes: 38, progress: 72, image: "/images/anime-char3.png" },
            { title: "Demon Slayer", episodes: 55, progress: 84, image: "/images/anime-char3.png" },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Watching",
      value: dashboardData.watchingCount,
      icon: Play,
      color: "#e5b23c",
      bgColor: "#e5b23c20",
    },
    {
      title: "Completed",
      value: dashboardData.completedCount,
      icon: Trophy,
      color: "#d8d5cc",
      bgColor: "#d8d5cc20",
    },
    {
      title: "Plan To Watch",
      value: dashboardData.planToWatchCount,
      icon: BookOpen,
      color: "#6C5CE7",
      bgColor: "#6C5CE720",
    },
    {
      title: "Episodes",
      value: dashboardData.totalEpisodes.toLocaleString(),
      icon: Eye,
      color: "#ff5b47",
      bgColor: "#ff5b4720",
    },
  ];

  const xpProgress = (dashboardData.currentXP / (dashboardData.currentXP + dashboardData.xpToNextLevel)) * 100;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="h-[400px] animate-pulse rounded-[28px] bg-[#1a1a1a]" />
          <div className="h-[400px] animate-pulse rounded-[28px] bg-[#1a1a1a]" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[120px] animate-pulse rounded-[24px] bg-[#1a1a1a]" />
          ))}
        </div>
      </div>
    );
  }

  const mostRecentAnime = dashboardData.continueWatching[0];

  return (
    <div className="space-y-6">
      {/* TOP SECTION - Continue Watching & Profile */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* CONTINUE WATCHING - Only Most Recent */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] bg-[#0A0A0A] p-5 shadow-xl border border-gray-800"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Continue Watching</h2>
            <Link
              href="/library?status=WATCHING"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>

          {!mostRecentAnime ? (
            <div className="mt-8 text-center py-8">
              <p className="text-gray-400">No anime in progress</p>
              <Link href="/explore" className="mt-2 inline-block text-[#e5b23c] hover:underline">
                Explore Anime →
              </Link>
            </div>
          ) : (
            <div className="mt-5">
              <div className="grid gap-5 md:grid-cols-[140px_1fr] items-center rounded-[22px] bg-[#1a1a1a] p-5">
                {/* IMAGE */}
                <div className="relative h-[180px] w-full overflow-hidden rounded-xl md:h-[160px] md:w-[140px]">
                  <Image
                    src={mostRecentAnime.image}
                    alt={mostRecentAnime.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{mostRecentAnime.title}</h3>
                      <p className="mt-1 text-sm text-gray-400">
                        Episode {mostRecentAnime.episode} of {mostRecentAnime.totalEpisodes}
                      </p>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5b23c] text-black transition hover:scale-105">
                      <Play className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-[#e5b23c]">{mostRecentAnime.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#e5b23c] to-[#ff5b47]"
                        style={{ width: `${mostRecentAnime.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button className="rounded-lg bg-[#e5b23c] px-4 py-2 text-sm font-medium text-black transition hover:scale-105">
                      +1 Episode
                    </button>
                    <button className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800">
                      +5 Episodes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* PROFILE / LEVEL CARD */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[28px] bg-[#0A0A0A] p-5 shadow-xl border border-gray-800"
        >
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="profile"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full border-2 border-[#e5b23c] object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#e5b23c] to-[#ff5b47] text-3xl font-bold text-black">
                {session?.user?.name?.charAt(0) ?? "?"}
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-white">
                {session?.user?.name?.split(" ")[0] ?? "Anime Fan"}
              </h2>
              <p className="mt-1 text-sm text-gray-400">Level {dashboardData.level} Otaku</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center justify-center">
                  <SwordIcon className="h-3 w-3" style={{ color: "#e5b23c" }} />
                </span>
                <span className="text-xs text-gray-500">{dashboardData.currentXP} XP</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">Level Progress</p>
              <p className="text-sm font-semibold text-white">Level {dashboardData.level}</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-[#e5b23c] to-[#ff5b47]"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {dashboardData.xpToNextLevel} XP to next level
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[18px] bg-[#1a1a1a] p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center">
                  <CrownIcon className="h-4 w-4" style={{ color: "#e5b23c" }} />
                </span>
                <span className="text-xs text-gray-500">Badges</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{dashboardData.badges.length}</p>
              <p className="text-xs text-gray-500">Unlocked</p>
            </div>
            <div className="rounded-[18px] bg-[#1a1a1a] p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center">
                  <DragonIcon className="h-4 w-4" style={{ color: "#ff5b47" }} />
                </span>
                <span className="text-xs text-gray-500">Streak</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{dashboardData.streak || 0}</p>
              <p className="text-xs text-gray-500">Days</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="rounded-[24px] bg-[#0A0A0A] p-5 shadow-xl border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="mt-2 text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: stat.bgColor }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BOTTOM GRID - Badges & Top Anime */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* BADGES */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] bg-[#0A0A0A] p-5 shadow-xl border border-gray-800"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Badges</h2>
            <Link
              href="/achievements"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>

          {dashboardData.badges.length === 0 ? (
            <div className="mt-8 text-center py-8">
              <span className="inline-flex items-center justify-center">
                <AchievementIcon className="h-12 w-12 text-gray-600" />
              </span>
              <p className="mt-2 text-gray-400">No badges earned yet</p>
              <p className="text-xs text-gray-500">Watch anime to earn badges!</p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {dashboardData.badges.slice(0, 4).map((badge, index) => (
                <div
                  key={badge.name}
                  className="flex items-center justify-between rounded-[18px] bg-[#1a1a1a] p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#e5b23c] to-[#ff5b47]">
                      <Trophy className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{badge.name}</p>
                      <p className="text-xs text-gray-500">
                        Earned {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* RECENT ACTIVITY & TOP ANIME */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Recent Activity */}
          <div className="rounded-[28px] bg-[#0A0A0A] p-5 shadow-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">
                View All
              </button>
            </div>

            {dashboardData.recentActivity.length === 0 ? (
              <div className="mt-8 text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-600" />
                <p className="mt-2 text-gray-400">No recent activity</p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {dashboardData.recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-[18px] bg-[#1a1a1a] p-3"
                  >
                    <div>
                      <p className="text-sm text-white">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <span className="text-sm font-medium text-[#e5b23c]">+{activity.xp} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Anime */}
          <div className="rounded-[28px] bg-[#0A0A0A] p-5 shadow-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Most Watched</h2>
              <Link
                href="/library"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                See All
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {dashboardData.topAnime.map((anime) => (
                <div
                  key={anime.title}
                  className="overflow-hidden rounded-[20px] bg-[#1a1a1a]"
                >
                  <div className="relative h-[140px] w-full overflow-hidden">
                    <Image
                      src={anime.image}
                      alt={anime.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-1">
                      {anime.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">{anime.episodes} episodes</p>
                    <div className="mt-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#e5b23c] to-[#ff5b47]"
                          style={{ width: `${anime.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}