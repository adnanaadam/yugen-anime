// src/app/anime/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { lordJuusai } from "@/fonts/fonts";

// Import game-icons.net SVGs
import PlayIcon from "@/assets/icons/play.svg";
import BookIcon from "@/assets/icons/book.svg";
import PauseIcon from "@/assets/icons/pause.svg";
import SkullIcon from "@/assets/icons/skull.svg";
import StarIcon from "@/assets/icons/star.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";
import ClockIcon from "@/assets/icons/clock.svg";
import UsersIcon from "@/assets/icons/users.svg";
import GenreIcon from "@/assets/icons/genre.svg";
import StudioIcon from "@/assets/icons/studio.svg";

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
  studios: {
    edges: Array<{
      node: {
        name: string;
      };
      isMain: boolean;
    }>;
  };
  characters: {
    edges: Array<{
      node: {
        name: {
          full: string;
        };
        image: {
          medium: string;
        };
      };
      role: string;
    }>;
  };
  recommendations: {
    edges: Array<{
      node: {
        mediaRecommendation: {
          id: number;
          title: {
            romaji: string;
          };
          coverImage: {
            medium: string;
          };
          averageScore: number;
        };
      };
    }>;
  };
}

type AnimeStatus = "WATCHING" | "COMPLETED" | "PLAN_TO_WATCH" | "PAUSED" | "DROPPED";

const statusConfig = {
  WATCHING: { label: "Watching", icon: PlayIcon, color: "#e5b23c" },
  COMPLETED: { label: "Completed", icon: BookIcon, color: "#d8d5cc" },
  PLAN_TO_WATCH: { label: "Plan to Watch", icon: CalendarIcon, color: "#6C5CE7" },
  PAUSED: { label: "Paused", icon: PauseIcon, color: "#ff5b47" },
  DROPPED: { label: "Dropped", icon: SkullIcon, color: "#ff7675" },
};

export default function AnimeDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(0);
  const [userStatus, setUserStatus] = useState<AnimeStatus | null>(null);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch anime details from AniList
  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      const query = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              extraLarge
            }
            bannerImage
            description
            episodes
            status
            averageScore
            popularity
            genres
            seasonYear
            season
            format
            duration
            source
            studios {
              edges {
                node {
                  name
                }
                isMain
              }
            }
            characters {
              edges {
                node {
                  name {
                    full
                  }
                  image {
                    medium
                  }
                }
                role
              }
            }
            recommendations {
              edges {
                node {
                  mediaRecommendation {
                    id
                    title {
                      romaji
                    }
                    coverImage {
                      medium
                    }
                    averageScore
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { id: parseInt(id as string) } }),
        });
        const data = await response.json();
        setAnime(data.data.Media);
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAnime();
  }, [id]);

  // Fetch user's tracking status
  useEffect(() => {
    if (!session || !anime) return;

    const fetchUserStatus = async () => {
      try {
        const response = await fetch(`/api/anime/status?animeId=${anime.id}`);
        const data = await response.json();
        if (data.status) {
          setUserStatus(data.status);
          setUserProgress(data.progress || 0);
          setUserScore(data.score || null);
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    fetchUserStatus();
  }, [session, anime]);

  const updateStatus = async (status: AnimeStatus) => {
    if (!session) return;
    setUpdating(true);

    try {
      const response = await fetch("/api/anime/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animeId: anime?.id,
          status,
          progress: userProgress,
          score: userScore,
        }),
      });

      if (response.ok) {
        setUserStatus(status);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const updateProgress = async (increment: number) => {
    if (!session || !anime || userStatus !== "WATCHING") return;
    
    const newProgress = Math.min(userProgress + increment, anime.episodes || 0);
    setUpdating(true);

    try {
      const response = await fetch("/api/anime/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animeId: anime.id,
          status: userStatus,
          progress: newProgress,
          score: userScore,
        }),
      });

      if (response.ok) {
        setUserProgress(newProgress);
        if (newProgress === anime.episodes) {
          setUserStatus("COMPLETED");
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="animate-pulse">
          <div className="h-[400px] bg-gray-800" />
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="h-8 w-64 rounded bg-gray-800" />
            <div className="mt-4 h-4 w-full rounded bg-gray-800" />
            <div className="mt-2 h-4 w-3/4 rounded bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Anime not found</h2>
            <Link href="/explore" className="mt-4 inline-block text-[#e5b23c] hover:underline">
              Back to Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const StatusButtons = () => (
    <div className="flex flex-wrap gap-2">
      {Object.entries(statusConfig).map(([key, config]) => {
        const Icon = config.icon;
        const isActive = userStatus === key;
        return (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateStatus(key as AnimeStatus)}
            disabled={updating}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-gradient-to-r from-[#e5b23c] to-[#ff5b47] text-black"
                : "border border-gray-700 bg-[#0A0A0A] text-gray-400 hover:border-gray-600"
            }`}
          >
            <span className="size-6 flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </span>
            {config.label}
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Banner Image */}
      <div className="relative h-[300px] md:h-[400px]">
        {anime.bannerImage ? (
          <Image
            src={anime.bannerImage}
            alt={anime.title.romaji}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full bg-gradient-to-r from-[#0A0A0A] to-[#1a1a2e]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Cover Image */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 overflow-hidden rounded-2xl">
              <Image
                src={anime.coverImage.extraLarge}
                alt={anime.title.romaji}
                width={300}
                height={450}
                className="w-full"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 lg:w-3/4">
            <h1 className={`text-3xl font-bold md:text-4xl ${lordJuusai.className} text-white`}>
              {anime.title.english || anime.title.romaji}
            </h1>
            <p className="mt-2 text-gray-400">{anime.title.native}</p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-4">
              {anime.averageScore && (
                <div className="flex items-center gap-2">
                  <span className="size-6 flex items-center justify-center">
                    <StarIcon className="h-5 w-5 text-[#e5b23c]" />
                  </span>
                  <span className="text-white">{(anime.averageScore / 10).toFixed(1)}</span>
                </div>
              )}
              {anime.popularity && (
                <div className="flex items-center gap-2">
                  <span className="size-6 flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-[#6C5CE7]" />
                  </span>
                  <span className="text-white">{anime.popularity.toLocaleString()}</span>
                </div>
              )}
              {anime.episodes && (
                <div className="flex items-center gap-2">
                  <span className="size-6 flex items-center justify-center">
                    <PlayIcon className="h-5 w-5 text-[#ff5b47]" />
                  </span>
                  <span className="text-white">{anime.episodes} episodes</span>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-2">
                  <span className="size-6 flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-[#d8d5cc]" />
                  </span>
                  <span className="text-white">{anime.duration} min/ep</span>
                </div>
              )}
              {anime.seasonYear && (
                <div className="flex items-center gap-2">
                  <span className="size-6 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-white" />
                  </span>
                  <span className="text-white">
                    {anime.season} {anime.seasonYear}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="mt-4 flex flex-wrap gap-2">
              {anime.genres?.slice(0, 5).map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold text-white">Synopsis</h3>
              <div
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: anime.description?.replace(/\n/g, "<br />") || "No description available.",
                }}
              />
            </div>

            {/* Studios */}
            {anime.studios?.edges.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-semibold text-white">Studios</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.edges.map((studio, i) => (
                    <span key={i} className="text-sm text-gray-400">
                      {studio.node.name}
                      {studio.isMain && " (Main)"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tracking Section */}
            {session && (
              <div className="mt-8 rounded-xl border border-gray-800 bg-[#0A0A0A] p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Your Progress</h3>
                <StatusButtons />
                
                {userStatus === "WATCHING" && anime.episodes && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Progress</span>
                      <span>{userProgress} / {anime.episodes} episodes</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#e5b23c] to-[#ff5b47] transition-all"
                        style={{ width: `${(userProgress / anime.episodes) * 100}%` }}
                      />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => updateProgress(1)}
                        disabled={updating || userProgress === anime.episodes}
                        className="rounded-lg bg-[#e5b23c] px-4 py-2 text-sm font-medium text-black transition-all hover:bg-[#d4a32c]"
                      >
                        +1 Episode
                      </button>
                      <button
                        onClick={() => updateProgress(5)}
                        disabled={updating || userProgress === anime.episodes}
                        className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-gray-800"
                      >
                        +5 Episodes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Characters Section */}
            {anime.characters?.edges.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-white">Characters</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {anime.characters.edges.slice(0, 8).map((char, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-[#0A0A0A] p-3">
                      <Image
                        src={char.node.image.medium}
                        alt={char.node.name.full}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{char.node.name.full}</p>
                        <p className="text-xs text-gray-500">{char.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {anime.recommendations?.edges.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-white">Recommendations</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {anime.recommendations.edges.slice(0, 10).map((rec, i) => {
                    const recAnime = rec.node.mediaRecommendation;
                    return (
                      <Link key={i} href={`/anime/${recAnime.id}`}>
                        <div className="group cursor-pointer">
                          <Image
                            src={recAnime.coverImage.medium}
                            alt={recAnime.title.romaji}
                            width={200}
                            height={300}
                            className="rounded-lg transition-transform group-hover:scale-105"
                          />
                          <p className="mt-2 line-clamp-1 text-sm text-gray-300 group-hover:text-[#e5b23c]">
                            {recAnime.title.romaji}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}