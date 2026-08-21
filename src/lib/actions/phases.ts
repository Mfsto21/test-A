"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function setPhaseStatus(phaseId: string, status: "upcoming" | "current" | "complete") {
  const session = await getSession();
  if (!session || session.role !== "BUILDER") throw new Error("Only the MJF team can do that.");

  await prisma.phase.update({
    where: { id: phaseId },
    data: {
      status,
      actualDate: status === "complete" ? new Date() : undefined,
    },
  });

  revalidatePath("/timeline");
  revalidatePath("/");
}
