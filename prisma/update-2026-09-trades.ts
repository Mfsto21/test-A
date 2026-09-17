// One-off, non-destructive Build Progress update for the live database.
// Adds new trades and subcategories the client asked for without touching
// any existing trade's live progress/summary/milestoneNote. Safe to run
// more than once — every step checks for an existing record by name first.
//
//   npx tsx prisma/update-2026-09-trades.ts
//
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const home = await prisma.home.findFirst({ where: { slug: "kendall-hill" } });
  if (!home) throw new Error("Could not find the Kendell Hill home record.");

  const trades = await prisma.trade.findMany({ where: { homeId: home.id } });
  const maxOrder = trades.reduce((max, t) => Math.max(max, t.order), -1);
  let nextOrder = maxOrder + 1;

  async function ensureBlankTrade(name: string) {
    const existing = trades.find((t) => t.name === name);
    if (existing) {
      console.log(`Trade "${name}" already exists — skipped.`);
      return;
    }
    await prisma.trade.create({
      data: { homeId: home!.id, name, order: nextOrder++, progress: 0 },
    });
    console.log(`Added trade "${name}".`);
  }

  // ---- New blank trades (builder fills in text from the live site) -----
  for (const name of ["AV", "Garage Doors", "Waterproofing", "Cabinets", "Shower Glass", "Glass Railing", "Solar"]) {
    await ensureBlankTrade(name);
  }

  // ---- Painting: new trade, with Fascia folded in as a subcategory -----
  const existingPainting = trades.find((t) => t.name === "Painting");
  if (existingPainting) {
    console.log('Trade "Painting" already exists — skipped.');
  } else {
    const fascia = trades.find((t) => t.name === "Fascia");
    const fasciaProgress = fascia?.progress ?? 0;

    const painting = await prisma.trade.create({
      data: {
        homeId: home.id,
        name: "Painting",
        order: fascia ? fascia.order : nextOrder++,
        progress: 0,
        subcategories: {
          create: [
            { name: "Fascia", order: 0, progress: fasciaProgress },
            { name: "Prime", order: 1, progress: 0 },
            { name: "Interior", order: 2, progress: 0 },
            { name: "Exterior", order: 3, progress: 0 },
          ],
        },
      },
    });
    console.log(`Added trade "Painting" (id ${painting.id}) with Fascia/Prime/Interior/Exterior subcategories.`);

    if (fascia) {
      await prisma.trade.delete({ where: { id: fascia.id } });
      console.log(`Removed the standalone "Fascia" trade (progress ${fasciaProgress}% carried into Painting > Fascia).`);
    }
  }

  // ---- Stucco: add Lath / Scratch / Brown/Acrylic subcategories --------
  const stucco = await prisma.trade.findFirst({
    where: { homeId: home.id, name: "Stucco" },
    include: { subcategories: true },
  });
  if (stucco) {
    const wanted = ["Lath", "Scratch", "Brown/Acrylic"];
    const have = new Set(stucco.subcategories.map((s) => s.name));
    let order = stucco.subcategories.reduce((max, s) => Math.max(max, s.order), -1) + 1;
    for (const name of wanted) {
      if (have.has(name)) {
        console.log(`Stucco subcategory "${name}" already exists — skipped.`);
        continue;
      }
      await prisma.tradeSubcategory.create({
        data: { tradeId: stucco.id, name, order: order++, progress: 0 },
      });
      console.log(`Added Stucco subcategory "${name}".`);
    }
  } else {
    console.log('No "Stucco" trade found — skipped its subcategories.');
  }

  // ---- Plumbing: add Sewer Line / Water Line subcategories --------------
  const plumbing = await prisma.trade.findFirst({
    where: { homeId: home.id, name: "Plumbing" },
    include: { subcategories: true },
  });
  if (plumbing) {
    const wanted = ["Sewer Line", "Water Line"];
    const have = new Set(plumbing.subcategories.map((s) => s.name));
    let order = plumbing.subcategories.reduce((max, s) => Math.max(max, s.order), -1) + 1;
    for (const name of wanted) {
      if (have.has(name)) {
        console.log(`Plumbing subcategory "${name}" already exists — skipped.`);
        continue;
      }
      await prisma.tradeSubcategory.create({
        data: { tradeId: plumbing.id, name, order: order++, progress: 0 },
      });
      console.log(`Added Plumbing subcategory "${name}".`);
    }
  } else {
    console.log('No "Plumbing" trade found — skipped its subcategories.');
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
