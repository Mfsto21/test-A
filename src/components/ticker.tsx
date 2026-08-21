export function Ticker({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="group overflow-hidden border-y hairline bg-ink-900 py-3">
      <div className="animate-[ticker_32s_linear_infinite] flex w-max gap-3 group-hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 whitespace-nowrap text-[11px] uppercase tracking-widest2 text-paper/70"
          >
            {item}
            <span className="text-bronze-400">✦</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
