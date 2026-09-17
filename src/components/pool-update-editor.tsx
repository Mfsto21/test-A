"use client";

import { useState } from "react";
import { updateDecisionDescription } from "@/lib/actions/decisions";

export function PoolUpdateEditor({ decisionId, description }: { decisionId: string; description: string | null }) {
  const [editing, setEditing] = useState(false);
  const update = updateDecisionDescription.bind(null, decisionId);

  return (
    <div className="mt-3">
      <button
        onClick={() => setEditing((v) => !v)}
        className="text-[11px] uppercase tracking-wide text-bronze-600 hover:text-bronze-700"
      >
        {editing ? "Close" : "Update This"}
      </button>

      {editing && (
        <form action={update} className="mt-3 flex flex-col items-start gap-2">
          <textarea
            name="description"
            defaultValue={description ?? ""}
            rows={3}
            placeholder="Latest update on the pool for the homeowners"
            className="w-full max-w-lg rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-ink-900 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600"
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
}
