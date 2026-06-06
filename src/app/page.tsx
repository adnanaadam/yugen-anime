import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import TrackingPreview from "@/components/landing/TrackingPreview";
import Gamification from "@/components/landing/Gamification";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Features />
        <TrackingPreview />
        <Gamification />
        <CTA />
        <Footer />
      </main>
    </>
  );
}