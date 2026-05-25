"use client";

import React from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { cn } from "@/lib/utils";

interface ImageCompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function ImageCompareSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: ImageCompareSliderProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-neutral-200 shadow-md", className)}>
      <ReactCompareSlider
        itemOne={
          <div className="relative h-full w-full">
            <ReactCompareSliderImage src={beforeSrc} alt="Original room" />
            <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {beforeLabel}
            </div>
          </div>
        }
        itemTwo={
          <div className="relative h-full w-full">
            <ReactCompareSliderImage src={afterSrc} alt="Floor swapped room" />
            <div className="absolute bottom-3 right-3 rounded-full bg-sky-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {afterLabel}
            </div>
          </div>
        }
        style={{ height: "480px", width: "100%" }}
        handle={
          <div className="flex h-full items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl border border-neutral-200">
              <svg
                className="h-5 w-5 text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 9l-3 3 3 3M16 9l3 3-3 3"
                />
              </svg>
            </div>
          </div>
        }
      />
    </div>
  );
}
