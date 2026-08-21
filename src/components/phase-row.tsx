"use client";

import { useTransition } from "react";
import { setPhaseStatus } from "@/lib/actions/phases";
import { Pill } from "@/components/ui";
import { formatDate } from "@/lib/format";

type PhaseLike = {
  id: string;
  name: string;
  order: number;
  status: string;
  description: string | null;
  expectedDate: string | Date | null;
  actualDate: string | Date | null;
};

export function PhaseRow({
  phase,
  isLast,
  canEdit,
}: {
  phase: PhaseLike;
  isLast: boolean;
  canEdit: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const complete = phase.status === "complete";
  const current = phase.status === "current";

  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium ${
            complete
              ? "border-bronze-500 bg-bronze-500 text-paper"
              : current
              ? "border-bronze-500 bg-paper text-bronze-600"
              : "hairline bg-paper text-ink-700/40"
          }`}
        >
          {String(phase.order + 1).padStart(2, "0")}
        </div>
        {!isLast && (
          <div
            className={`my-1 w-px flex-1 ${complete ? "bg-bronze-500/40" : "bg-ink-900/10"}`}
          />
        )}
      </div>

      <div className={`pb-10 ${current ? "" : ""}`}>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className={`font-serif text-xl ${current ? "text-ink-900" : complete ? "text-ink-900" : "text-ink-700/50"}`}>
            {phase.name}
          </h3>
          {current && <Pill tone="bronze">In Progress</Pill>}
          {complete && <Pill tone="moss">Complete</Pill>}
        </div>
        {phase.description && (
          <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-ink-700/70">
            {phase.description}
          </p>
        )}
        <p className="mt-1.5 text-[11px] uppercase tracking-wide text-ink-700/40">
          {complete && phase.actualDate
            ? `Completed ${formatDate(phase.actualDate)}`
            : phase.expectedDate
            ? `Expected ${formatDate(phase.expectedDate)}`
            : null}
        </p>

        {canEdit && (
          <div className="mt-3 flex gap-2">
            {(["upcoming", "current", "complete"] as const).map((s) => (
              <button
                key={s}
                disabled={pending || phase.status === s}
                onClick={() => startTransition(() => setPhaseStatus(phase.id, s))}
                className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wide transition ${
                  phase.status === s
                    ? "border-ink-900 bg-ink-900 text-paper"
                    : "hairline text-ink-700/60 hover:border-ink-900"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
