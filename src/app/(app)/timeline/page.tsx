import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { PageShell, SectionIntro } from "@/components/ui";
import { PhaseRow } from "@/components/phase-row";

export default async function TimelinePage() {
  const { session, home } = await requireSessionAndHome();

  const phases = await prisma.phase.findMany({
    where: { homeId: home.id },
    orderBy: { order: "asc" },
  });

  return (
    <PageShell>
      <SectionIntro
        eyebrow="The Construction Journey"
        title={
          <>
            From empty lot <em className="italic text-bronze-600">to home.</em>
          </>
        }
        lede="Every chapter of your home's construction, in order — where you've been, where you are, and what's still ahead."
      />

      <div className="mt-12">
        {phases.map((phase, i) => (
          <PhaseRow
            key={phase.id}
            phase={phase}
            isLast={i === phases.length - 1}
            canEdit={session.role === "BUILDER"}
          />
        ))}
      </div>
    </PageShell>
  );
}
