// One-off, non-destructive correction script for the live database.
// Run this instead of `npm run db:reset` (which wipes everything) — it only
// updates the specific fields the client review flagged, and leaves any
// uploaded plans/decisions/media alone. Safe to run more than once.
//
//   npx tsx prisma/update-2026-09.ts
//
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const home = await prisma.home.findFirst({ where: { slug: "kendall-hill" } });
  if (!home) throw new Error("Could not find the Kendell Hill home record.");

  // Spelling fixes: "Kendell Hill" (not "Kendall"), "Maria Teresa" (one 's').
  await prisma.home.update({
    where: { id: home.id },
    data: {
      name: "Kendell Hill",
      ownerLabel: "Rainer & Maria Teresa Braun",
    },
  });
  await prisma.user.updateMany({
    where: { homeId: home.id, role: "OWNER" },
    data: { name: "Rainer & Maria Teresa Braun" },
  });
  console.log("Fixed home name and owner name spelling.");

  // Home Story: "county" -> "city", and the "What We See" rewrite.
  const story = await prisma.storyUpdate.findFirst({
    where: { homeId: home.id },
    orderBy: { publishedAt: "desc" },
  });
  if (story) {
    await prisma.storyUpdate.update({
      where: { id: story.id },
      data: {
        narrative: story.narrative.replace(
          "we're still sitting with the county on that permit",
          "we're still sitting with the city on that permit"
        ),
        whatWeSee:
          "Standing in the great room today, you finally get a sense of scale the drawings never quite gave you. The ceilings soar overhead, and the two double tray ceilings we framed in are already doing exactly what they were drawn to do — pulling your eye up and out toward the windows instead of boxing the room in. Turn any direction and you're looking through open framing at the hills beyond; the views out here really are expansive, and standing in the room instead of just seeing it on paper, you understand why we fought for every inch of that window wall. This is the moment a house on paper starts to feel like a home.",
      },
    });
    console.log("Updated the Home Story narrative and What We See section.");
  }

  // Timeline: Framing complete Aug 5, 2026; add/rename phases.
  const framing = await prisma.phase.findFirst({ where: { homeId: home.id, name: "Framing" } });
  if (framing) {
    await prisma.phase.update({
      where: { id: framing.id },
      data: {
        status: "complete",
        actualDate: new Date("2026-08-05T00:00:00Z"),
        expectedDate: null,
      },
    });
    console.log("Marked Framing complete (Aug 5, 2026).");
  }

  const flooring = await prisma.phase.findFirst({ where: { homeId: home.id, name: "Flooring" } });
  if (flooring) {
    await prisma.phase.update({ where: { id: flooring.id }, data: { name: "Tile" } });
    console.log("Renamed Flooring -> Tile.");
  }

  const hvac = await prisma.phase.findFirst({ where: { homeId: home.id, name: "HVAC" } });
  const existingFireSprinklers = await prisma.phase.findFirst({
    where: { homeId: home.id, name: "Fire Sprinklers" },
  });
  if (hvac && !existingFireSprinklers) {
    const laterPhases = await prisma.phase.findMany({
      where: { homeId: home.id, order: { gt: hvac.order } },
      orderBy: { order: "asc" },
    });
    for (const p of laterPhases) {
      await prisma.phase.update({ where: { id: p.id }, data: { order: p.order + 1 } });
    }
    await prisma.phase.create({
      data: { homeId: home.id, name: "Fire Sprinklers", order: hvac.order + 1, status: "upcoming" },
    });
    console.log("Added Fire Sprinklers after HVAC.");
  }

  const tile = await prisma.phase.findFirst({ where: { homeId: home.id, name: "Tile" } });
  const existingPainting = await prisma.phase.findFirst({ where: { homeId: home.id, name: "Painting" } });
  if (tile && !existingPainting) {
    const laterPhases = await prisma.phase.findMany({
      where: { homeId: home.id, order: { gt: tile.order } },
      orderBy: { order: "asc" },
    });
    for (const p of laterPhases) {
      await prisma.phase.update({ where: { id: p.id }, data: { order: p.order + 1 } });
    }
    await prisma.phase.create({
      data: { homeId: home.id, name: "Painting", order: tile.order + 1, status: "upcoming" },
    });
    console.log("Added Painting after Tile.");
  }

  const landscaping = await prisma.phase.findFirst({ where: { homeId: home.id, name: "Landscaping" } });
  const existingFlatwork = await prisma.phase.findFirst({
    where: { homeId: home.id, name: "Flatwork (Concrete/Asphalt)" },
  });
  if (landscaping && !existingFlatwork) {
    const laterPhases = await prisma.phase.findMany({
      where: { homeId: home.id, order: { gt: landscaping.order } },
      orderBy: { order: "asc" },
    });
    for (const p of laterPhases) {
      await prisma.phase.update({ where: { id: p.id }, data: { order: p.order + 1 } });
    }
    await prisma.phase.create({
      data: {
        homeId: home.id,
        name: "Flatwork (Concrete/Asphalt)",
        order: landscaping.order + 1,
        status: "upcoming",
      },
    });
    console.log("Added Flatwork (Concrete/Asphalt) after Landscaping.");
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
