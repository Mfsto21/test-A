// One-off, non-destructive update to the live database: marks the Rock
// Retaining Wall decision as approved with Canepa Landscaping (already
// signed), and removes the Green Vine bid since it's no longer relevant.
// Safe to run more than once.
//
//   npx tsx prisma/update-2026-09-retaining-wall.ts
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

  const canepa = decision.options.find((o) => o.vendorName === "Canepa Landscaping");
  if (!canepa) throw new Error("Could not find the Canepa Landscaping option.");

  const greenVine = decision.options.find((o) => o.vendorName === "Green Vine Landscaping");
  if (greenVine) {
    await prisma.decisionOption.delete({ where: { id: greenVine.id } });
    console.log("Removed the Green Vine Landscaping bid.");
  } else {
    console.log("No Green Vine Landscaping bid found — already removed.");
  }

  await prisma.decision.update({
    where: { id: decision.id },
    data: {
      status: "approved",
      selectedOptionId: canepa.id,
      description: "Signed with Canepa Landscaping for the dry-stack rock retaining wall.",
    },
  });
  console.log("Marked the Rock Retaining Wall decision approved with Canepa Landscaping.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
