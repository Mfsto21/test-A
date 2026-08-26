"use client";

import { useState } from "react";
import { updateStoryUpdate } from "@/lib/actions/story";

type StoryLike = {
  id: string;
  title: string;
  weekLabel: string;
  narrative: string;
  whatWeSee: string | null;
};

export function StoryEditor({ story }: { story: StoryLike }) {
  const [editing, setEditing] = useState(false);
  const update = updateStoryUpdate.bind(null, story.id);

  return (
    <div className="mt-4 border-t hairline pt-4">
      <button
        onClick={() => setEditing((v) => !v)}
        className="text-[11px] uppercase tracking-wide text-bronze-600 hover:text-bronze-700"
      >
        {editing ? "Close" : "Update This Story"}
      </button>

      {editing && (
        <form action={update} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            name="weekLabel"
            defaultValue={story.weekLabel}
            required
            className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
          />
          <input
            name="title"
            defaultValue={story.title}
            required
            className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
          />
          <textarea
            name="narrative"
            defaultValue={story.narrative}
            required
            rows={8}
            className="col-span-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
          />
          <textarea
            name="whatWeSee"
            defaultValue={story.whatWeSee ?? ""}
            placeholder="What We See — the builder's perspective on this moment"
            rows={3}
            className="col-span-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
          />
          <button
            type="submit"
            className="col-span-full ml-auto rounded-lg bg-ink-900 px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}
