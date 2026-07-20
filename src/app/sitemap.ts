// src/app/sitemap.ts
import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const BASE_URL = "https://otakuprofile.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ============================================================
  // Static routes
  // ============================================================
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/signin`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ============================================================
  // Anime pages — fetch top anime from Tenrai API
  // ============================================================
  let animeRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      "https://api.tenrai.org/v1/top/anime?page=1&limit=50",
      { next: { revalidate: 86400 } } // cache for 24 hours
    );
    if (res.ok) {
      const data = await res.json();
      const animeList: { mal_id: number }[] = data.data || [];
      animeRoutes = animeList.map((anime) => ({
        url: `${BASE_URL}/anime/${anime.mal_id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Sitemap: failed to fetch top anime from Tenrai API", error);
  }

  // ============================================================
  // User profiles — query public profiles from database
  // ============================================================
  let userRoutes: MetadataRoute.Sitemap = [];
  try {
    const users = await prisma.user.findMany({
      where: {
        username: { not: null },
        isProfilePublic: true,
      },
      select: {
        username: true,
        updatedAt: true,
      },
      take: 1000,
    });

    userRoutes = users.map((user) => ({
      url: `${BASE_URL}/u/${user.username}`,
      lastModified: user.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  } catch (error) {
    console.error("Sitemap: failed to fetch users from database", error);
  }

  return [...staticRoutes, ...animeRoutes, ...userRoutes];
}