import Link from "next/link";
import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { publishStoryUpdate } from "@/lib/actions/story";
import { Card, Eyebrow, PageShell, Pill, SectionIntro } from "@/components/ui";
import { formatDate } from "@/lib/format";

export default async function StoryFeedPage() {
  const { session, home } = await requireSessionAndHome();

  const stories = await prisma.storyUpdate.findMany({
    where: { homeId: home.id },
    orderBy: { publishedAt: "desc" },
    include: { media: { take: 1 } },
  });

  const publish = publishStoryUpdate.bind(null, home.id);

  return (
    <PageShell>
      <SectionIntro
        eyebrow="The Home Story"
        title={
          <>
            Standing here with you, <em className="italic text-bronze-600">every week.</em>
          </>
        }
        lede="Not a status log — a personal account of what changed at your home, why it matters, and what's coming next, from the people building it."
      />

      {session.role === "BUILDER" && (
        <Card className="mt-10 p-6">
          <Eyebrow>MJF Team — Publish This Week's Story</Eyebrow>
          <form action={publish} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              name="weekLabel"
              placeholder="Week of August 17, 2026"
              required
              className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
            />
            <input
              name="title"
              placeholder="Title — e.g. The Frame Comes Alive"
              required
              className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
            />
            <textarea
              name="narrative"
              placeholder="Imagine you're standing here with me…"
              required
              rows={4}
              className="col-span-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
            />
            <textarea
              name="whatWeSee"
              placeholder="What We See — the builder's perspective on this moment"
              rows={2}
              className="col-span-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400"
            />
            <button
              type="submit"
              className="col-span-full ml-auto rounded-lg bg-ink-900 px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600"
            >
              Publish to Homeowners
            </button>
          </form>
        </Card>
      )}

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {stories.map((story) => (
          <Link key={story.id} href={`/story/${story.id}`} className="group block">
            <Card className="h-full overflow-hidden transition group-hover:border-bronze-400/60">
              <div className="p-6">
                <Pill tone="bronze">{story.weekLabel}</Pill>
                <h3 className="mt-3 font-serif text-xl text-ink-900">{story.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-700/70">
                  {story.narrative.slice(0, 180)}
                  {story.narrative.length > 180 ? "…" : ""}
                </p>
                <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-wide text-ink-700/50">
                  <span>{formatDate(story.publishedAt)}</span>
                  <span className="text-bronze-600 group-hover:text-bronze-700">Read →</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {stories.length === 0 && (
          <p className="text-sm text-ink-700/60">No stories published yet.</p>
        )}
      </div>
    </PageShell>
  );
}
