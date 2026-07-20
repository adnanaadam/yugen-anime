// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/profile",
          "/library",
          "/favorites",
          "/settings",
          "/onboarding",
        ],
      },
    ],
    sitemap: "https://otakuprofile.com/sitemap.xml",
  };
}