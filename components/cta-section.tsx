"use client";

import React from "react";
import { IconArrowRight } from "@tabler/icons-react";

export function CtaSection() {
  return (
    <section className="bg-white py-24 px-4">
      <div className="mx-auto max-w-3xl text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-700 px-8 py-16 shadow-2xl">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative">
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              100% Free · No Credit Card Required
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Ready to see your new floor?
            </h2>
            <p className="mt-4 text-base text-white/60">
              Sign in with Google and start visualizing in under 60 seconds.
              No design skills, no software, no cost.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="/app"
                className="group flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-neutral-900 shadow-lg hover:bg-neutral-50 transition-colors"
              >
                Start Swapping Tiles
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/gallery"
                className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
              >
                View Gallery
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
