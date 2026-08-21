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
    <div className={`w-full rounded-full bg-ink-900/[0.07] ${height}`}>
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
