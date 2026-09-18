"use client";

import { useState } from "react";
import { MediaTile } from "@/components/media-tile";
import { UploadField } from "@/components/upload-field";
import { deleteStoryMedia, replaceStoryMedia } from "@/lib/actions/story";

type MediaLike = {
  id: string;
  type: string;
  url: string | null;
  caption: string | null;
  room: string | null;
};

/**
 * Builder-only view of the story's media grid: same MediaTile as everyone
 * sees, plus hover controls to replace a tile's file or remove it entirely.
 */
export function StoryMediaManager({
  media,
  storyUpdateId,
}: {
  media: MediaLike[];
  storyUpdateId: string;
}) {
  const [replacingId, setReplacingId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {media.map((m) => (
        <div key={m.id} className="group relative">
          <MediaTile media={m} />

          <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setReplacingId((id) => (id === m.id ? null : m.id))}
              className="rounded-md bg-ink-900/80 px-2 py-1 text-[10px] uppercase tracking-wide text-paper backdrop-blur transition hover:bg-bronze-600"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Remove this media from the story? This can't be undone.")) {
                  deleteStoryMedia(storyUpdateId, m.id);
                }
              }}
              className="rounded-md bg-ink-900/80 px-2 py-1 text-[10px] uppercase tracking-wide text-paper backdrop-blur transition hover:bg-red-600"
            >
              Delete
            </button>
          </div>

          {replacingId === m.id && (
            <form
              action={async (formData) => {
                await replaceStoryMedia(storyUpdateId, m.id, formData);
                setReplacingId(null);
              }}
              className="absolute inset-x-0 top-full z-10 mt-2 rounded-lg border hairline bg-paper p-3 shadow-card"
            >
              <UploadField
                name="url"
                accept="image/*,video/*"
                placeholder="Paste a URL, or upload a replacement file"
              />
              <button
                type="submit"
                className="mt-2 w-full rounded-md bg-ink-900 px-3 py-1.5 text-[11px] uppercase tracking-wide text-paper transition hover:bg-bronze-600"
              >
                Save Replacement
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
