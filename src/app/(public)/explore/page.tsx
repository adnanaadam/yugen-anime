// src/app/explore/page.tsx

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVGs
import SearchIcon from "@/assets/icons/search.svg";
import CompassIcon from "@/assets/icons/compass.svg";
import StarIcon from "@/assets/icons/star.svg";
import FireIcon from "@/assets/icons/fire.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";

// Types for anime data from AniList
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
  { id: "trending", label: "Trending", icon: FireIcon, color: "#ff5b47" },
  { id: "popular", label: "Most Popular", icon: StarIcon, color: "#e5b23c" },
  { id: "seasonal", label: "Seasonal", icon: CalendarIcon, color: "#6C5CE7" },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("trending");
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Fetch anime data from AniList API
  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);

      let query = "";
      let variables = {};

      if (searchQuery && searching) {
        // Search query
        query = `
          query ($search: String) {
            Page(page: 1, perPage: 20) {
              media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
                id
                title { romaji english native }
                coverImage { large medium }
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
        variables = { search: searchQuery };
      } else {
        // Category-based query
        let sort = "TRENDING_DESC";
        if (activeCategory === "popular") sort = "POPULARITY_DESC";
        if (activeCategory === "seasonal") sort = "START_DATE_DESC";

        query = `
          query ($sort: [MediaSort]) {
            Page(page: 1, perPage: 24) {
              media(sort: $sort, type: ANIME) {
                id
                title { romaji english native }
                coverImage { large medium }
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
        variables = { sort };
      }

      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, variables }),
        });
        const data = await response.json();
        setAnimeList(data.data?.Page?.media || []);
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setLoading(false);
        setSearching(false);
      }
    };

    const debounce = setTimeout(() => {
      if (searchQuery) {
        setSearching(true);
        fetchAnime();
      } else {
        fetchAnime();
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery, activeCategory]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      setActiveCategory("");
    } else {
      setActiveCategory("trending");
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800 bg-gradient-to-b from-[#0A0A0A] to-black">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1
              className={`text-5xl uppercase md:text-7xl tracking-wider ${lordJuusai.className} text-white`}
            >
              Explore Anime
            </h1>
            <p className="mt-4 text-gray-400">
              Discover your next favorite anime
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-md">
              <div className="relative">
                <span className="absolute left-4 top-1/2 size-6 flex item-center justify-center -translate-y-1/2">
                  {" "}
                  <SearchIcon className="" />
                </span>

                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full rounded-xl border border-gray-800 bg-[#0A0A0A] py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-[#e5b23c] focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#e5b23c] to-[#ff5b47] text-black"
                      : "border border-gray-700 bg-[#0A0A0A] text-gray-400 hover:border-gray-600 hover:text-white"
                  }`}
                >
                  <span className="flex items-center justify-center size-6">
                    <Icon className="h-4 w-4" />
                  </span>

                  {category.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Anime Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] rounded-xl bg-gray-800" />
                <div className="mt-2 h-4 w-3/4 rounded bg-gray-800" />
                <div className="mt-1 h-3 w-1/2 rounded bg-gray-800" />
              </div>
            ))}
          </div>
        ) : animeList.length === 0 ? (
          <div className="py-20 text-center">
            <CompassIcon className="mx-auto size-16 text-gray-600" />
            <h3 className="mt-4 text-xl font-semibold text-white">
              No anime found
            </h3>
            <p className="mt-2 text-gray-400">Try a different search term</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          >
            <AnimatePresence>
              {animeList.map((anime, index) => (
                <motion.div
                  key={anime.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/anime/${anime.id}`}>
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={anime.coverImage.large}
                        alt={anime.title.romaji}
                        width={300}
                        height={450}
                        className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {anime.averageScore && (
                        <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-[#e5b23c]">
                          ★ {anime.averageScore / 10}
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <h3 className="line-clamp-1 text-sm font-medium text-white group-hover:text-[#e5b23c]">
                        {anime.title.english || anime.title.romaji}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        {anime.episodes && <span>{anime.episodes} eps</span>}
                        {anime.seasonYear && <span>• {anime.seasonYear}</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
