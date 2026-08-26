"use client";

import { motion } from "framer-motion";

export function ProgressBar({
  progress,
  size = "md",
}: {
  progress: number;
  size?: "sm" | "md";
}) {
  const complete = progress >= 100;
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className={`relative w-full rounded-full bg-ink-900/[0.07] ${height}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className={`progress-fill ${complete ? "is-complete" : ""} ${height} rounded-full ${
          complete
            ? "bg-gradient-to-r from-bronze-500 to-bronze-400"
            : "bg-ink-900"
        }`}
      />
      {/* A quick, one-time celebration the instant this bar reaches 100% —
          separate from the persistent shimmer above, which keeps going
          indefinitely as the "this trade is done" signal. This one plays
          once per mount and settles, so it reads as a moment, not a loop. */}
      {complete && <CelebrationBurst />}
    </div>
  );
}

function CelebrationBurst() {
  const sparks = [0, 1, 2, 3, 4, 5];
  return (
    <div className="pointer-events-none absolute right-0 top-1/2 z-10 -translate-y-1/2">
      <motion.span
        className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-bronze-400"
        initial={{ opacity: 0.9, scale: 0.3 }}
        animate={{ opacity: 0, scale: 3.4 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 1.0 }}
      />
      {sparks.map((i) => {
        const angle = (i / sparks.length) * Math.PI * 2;
        const dx = Math.cos(angle) * 16;
        const dy = Math.sin(angle) * 16;
        return (
          <motion.span
            key={i}
            className="absolute right-0 top-1/2 h-1 w-1 rounded-full bg-bronze-500"
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: dx, y: dy, scale: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 + i * 0.02 }}
          />
        );
      })}
    </div>
  );
}

export function CompleteBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inline-flex items-center gap-1 rounded-full bg-bronze-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-bronze-700"
    >
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6.5L5 9.5L10 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Complete
    </motion.span>
  );
}
