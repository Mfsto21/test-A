// One-off, non-destructive update to the live database: the builder tried
// to attach the Canepa proposal PDF to the existing (selected) Canepa
// option, but the only UI available at the time created a brand-new
// duplicate "Canepa Landscaping" option instead. This moves that file
// onto the real, selected option and removes the stray duplicate.
//
//   npx tsx prisma/update-2026-09-merge-canepa-file.ts
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

  const canepaOptions = decision.options.filter((o) => o.vendorName === "Canepa Landscaping");
  if (canepaOptions.length !== 2) {
    throw new Error(
      `Expected exactly 2 "Canepa Landscaping" options (the real one + the stray duplicate), found ${canepaOptions.length}. Stopping — check manually.`
    );
  }

  const real = canepaOptions.find((o) => o.id === decision.selectedOptionId);
  const stray = canepaOptions.find((o) => o.id !== decision.selectedOptionId);
  if (!real || !stray) {
    throw new Error("Could not tell which Canepa option is selected vs. stray. Stopping — check manually.");
  }
  if (!stray.fileUrl) {
    console.log("The stray duplicate has no file attached — nothing to move. Deleting it anyway.");
  }

  await prisma.decisionOption.update({
    where: { id: real.id },
    data: { fileUrl: stray.fileUrl ?? real.fileUrl },
  });
  console.log(`Moved the proposal document onto the real, selected Canepa option (id ${real.id}).`);

  await prisma.decisionOption.delete({ where: { id: stray.id } });
  console.log(`Removed the stray duplicate Canepa Landscaping option (id ${stray.id}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
