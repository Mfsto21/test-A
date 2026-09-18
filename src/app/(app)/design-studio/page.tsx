import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { PageShell, SectionIntro, Eyebrow, Card } from "@/components/ui";
import { DecisionCard } from "@/components/decision-card";
import { RevealStagger, RevealItem } from "@/components/reveal";

export default async function DesignStudioPage() {
  const { session, home } = await requireSessionAndHome();

  const decisions = await prisma.decision.findMany({
    // Pool is excluded here on purpose: while it's in permitting there's
    // nothing for the owner to decide, so it doesn't belong in the Design
    // Packet's approval queue. It still gets its own prominent callout on
    // the Residence dashboard.
    where: { homeId: home.id, category: { not: "Pool" } },
    orderBy: [{ important: "desc" }, { order: "asc" }],
    include: { options: true },
  });

  const awaiting = decisions.filter((d) => d.status === "pending" || d.status === "changes_requested");
  const finalized = decisions.filter((d) => d.status === "approved" || d.status === "declined");
  const pendingCount = awaiting.length;
  const canEdit = session.role === "BUILDER";

  return (
    <PageShell>
      <SectionIntro
        eyebrow="Design Studio"
        title={
          <>
            The Design Packet — <em className="italic text-bronze-600">finalize what you love.</em>
          </>
        }
        lede="Every selection you've already made, gathered in one place to review and approve. Compare proposals side by side, ask questions, and keep a permanent record of every decision."
      />

      <Card className="mt-8 flex items-center justify-between p-6">
        <div>
          <Eyebrow>Status</Eyebrow>
          <p className="mt-1 font-serif text-xl text-ink-900">
            {pendingCount === 0
              ? "Everything is finalized."
              : `${pendingCount} item${pendingCount === 1 ? "" : "s"} awaiting your approval`}
          </p>
        </div>
      </Card>

      {awaiting.length > 0 && (
        <RevealStagger className="mt-8 space-y-6">
          {awaiting.map((decision) => (
            <RevealItem key={decision.id}>
              <DecisionCard decision={decision} canEdit={canEdit} />
            </RevealItem>
          ))}
        </RevealStagger>
      )}

      {decisions.length === 0 && (
        <p className="mt-8 text-sm text-ink-700/60">No design items yet.</p>
      )}

      {finalized.length > 0 && (
        <div className="mt-14">
          <Eyebrow>Finalized</Eyebrow>
          <RevealStagger className="mt-4 space-y-6">
            {finalized.map((decision) => (
              <RevealItem key={decision.id}>
                <DecisionCard decision={decision} canEdit={canEdit} />
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      )}
    </PageShell>
  );
}
