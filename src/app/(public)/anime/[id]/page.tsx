// src/app/anime/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { ArrowLeft, Star, Tv, Clock, Users, Calendar, BookOpen } from "lucide-react";
import { addToAnimeList, updateProgress } from "@/features/tracking/api";
import { handleFeedback, extractFeedback } from "@/lib/feedback-helper";
import { lordJuusai } from "@/fonts/fonts";
import UpdateProgressModal from "@/components/anime/UpdateProgressModal";
import FavoriteButton from "@/components/anime/FavoriteButton";

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
  const [showModal, setShowModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  // Fetch anime details
  useEffect(() => {
    let cancelled = false;

    const fetchAnime = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/anime/${id}`);
        if (!res.ok) throw new Error("Anime not found");
        const animeData = await res.json();

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

    // Fetch favorite status
    const fetchFavoriteStatus = async () => {
      if (!session || !anime) return;
      try {
        const res = await fetch("/api/favorites/ids");
        if (!res.ok) return;
        const data: number[] = await res.json();
        setIsFavorited(data.includes(anime.id));
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      } finally {
        setFavoritesLoaded(true);
      }
    };
    fetchFavoriteStatus();
  }, [session, anime]);

  const handleSave = async (status: string, progress: number) => {
    if (!session) {
      signIn();
      return;
    }
    if (!anime || updating) return;

    setUpdating(true);
    try {
      let feedback;
      if (status !== userStatus) {
        const result = await addToAnimeList(anime.id, status as AnimeStatus, progress, userScore || undefined);
        feedback = extractFeedback(result);
      } else {
        const result = await updateProgress(anime.id, progress);
        feedback = extractFeedback(result);
      }
      
      if (feedback) {
        handleFeedback(feedback);
      }
      
      setUserStatus(status as AnimeStatus);
      setUserProgress(progress);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating:", error);
    } finally {
      setUpdating(false);
    }
  };

  const isAiring = anime?.status?.toLowerCase().includes("currently airing");

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
  const imageSrc = "/images/anime-bg4.jpg";

  return (
    <div className="min-h-screen bg-[#fffdf8]">
      {/* Banner */}
      <div className="relative h-[200px] md:h-[300px] bg-black">
        {anime.bannerImage && (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover opacity-30"
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

                {/* Favorite button */}
                <div className="pt-2 mt-2 border-t border-[#ececec] flex items-center gap-2">
                  <FavoriteButton
                    animeId={anime.id}
                    initialFavorited={isFavorited}
                    size={18}
                    className="h-9 w-9"
                  />
                  <span className="text-xs text-[#7b7f89]">
                    {isFavorited ? "Favorited" : "Add to favorites"}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#ececec]">
                  {session ? (
                    <Link
                      href="/library"
                      className="inline-flex items-center gap-2 text-sm text-[#f96e46] hover:text-[#e55d3a] transition-colors"
                    >
                      <BookOpen size={14} />
                      View in Library
                    </Link>
                  ) : (
                    <button
                      onClick={() => signIn()}
                      className="inline-flex items-center gap-2 text-sm text-[#f96e46] hover:text-[#e55d3a] transition-colors"
                    >
                      <BookOpen size={14} />
                      Sign in to track
                    </button>
                  )}
                </div>
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
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-[#545863] mb-4">Your Progress</h3>

              {/* Update Button */}
              {session ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full rounded-lg border border-[#ececec] bg-[#fffdf8] px-4 py-2.5 text-sm font-medium text-[#545863] hover:border-[#f9c846]/30 transition-colors"
                >
                  {userStatus ? "Update Progress" : "Add to Library"}
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="w-full rounded-lg border border-[#ececec] bg-[#fffdf8] px-4 py-2.5 text-sm font-medium text-[#545863] hover:border-[#f9c846]/30 transition-colors"
                >
                  Sign in to track
                </button>
              )}

              {/* Current Status Display */}
              {userStatus && (
                <div className="mt-4 p-4 rounded-lg border border-[#ececec] bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ 
                        backgroundColor: userStatus === "WATCHING" ? "#00e8fc" :
                                       userStatus === "COMPLETED" ? "#97cc04" :
                                       userStatus === "PLAN_TO_WATCH" ? "#f9c846" :
                                       userStatus === "PAUSED" ? "#f96e46" :
                                       userStatus === "DROPPED" ? "#ff4444" : "#c084fc"
                      }} />
                      <span className="text-sm font-medium text-[#545863]">{userStatus}</span>
                    </div>
                    <span className="text-sm text-[#7b7f89]">
                      {userProgress} / {anime.episodes || "?"} eps
                    </span>
                  </div>
                </div>
              )}
            </div>

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

      {/* Update Progress Modal */}
      <UpdateProgressModal
        key={`modal-${anime.id}`}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        currentStatus={userStatus || "PLAN_TO_WATCH"}
        currentProgress={userProgress}
        totalEpisodes={anime.episodes || undefined}
        animeTitle={title}
        isAiring={isAiring}
        isUpdating={updating}
      />
    </div>
  );
}