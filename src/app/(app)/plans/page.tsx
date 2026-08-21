import { requireSessionAndHome } from "@/lib/current-home";
import { prisma } from "@/lib/prisma";
import { PageShell, SectionIntro } from "@/components/ui";
import { PlansExplorer } from "@/components/plans-explorer";

export default async function PlansPage() {
  const { session, home } = await requireSessionAndHome();

  const plans = await prisma.planDocument.findMany({
    where: { homeId: home.id },
    orderBy: { order: "asc" },
  });

  return (
    <PageShell>
      <SectionIntro
        eyebrow="Explore Your Home"
        title={
          <>
            Every drawing, <em className="italic text-bronze-600">at your fingertips.</em>
          </>
        }
        lede="Switch between the site plan, each floor, and the architectural set — then zoom in on exactly what you want to see."
      />

      <div className="mt-10">
        <PlansExplorer plans={plans} canEdit={session.role === "BUILDER"} />
      </div>
    </PageShell>
  );
}
