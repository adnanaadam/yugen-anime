// src/app/(public)/page.tsx
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import AchievementsPreview from "@/components/home/AchievementsPreview";
import HomeAnimeRows from "@/components/home/HomeAnimeRows";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HomeAnimeRows />
      <AchievementsPreview />
    </main>
  );
}