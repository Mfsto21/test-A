import { notFound } from "next/navigation";
import Link from "next/link";
import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { addStoryMedia } from "@/lib/actions/story";
import { Card, Eyebrow, PageShell, Pill } from "@/components/ui";
import { MediaTile } from "@/components/media-tile";
import { formatDate } from "@/lib/format";

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session, home } = await requireSessionAndHome();

  const story = await prisma.storyUpdate.findFirst({
    where: { id, homeId: home.id },
    include: { media: { orderBy: { order: "asc" } } },
  });

  if (!story) notFound();

  const addMedia = addStoryMedia.bind(null, story.id, home.id);

  return (
    <PageShell>
      <Link href="/story" className="text-[12px] uppercase tracking-wide text-bronze-600 hover:text-bronze-700">
        ← The Home Story
      </Link>

      <div className="mt-6 max-w-2xl">
        <Pill tone="bronze">{story.weekLabel}</Pill>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-ink-900">{story.title}</h1>
        <p className="mt-2 text-[12px] uppercase tracking-wide text-ink-700/50">
          {formatDate(story.publishedAt)}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="whitespace-pre-line text-[17px] leading-relaxed text-ink-800">
            {story.narrative}
          </p>
        </div>

        {story.whatWeSee && (
          <Card className="h-fit bg-ink-900 p-6 text-paper lg:sticky lg:top-24">
            <Eyebrow>
              <span className="text-bronze-400">What We See</span>
            </Eyebrow>
            <p className="mt-3 font-serif text-lg italic leading-relaxed text-paper/90">
              "{story.whatWeSee}"
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-wide text-paper/40">
              A builder's-eye read on this week — the things thirty years on
              job sites teach you to notice.
            </p>
          </Card>
        )}
      </div>

      {story.media.length > 0 && (
        <div className="mt-14">
          <Eyebrow>Media From This Week</Eyebrow>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {story.media.map((m) => (
              <MediaTile key={m.id} media={m} />
            ))}
          </div>
        </div>
      )}

      {session.role === "BUILDER" && (
        <Card className="mt-10 p-6">
          <Eyebrow>MJF Team — Add Media</Eyebrow>
          <form action={addMedia} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select
              name="type"
              className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
            >
              <option value="photo">Photograph</option>
              <option value="video">Walkthrough Video</option>
              <option value="drone">Drone Footage</option>
            </select>
            <input
              name="room"
              placeholder="Room / area (optional)"
              className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
            />
            <input
              name="url"
              placeholder="File URL (optional — leave blank to placeholder)"
              className="col-span-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
            />
            <input
              name="caption"
              placeholder="Caption"
              className="col-span-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
            />
            <button
              type="submit"
              className="col-span-full ml-auto rounded-lg bg-ink-900 px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600"
            >
              Add to Story
            </button>
          </form>
        </Card>
      )}
    </PageShell>
  );
}
