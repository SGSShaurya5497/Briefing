"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

interface TestimonialsColumnsProps {
  testimonials: Testimonial[];
  className?: string;
}

// ─── Single Card ──────────────────────────────────────────────────────────────

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="mb-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Stars */}
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className="h-4 w-4 fill-amber-400 text-amber-400"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="mb-4 text-sm leading-relaxed text-neutral-600">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold text-white select-none">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-800">
            {testimonial.name}
          </p>
          <p className="text-xs text-neutral-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Scrolling Column ─────────────────────────────────────────────────────────

function ScrollingColumn({
  testimonials,
  reverse = false,
  speed = "30s",
}: {
  testimonials: Testimonial[];
  reverse?: boolean;
  speed?: string;
}) {
  // Duplicate for seamless loop
  const doubled = [...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden" style={{ height: "520px" }}>
      <div
        className={cn(
          "flex flex-col",
          reverse ? "animate-[marquee-reverse_var(--speed)_linear_infinite]" : "animate-[marquee_var(--speed)_linear_infinite]"
        )}
        style={{ "--speed": speed } as React.CSSProperties}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TestimonialsColumns({
  testimonials,
  className,
}: TestimonialsColumnsProps) {
  // Split into 3 columns
  const col1 = testimonials.filter((_, i) => i % 3 === 0);
  const col2 = testimonials.filter((_, i) => i % 3 === 1);
  const col3 = testimonials.filter((_, i) => i % 3 === 2);

  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-3", className)}>
      <ScrollingColumn testimonials={col1} speed="35s" />
      <ScrollingColumn testimonials={col2} reverse speed="28s" />
      <ScrollingColumn testimonials={col3} speed="40s" />
    </div>
  );
}
