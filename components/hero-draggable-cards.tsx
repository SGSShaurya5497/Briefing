"use client";

import React from "react";
import Image from "next/image";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

const items = [
  {
    title: "Marble Elegance",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
    className: "absolute top-16 left-[8%] w-52 rotate-[-6deg]",
  },
  {
    title: "Modern Kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    className: "absolute top-32 left-[30%] w-60 rotate-[4deg]",
  },
  {
    title: "Terracotta Living",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    className: "absolute top-10 right-[18%] w-52 rotate-[7deg]",
  },
  {
    title: "Herringbone Study",
    image:
      "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=400&q=80",
    className: "absolute bottom-28 left-[14%] w-56 rotate-[2deg]",
  },
  {
    title: "Slate Bathroom",
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",
    className: "absolute bottom-20 right-[10%] w-52 rotate-[-5deg]",
  },
  {
    title: "Parquet Dining",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
    className: "absolute bottom-10 left-1/2 -translate-x-1/2 w-56 rotate-[3deg]",
  },
];

export function HeroDraggableCards() {
  return (
    <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip bg-white">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Central headline */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-1.5 text-xs font-medium text-sky-600">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
          Powered by Gemini AI
        </div>
        <h1 className="max-w-lg text-4xl font-black tracking-tight text-neutral-800 md:text-5xl">
          Visualize your dream floor{" "}
          <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            in seconds.
          </span>
        </h1>
        <p className="mt-4 max-w-sm text-base text-neutral-500">
          Upload your room, upload a tile, and let AI do the rest.
        </p>
        <div className="mt-8 flex gap-3">
          <a
            href="/app"
            className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-neutral-700 transition-colors"
          >
            Try it free →
          </a>
          <a
            href="#how-it-works"
            className="rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            See how it works
          </a>
        </div>
      </div>

      {/* Draggable room cards */}
      {items.map((item) => (
        <DraggableCardBody key={item.title} className={item.className}>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
            <Image
              src={item.image}
              alt={item.title}
              width={400}
              height={300}
              className="pointer-events-none h-40 w-full object-cover"
            />
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-neutral-600">{item.title}</p>
            </div>
          </div>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}
