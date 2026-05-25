"use client";

import React from "react";
import { IconUpload, IconSparkles, IconDownload } from "@tabler/icons-react";

const features = [
  {
    icon: IconUpload,
    number: "01",
    title: "Upload Your Room",
    description:
      "Drag and drop a photo of any room. Works with living rooms, kitchens, bathrooms — any space with a visible floor.",
    color: "from-violet-50 to-purple-50",
    iconColor: "text-violet-500",
    border: "border-violet-100",
  },
  {
    icon: IconSparkles,
    number: "02",
    title: "Pick Your Tile",
    description:
      "Upload a close-up photo or sample of the tile texture you want. Marble, wood, terracotta, concrete — anything goes.",
    color: "from-sky-50 to-blue-50",
    iconColor: "text-sky-500",
    border: "border-sky-100",
  },
  {
    icon: IconDownload,
    number: "03",
    title: "Get Your Preview",
    description:
      "Our AI realistically replaces the floor texture in seconds, preserving lighting, shadows, and perspective. Download and share.",
    color: "from-emerald-50 to-teal-50",
    iconColor: "text-emerald-500",
    border: "border-emerald-100",
  },
];

export function FeaturesSection() {
  return (
    <section id="how-it-works" className="bg-white py-24 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-500">
            How It Works
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Three steps to your perfect floor
          </h2>
          <p className="mt-3 text-base text-neutral-500">
            No design skills needed. No software to install. Just upload and visualize.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.number}
                className={`group relative overflow-hidden rounded-3xl border ${feature.border} bg-gradient-to-br ${feature.color} p-8 transition-shadow duration-300 hover:shadow-lg`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ${feature.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-5xl font-black text-neutral-100 select-none">
                    {feature.number}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-800">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
