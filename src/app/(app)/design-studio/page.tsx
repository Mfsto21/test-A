import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { PageShell, SectionIntro, Eyebrow, Card } from "@/components/ui";
import { DecisionCard } from "@/components/decision-card";

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

  const pendingCount = decisions.filter((d) => d.status === "pending").length;

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

      <div className="mt-8 space-y-6">
        {decisions.map((decision) => (
          <DecisionCard
            key={decision.id}
            decision={decision}
            canEdit={session.role === "BUILDER"}
          />
        ))}
        {decisions.length === 0 && (
          <p className="text-sm text-ink-700/60">No design items yet.</p>
        )}
      </div>
    </PageShell>
  );
}
