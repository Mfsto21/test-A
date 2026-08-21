"use client";

import { useState } from "react";
import { ProgressBar, CompleteBadge } from "@/components/progress-bar";
import { Card, Pill } from "@/components/ui";
import { updateTradeProgress, updateSubcategoryProgress } from "@/lib/actions/trades";

type Subcategory = { id: string; name: string; progress: number };
type TradeLike = {
  id: string;
  name: string;
  progress: number;
  summary: string | null;
  milestoneNote: string | null;
  subcategories: Subcategory[];
};

export function TradeCard({
  trade,
  canEdit,
}: {
  trade: TradeLike;
  canEdit: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const updateTrade = updateTradeProgress.bind(null, trade.id);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl text-ink-900">{trade.name}</h3>
          {trade.summary && (
            <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-ink-700/70">
              {trade.summary}
            </p>
          )}
        </div>
        {trade.progress >= 100 ? (
          <CompleteBadge />
        ) : (
          <span className="font-serif text-2xl text-ink-900">{trade.progress}%</span>
        )}
      </div>

      <div className="mt-5">
        <ProgressBar progress={trade.progress} />
      </div>

      {trade.milestoneNote && (
        <p className="mt-4 text-[12px] uppercase tracking-wide text-bronze-600">
          Next — {trade.milestoneNote}
        </p>
      )}

      <div className="mt-5 flex items-center gap-4">
        {trade.subcategories.length > 0 && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-[11px] uppercase tracking-wide text-ink-700/60 hover:text-ink-900"
          >
            {open ? "Hide" : "Show"} breakdown ({trade.subcategories.length})
          </button>
        )}
        {canEdit && (
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-[11px] uppercase tracking-wide text-bronze-600 hover:text-bronze-700"
          >
            {editing ? "Close" : "Update"}
          </button>
        )}
      </div>

      {open && trade.subcategories.length > 0 && (
        <div className="mt-5 space-y-4 border-t hairline pt-5">
          {trade.subcategories.map((sub) => (
            <div key={sub.id}>
              <div className="mb-1.5 flex items-center justify-between text-[12px]">
                <span className="text-ink-800">{sub.name}</span>
                <span className="text-ink-700/60">{sub.progress}%</span>
              </div>
              <ProgressBar progress={sub.progress} size="sm" />
              {canEdit && editing && (
                <SubcategoryEditor id={sub.id} progress={sub.progress} />
              )}
            </div>
          ))}
        </div>
      )}

      {canEdit && editing && (
        <form
          action={updateTrade}
          className="mt-5 space-y-3 border-t hairline pt-5"
        >
          <div className="flex items-center gap-3">
            <label className="w-28 shrink-0 text-[11px] uppercase tracking-wide text-ink-700/60">
              Progress %
            </label>
            <input
              type="number"
              name="progress"
              min={0}
              max={100}
              defaultValue={trade.progress}
              className="w-24 rounded-md border hairline bg-paper px-2 py-1.5 text-sm outline-none focus:border-bronze-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-28 shrink-0 text-[11px] uppercase tracking-wide text-ink-700/60">
              Summary
            </label>
            <input
              name="summary"
              defaultValue={trade.summary ?? ""}
              placeholder="Plain-language explanation for the homeowner"
              className="flex-1 rounded-md border hairline bg-paper px-2 py-1.5 text-sm outline-none focus:border-bronze-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-28 shrink-0 text-[11px] uppercase tracking-wide text-ink-700/60">
              Next up
            </label>
            <input
              name="milestoneNote"
              defaultValue={trade.milestoneNote ?? ""}
              placeholder="e.g. Roller shutter contractor arriving 8/27"
              className="flex-1 rounded-md border hairline bg-paper px-2 py-1.5 text-sm outline-none focus:border-bronze-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-ink-900 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600"
          >
            Save
          </button>
        </form>
      )}
    </Card>
  );
}

function SubcategoryEditor({ id, progress }: { id: string; progress: number }) {
  const action = updateSubcategoryProgress.bind(null, id);
  return (
    <form action={action} className="mt-2 flex items-center gap-2">
      <input
        type="number"
        name="progress"
        min={0}
        max={100}
        defaultValue={progress}
        className="w-20 rounded-md border hairline bg-paper px-2 py-1 text-xs outline-none focus:border-bronze-400"
      />
      <button
        type="submit"
        className="rounded-md border hairline px-2.5 py-1 text-[10px] uppercase tracking-wide text-ink-700 hover:border-ink-900"
      >
        Save
      </button>
    </form>
  );
}
