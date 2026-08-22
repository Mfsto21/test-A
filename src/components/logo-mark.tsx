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
  logoIconUrl?: string | null;
  logoWordmarkUrl?: string | null;
};

/**
 * The real MJF mark is two assets — an icon and a wordmark — composed
 * together, matching mjfconstruction.net's own lockup. Both are supplied as
 * black-on-transparent art, so getting a version for the dark hero isn't a
 * second asset: it's a CSS invert on the same one. `tone="light"` (the
 * logo's own rendered color, matching every other tone prop in this design
 * system) means "on a dark surface," so that's when the invert is applied.
 *
 * `layout="horizontal"` sits the icon beside the wordmark (the nav bar,
 * where height is tight); `layout="stacked"` centers the icon above the
 * wordmark (the login screen, which has the room for a presented lockup).
 * Falls back to the vector mark + hand-set type when no real assets exist.
 */
export function BuilderWordmark({
  className = "",
  tone = "dark",
  layout = "horizontal",
  logoIconUrl,
  logoWordmarkUrl,
}: {
  className?: string;
  tone?: "dark" | "light";
  layout?: "horizontal" | "stacked";
} & LogoAssets) {
  const ink = tone === "light" ? "text-paper" : "text-ink-900";
  const sub = tone === "light" ? "text-paper/60" : "text-ink-700/70";
  const invert = tone === "light" ? "brightness-0 invert" : "";

  if (logoIconUrl || logoWordmarkUrl) {
    const stacked = layout === "stacked";
    return (
      <div
        className={`flex items-center ${stacked ? "flex-col gap-2" : "flex-row gap-3"} ${className}`}
      >
        {logoIconUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoIconUrl}
            alt="MJF"
            className={`${stacked ? "h-14" : "h-8"} w-auto ${invert}`}
          />
        )}
        {logoWordmarkUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoWordmarkUrl}
            alt="MJF Construction & Development"
            className={`${stacked ? "h-7" : "h-5"} w-auto ${invert}`}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className={`h-7 w-7 ${ink}`} />
      <div className="leading-none">
        <div className={`text-[13px] font-semibold tracking-widest2 uppercase ${ink}`}>
          MJF
        </div>
        <div className={`text-[9px] tracking-[0.2em] uppercase ${sub}`}>
          Construction &amp; Development
        </div>
      </div>
    </div>
  );
}
