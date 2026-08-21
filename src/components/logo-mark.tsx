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

export function BuilderWordmark({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const ink = tone === "light" ? "text-paper" : "text-ink-900";
  const sub = tone === "light" ? "text-paper/60" : "text-ink-700/70";
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
