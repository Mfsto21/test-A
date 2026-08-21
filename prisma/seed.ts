import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Future Home Platform with real Kendall Hill pilot data…");

  const builder = await prisma.builder.create({
    data: {
      name: "MJF Construction & Development",
      license: "Lic #1069037",
      website: "https://www.mjfconstruction.net",
    },
  });

  const home = await prisma.home.create({
    data: {
      slug: "kendall-hill",
      name: "Kendall Hill",
      address: "3580 Kendell Hill Drive, Santa Rosa, CA 95404",
      ownerLabel: "The Kendall Hill Owners",
      overallProgress: 35,
      currentPhase: "MEP Rough-In",
      builderId: builder.id,
    },
  });

  const builderUser = await prisma.user.create({
    data: {
      email: "builder@mjfconstruction.net",
      passwordHash: bcrypt.hashSync("mjfbuilder2026", 10),
      name: "MJF Team",
      role: "BUILDER",
      builderId: builder.id,
    },
  });

  const ownerUser = await prisma.user.create({
    data: {
      email: "owner@kendallhill.com",
      passwordHash: bcrypt.hashSync("kendallhill2026", 10),
      name: "Kendall Hill Owners",
      role: "OWNER",
      homeId: home.id,
    },
  });

  // ---- Trades / Build Progress ----------------------------------------
  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Framing",
      order: 0,
      progress: 95,
      summary:
        "The main residence is substantially framed. The pool room and pool bathroom are still pending, waiting on the pool permit.",
      milestoneNote: null,
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Windows & Doors",
      order: 1,
      progress: 100,
      summary: "All windows and doors are installed, supplied by AD.",
      completedAt: new Date(),
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Plumbing",
      order: 2,
      progress: 25,
      summary: "Top-out is underway across the home.",
      milestoneNote: "Top-out continues over the next few weeks",
      subcategories: {
        create: [
          { name: "Water Lines", order: 0, progress: 50 },
          { name: "Rough-In Valves", order: 1, progress: 25 },
          { name: "DWV", order: 2, progress: 20 },
          { name: "Top-Out", order: 3, progress: 5 },
        ],
      },
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Electrical",
      order: 3,
      progress: 0,
      summary: "Rough-in is beginning now that framing has cleared the way.",
      milestoneNote: "Rough-in beginning",
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "HVAC",
      order: 4,
      progress: 0,
      summary: "Rough-in is beginning alongside electrical.",
      milestoneNote: "Rough-in beginning",
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Waste / DWV",
      order: 5,
      progress: 85,
      summary: "Drain-waste-vent rough-in is finishing up.",
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Roofing",
      order: 6,
      progress: 0,
      summary: "Roofing is expected to begin in the next few weeks.",
      milestoneNote: "Expected to begin in the next few weeks",
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Stucco",
      order: 7,
      progress: 0,
      summary: "The exterior envelope starts with a waterproofing membrane, followed by lath.",
      milestoneNote: "Waterproofing membrane, then lath",
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Roller Shutters",
      order: 8,
      progress: 0,
      summary: "The roller shutter contractor is arriving to begin installation.",
      milestoneNote: "Contractor arriving August 27",
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Fire Sprinklers",
      order: 9,
      progress: 0,
      summary: "The fire sprinkler contractor is expected to begin soon.",
      milestoneNote: "Expected to begin in approximately 3 weeks",
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Fascia",
      order: 10,
      progress: 0,
      summary: "Fascia painting is coming up next.",
      milestoneNote: "Painting coming",
    },
  });

  await prisma.trade.create({
    data: {
      homeId: home.id,
      name: "Pool",
      order: 11,
      progress: 0,
      summary: "The pool and pool bath are waiting on permit before work can continue.",
      milestoneNote: "Waiting on permit — no new update yet",
    },
  });

  // ---- Phases / Timeline -------------------------------------------------
  const phaseDefs: { name: string; status: string }[] = [
    { name: "Design", status: "complete" },
    { name: "Engineering", status: "complete" },
    { name: "Permits", status: "complete" },
    { name: "Excavation", status: "complete" },
    { name: "Foundation", status: "complete" },
    { name: "Framing", status: "current" },
    { name: "Windows & Doors", status: "complete" },
    { name: "Electrical", status: "current" },
    { name: "Plumbing", status: "current" },
    { name: "HVAC", status: "current" },
    { name: "Insulation", status: "upcoming" },
    { name: "Drywall", status: "upcoming" },
    { name: "Cabinets", status: "upcoming" },
    { name: "Flooring", status: "upcoming" },
    { name: "Lighting", status: "upcoming" },
    { name: "Landscaping", status: "upcoming" },
    { name: "Final Inspection", status: "upcoming" },
    { name: "Move-In", status: "upcoming" },
  ];

  for (let i = 0; i < phaseDefs.length; i++) {
    await prisma.phase.create({
      data: {
        homeId: home.id,
        name: phaseDefs[i].name,
        order: i,
        status: phaseDefs[i].status,
        actualDate: phaseDefs[i].status === "complete" ? new Date() : null,
      },
    });
  }

  // ---- Plans ---------------------------------------------------------
  const planNames = ["Site Plan", "First Floor", "Lower Floor", "Pool Room", "Architectural"];
  for (let i = 0; i < planNames.length; i++) {
    await prisma.planDocument.create({
      data: { homeId: home.id, name: planNames[i], order: i },
    });
  }

  // ---- Design Studio / Decisions --------------------------------------
  const retainingWall = await prisma.decision.create({
    data: {
      homeId: home.id,
      title: "Rock Retaining Wall",
      category: "Landscape",
      description:
        "Two contractor proposals for the dry-stack rock retaining wall. Compare scope and pricing below, then choose the one you'd like MJF to move forward with.",
      order: 0,
    },
  });

  await prisma.decisionOption.createMany({
    data: [
      {
        decisionId: retainingWall.id,
        vendorName: "Canepa Landscaping",
        amount: 25565,
        scope: "Approximately 75 linear feet of dry-stack rock wall, up to 5 ft at the lowest grade.",
        inclusions: "Uses site rock; includes backfill and leveling.",
      },
      {
        decisionId: retainingWall.id,
        vendorName: "Green Vine Landscaping",
        amount: 15434.29,
        scope:
          "Proposal #9720 — approximately 40 linear feet of dry-stack stone retaining wall using existing onsite stone and fill dirt.",
        inclusions: "Excavation/backfill ($6,533.26) + wall installation ($8,901.03).",
        notes: "Optional drainage add-on available at $4,587.15.",
      },
    ],
  });

  await prisma.decision.create({
    data: {
      homeId: home.id,
      title: "Outdoor Kitchen",
      category: "Kitchen",
      description: "Relocating the outdoor kitchen is currently being considered.",
      order: 1,
    },
  });

  await prisma.decision.create({
    data: {
      homeId: home.id,
      title: "Cabinet Drawings",
      category: "Cabinetry",
      description: "Cabinet drawings will be uploaded here as soon as they're received from the shop.",
      order: 2,
    },
  });

  await prisma.decision.create({
    data: {
      homeId: home.id,
      title: "The Pool",
      category: "Pool",
      description:
        "The pool and pool bath are waiting on permit. No new update at the moment — as soon as there's movement, you'll see it here first.",
      important: true,
      order: 3,
    },
  });

  // ---- The Home Story --------------------------------------------------
  const story = await prisma.storyUpdate.create({
    data: {
      homeId: home.id,
      title: "The Frame Comes Alive",
      weekLabel: "Week of August 17, 2026",
      narrative:
        "Imagine you're standing here with me, right in the middle of what will be your great room. The frame is up almost everywhere now — the only piece we're still waiting on is the pool room and pool bath, which need that permit before we can close them in. \n\nThis week the plumbers started top-out — that's the point where all the supply and drain lines finally reach their final runs before drywall goes up. You'll see it broken out below by water lines, rough-in valves, and DWV, because each moves at its own pace. Electrical and HVAC are starting their rough-in right behind them, so the next few weeks are going to move fast.\n\nOn the exterior, we're getting ready for roofing in the next few weeks, and the stucco crew will start with a waterproofing membrane followed by lath. The roller shutter contractor is arriving August 27, and fire sprinklers should start in about three weeks. Fascia painting is coming up after that.\n\nI know the pool is the one you're waiting to hear about — we don't have a new update yet, we're still sitting with the county on that permit. The moment it moves, you'll be the first to know.",
      whatWeSee:
        "Standing in the great room today, you can finally feel the ceiling height the drawings never quite communicate. The window wall is framed exactly where it needs to be to catch the afternoon light, and you can already see how the kitchen island will sit in relation to it. This is the moment a house on paper starts to feel like a home.",
      authorId: builderUser.id,
    },
  });

  await prisma.media.create({
    data: {
      homeId: home.id,
      storyUpdateId: story.id,
      type: "drone",
      room: null,
      phase: "Framing",
      caption: "This week's aerial view over the site.",
    },
  });
  await prisma.media.create({
    data: {
      homeId: home.id,
      storyUpdateId: story.id,
      type: "photo",
      room: "Great Room",
      phase: "Framing",
      caption: "The window wall, framed and ready for glazing.",
    },
  });
  await prisma.media.create({
    data: {
      homeId: home.id,
      storyUpdateId: story.id,
      type: "photo",
      room: "Kitchen",
      phase: "Plumbing",
      caption: "Rough plumbing taking shape behind the future island.",
    },
  });

  // ---- Ask MJF ---------------------------------------------------------
  await prisma.message.create({
    data: {
      homeId: home.id,
      authorId: ownerUser.id,
      body: "Any news yet on the pool permit? We'd love to know roughly when that piece can move forward.",
    },
  });
  await prisma.message.create({
    data: {
      homeId: home.id,
      authorId: builderUser.id,
      body: "Nothing new to report yet — we're still waiting to hear back from the county. The moment we have movement we'll post it here and walk you through what it means for the pool room and pool bath framing.",
    },
  });

  console.log("Seed complete.");
  console.log("Builder login: builder@mjfconstruction.net / mjfbuilder2026");
  console.log("Owner login:   owner@kendallhill.com / kendallhill2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
