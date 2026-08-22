"use client";

import { useRef, useState } from "react";

export function PlanViewer({
  fileUrl,
  name,
}: {
  fileUrl: string | null;
  name: string;
}) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const isPdf = fileUrl?.toLowerCase().endsWith(".pdf") ?? false;

  // PDFs get the browser's own viewer — it already has better zoom, search,
  // and multi-page support than our drag canvas can offer, and the two
  // don't compose (an <img> pan/zoom wrapper around a PDF doesn't render).
  if (isPdf && fileUrl) {
    return (
      <div className="overflow-hidden rounded-2xl border hairline">
        <iframe src={fileUrl} title={name} className="h-[620px] w-full" />
      </div>
    );
  }

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    setPos({ x: e.clientX - dragging.current.x, y: e.clientY - dragging.current.y });
  }
  function onPointerUp() {
    dragging.current = null;
  }

  return (
    <div className="relative">
      <div
        className="relative h-[520px] cursor-grab overflow-hidden rounded-2xl border hairline bg-[#0e1f1a] active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(247,242,233,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(247,242,233,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 flex h-full w-full items-center justify-center select-none"
          style={{
            transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transition: dragging.current ? "none" : "transform 0.2s ease-out",
          }}
        >
          {fileUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fileUrl} alt={name} className="max-h-none max-w-none" draggable={false} />
          ) : (
            <div className="flex flex-col items-center gap-3 text-paper/50">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="8" y="8" width="48" height="48" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
                <path d="M8 32h48M32 8v48" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
                <path d="M18 44l8-10 6 6 8-14 8 18" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
              </svg>
              <p className="text-[11px] uppercase tracking-widest2">{name}</p>
              <p className="text-[10px] text-paper/30">Drawing not yet uploaded</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wide text-ink-700/50">
          Drag to pan · use the controls to zoom
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            className="h-8 w-8 rounded-md border hairline text-ink-700 hover:border-ink-900 hover:text-ink-900"
          >
            −
          </button>
          <button
            onClick={() => {
              setScale(1);
              setPos({ x: 0, y: 0 });
            }}
            className="rounded-md border hairline px-3 py-1.5 text-[11px] uppercase tracking-wide text-ink-700 hover:border-ink-900 hover:text-ink-900"
          >
            Reset
          </button>
          <button
            onClick={() => setScale((s) => Math.min(3, s + 0.25))}
            className="h-8 w-8 rounded-md border hairline text-ink-700 hover:border-ink-900 hover:text-ink-900"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
