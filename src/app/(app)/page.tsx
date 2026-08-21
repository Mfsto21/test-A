import Link from "next/link";
import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { formatDate, formatShortDate, daysUntil } from "@/lib/format";
import { HouseIllustration } from "@/components/house-illustration";
import { Ticker } from "@/components/ticker";
import { ProgressBar, CompleteBadge } from "@/components/progress-bar";
import { Card, Eyebrow, Pill, PageShell, SectionIntro } from "@/components/ui";

export default async function ResidencePage() {
  const { home } = await requireSessionAndHome();

  const [trades, latestStory, poolDecision] = await Promise.all([
    prisma.trade.findMany({ where: { homeId: home.id }, orderBy: { order: "asc" } }),
    prisma.storyUpdate.findFirst({
      where: { homeId: home.id },
      orderBy: { publishedAt: "desc" },
      include: { media: { orderBy: { order: "asc" }, take: 4 } },
    }),
    prisma.decision.findFirst({
      where: { homeId: home.id, category: "Pool" },
    }),
  ]);

  const upcoming = trades
    .filter((t) => t.milestoneNote)
    .slice(0, 6);

  const days = daysUntil(home.targetCompletionDate);

  return (
    <div>
      {/* HERO — RESIDENCE */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink-900 text-paper">
        <div className="bg-grain pointer-events-none absolute inset-0" />
        <HouseIllustration className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-full text-paper" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,19,15,0.15) 0%, rgba(21,19,15,0.55) 55%, rgba(21,19,15,0.96) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse at 15% 10%, rgba(169,121,63,0.18), transparent 55%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-40">
          <p className="text-[11px] uppercase tracking-widest2 text-paper/50">
            MJF Construction &amp; Development · Northern &amp; Southern California · Lic #1069037
          </p>
          <p className="mt-6 text-[12px] font-medium uppercase tracking-widest2 text-bronze-400">
            Private Luxury Residence
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-[1.05] sm:text-7xl">
            {home.name.split(" ")[0]}{" "}
            <em className="italic text-bronze-300">
              {home.name.split(" ").slice(1).join(" ") || "Residence"}
            </em>
          </h1>
          <p className="mt-4 text-lg text-paper/70">{home.address}</p>

          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-paper/10 pt-8 sm:grid-cols-4">
            <div>
              <div className="font-serif text-4xl text-paper">{home.overallProgress}%</div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-paper/50">
                Overall Complete
              </div>
            </div>
            <div>
              <div className="font-serif text-4xl text-paper">
                {home.currentPhase ?? "—"}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-paper/50">
                Current Phase
              </div>
            </div>
            <div>
              <div className="font-serif text-4xl text-paper">
                {days && days > 0 ? days : "—"}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-paper/50">
                {days && days > 0 ? "Days to Target" : "Target Date TBD"}
              </div>
            </div>
            <div>
              <div className="font-serif text-4xl text-paper">
                {formatShortDate(home.targetCompletionDate) ?? "—"}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-paper/50">
                Target Completion
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticker
        items={trades.map((t) => t.name.toUpperCase())}
      />

      <PageShell>
        {/* THE HOME STORY teaser */}
        {latestStory && (
          <section className="mb-20">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionIntro
                eyebrow="The Home Story"
                title={
                  <>
                    Your home, <em className="italic text-bronze-600">this week.</em>
                  </>
                }
              />
              <Link
                href="/story"
                className="whitespace-nowrap text-[12px] font-medium uppercase tracking-wide text-bronze-600 hover:text-bronze-700"
              >
                Read the full story →
              </Link>
            </div>

            <Card className="mt-8 grid grid-cols-1 overflow-hidden md:grid-cols-5">
              <div className="relative col-span-2 flex min-h-[240px] items-end bg-ink-900 p-8 text-paper">
                <HouseIllustration className="pointer-events-none absolute inset-0 h-full w-full text-paper/40" />
                <div className="relative">
                  <Pill tone="bronze">{latestStory.weekLabel}</Pill>
                  <h3 className="mt-3 font-serif text-2xl leading-snug">
                    {latestStory.title}
                  </h3>
                </div>
              </div>
              <div className="col-span-3 p-8">
                <p className="text-[15px] leading-relaxed text-ink-700/85">
                  {latestStory.narrative.slice(0, 320)}
                  {latestStory.narrative.length > 320 ? "…" : ""}
                </p>
                {latestStory.whatWeSee && (
                  <div className="mt-5 rounded-xl bg-bronze-500/[0.07] p-4">
                    <Eyebrow>What We See</Eyebrow>
                    <p className="mt-1.5 text-sm italic text-ink-800/90">
                      "{latestStory.whatWeSee}"
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </section>
        )}

        {/* BUILD PROGRESS snapshot */}
        <section className="mb-20">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionIntro
              eyebrow="Build Progress"
              title={
                <>
                  Watch every trade <em className="italic text-bronze-600">take shape.</em>
                </>
              }
            />
            <Link
              href="/progress"
              className="whitespace-nowrap text-[12px] font-medium uppercase tracking-wide text-bronze-600 hover:text-bronze-700"
            >
              See all trades →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trades.slice(0, 6).map((trade) => (
              <Card key={trade.id} className="p-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg text-ink-900">{trade.name}</h4>
                  {trade.progress >= 100 ? (
                    <CompleteBadge />
                  ) : (
                    <span className="font-serif text-lg text-ink-900">
                      {trade.progress}%
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <ProgressBar progress={trade.progress} />
                </div>
                {trade.summary && (
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-700/70">
                    {trade.summary}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* POOL — prominent because it matters to the owners */}
        {poolDecision && (
          <section className="mb-20">
            <Card className="flex flex-col items-start justify-between gap-6 border-bronze-500/30 bg-bronze-500/[0.06] p-8 sm:flex-row sm:items-center">
              <div>
                <Eyebrow>Personally Important To You</Eyebrow>
                <h3 className="mt-2 font-serif text-2xl text-ink-900">The Pool</h3>
                <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-ink-700/80">
                  {poolDecision.description ??
                    "The pool and pool bath are currently waiting on permit. As soon as we have movement, you'll see it here first."}
                </p>
              </div>
              <Pill tone="bronze">{poolDecision.status === "pending" ? "Waiting on Permit" : poolDecision.status}</Pill>
            </Card>
          </section>
        )}

        {/* THE NEXT CHAPTER */}
        {upcoming.length > 0 && (
          <section className="mb-20">
            <SectionIntro
              eyebrow="The Next Chapter"
              title={
                <>
                  What's <em className="italic text-bronze-600">coming next.</em>
                </>
              }
            />
            <div className="mt-10 flex flex-col gap-0">
              {upcoming.map((item, i) => (
                <div key={item.id} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-bronze-500 bg-paper" />
                    {i < upcoming.length - 1 && (
                      <div className="my-1 w-px flex-1 bg-ink-900/10" />
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="text-[11px] uppercase tracking-wide text-bronze-600">
                      {item.name}
                    </div>
                    <p className="mt-1 text-[15px] text-ink-800">{item.milestoneNote}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* QUICK LINKS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickLink href="/plans" title="Explore Your Home" body="Site plan, floors, and architectural drawings." />
          <QuickLink href="/design-studio" title="Design Studio" body="Finalize selections and compare vendor proposals." />
          <QuickLink href="/ask-mjf" title="Ask MJF" body="A direct line to your builder — every answer, kept." />
        </section>
      </PageShell>
    </div>
  );
}

function QuickLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full p-6 transition group-hover:border-bronze-400/60">
        <h4 className="font-serif text-lg text-ink-900">{title}</h4>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-700/70">{body}</p>
        <span className="mt-4 inline-block text-[11px] uppercase tracking-wide text-bronze-600 group-hover:text-bronze-700">
          Open →
        </span>
      </Card>
    </Link>
  );
}
