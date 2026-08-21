import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { PageShell, SectionIntro, Card } from "@/components/ui";
import { TradeCard } from "@/components/trade-card";
import { updateHomeStatus } from "@/lib/actions/trades";

export default async function ProgressPage() {
  const { session, home } = await requireSessionAndHome();

  const trades = await prisma.trade.findMany({
    where: { homeId: home.id },
    orderBy: { order: "asc" },
    include: { subcategories: { orderBy: { order: "asc" } } },
  });

  const canEdit = session.role === "BUILDER";
  const setHomeStatus = updateHomeStatus.bind(null, home.id);

  return (
    <PageShell>
      <SectionIntro
        eyebrow="Build Progress"
        title={
          <>
            Not just a percentage — <em className="italic text-bronze-600">what it means.</em>
          </>
        }
        lede="Every trade tells its own story. Expand any trade to see exactly what's finished, what's underway, and what's next."
      />

      {canEdit && (
        <Card className="mt-8 p-6">
          <form action={setHomeStatus} className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-ink-700/60">
                Overall Complete %
              </label>
              <input
                type="number"
                name="overallProgress"
                min={0}
                max={100}
                defaultValue={home.overallProgress}
                className="mt-1 w-28 rounded-md border hairline bg-paper px-2 py-1.5 text-sm outline-none focus:border-bronze-400"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-ink-700/60">
                Current Phase
              </label>
              <input
                name="currentPhase"
                defaultValue={home.currentPhase ?? ""}
                className="mt-1 w-56 rounded-md border hairline bg-paper px-2 py-1.5 text-sm outline-none focus:border-bronze-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-ink-900 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-paper transition hover:bg-bronze-600"
            >
              Update Residence Header
            </button>
          </form>
        </Card>
      )}

      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {trades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} canEdit={canEdit} />
        ))}
      </div>
    </PageShell>
  );
}
