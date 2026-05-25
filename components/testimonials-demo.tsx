"use client";

import React from "react";
import { TestimonialsColumns, type Testimonial } from "@/components/ui/testimonials-columns-1";

const testimonials: Testimonial[] = [
  {
    quote:
      "Saved me hours trying to imagine how my kitchen would look with those new marble tiles. The AI nailed the lighting perfectly.",
    name: "Sarah M.",
    role: "Homeowner, Austin TX",
  },
  {
    quote:
      "I showed my clients three different tile options in the same room photo. Closed the deal same day. This tool is a game changer.",
    name: "James R.",
    role: "Interior Designer",
  },
  {
    quote:
      "Ordered the wrong tiles twice before. Now I visualize everything first. Haven't made a bad purchase since.",
    name: "Priya K.",
    role: "Home Renovator",
  },
  {
    quote:
      "The perspective and shadow matching is incredibly realistic. My clients couldn't believe it was AI-generated.",
    name: "Carlos D.",
    role: "Architect, Miami",
  },
  {
    quote:
      "Tried five different tile styles before settling on herringbone wood. Would have spent thousands on samples otherwise.",
    name: "Emma L.",
    role: "Property Developer",
  },
  {
    quote:
      "As a tile retailer, I've embedded FloorSwap on our website. Customer conversions went up 40% in the first month.",
    name: "David W.",
    role: "Tile Showroom Owner",
  },
  {
    quote:
      "I was skeptical but the result looked like a real photo. My husband couldn't tell it was AI until I showed him the original.",
    name: "Aisha T.",
    role: "Interior Enthusiast",
  },
  {
    quote:
      "Finally convinced my landlord to change the flooring by showing him a professional-looking preview. Works perfectly!",
    name: "Tom H.",
    role: "Renter, NYC",
  },
  {
    quote:
      "Used it for a client presentation. They approved the budget on the spot. Phenomenal tool for any design professional.",
    name: "Lena B.",
    role: "Freelance Designer",
  },
  {
    quote:
      "The terracotta tiles I visualized look exactly how they turned out in real life. The AI is shockingly accurate.",
    name: "Marco V.",
    role: "Renovation Contractor",
  },
  {
    quote:
      "Visualized slate tiles in my bathroom before buying. Saved myself from a very expensive mistake — the scale was all wrong.",
    name: "Rachel S.",
    role: "DIY Renovator",
  },
  {
    quote:
      "Our staging team uses this for every property. Helps buyers envision possibilities without any physical changes.",
    name: "Kevin O.",
    role: "Real Estate Agent",
  },
];

export function TestimonialsDemo() {
  return (
    <section className="bg-neutral-50 py-24 px-4 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Static header — no scroll animations */}
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-500">
            Customer Stories
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Loved by designers and homeowners
          </h2>
          <p className="mt-3 text-base text-neutral-500">
            Join thousands of people who visualize before they buy.
          </p>
        </div>

        {/* Three-column scrolling testimonials */}
        <TestimonialsColumns testimonials={testimonials} />
      </div>
    </section>
  );
}
