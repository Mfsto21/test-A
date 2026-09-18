"use client";

import { useId, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

/**
 * A text input (still submits as `name` in the surrounding <form>) paired
 * with a file picker. Choosing a file uploads it immediately and fills the
 * text value with the returned URL — so the parent form's existing Server
 * Action doesn't need to change at all. Pasting a URL directly still works
 * too (e.g. an existing hosted asset).
 *
 * Upload path: tries a direct client-to-Blob-storage upload first (bytes
 * stream straight from the browser to Vercel Blob, bypassing our
 * serverless function's request-body size limit entirely — the fix for
 * multi-minute-video uploads hanging/failing). Falls back to the classic
 * POST-to-/api/upload route if that's unavailable, e.g. local dev without
 * Blob configured, where the size limit doesn't apply anyway.
 */
export function UploadField({
  name,
  label,
  defaultValue = "",
  accept = "image/*",
  placeholder = "Paste a URL, or upload a file",
}: {
  name: string;
  label?: string;
  defaultValue?: string;
  accept?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(null);
    setError(null);
    try {
      const SAFE_FALLBACK_BYTES = 4 * 1024 * 1024; // Vercel's own function body limit is around here
      try {
        const blob = await upload(`uploads/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload/token",
          onUploadProgress: ({ percentage }) => setProgress(percentage),
        });
        setValue(blob.url);
      } catch (blobErr) {
        // Only worth retrying through the classic path for files small
        // enough that it'd actually succeed (e.g. local dev without Blob
        // configured). A large file that failed here would just hang or
        // fail again the same way through that route.
        if (file.size > SAFE_FALLBACK_BYTES) throw blobErr;

        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed.");
        setValue(data.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      setProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="col-span-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-[11px] uppercase tracking-wide text-ink-700/60">
          {label}
        </label>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input
          id={inputId}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="min-w-[220px] flex-1 rounded-md border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
        />
        <label className="cursor-pointer rounded-md border hairline px-3 py-2 text-[11px] uppercase tracking-wide text-ink-700 transition hover:border-ink-900 hover:text-ink-900">
          {uploading
            ? progress != null
              ? `Uploading… ${Math.round(progress)}%`
              : "Uploading…"
            : "Choose File"}
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] uppercase tracking-wide text-bronze-600 hover:text-bronze-700"
          >
            Preview →
          </a>
        )}
      </div>
      {error && <p className="mt-1 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
