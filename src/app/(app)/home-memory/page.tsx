import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { addTimeCapsuleEntry } from "@/lib/actions/memory";
import { Card, Eyebrow, PageShell, Pill, SectionIntro } from "@/components/ui";
import { formatDate } from "@/lib/format";

export default async function HomeMemoryPage() {
  const { session, home } = await requireSessionAndHome();

  const entries = await prisma.timeCapsuleEntry.findMany({
    where: { homeId: home.id },
    orderBy: { createdAt: "desc" },
  });

  const addEntry = addTimeCapsuleEntry.bind(null, home.id);

  return (
    <PageShell>
      <SectionIntro
        eyebrow="Home Memory"
        title={
          <>
            What's inside the walls, <em className="italic text-bronze-600">preserved forever.</em>
          </>
        }
        lede="Before drywall closes a wall for good, we document exactly what's behind it — electrical runs, plumbing, HVAC, structure. Years from now, you'll know before you ever have to guess."
      />

      <div className="mt-10 rounded-2xl border hairline bg-ink-900 p-8 text-paper">
        <Eyebrow>
          <span className="text-bronze-400">The Digital Time Capsule</span>
        </Eyebrow>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-paper/75">
          "Before The Walls Close" is a dedicated capture milestone — organized
          by room and system, so you can always answer the question every
          homeowner eventually asks: what's actually inside this wall?
        </p>
      </div>

      {session.role === "BUILDER" && (
        <Card className="mt-8 p-6">
          <Eyebrow>MJF Team — Add a Capture</Eyebrow>
          <form action={addEntry} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input name="room" placeholder="Room — e.g. Primary Bedroom" required className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400" />
            <select name="system" required className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400">
              <option value="">System…</option>
              <option>Electrical</option>
              <option>Plumbing</option>
              <option>HVAC</option>
              <option>Framing</option>
              <option>Structural</option>
            </select>
            <textarea name="description" placeholder="What's behind this wall — runs, blocking, backing, routing…" required rows={2} className="col-span-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400" />
            <input name="mediaUrl" placeholder="Photo/video URL (optional)" className="col-span-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-bronze-400" />
            <button type="submit" className="col-span-full ml-auto rounded-lg bg-ink-900 px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600">
              Save to Time Capsule
            </button>
          </form>
        </Card>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-6">
            <div className="flex items-center justify-between">
              <Pill tone="bronze">{entry.system}</Pill>
              <span className="text-[11px] uppercase tracking-wide text-ink-700/40">
                {formatDate(entry.createdAt)}
              </span>
            </div>
            <h4 className="mt-3 font-serif text-lg text-ink-900">{entry.room}</h4>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-700/75">
              {entry.description}
            </p>
          </Card>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-ink-700/60">
            No captures yet — this fills in automatically as walls close.
          </p>
        )}
      </div>

      <Card className="mt-10 p-6">
        <Eyebrow>On the Horizon</Eyebrow>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-ink-700/70">
          Future chapters of Home Memory: a cinematic Home Story documentary
          from empty lot to finished home, and a "Time Machine" slider so you
          can scrub through your home's entire history — years after move-in.
        </p>
      </Card>
    </PageShell>
  );
}
