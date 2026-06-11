// src/app/anime/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Star, Tv, Clock, Users, Calendar, Check, ChevronDown, BookOpen } from "lucide-react";
import { addToAnimeList, updateProgress } from "@/features/tracking/api";
import { lordJuusai } from "@/fonts/fonts";

// Types
interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    large: string;
    extraLarge: string;
  };
  bannerImage: string;
  description: string;
  episodes: number;
  status: string;
  averageScore: number;
  popularity: number;
  genres: string[];
  seasonYear: number;
  season: string;
  format: string;
  duration: number;
  source: string;
  studios: Array<{ name: string; isMain: boolean }>;
  characters: Array<{
    id: number;
    name: string;
    image: string;
    role: string;
  }>;
  recommendations: Array<{
    id: number;
    title: string;
    coverImage: string;
    score: number;
  }>;
}

type AnimeStatus = "WATCHING" | "COMPLETED" | "PLAN_TO_WATCH" | "PAUSED" | "DROPPED" | "REWATCHING";

const statusOptions = [
  { label: "Watching", value: "WATCHING" as const, color: "#00e8fc" },
  { label: "Completed", value: "COMPLETED" as const, color: "#97cc04" },
  { label: "Plan to Watch", value: "PLAN_TO_WATCH" as const, color: "#f9c846" },
  { label: "Paused", value: "PAUSED" as const, color: "#f96e46" },
  { label: "Dropped", value: "DROPPED" as const, color: "#ff4444" },
  { label: "Rewatching", value: "REWATCHING" as const, color: "#c084fc" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformJikanToAnime(jikanAnime: any): Anime {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studios = jikanAnime.studios?.map((studio: any) => ({
    name: studio.name,
    isMain: true,
  })) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const characters = jikanAnime.characters?.slice(0, 12).map((char: any) => ({
    id: char.character.mal_id,
    name: char.character.name,
    image: char.character.images.jpg.image_url,
    role: char.role,
  })) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recommendations = jikanAnime.recommendations?.slice(0, 10).map((rec: any) => ({
    id: rec.entry.mal_id,
    title: rec.entry.title,
    coverImage: rec.entry.images.jpg.image_url,
    score: 0,
  })) || [];

  return {
    id: jikanAnime.mal_id,
    title: {
      romaji: jikanAnime.title,
      english: jikanAnime.title_english,
      native: jikanAnime.title_japanese,
    },
    coverImage: {
      large: jikanAnime.images.jpg.large_image_url,
      extraLarge: jikanAnime.images.jpg.large_image_url,
    },
    bannerImage: jikanAnime.images.jpg.large_image_url,
    description: jikanAnime.synopsis || "No description available.",
    episodes: jikanAnime.episodes || 0,
    status: jikanAnime.status || "Unknown",
    averageScore: jikanAnime.score ? jikanAnime.score * 10 : 0,
    popularity: jikanAnime.popularity || 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genres: jikanAnime.genres?.map((g: any) => g.name) || [],
    seasonYear: jikanAnime.year || null,
    season: jikanAnime.season || "",
    format: jikanAnime.type || "",
    duration: jikanAnime.duration ? parseInt(jikanAnime.duration) || 24 : 24,
    source: jikanAnime.source || "",
    studios,
    characters,
    recommendations,
  };
}

export default function AnimeDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(0);
  const [userStatus, setUserStatus] = useState<AnimeStatus | null>(null);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const activeStatus = statusOptions.find((s) => s.value === userStatus);

  // Fetch anime details
  useEffect(() => {
    let cancelled = false;

    const fetchAnime = async () => {
      setLoading(true);
      try {
        const [animeRes, charsRes, recsRes] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/anime/${id}`),
          fetch(`https://api.jikan.moe/v4/anime/${id}/characters`),
          fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`),
        ]);

        const [animeJson, charsJson, recsJson] = await Promise.all([
          animeRes.json(),
          charsRes.json(),
          recsRes.json(),
        ]);

        if (!animeJson.data) throw new Error("Anime not found");

        const animeData = {
          ...animeJson.data,
          characters: charsJson.data,
          recommendations: recsJson.data,
        };

        if (!cancelled) setAnime(transformJikanToAnime(animeData));
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (id) fetchAnime();
    return () => { cancelled = true; };
  }, [id]);

  // Fetch user's tracking status
  useEffect(() => {
    if (!session || !anime) return;

    const fetchUserStatus = async () => {
      try {
        const response = await fetch(`/api/tracking/list`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data)) {
          const entry = data.find((item: { animeId: number }) => item.animeId === anime.id);
          if (entry) {
            setUserStatus(entry.status);
            setUserProgress(entry.progress || 0);
            setUserScore(entry.score || null);
          }
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    fetchUserStatus();
  }, [session, anime]);

  const handleStatusChange = async (status: AnimeStatus) => {
    if (!session || !anime || updating) return;
    setUpdating(true);
    try {
      await addToAnimeList(anime.id, status, userProgress, userScore || undefined);
      setUserStatus(status);
      setShowStatusDropdown(false);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleProgressUpdate = async (increment: number) => {
    if (!session || !anime || updating) return;
    const newProgress = Math.min(userProgress + increment, anime.episodes || 0);
    setUpdating(true);
    try {
      await updateProgress(anime.id, newProgress);
      setUserProgress(newProgress);
      if (newProgress === anime.episodes && anime.episodes > 0) {
        setUserStatus("COMPLETED");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#545863]/15">
        <div className="animate-pulse">
          <div className="h-[250px] md:h-[300px] bg-[#545863]/15" />
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-[280px] shrink-0">
                <div className="aspect-[2/3] rounded-2xl bg-[#545863]/15" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-8 w-64 rounded bg-[#545863]/15" />
                <div className="h-4 w-full rounded bg-[#545863]/15" />
                <div className="h-4 w-3/4 rounded bg-[#545863]/15" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#545863]">Anime not found</h2>
          <Link href="/explore" className="mt-4 inline-block text-[#f96e46] hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const title = anime.title.english || anime.title.romaji;

  return (
    <div className="min-h-screen bg-[#fffdf8]">
      {/* Banner */}
      <div className="relative h-[200px] md:h-[300px] bg-[#f7f7f7]">
        {anime.bannerImage && (
          <Image
            src={anime.bannerImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-5xl px-4 pb-16 -mt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Cover */}
          <div className="lg:w-[200px] shrink-0">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-[#ececec] bg-white overflow-hidden shadow-sm">
                <div className="relative aspect-[2/3]">
                  <Image
                    src={anime.coverImage.extraLarge}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-4 space-y-2">
                {anime.format && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7b7f89]">Format</span>
                    <span className="text-[#545863] font-medium">{anime.format}</span>
                  </div>
                )}
                {anime.episodes > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7b7f89]">Episodes</span>
                    <span className="text-[#545863] font-medium">{anime.episodes}</span>
                  </div>
                )}
                {anime.duration > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7b7f89]">Duration</span>
                    <span className="text-[#545863] font-medium">{anime.duration} min</span>
                  </div>
                )}
                {anime.status && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7b7f89]">Status</span>
                    <span className="text-[#97cc04] font-medium">{anime.status}</span>
                  </div>
                )}
                {anime.seasonYear && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7b7f89]">Season</span>
                    <span className="text-[#545863] font-medium capitalize">
                      {anime.season} {anime.seasonYear}
                    </span>
                  </div>
                )}
                {anime.source && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7b7f89]">Source</span>
                    <span className="text-[#545863] font-medium">{anime.source}</span>
                  </div>
                )}

                {/* Library link */}
                {session && (
                  <div className="pt-2 mt-2 border-t border-[#ececec]">
                    <Link
                      href="/library"
                      className="inline-flex items-center gap-2 text-sm text-[#f96e46] hover:text-[#e55d3a] transition-colors"
                    >
                      <BookOpen size={14} />
                      View in Library
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 mt-26">
            {/* Back link */}
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-sm text-[#7b7f89] hover:text-[#f96e46] transition-colors mb-4"
            >
              <ArrowLeft size={14} />
              Back to Explore
            </Link>

            {/* Title */}
            <h1 className={`text-2xl md:text-3xl lg:text-4xl text-[#545863] ${lordJuusai.className}`}>
              {title}
            </h1>
            {anime.title.native && anime.title.native !== title && (
              <p className="mt-1 text-sm text-[#7b7f89]">{anime.title.native}</p>
            )}

            {/* Stats row */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {anime.averageScore > 0 && (
                <div className="flex items-center gap-1.5 rounded-lg bg-[#f9c846]/10 px-3 py-1.5">
                  <Star size={14} className="text-[#f9c846]" fill="#f9c846" />
                  <span className="font-semibold text-[#545863]">{(anime.averageScore / 10).toFixed(1)}</span>
                </div>
              )}
              {anime.popularity > 0 && (
                <div className="flex items-center gap-1.5 rounded-lg bg-[#f7f7f7] px-3 py-1.5 text-[#7b7f89]">
                  <Users size={14} />
                  {anime.popularity.toLocaleString()}
                </div>
              )}
              {anime.episodes > 0 && (
                <div className="flex items-center gap-1.5 rounded-lg bg-[#f7f7f7] px-3 py-1.5 text-[#7b7f89]">
                  <Tv size={14} />
                  {anime.episodes} eps
                </div>
              )}
              {anime.duration > 0 && (
                <div className="flex items-center gap-1.5 rounded-lg bg-[#f7f7f7] px-3 py-1.5 text-[#7b7f89]">
                  <Clock size={14} />
                  {anime.duration}m
                </div>
              )}
              {anime.seasonYear && (
                <div className="flex items-center gap-1.5 rounded-lg bg-[#f7f7f7] px-3 py-1.5 text-[#7b7f89]">
                  <Calendar size={14} />
                  {anime.season} {anime.seasonYear}
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="mt-4 flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-[#ececec] bg-white px-3 py-1 text-xs text-[#545863]"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Tracking Section */}
            {session && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#545863] mb-4">Your Progress</h3>

                {/* Status selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="flex items-center cursor-pointer justify-between w-full rounded-lg border border-[#ececec] bg-[#fffdf8] px-4 py-2.5 text-sm transition-colors hover:border-[#f9c846]/30"
                  >
                    <div className="flex items-center gap-2">
                      {activeStatus ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeStatus.color }} />
                          <span className="text-[#545863] font-medium">{activeStatus.label}</span>
                        </>
                      ) : (
                        <span className="text-[#7b7f89]">Add to Library</span>
                      )}
                    </div>
                    <ChevronDown size={14} className={`text-[#7b7f89] transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 overflow-hidden rounded-xl border border-[#ececec] bg-white shadow-xl z-30">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          disabled={updating}
                          className={`flex w-full items-center cursor-pointer gap-3 px-4 py-2.5 text-sm transition-colors ${
                            userStatus === option.value
                              ? "bg-[#f7f7f7] font-semibold text-[#545863]"
                              : "text-[#545863] hover:bg-[#f7f7f7]"
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: option.color }} />
                          <span>{option.label}</span>
                          {userStatus === option.value && (
                            <Check size={14} className="ml-auto text-[#97cc04]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {userStatus === "WATCHING" && anime.episodes > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-[#7b7f89] mb-1.5">
                      <span>Episode Progress</span>
                      <span className="font-medium text-[#545863]">{userProgress} / {anime.episodes}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#f7f7f7] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#f9c846] to-[#f96e46] transition-all duration-300"
                        style={{ width: `${(userProgress / anime.episodes) * 100}%` }}
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleProgressUpdate(1)}
                        disabled={updating || userProgress === anime.episodes}
                        className="rounded-lg bg-[#f9c846] px-4 py-2 text-xs font-medium text-[#545863] hover:bg-[#f5bd29] transition-colors disabled:opacity-50"
                      >
                        +1 Episode
                      </button>
                      <button
                        onClick={() => handleProgressUpdate(5)}
                        disabled={updating || userProgress + 5 > anime.episodes}
                        className="rounded-lg border border-[#ececec] bg-white px-4 py-2 text-xs text-[#545863] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
                      >
                        +5 Episodes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#545863] mb-3">Synopsis</h3>
              <div
                className="text-base text-[#7b7f89] leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: anime.description?.replace(/\n/g, "<br />") || "No description available.",
                }}
              />
            </div>

            {/* Studios */}
            {anime.studios.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#545863] mb-2">Studios</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.map((studio, i) => (
                    <span key={i} className="rounded-lg border border-[#ececec] bg-white px-3 py-1 text-xs text-[#545863]">
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Characters */}
            {anime.characters.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-[#545863] mb-4">Characters</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {anime.characters.slice(0, 8).map((char, i) => (
                    <div key={char.id || i} className="flex items-center gap-3 rounded-xl border border-[#ececec] bg-white p-3 shadow-sm">
                      {char.image && (
                        <Image
                          src={char.image}
                          alt={char.name}
                          width={64}
                          height={64}
                          className="rounded-sm object-cover shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#545863]">{char.name}</p>
                        <p className="text-xs text-[#7b7f89]">{char.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {anime.recommendations.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-[#545863] mb-4">You Might Also Like</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {anime.recommendations.slice(0, 10).map((rec, i) => (
                    <Link key={rec.id || i} href={`/anime/${rec.id}`} className="group">
                      <div className="relative aspect-[2/3] rounded-xl border border-[#ececec] overflow-hidden bg-white">
                        <Image
                          src={rec.coverImage}
                          alt={rec.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 text-xs text-[#545863] line-clamp-2 group-hover:text-[#f96e46] transition-colors">
                        {rec.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}