// One-off, non-destructive update to the live database: removes the
// Green Vine Landscaping estimate from the Rock Retaining Wall decision
// now that Canepa has been finalized. Safe to run more than once.
//
//   npx tsx prisma/update-2026-09-remove-greenvine.ts
//
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const home = await prisma.home.findFirst({ where: { slug: "kendall-hill" } });
  if (!home) throw new Error("Could not find the Kendell Hill home record.");

  const decision = await prisma.decision.findFirst({
    where: { homeId: home.id, title: "Rock Retaining Wall" },
    include: { options: true },
  });
  if (!decision) throw new Error('Could not find the "Rock Retaining Wall" decision.');

  const greenVine = decision.options.find((o) => o.vendorName === "Green Vine Landscaping");
  if (!greenVine) {
    console.log("Green Vine Landscaping option not found — already removed, nothing to do.");
    return;
  }

  if (decision.selectedOptionId === greenVine.id) {
    throw new Error(
      "Green Vine is currently the selected option on this decision — refusing to delete it. Re-select Canepa first."
    );
  }

  await prisma.decisionOption.delete({ where: { id: greenVine.id } });
  console.log("Removed the Green Vine Landscaping estimate from Rock Retaining Wall.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
