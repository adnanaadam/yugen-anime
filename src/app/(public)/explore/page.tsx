// src/app/(public)/explore/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  ArrowUp,
  Loader2,
  Star,
  Tv,
  ChevronDown,
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { addToAnimeList, updateProgress } from "@/features/tracking/api";
import { handleFeedback, extractFeedback } from "@/lib/feedback-helper";
import { lordJuusai } from "@/fonts/fonts";
import UpdateProgressModal from "@/components/anime/UpdateProgressModal";
import type { TransformedAnime } from "@/services/jikan.service";

const categories = [
  { id: "trending", label: "Trending" },
  { id: "popular", label: "Popular" },
  { id: "seasonal", label: "Seasonal" },
];

const statusColors: Record<string, string> = {
  WATCHING: "#00e8fc",
  COMPLETED: "#97cc04",
  PLAN_TO_WATCH: "#f9c846",
  PAUSED: "#f96e46",
  DROPPED: "#ff4444",
  REWATCHING: "#c084fc",
};

// 18+ genre identifiers to filter client-side
const adultGenres = ["Hentai", "Erotica"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformJikanToAnime(jikanAnime: any): TransformedAnime {
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
      small: jikanAnime.images.jpg.small_image_url,
    },
    bannerImage: jikanAnime.images.jpg.large_image_url,
    description: jikanAnime.synopsis,
    episodes: jikanAnime.episodes,
    status: jikanAnime.status,
    averageScore: jikanAnime.score ? jikanAnime.score * 10 : null,
    popularity: jikanAnime.popularity,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genres: jikanAnime.genres?.map((g: any) => g.name) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    studios: jikanAnime.studios?.map((s: any) => s.name) || [],
    seasonYear: jikanAnime.year,
    season: jikanAnime.season,
    type: jikanAnime.type,
    format: jikanAnime.type,
    duration: jikanAnime.duration,
    trailer: jikanAnime.trailer?.youtube_id
      ? { id: jikanAnime.trailer.youtube_id, site: "youtube" }
      : null,
  };
}

async function fetchAnimeData({
  searchQuery,
  activeCategory,
  page = 1,
  perPage = 25,
  sfw = true,
}: {
  searchQuery: string;
  activeCategory: string;
  page?: number;
  perPage?: number;
  sfw?: boolean;
}) {
  try {
    if (searchQuery.trim()) {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${perPage}&order_by=popularity&sort=desc&sfw=${sfw}`,
      );
      const data = await response.json();
      let media = data.data?.map(transformJikanToAnime) || [];
      // Client-side filter for 18+ genres
      if (sfw) {
        media = media.filter(
          (anime: TransformedAnime) =>
            !anime.genres?.some((g) => adultGenres.includes(g)),
        );
      }
      return {
        media: media,
        pageInfo: {
          hasNextPage: !!data.pagination?.has_next_page,
          total: data.pagination?.items?.total || 0,
          currentPage: data.pagination?.current_page || page,
          lastPage: data.pagination?.last_visible_page || page,
        },
      };
    }

    let url = "";
    switch (activeCategory) {
      case "trending":
        url = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${perPage}&filter=airing&sfw=${sfw}`;
        break;
      case "popular":
        url = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${perPage}&filter=bypopularity&sfw=${sfw}`;
        break;
      case "seasonal": {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        let season = "winter";
        if (month >= 3 && month <= 5) season = "spring";
        else if (month >= 6 && month <= 8) season = "summer";
        else if (month >= 9 && month <= 11) season = "fall";
        url = `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}&limit=${perPage}&sfw=${sfw}`;
        break;
      }
      default:
        url = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${perPage}&sfw=${sfw}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    let media = data.data?.map(transformJikanToAnime) || [];
    // Client-side filter for 18+ genres
    if (sfw) {
      media = media.filter(
        (anime: TransformedAnime) =>
          !anime.genres?.some((g) => adultGenres.includes(g)),
      );
    }
    return {
      media: media,
      pageInfo: {
        hasNextPage: !!data.pagination?.has_next_page,
        total: data.pagination?.items?.total || 0,
        currentPage: data.pagination?.current_page || page,
        lastPage: data.pagination?.last_visible_page || page,
      },
    };
  } catch (error) {
    console.error("Error fetching from Jikan API:", error);
    return {
      media: [],
      pageInfo: { hasNextPage: false, total: 0, currentPage: 1, lastPage: 1 },
    };
  }
}

// Track user's anime statuses globally so we don't fetch per-card
function useUserAnimeStatuses(session: ReturnType<typeof useSession>["data"]) {
  const [statusMap, setStatusMap] = useState<
    Record<number, { status: string; progress: number }>
  >({});
  const [loaded, setLoaded] = useState(!session);

  useEffect(() => {
    if (!session) return;

    const fetchStatuses = async () => {
      try {
        const response = await fetch("/api/tracking/list");
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data)) {
          const map: Record<number, { status: string; progress: number }> = {};
          data.forEach(
            (item: { animeId: number; status: string; progress: number }) => {
              map[item.animeId] = {
                status: item.status,
                progress: item.progress || 0,
              };
            },
          );
          setStatusMap(map);
        }
      } catch (error) {
        console.error("Error fetching anime statuses:", error);
      } finally {
        setLoaded(true);
      }
    };

    fetchStatuses();
  }, [session]);

  // Function to update a single status locally
  const updateStatus = (animeId: number, status: string, progress: number) => {
    setStatusMap((prev) => ({
      ...prev,
      [animeId]: { status, progress },
    }));
  };

  return { statusMap, loaded, updateStatus };
}

interface ExploreAnimeCardProps {
  anime: TransformedAnime;
  session: ReturnType<typeof useSession>["data"];
  initialStatus: string | null;
  initialProgress: number;
  onStatusChange: (animeId: number, status: string, progress: number) => void;
}

function ExploreAnimeCard({
  anime,
  session,
  initialStatus,
  initialProgress,
  onStatusChange,
}: ExploreAnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [detailPosition, setDetailPosition] = useState<"right" | "left">(
    "right",
  );
  const [showModal, setShowModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(
    initialStatus,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const title = anime.title.english || anime.title.romaji;
  const nativeTitle = anime.title.native;
  const activeStatus = statusColors[currentStatus || ""];

  const handleSave = async (status: string, progress: number) => {
    if (!session) {
      signIn();
      return;
    }

    setIsUpdating(true);
    try {
      let feedback;
      if (status !== currentStatus) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await addToAnimeList(anime.id, status as any, progress);
        feedback = extractFeedback(result);
      } else {
        const result = await updateProgress(anime.id, progress);
        feedback = extractFeedback(result);
      }
      
      if (feedback) {
        handleFeedback(feedback);
      }
      
      setCurrentStatus(status);
      onStatusChange(anime.id, status, progress);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceOnRight = window.innerWidth - rect.right;
      const spaceOnLeft = rect.left;
      setDetailPosition(
        spaceOnRight < 300 && spaceOnLeft > spaceOnRight ? "left" : "right",
      );
    }
  }, [isHovered]);

  // Sync local state with parent statusMap (only on initial mount via key)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentStatus(initialStatus);
  }, [initialStatus, initialProgress]);

  const isAiring = anime.status?.toLowerCase().includes("currently airing");

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowModal(false);
      }}
    >
      <div className="block">
        <div
          className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
            isHovered
              ? "border-[#f9c846]/60 shadow-xl"
              : "border-[#ececec] bg-white shadow-sm"
          }`}
        >
          <Link href={`/anime/${anime.id}`}>
            <div className="relative aspect-[2/3] overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-[#f7f7f7] animate-pulse" />
              )}
              <Image
                src={anime.coverImage.large}
                alt={title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                className={`object-cover transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </Link>

          <div className="absolute w-full px-3 bottom-2 left-1/2 -translate-x-1/2 z-20">
              <div className="relative w-full">
                {currentStatus ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowModal(true);
                    }}
                    className="flex h-8 w-full items-center justify-between cursor-pointer rounded-lg bg-white/90 backdrop-blur-sm border border-[#ececec] px-3 shadow-sm hover:shadow-md transition-all"
                    disabled={isUpdating}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: activeStatus }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: activeStatus }}
                      >
                        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <ChevronDown
                      size={12}
                      className={`text-[#7b7f89] transition-transform duration-200`}
                    />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!session) {
                        signIn();
                        return;
                      }
                      setShowModal(true);
                    }}
                    className="flex h-8 w-full items-center justify-center gap-1.5 cursor-pointer rounded-lg bg-[#f9c846] text-[#545863] border border-[#f5bd29] hover:bg-[#f5bd29] hover:scale-[1.02] transition-all"
                    disabled={isUpdating}
                  >
                    <Plus size={13} />
                    <span className="text-xs font-medium">Add to Library</span>
                  </button>
                )}
              </div>
            </div>
        </div>

        <Link href={`/anime/${anime.id}`}>
          <div className="mt-2 px-0.5">
            <h3
              className={`text-[13px] font-semibold line-clamp-2 leading-tight transition-colors duration-200 ${isHovered ? "text-[#f96e46]" : "text-[#545863]/70"}`}
            >
              {title}
            </h3>
          </div>
        </Link>
      </div>

      {/* Hover Detail Box */}
      <div
        className={`absolute top-0 z-50 w-72 transition-all duration-300 pointer-events-none ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        } ${detailPosition === "right" ? "left-[calc(100%+12px)]" : "right-[calc(100%+12px)]"}`}
      >
        <div className="rounded-xl border border-[#ececec] bg-[#545863] shadow-xl p-5">
          <h4 className="text-sm font-bold text-white leading-tight">
            {title}
          </h4>
          {nativeTitle && nativeTitle !== title && (
            <p className="mt-0.5 text-[11px] text-white">{nativeTitle}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            {anime.type && (
              <span className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-white/80">
                <Tv size={11} />
                {anime.type}
              </span>
            )}
            {anime.status && (
              <span className="rounded-md bg-[#f9c846]/20 text-[#f9c846] px-2 py-0.5 font-medium">
                {anime.status}
              </span>
            )}
            {anime.episodes && (
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-white/80">
                {anime.episodes} episodes
              </span>
            )}
          </div>

          {anime.averageScore && (
            <div className="mt-3 flex items-center gap-2">
              <Star size={14} className="text-[#f9c846]" fill="#f9c846" />
              <span className="text-sm font-bold text-white">
                {(anime.averageScore / 10).toFixed(1)}
              </span>
              <span className="text-[11px] text-white/60">/ 10</span>
            </div>
          )}

          {anime.genres.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1.5">
                {anime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] text-white font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {anime.studios.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">
                Studio
              </p>
              <p className="text-xs text-white/80 font-medium">
                {anime.studios.slice(0, 2).join(", ")}
              </p>
            </div>
          )}

          {anime.description && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">
                Synopsis
              </p>
              <p className="text-[11px] text-white/70 leading-relaxed line-clamp-4">
                {anime.description.replace(/<[^>]*>/g, "").replace(/\\n/g, " ")}
              </p>
            </div>
          )}

          <div
            className={`absolute top-6 ${detailPosition === "right" ? "-left-1.5" : "-right-1.5"}`}
          >
            <div
              className={`w-3 h-3 bg-[#545863] border border-[#ececec] rotate-45 ${detailPosition === "right" ? "border-r-0 border-t-0" : "border-l-0 border-b-0"}`}
            />
          </div>
        </div>
      </div>

      {/* Update Progress Modal */}
      <UpdateProgressModal
        key={`modal-${anime.id}`}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        currentStatus={currentStatus || ""}
        currentProgress={initialProgress}
        totalEpisodes={anime.episodes || undefined}
        animeTitle={title}
        isAiring={isAiring}
        isUpdating={isUpdating}
      />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="w-full relative">
      <div className="aspect-[2/3] rounded-xl bg-[#545863]/15 animate-pulse" />
      <div className="mt-2 space-y-1.5 p-1">
        <div className="h-3 w-3/4 rounded bg-[#545863]/15 animate-pulse" />
        <div className="h-2.5 w-1/2 rounded bg-[#545863]/15 animate-pulse" />
      </div>
    </div>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "trending";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [animeList, setAnimeList] = useState<TransformedAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    total: 0,
    currentPage: 1,
    lastPage: 1,
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [sfwOnly, setSfwOnly] = useState(true);

  // Global user statuses (fetched once, not per-card)
  const {
    statusMap,
    loaded: statusesLoaded,
    updateStatus,
  } = useUserAnimeStatuses(session);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        if (page === 1) {
          setLoading(true);
          setAnimeList([]);
        } else {
          setLoadingMore(true);
        }

        const result = await fetchAnimeData({
          searchQuery: debouncedQuery,
          activeCategory,
          page,
          sfw: sfwOnly,
        });

        if (cancelled) return;

        if (page === 1) {
          setAnimeList(result.media);
        } else {
          setAnimeList((prev) => [...prev, ...result.media]);
        }
        setPageInfo(result.pageInfo);
      } catch (error) {
        console.error("Failed to fetch anime", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, activeCategory, page, sfwOnly]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
    setPage(1);
  };

  const handleLoadMore = useCallback(() => {
    if (pageInfo.hasNextPage && !loadingMore) {
      setPage((prev) => prev + 1);
    }
  }, [pageInfo.hasNextPage, loadingMore]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const totalPages = pageInfo.lastPage || 1;
  const currentPage = pageInfo.currentPage || 1;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen mx-auto max-w-5xl w-5xl overflow-hidden bg-[#fffdf8]">
      {/* Header */}
      <div className="bg-white border-b border-[#ececec]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <h1
            className={`text-3xl md:text-4xl text-[#545863] ${lordJuusai.className}`}
          >
            Explore Anime
          </h1>
          <p className="mt-2 text-sm text-[#7b7f89] max-w-lg">
            Discover trending series, seasonal releases, and hidden gems.
          </p>

          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b7f89]" />
              <input
                type="text"
                placeholder="Search anime titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#ececec] bg-[#fffdf8] pl-11 pr-4 text-sm text-[#545863] outline-none placeholder:text-[#7b7f89] focus:border-[#f9c846]/50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 items-center">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`rounded-lg px-4 py-2 cursor-pointer text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-[#f9c846] text-[#545863]"
                      : "bg-white border border-[#ececec] text-[#7b7f89] hover:bg-[#f7f7f7]"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* 18+ Toggle */}
            <button
              onClick={() => {
                setSfwOnly(!sfwOnly);
                setPage(1);
                setAnimeList([]);
              }}
              className={`flex items-center gap-1.5 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium border transition-colors ${
                sfwOnly
                  ? "bg-white border-[#ececec] text-[#7b7f89] hover:bg-[#f7f7f7]"
                  : "bg-[#f96e46]/10 text-[#f96e46] border-[#f96e46]/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${sfwOnly ? "bg-[#97cc04]" : "bg-[#f96e46]"}`}
              />
              {sfwOnly ? "SFW" : "18+"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-5xl relative px-4 py-8">
        <div className="mb-6 flex items-center relative justify-between">
          <p className="text-sm text-[#7b7f89]">
            {loading
              ? "Loading..."
              : `${pageInfo.total || animeList.length} anime found`}
          </p>
          {!loading && totalPages > 1 && (
            <p className="text-xs text-[#7b7f89]">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {loading && page === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {Array.from({ length: 15 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : animeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-semibold text-[#545863]">
              No anime found
            </p>
            <p className="mt-1 text-sm text-[#7b7f89]">
              Try another title or category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {animeList.map((anime, index) => (
                <ExploreAnimeCard
                  key={`${anime.id}-${index}`}
                  anime={anime}
                  session={session}
                  initialStatus={
                    statusesLoaded ? statusMap[anime.id]?.status || null : null
                  }
                  initialProgress={
                    statusesLoaded ? statusMap[anime.id]?.progress || 0 : 0
                  }
                  onStatusChange={updateStatus}
                />
              ))}
              {loadingMore &&
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={`skeleton-${i}`} />
                ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1.5">
                {pageInfo.hasNextPage && (
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 rounded-lg border border-[#ececec] bg-white px-5 py-2.5 text-sm font-medium text-[#545863] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Load More
                      </>
                    )}
                  </button>
                )}

                <div className="hidden md:flex items-center gap-1 ml-4">
                  {getPageNumbers().map((pageNum, i) =>
                    pageNum === "..." ? (
                      <span
                        key={`dots-${i}`}
                        className="px-2 py-1 text-xs text-[#7b7f89]"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => {
                          if (pageNum !== currentPage) {
                            setPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${
                          pageNum === currentPage
                            ? "bg-[#f9c846] text-[#545863]"
                            : "bg-white border border-[#ececec] text-[#7b7f89] hover:bg-[#f7f7f7]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#f9c846] text-[#545863] shadow-lg hover:bg-[#f5bd29] hover:shadow-xl transition-all"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center">
          <div className="text-[#7b7f89] text-sm">Loading...</div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}