import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-widest2 text-bronze-600">
      {children}
    </p>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  lede,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 max-w-2xl font-serif text-3xl leading-snug text-ink-900 sm:text-4xl">
        {title}
      </h2>
      {lede && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-700/80">{lede}</p>}
    </div>
  );
}

export function Card({
  children,
  className = "",
  interactive = false,
  elevated = false,
}: {
  children: ReactNode;
  className?: string;
  /** Adds a hover lift + deeper shadow for cards that are clickable/whole-card links. */
  interactive?: boolean;
  /** Gives the card extra visual weight (deeper shadow) for the things that matter most. */
  elevated?: boolean;
}) {
  // Utility classes with equal specificity are ordered by where they land in
  // the compiled stylesheet, not by position in this string — so a caller
  // passing its own bg-* override can silently lose to the default here.
  // Omit the default whenever the caller supplies any bg- utility.
  const hasBgOverride = /(^|\s)bg-/.test(className);
  return (
    <div
      className={`card-sheen rounded-2xl border hairline transition-[transform,box-shadow] duration-300 ease-refined ${
        elevated ? "shadow-elevated" : "shadow-card"
      } ${
        interactive
          ? "motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-card-hover motion-safe:active:translate-y-0"
          : ""
      } ${hasBgOverride ? "" : "bg-paper-50"} ${className}`}
    >
      {children}
    </div>
  );
}

export function Stat({
  value,
  label,
  tone = "dark",
}: {
  value: string;
  label: string;
  tone?: "dark" | "light";
}) {
  const valueColor = tone === "light" ? "text-paper" : "text-ink-900";
  const labelColor = tone === "light" ? "text-paper/50" : "text-ink-700/60";
  return (
    <div>
      <div className={`font-serif text-3xl ${valueColor}`}>{value}</div>
      <div className={`mt-1 text-[11px] uppercase tracking-wide ${labelColor}`}>
        {label}
      </div>
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "bronze" | "moss";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink-900/5 text-ink-700",
    bronze: "bg-bronze-500/10 text-bronze-700",
    moss: "bg-moss/10 text-moss",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide transition-colors duration-300 ease-refined ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PageShell({
  children,
  noTopClearance = false,
}: {
  children: ReactNode;
  /** Skip the nav-clearance padding — for use right after a hero that
   * already provides its own space below the (transparent) fixed nav. */
  noTopClearance?: boolean;
}) {
  // Nav is fixed/floating (so it can overlay the Residence hero
  // transparently), which means every other page has to compensate with its
  // own top clearance — the nav no longer reserves space in normal flow.
  return (
    <div className="relative">
      {/* A quiet echo of the hero's own bronze glow, so interior pages don't
          drop so abruptly from the hero into flat cards. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(169,121,63,0.07),transparent)]"
      />
      <div
        className={`mx-auto max-w-6xl px-6 pb-12 sm:pb-16 ${
          noTopClearance ? "pt-12 sm:pt-16" : "pt-28 sm:pt-32"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
