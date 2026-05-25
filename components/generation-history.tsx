"use client";

import React from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { IconPhoto, IconLoader2, IconAlertCircle } from "@tabler/icons-react";

interface Generation {
  id: string;
  originalRoomUrl: string;
  tileUrl: string;
  generatedImageUrl: string | null;
  status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  errorMessage: string | null;
  createdAt: string;
}

interface GenerationHistoryProps {
  generations: Generation[];
  onSelect?: (gen: Generation) => void;
  selectedId?: string;
}

export function GenerationHistory({
  generations,
  onSelect,
  selectedId,
}: GenerationHistoryProps) {
  if (generations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
          <IconPhoto className="h-6 w-6 text-neutral-400" />
        </div>
        <p className="text-sm font-medium text-neutral-500">No generations yet</p>
        <p className="text-xs text-neutral-400">
          Upload a room and tile to create your first visualization.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-400">
        Recent Generations
      </h3>
      {generations.map((gen) => (
        <button
          key={gen.id}
          onClick={() => onSelect?.(gen)}
          className={`group relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
            selectedId === gen.id
              ? "border-sky-200 bg-sky-50"
              : "border-neutral-100 bg-white hover:border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          {/* Thumbnail */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            {gen.generatedImageUrl ? (
              <Image
                src={gen.generatedImageUrl}
                alt="Generated floor"
                fill
                className="object-cover"
              />
            ) : gen.originalRoomUrl ? (
              <Image
                src={gen.originalRoomUrl}
                alt="Original room"
                fill
                className="object-cover opacity-60"
              />
            ) : null}

            {/* Status badge */}
            {gen.status === "PROCESSING" || gen.status === "PENDING" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <IconLoader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            ) : gen.status === "FAILED" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/30">
                <IconAlertCircle className="h-5 w-5 text-white" />
              </div>
            ) : null}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-700">
              Floor Swap
            </p>
            <p className="mt-0.5 text-xs text-neutral-400">
              {formatDate(gen.createdAt)}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                gen.status === "DONE"
                  ? "bg-emerald-50 text-emerald-600"
                  : gen.status === "FAILED"
                  ? "bg-red-50 text-red-500"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {gen.status.charAt(0) + gen.status.slice(1).toLowerCase()}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
