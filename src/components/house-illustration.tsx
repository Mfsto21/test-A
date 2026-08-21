export function HouseIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 640"
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <line x1="0" y1="520" x2="1200" y2="520" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />

      {/* Low modern roofline */}
      <path
        d="M120 380 L360 260 L840 260 L1080 380"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1.5"
      />
      <path d="M360 260 L360 220 L840 220 L840 260" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />

      {/* Main volume */}
      <path
        d="M150 380 L150 520 M1050 380 L1050 520"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="1.5"
      />
      <path d="M150 380 L1050 380" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" />

      {/* Window wall / great room glazing */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line
          key={i}
          x1={430 + i * 34}
          y1={380}
          x2={430 + i * 34}
          y2={520}
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      ))}
      <line x1="430" y1="450" x2="770" y2="450" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />

      {/* Left wing */}
      <path d="M150 460 L260 460 L260 520" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" />
      <rect x="180" y="480" width="40" height="40" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />

      {/* Right wing / garage */}
      <path d="M900 460 L1050 460" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" />
      <rect x="930" y="480" width="80" height="40" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />

      {/* Entry canopy */}
      <path d="M300 380 L300 340 L360 340 L360 380" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" />
      <line x1="330" y1="340" x2="330" y2="520" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />

      {/* Site line / landscape */}
      <path
        d="M0 560 C 250 540, 400 575, 620 555 S 950 535, 1200 560"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <path
        d="M0 590 C 300 575, 550 605, 800 585 S 1050 570, 1200 590"
        stroke="currentColor"
        strokeOpacity="0.14"
        strokeWidth="1"
      />
    </svg>
  );
}
