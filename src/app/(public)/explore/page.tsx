// src/app/(public)/explore/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Plus,
  Play,
  BookMarked,
  ArrowUp,
  Info,
} from "lucide-react";

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

interface PageInfo {
  hasNextPage: boolean;
  total: number;
  currentPage: number;
  lastPage: number;
}

const categories = [
  {
    id: "trending",
    label: "Trending",
    icon: FireIcon,
    color: "#ff5b47",
    endpoint: "trending",
  },
  {
    id: "popular",
    label: "Popular",
    icon: StarIcon,
    color: "#e5b23c",
    endpoint: "popular",
  },
  {
    id: "seasonal",
    label: "Seasonal",
    icon: CalendarIcon,
    color: "#9810fa",
    endpoint: "seasonal",
  },
];

// Helper function to transform Jikan response to our Anime interface
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformJikanToAnime(jikanAnime: any): Anime {
  return {
    id: jikanAnime.mal_id,
    title: {
      romaji: jikanAnime.title,
      english: jikanAnime.title_english,
      native: jikanAnime.title_japanese,
    },
    coverImage: {
      large: jikanAnime.images.jpg.large_image_url,
      medium: jikanAnime.images.jpg.image_url,
    },
    bannerImage: jikanAnime.images.jpg.large_image_url,
    description: jikanAnime.synopsis,
    episodes: jikanAnime.episodes,
    status: jikanAnime.status,
    averageScore: jikanAnime.score ? jikanAnime.score * 10 : undefined,
    popularity: jikanAnime.popularity,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genres: jikanAnime.genres?.map((g: any) => g.name) || [],
    seasonYear: jikanAnime.year,
  };
}

async function fetchAnimeData({
  searchQuery,
  activeCategory,
  page = 1,
  perPage = 24,
}: {
  searchQuery: string;
  activeCategory: string;
  page?: number;
  perPage?: number;
}) {
  const isSearching = Boolean(searchQuery.trim());

  // Rate limiting for Jikan API (max 3 requests per second)
  await new Promise(resolve => setTimeout(resolve, 350));

  try {
    if (isSearching) {
      // Search endpoint
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${perPage}&order_by=popularity&sort=desc`
      );
      const data = await response.json();
      
      return {
        media: data.data?.map(transformJikanToAnime) || [],
        pageInfo: {
          hasNextPage: !!data.pagination?.has_next_page,
          total: data.pagination?.items?.total || 0,
          currentPage: data.pagination?.current_page || page,
          lastPage: data.pagination?.last_visible_page || page,
        },
      };
    } else {
      // Category-based endpoint
      let url = "";
      switch (activeCategory) {
        case "trending":
          url = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${perPage}&filter=airing`;
          break;
        case "popular":
          url = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${perPage}&filter=bypopularity`;
          break;
        case "seasonal":
          // Get current season
          const now = new Date();
          const year = now.getFullYear();
          const season = getCurrentSeason();
          url = `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}&limit=${perPage}`;
          break;
        default:
          url = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${perPage}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        media: data.data?.map(transformJikanToAnime) || [],
        pageInfo: {
          hasNextPage: !!data.pagination?.has_next_page,
          total: data.pagination?.items?.total || 0,
          currentPage: data.pagination?.current_page || page,
          lastPage: data.pagination?.last_visible_page || page,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching from Jikan API:", error);
    return {
      media: [],
      pageInfo: { hasNextPage: false, total: 0, currentPage: 1, lastPage: 1 },
    };
  }
}

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 0 && month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "fall";
}

function AnimeCard({ anime, index }: { anime: Anime; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [actionStatus, setActionStatus] = useState<"idle" | "plan" | "watching">("idle");

  const handleQuickAction = (e: React.MouseEvent, action: "plan" | "watching") => {
    e.preventDefault();
    e.stopPropagation();
    setActionStatus(action);
    setShowDropdown(false);
    console.log(`Added ${anime.title.romaji} to ${action}`);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (actionStatus === "idle") {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.25) }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <div className="relative">
        <Link href={`/anime/${anime.id}`}>
          <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A]">
            <Image
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              width={300}
              height={450}
              className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {anime.averageScore && (
              <div className="absolute left-3 top-3 z-10 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-[#e5b23c] backdrop-blur-sm">
                ★ {(anime.averageScore / 10).toFixed(1)}
              </div>
            )}

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
                      {anime.description.slice(0, 100)}...
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        <div className="absolute bottom-3 right-3 z-30">
          {actionStatus === "idle" ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDropdown}
                className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-full bg-black/70 text-white backdrop-blur-sm shadow-lg transition-all hover:bg-[#e5b23c] hover:text-black"
              >
                <Plus className="h-4 w-4" />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className="absolute bottom-full text-nowrap right-0 mb-2 overflow-hidden rounded-xl border border-white/10 bg-black/95 backdrop-blur-md shadow-xl"
                  >
                    <button
                      onClick={(e) => handleQuickAction(e, "plan")}
                      className="flex w-full items-center cursor-pointer gap-2 px-4 py-2 text-xs text-white transition-colors hover:bg-white/10"
                    >
                      <BookMarked className="h-3.5 w-3.5 text-[#6C5CE7]" />
                      <span>Plan to Watch</span>
                    </button>
                    <button
                      onClick={(e) => handleQuickAction(e, "watching")}
                      className="flex w-full items-center cursor-pointer gap-2 px-4 py-2 text-xs text-white transition-colors hover:bg-white/10"
                    >
                      <Play className="h-3.5 w-3.5 text-[#e5b23c]" />
                      <span>Watching</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex h-8 w-8 items-center justify-center rounded-full shadow-lg ${
                actionStatus === "plan"
                  ? "bg-[#6C5CE7] text-white"
                  : "bg-[#e5b23c] text-black"
              }`}
            >
              {actionStatus === "plan" ? (
                <BookMarked className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </motion.div>
          )}
        </div>
      </div>

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    hasNextPage: false,
    total: 0,
    currentPage: 1,
    lastPage: 1,
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showStickyInfo, setShowStickyInfo] = useState(false);

  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  const [prevActiveCategory, setPrevActiveCategory] = useState(activeCategory);

  const activeCategoryData = useMemo(() => {
    return categories.find((c) => c.id === activeCategory) || categories[0];
  }, [activeCategory]);

  // Reset pagination when search or category changes
  if (searchQuery !== prevSearchQuery || activeCategory !== prevActiveCategory) {
    setPrevSearchQuery(searchQuery);
    setPrevActiveCategory(activeCategory);
    setPage(1);
    setAnimeList([]);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const { media, pageInfo: newPageInfo } = await fetchAnimeData({
          searchQuery,
          activeCategory,
          page,
        });

        if (page === 1) {
          setAnimeList(media);
        } else {
          setAnimeList((prev) => [...prev, ...media]);
        }

        setPageInfo(newPageInfo);
      } catch (error) {
        console.error("Failed to fetch anime", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    const debounce = setTimeout(fetchData, 400);
    return () => clearTimeout(debounce);
  }, [searchQuery, activeCategory, page]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
      setShowStickyInfo(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoadMore = () => {
    if (pageInfo.hasNextPage && !loadingMore) {
      setPage((prev) => prev + 1);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundColor: activeCategoryData.color }}
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
                        ? "border-transparent text-white"
                        : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    }`}
                    style={{
                      backgroundColor: isActive ? category.color : "transparent",
                    }}
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

      {/* Sticky Page Info */}
      <AnimatePresence>
        {showStickyInfo && !loading && animeList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-40"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/80 backdrop-blur-md px-4 py-2 shadow-lg">
              <Info className="h-3.5 w-3.5 text-[#e5b23c]" />
              <span className="text-xs text-gray-300">
                Page {pageInfo.currentPage} of {pageInfo.lastPage}
              </span>
              <div className="h-3 w-px bg-white/20" />
              <span className="text-xs text-gray-400">
                {pageInfo.total} total
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {pageInfo.total || animeList.length} anime discovered
            </p>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300 md:flex">
            Page {pageInfo.currentPage} of {pageInfo.lastPage}
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
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              <AnimatePresence>
                {animeList.map((anime, index) => (
                  <AnimeCard key={`${anime.id}-${index}`} anime={anime} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {pageInfo.hasNextPage && (
              <div className="mt-12 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Load More
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 cursor-pointer flex h-12 w-12 items-center justify-center rounded-full bg-[#e5b23c] text-black shadow-lg transition-all hover:shadow-xl"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}