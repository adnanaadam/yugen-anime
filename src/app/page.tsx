// src/app/page.tsx
import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import HomeAnimeRows from "@/components/home/HomeAnimeRows";
import AchievementsPreview from "@/components/home/AchievementsPreview";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      <Suspense fallback={<AnimeRowsSkeleton />}>
        <HomeAnimeRows />
      </Suspense>

      <AchievementsPreview />

      <FAQSection />

      <Footer />
    </main>
  );
}

function AnimeRowsSkeleton() {
  return (
    <section className="py-4 bg-black">
      <div className="mx-auto max-w-7xl px-4 space-y-12">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            <div className="mb-5">
              <div className="h-6 w-40 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-60 rounded bg-white/5 animate-pulse mt-2" />
            </div>
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[170px]"
                >
                  <div className="aspect-[2/3] rounded-xl bg-white/10 animate-pulse" />
                  <div className="mt-2 space-y-1.5 p-1">
                    <div className="h-3 w-3/4 rounded bg-white/15 animate-pulse" />
                    <div className="h-2.5 w-1/2 rounded bg-white/10 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
