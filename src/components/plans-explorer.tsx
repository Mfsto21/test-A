"use client";

import { useState } from "react";
import { PlanViewer } from "@/components/plan-viewer";
import { Card, Eyebrow, Pill } from "@/components/ui";
import { UploadField } from "@/components/upload-field";
import { setPlanFileUrl } from "@/lib/actions/plans";

type Plan = { id: string; name: string; fileUrl: string | null };

const ROOM_CHIPS = ["Kitchen", "Great Room", "Primary Suite", "Powder", "Pool Room"];

export function PlansExplorer({ plans, canEdit }: { plans: Plan[]; canEdit: boolean }) {
  const [activeId, setActiveId] = useState(plans[0]?.id);
  const active = plans.find((p) => p.id === activeId) ?? plans[0];
  const updatePlan = active ? setPlanFileUrl.bind(null, active.id) : null;

  if (!active) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setActiveId(plan.id)}
            className={`rounded-full border px-4 py-2 text-[12px] uppercase tracking-wide transition ${
              plan.id === activeId
                ? "border-ink-900 bg-ink-900 text-paper"
                : "hairline text-ink-700/70 hover:border-ink-900 hover:text-ink-900"
            }`}
          >
            {plan.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <PlanViewer key={active.id} fileUrl={active.fileUrl} name={active.name} />
      </div>

      {canEdit && updatePlan && (
        <form action={updatePlan} className="mt-4 flex flex-wrap items-center gap-3">
          <UploadField
            name="fileUrl"
            defaultValue={active.fileUrl ?? ""}
            accept="image/*,.pdf"
            placeholder="Paste a URL, or upload this plan's drawing (image or PDF)"
          />
          <button
            type="submit"
            className="rounded-lg bg-ink-900 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600"
          >
            Save Drawing
          </button>
        </form>
      )}

      <Card className="mt-10 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <Eyebrow>Coming Soon</Eyebrow>
          <h4 className="mt-1 font-serif text-lg text-ink-900">Room-Level Navigation</h4>
          <p className="mt-1 max-w-md text-[13px] leading-relaxed text-ink-700/70">
            Soon you'll be able to tap a room and jump straight to it — no
            hunting through the full drawing set.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ROOM_CHIPS.map((room) => (
            <Pill key={room}>{room}</Pill>
          ))}
        </div>
      </Card>
    </div>
  );
}
