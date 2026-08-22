export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 26L24 8L44 26"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 22V40H38V22"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 40V28H28V40"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M24 8V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export type LogoAssets = {
  logoUrlLight?: string | null; // a dark-colored logo, for use on light/cream backgrounds
  logoUrlDark?: string | null; // a light-colored logo, for use on dark backgrounds
};

/**
 * `tone` describes the logo's own rendered color, matching how the rest of
 * this design system's tone props read: "light" = light-colored (paper),
 * used on a dark surface; "dark" = dark-colored (ink), used on a light
 * surface. When a real logo image exists for that surface, it's used;
 * otherwise this falls back to the vector mark, which adapts to any
 * background via currentColor — the one thing a raster export can't do.
 */
export function BuilderWordmark({
  className = "",
  tone = "dark",
  logoUrlLight,
  logoUrlDark,
}: {
  className?: string;
  tone?: "dark" | "light";
} & LogoAssets) {
  const ink = tone === "light" ? "text-paper" : "text-ink-900";
  const sub = tone === "light" ? "text-paper/60" : "text-ink-700/70";
  const imageSrc = tone === "light" ? logoUrlDark : logoUrlLight;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt="MJF Construction & Development" className="h-9 w-auto" />
      ) : (
        <>
          <LogoMark className={`h-7 w-7 ${ink}`} />
          <div className="leading-none">
            <div className={`text-[13px] font-semibold tracking-widest2 uppercase ${ink}`}>
              MJF
            </div>
            <div className={`text-[9px] tracking-[0.2em] uppercase ${sub}`}>
              Construction &amp; Development
            </div>
          </div>
        </>
      )}
    </div>
  );
}
