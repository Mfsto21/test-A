type MediaLike = {
  id: string;
  type: string;
  url: string | null;
  caption: string | null;
  room: string | null;
};

const TYPE_LABEL: Record<string, string> = {
  photo: "Photograph",
  video: "Walkthrough",
  drone: "Drone Footage",
};

function TypeIcon({ type }: { type: string }) {
  if (type === "drone") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 4l4.5 4.5M20 4l-4.5 4.5M4 20l4.5-4.5M20 20l-4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="4" cy="4" r="1.6" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="20" cy="4" r="1.6" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="4" cy="20" r="1.6" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="1.6" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  if (type === "video") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M16 10l5-2.5v9L16 14" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8.5" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 16l5.5-5 4 3.5L18 10l3 4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function MediaTile({ media }: { media: MediaLike }) {
  return (
    <div className="group overflow-hidden rounded-xl border hairline bg-ink-900">
      <div className="relative flex aspect-[4/3] items-center justify-center text-paper/40">
        {media.url ? (
          media.type === "video" || media.type === "drone" ? (
            <video src={media.url} className="h-full w-full object-cover" controls />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.url} alt={media.caption ?? ""} className="h-full w-full object-cover" />
          )
        ) : (
          <div className="bg-grain absolute inset-0" />
        )}
        {!media.url && (
          <div className="relative flex flex-col items-center gap-2">
            <TypeIcon type={media.type} />
            <span className="text-[10px] uppercase tracking-widest2">
              {TYPE_LABEL[media.type] ?? media.type}
            </span>
          </div>
        )}
      </div>
      {(media.caption || media.room) && (
        <div className="bg-ink-900 px-3 py-2.5">
          {media.room && (
            <div className="text-[10px] uppercase tracking-wide text-bronze-400">{media.room}</div>
          )}
          {media.caption && <p className="mt-0.5 text-[12px] text-paper/70">{media.caption}</p>}
        </div>
      )}
    </div>
  );
}
