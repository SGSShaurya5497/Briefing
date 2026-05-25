import type { Metadata } from "next";
import { HeroDraggableCards } from "@/components/hero-draggable-cards";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsDemo } from "@/components/testimonials-demo";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "FloorSwap AI — Visualize Your Dream Floor in Seconds",
  description:
    "Upload a room photo and a tile texture. Our AI realistically swaps the floor in seconds. Free, instant, no design skills needed.",
};

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero — full-screen draggable cards */}
      <HeroDraggableCards />

      {/* 2. How it works — 3-step feature cards */}
      <FeaturesSection />

      {/* 3. Social proof — infinite scrolling testimonials */}
      <TestimonialsDemo />

      {/* 4. Call to action */}
      <CtaSection />

      {/* Bottom padding for floating dock */}
      <div className="h-28" />
    </main>
  );
}
