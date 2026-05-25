"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import {
  IconLoader2,
  IconPhoto,
  IconDownload,
  IconClock,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

interface Generation {
  id: string;
  originalRoomUrl: string;
  tileUrl: string;
  generatedImageUrl: string | null;
  status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  errorMessage: string | null;
  createdAt: string;
}

const statusConfig = {
  DONE: {
    label: "Done",
    icon: IconCheck,
    classes: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  FAILED: {
    label: "Failed",
    icon: IconX,
    classes: "bg-red-50 text-red-500 border-red-100",
  },
  PENDING: {
    label: "Pending",
    icon: IconClock,
    classes: "bg-amber-50 text-amber-600 border-amber-100",
  },
  PROCESSING: {
    label: "Processing",
    icon: IconLoader2,
    classes: "bg-sky-50 text-sky-500 border-sky-100",
  },
};

export default function GalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Generation | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/generations")
      .then((r) => r.json())
      .then((d) => {
        setGenerations(d.generations ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!session) {
    router.replace("/auth/signin?callbackUrl=/gallery");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-32">
      {/* Header */}
      <div className="border-b border-neutral-100 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-lg font-bold text-neutral-800">My Gallery</h1>
          <p className="text-xs text-neutral-400">
            All your floor swap visualizations — private to your account.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-24">
            <IconLoader2 className="h-8 w-8 animate-spin text-neutral-400" />
            <p className="text-sm text-neutral-400">Loading your generations…</p>
          </div>
        ) : generations.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
              <IconPhoto className="h-8 w-8 text-neutral-400" />
            </div>
            <p className="text-lg font-semibold text-neutral-700">
              No generations yet
            </p>
            <p className="text-sm text-neutral-400">
              Head to the generator to create your first floor swap.
            </p>
            <a
              href="/app"
              className="mt-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700 transition-colors"
            >
              Try the Generator →
            </a>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-neutral-500">
              {generations.length} generation{generations.length !== 1 ? "s" : ""}
            </p>

            {/* Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {generations.map((gen, i) => {
                const cfg = statusConfig[gen.status];
                const StatusIcon = cfg.icon;
                return (
                  <motion.div
                    key={gen.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelected(gen)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Generated image */}
                    <div className="relative h-48 w-full bg-neutral-100">
                      {gen.generatedImageUrl ? (
                        <Image
                          src={gen.generatedImageUrl}
                          alt="Generated floor"
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : gen.originalRoomUrl ? (
                        <Image
                          src={gen.originalRoomUrl}
                          alt="Original room"
                          fill
                          className="object-cover opacity-50"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <IconPhoto className="h-10 w-10 text-neutral-300" />
                        </div>
                      )}

                      {/* Status pill */}
                      <div className={`absolute right-2 top-2 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${cfg.classes}`}>
                        <StatusIcon className={`h-3 w-3 ${gen.status === "PROCESSING" ? "animate-spin" : ""}`} />
                        {cfg.label}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-neutral-800">
                            Floor Swap
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-400">
                            {formatDate(gen.createdAt)}
                          </p>
                        </div>

                        {/* Tile thumbnail */}
                        {gen.tileUrl && (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-neutral-100">
                            <Image
                              src={gen.tileUrl}
                              alt="Tile"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {gen.generatedImageUrl && (
                        <a
                          href={gen.generatedImageUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors"
                        >
                          <IconDownload className="h-3.5 w-3.5" />
                          Download
                        </a>
                      )}

                      {gen.status === "FAILED" && gen.errorMessage && (
                        <p className="mt-2 truncate text-xs text-red-500">
                          {gen.errorMessage}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Lightbox modal */}
      {selected && selected.generatedImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected.generatedImageUrl}
              alt="Generated floor"
              width={1200}
              height={800}
              className="rounded-3xl object-contain"
            />
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Close"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
