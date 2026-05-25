"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { ImageCompareSlider } from "@/components/ui/image-compare-slider";
import { GenerationHistory } from "@/components/generation-history";
import {
  IconSparkles,
  IconLoader2,
  IconDownload,
  IconAlertCircle,
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

type AppState = "idle" | "generating" | "done" | "error";

export default function AppPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [roomFile, setRoomFile] = useState<File | null>(null);
  const [tileFile, setTileFile] = useState<File | null>(null);
  const [appState, setAppState] = useState<AppState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [result, setResult] = useState<{
    generatedUrl: string;
    originalUrl: string;
  } | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGen, setSelectedGen] = useState<Generation | null>(null);
  const [historLoaded, setHistoryLoaded] = useState(false);

  // Load history once authenticated
  const loadHistory = useCallback(async () => {
    if (historLoaded || !session) return;
    try {
      const res = await fetch("/api/generations");
      if (res.ok) {
        const data = await res.json();
        setGenerations(data.generations ?? []);
      }
    } catch {
      // non-critical
    }
    setHistoryLoaded(true);
  }, [historLoaded, session]);

  React.useEffect(() => {
    if (session) loadHistory();
  }, [session, loadHistory]);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <IconLoader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!session) {
    router.replace("/auth/signin?callbackUrl=/app");
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <IconLoader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  // ── Generate handler ────────────────────────────────────────────────────────
  async function handleGenerate() {
    if (!roomFile || !tileFile) return;

    setAppState("generating");
    setErrorMsg("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("room", roomFile);
      formData.append("tile", tileFile);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed. Please try again.");
      }

      setResult({
        generatedUrl: data.generatedImageUrl,
        originalUrl: data.originalRoomUrl,
      });
      setAppState("done");

      // Refresh history
      setHistoryLoaded(false);
      const histRes = await fetch("/api/generations");
      if (histRes.ok) {
        const histData = await histRes.json();
        setGenerations(histData.generations ?? []);
        setHistoryLoaded(true);
      }
    } catch (err: unknown) {
      setAppState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    }
  }

  function handleSelectHistory(gen: Generation) {
    setSelectedGen(gen);
    if (gen.generatedImageUrl && gen.originalRoomUrl) {
      setResult({
        generatedUrl: gen.generatedImageUrl,
        originalUrl: gen.originalRoomUrl,
      });
      setAppState("done");
    }
  }

  const canGenerate = roomFile && tileFile && appState !== "generating";

  return (
    <div className="min-h-screen bg-neutral-50 pb-32">
      {/* Header bar */}
      <div className="border-b border-neutral-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-neutral-800">
              Tile Swap Generator
            </h1>
            <p className="text-xs text-neutral-400">
              Signed in as {session.user?.name ?? session.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">
              Gemini AI Ready
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ── Main Panel ───────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Upload section */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-semibold text-neutral-800">
                Upload Images
              </h2>
              <p className="mb-6 text-sm text-neutral-400">
                Upload your room photo and tile texture to begin.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <FileDropzone
                  label="Room Photo"
                  sublabel="A photo of the room whose floor you want to change."
                  onFileAccepted={(f) => setRoomFile(f)}
                  onFileRemoved={() => setRoomFile(null)}
                />
                <FileDropzone
                  label="Tile Texture"
                  sublabel="A close-up sample or swatch of the tile you want."
                  onFileAccepted={(f) => setTileFile(f)}
                  onFileRemoved={() => setTileFile(null)}
                />
              </div>

              {/* Generate button */}
              <div className="mt-6 flex items-center gap-4">
                <button
                  id="generate-btn"
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="flex items-center gap-2 rounded-xl bg-neutral-900 px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {appState === "generating" ? (
                    <>
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <IconSparkles className="h-4 w-4" />
                      Generate Floor Swap
                    </>
                  )}
                </button>

                {!roomFile && !tileFile && (
                  <p className="text-xs text-neutral-400">
                    Upload both images to enable generation.
                  </p>
                )}
              </div>
            </div>

            {/* Result panel */}
            <AnimatePresence mode="wait">
              {appState === "generating" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-12 shadow-sm"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
                    <IconLoader2 className="h-8 w-8 animate-spin text-sky-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-neutral-700">
                      AI is working its magic…
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                      Analyzing floor geometry, lighting, and perspective.
                      This takes 15–30 seconds.
                    </p>
                  </div>
                  {/* Progress shimmer */}
                  <div className="h-1.5 w-64 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full w-1/2 animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-sky-300 via-sky-500 to-sky-300 bg-[length:200%_100%]" />
                  </div>
                </motion.div>
              )}

              {appState === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50 p-6"
                >
                  <IconAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <div>
                    <p className="font-semibold text-red-700">
                      Generation failed
                    </p>
                    <p className="mt-1 text-sm text-red-600">{errorMsg}</p>
                    <button
                      onClick={() => setAppState("idle")}
                      className="mt-3 rounded-lg bg-red-100 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                </motion.div>
              )}

              {appState === "done" && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-neutral-800">
                        Before &amp; After
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Drag the slider to compare
                      </p>
                    </div>
                    <a
                      id="download-btn"
                      href={result.generatedUrl}
                      download="floorswap-result.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <IconDownload className="h-4 w-4" />
                      Download
                    </a>
                  </div>

                  <ImageCompareSlider
                    beforeSrc={result.originalUrl}
                    afterSrc={result.generatedUrl}
                    beforeLabel="Original Floor"
                    afterLabel="New Tile"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Sidebar: History ─────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm h-fit">
            <GenerationHistory
              generations={generations}
              onSelect={handleSelectHistory}
              selectedId={selectedGen?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
