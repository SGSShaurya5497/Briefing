"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatBytes } from "@/lib/utils";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

interface FileDropzoneProps {
  label: string;
  sublabel?: string;
  onFileAccepted: (file: File) => void;
  onFileRemoved?: () => void;
  className?: string;
  previewUrl?: string;
}

export function FileDropzone({
  label,
  sublabel,
  onFileAccepted,
  onFileRemoved,
  className,
  previewUrl,
}: FileDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(previewUrl ?? null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError(null);

      if (rejected.length > 0) {
        const firstError = rejected[0].errors[0];
        if (firstError.code === "file-too-large") {
          setError(`File exceeds 5 MB limit (${formatBytes(rejected[0].file.size)})`);
        } else if (firstError.code === "file-invalid-type") {
          setError("Only JPG, PNG, and WEBP images are accepted.");
        } else {
          setError(firstError.message);
        }
        return;
      }

      if (accepted.length > 0) {
        const f = accepted[0];
        setFile(f);
        const objectUrl = URL.createObjectURL(f);
        setPreview(objectUrl);
        onFileAccepted(f);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    maxFiles: 1,
    multiple: false,
  });

  function removeFile(e: React.MouseEvent) {
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError(null);
    onFileRemoved?.();
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-semibold text-neutral-700">{label}</label>
      {sublabel && (
        <p className="text-xs text-neutral-400">{sublabel}</p>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200",
          isDragActive
            ? "border-sky-400 bg-sky-50 scale-[1.01]"
            : "border-neutral-200 bg-neutral-50 hover:border-sky-300 hover:bg-sky-50/50",
          preview ? "border-solid border-neutral-200 bg-white" : ""
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Uploaded preview"
                className="h-[196px] w-full rounded-xl object-cover"
              />
              <button
                onClick={removeFile}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                aria-label="Remove image"
              >
                <IconX className="h-4 w-4" />
              </button>
              {file && (
                <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                  {file.name} · {formatBytes(file.size)}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 p-6 text-center"
            >
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
                isDragActive ? "bg-sky-100 text-sky-500" : "bg-neutral-100 text-neutral-400"
              )}>
                {isDragActive ? (
                  <IconPhoto className="h-6 w-6" />
                ) : (
                  <IconUpload className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  {isDragActive ? "Drop it here!" : "Drag & drop or click to upload"}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  JPG, PNG, WEBP · Max 5 MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
