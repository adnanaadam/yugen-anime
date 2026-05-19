"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Play, Check } from "lucide-react";

import { lordJuusai } from "@/fonts/fonts";

import CompassIcon from "@/assets/icons/compass.svg";
import StarIcon from "@/assets/icons/star.svg";
import FireIcon from "@/assets/icons/fire.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";

interface Anime {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native?: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  bannerImage?: string;
  description?: string;
  episodes?: number;
  status?: string;
  averageScore?: number;
  popularity?: number;
  genres?: string[];
  seasonYear?: number;
}

const categories = [
  {
    id: "trending",
    label: "Trending",
    icon: FireIcon,
    color: "[#ff5b47]",
  },
  {
    id: "popular",
    label: "Popular",
    icon: StarIcon,
    color: "[#e5b23c]",
  },
  {
    id: "seasonal",
    label: "Seasonal",
    icon: CalendarIcon,
    color: "[#9810fa]",
  },
];

const CATEGORY_SORT: Record<string, string> = {
  trending: "TRENDING_DESC",
  popular: "POPULARITY_DESC",
  seasonal: "START_DATE_DESC",
};

const SEARCH_QUERY = `
  query ($search: String) {
    Page(page: 1, perPage: 24) {
      media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        episodes
        status
        averageScore
        popularity
        genres
        seasonYear
      }
    }
  }
`;

const CATEGORY_QUERY = `
  query ($sort: [MediaSort]) {
    Page(page: 1, perPage: 24) {
      media(sort: $sort, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        episodes
        status
        averageScore
        popularity
        genres
        seasonYear
      }
    }
  }
`;

async function fetchAnimeData({
  searchQuery,
  activeCategory,
}: {
  searchQuery: string;
  activeCategory: string;
}) {
  const isSearching = Boolean(searchQuery.trim());

  const query = isSearching ? SEARCH_QUERY : CATEGORY_QUERY;

  const variables = isSearching
    ? { search: searchQuery }
    : {
        sort: CATEGORY_SORT[activeCategory],
      };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const data = await response.json();

  return data?.data?.Page?.media || [];
}

function AnimeCard({ anime, index }: { anime: Anime; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [actionStatus, setActionStatus] = useState<"idle" | "plan" | "watching">("idle");

  const handleQuickAction = (e: React.MouseEvent, action: "plan" | "watching") => {
    e.preventDefault();
    e.stopPropagation();
    setActionStatus(action);
    // Here you would call your API to add to user's list
    console.log(`Added ${anime.title.romaji} to ${action}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.25) }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <div className="relative">
        {/* Card Image */}
        <Link href={`/anime/${anime.id}`}>
          <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A]">
            <Image
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              width={300}
              height={450}
              className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Score Badge */}
            {anime.averageScore && (
              <div className="absolute left-3 top-3 z-10 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-[#e5b23c] backdrop-blur-sm">
                ★ {(anime.averageScore / 10).toFixed(1)}
              </div>
            )}

            {/* Hover Overlay with Details */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent p-4"
                >
                  <h3 className="text-sm font-bold text-white line-clamp-2">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {anime.genres?.slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 text-xs text-gray-400">
                    {anime.episodes && <span>{anime.episodes} episodes</span>}
                    {anime.seasonYear && <span> • {anime.seasonYear}</span>}
                  </div>

                  {anime.description && (
                    <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-gray-300">
                      {anime.description.replace(/<[^>]*>/g, "").slice(0, 100)}...
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        {/* Quick Action Button */}
        <div className="absolute bottom-3 right-3 z-30">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              if (actionStatus === "idle") {
                handleQuickAction(e, "plan");
              }
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-all ${
              actionStatus === "plan"
                ? "bg-[#e5b23c] text-black"
                : actionStatus === "watching"
                ? "bg-[#ff5b47] text-white"
                : "bg-black/70 text-white backdrop-blur-sm hover:bg-[#e5b23c] hover:text-black"
            }`}
          >
            {actionStatus === "plan" ? (
              <Check className="h-4 w-4" />
            ) : actionStatus === "watching" ? (
              <Play className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Title under the card */}
      <Link href={`/anime/${anime.id}`}>
        <div className="mt-2">
          <h3 className="line-clamp-1 text-sm font-medium text-white transition-colors hover:text-[#e5b23c]">
            {anime.title.english || anime.title.romaji}
          </h3>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
            {anime.episodes && <span>{anime.episodes} eps</span>}
            {anime.seasonYear && <span>• {anime.seasonYear}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("trending");
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCategoryData = useMemo(() => {
    return (
      categories.find((category) => category.id === activeCategory) ||
      categories[0]
    );
  }, [activeCategory]);

  useEffect(() => {
    const debounce = setTimeout(async () => {
      try {
        setLoading(true);

        const data = await fetchAnimeData({
          searchQuery,
          activeCategory,
        });

        setAnimeList(data);
      } catch (error) {
        console.error("Failed to fetch anime", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden border-b border-white/10">
        <div
          className={`absolute inset-0 bg-${activeCategoryData.color} opacity-20`}
        />

        <div className="absolute inset-0">
          <Image
            src="/images/kakashi.png"
            alt="Anime background"
            fill
            priority
            className="object-cover opacity-35"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1
              className={`text-5xl uppercase tracking-wider text-white md:text-7xl ${lordJuusai.className}`}
            >
              Explore Anime
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
              Discover trending series, seasonal releases, hidden gems, and your
              next obsession.
            </p>

            <div className="mx-auto mt-8 max-w-2xl">
              <div className="relative overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-xl transition-all focus-within:border-[#e5b23c]/40 focus-within:bg-white/[0.07]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-5">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  type="text"
                  placeholder="Search anime titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 w-full bg-transparent pl-14 pr-6 text-sm text-white outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;

                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`relative overflow-hidden cursor-pointer rounded-full border px-5 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? `border-transparent bg-${category.color} text-black`
                        : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="flex items-center justify-center size-5">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{category.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Anime Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : activeCategoryData.label}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {animeList.length} anime discovered
            </p>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300 md:flex">
            Updated live
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[2/3] rounded-2xl bg-white/5" />
                <div className="mt-2 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-white/5" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : animeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] py-24 text-center">
            <CompassIcon className="h-16 w-16 text-gray-600" />

            <h3 className="mt-6 text-2xl font-semibold text-white">
              No anime found
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Try another title or category.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            <AnimatePresence>
              {animeList.map((anime, index) => (
                <AnimeCard key={anime.id} anime={anime} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}