// One-off, non-destructive update to the live database: sets the target
// completion date to Jan 15, 2027. Safe to run more than once.
//
//   npx tsx prisma/update-2026-09-target-date.ts
//
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const home = await prisma.home.findFirst({ where: { slug: "kendall-hill" } });
  if (!home) throw new Error("Could not find the Kendell Hill home record.");

  await prisma.home.update({
    where: { id: home.id },
    data: { targetCompletionDate: new Date("2027-01-15T00:00:00Z") },
  });
  console.log("Updated target completion date to January 15, 2027.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
