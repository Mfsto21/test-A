// One-off, non-destructive update to the live database: refreshes the Pool
// decision's description to reflect the permit now being with Bureau
// Veritas. Safe to run more than once.
//
//   npx tsx prisma/update-2026-09-pool.ts
//
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const home = await prisma.home.findFirst({ where: { slug: "kendall-hill" } });
  if (!home) throw new Error("Could not find the Kendell Hill home record.");

  const pool = await prisma.decision.findFirst({ where: { homeId: home.id, category: "Pool" } });
  if (!pool) throw new Error('Could not find the "Pool" decision record.');

  await prisma.decision.update({
    where: { id: pool.id },
    data: {
      description:
        "The pool permit has finally moved to Bureau Veritas for review — the clearest path yet toward getting this piece closed out. As soon as there's further movement, you'll see it here first.",
    },
  });
  console.log("Updated the Pool card's description.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
