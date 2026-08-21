"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function requireBuilder() {
  const session = await getSession();
  if (!session || session.role !== "BUILDER") {
    throw new Error("Only the MJF team can do that.");
  }
  return session;
}

function clampProgress(raw: FormDataEntryValue | null) {
  const n = Number(raw);
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export async function updateTradeProgress(tradeId: string, formData: FormData) {
  await requireBuilder();

  const progress = clampProgress(formData.get("progress"));
  const summary = String(formData.get("summary") ?? "").trim();
  const milestoneNote = String(formData.get("milestoneNote") ?? "").trim();

  const existing = await prisma.trade.findUniqueOrThrow({ where: { id: tradeId } });
  const justCompleted = progress >= 100 && existing.progress < 100;

  await prisma.trade.update({
    where: { id: tradeId },
    data: {
      progress,
      summary: summary || existing.summary,
      milestoneNote: milestoneNote || existing.milestoneNote,
      completedAt: justCompleted ? new Date() : existing.completedAt,
    },
  });

  revalidatePath("/progress");
  revalidatePath("/");
}

export async function updateSubcategoryProgress(subcategoryId: string, formData: FormData) {
  await requireBuilder();
  const progress = clampProgress(formData.get("progress"));

  await prisma.tradeSubcategory.update({
    where: { id: subcategoryId },
    data: { progress },
  });

  revalidatePath("/progress");
}

export async function updateHomeStatus(homeId: string, formData: FormData) {
  await requireBuilder();

  const overallProgress = clampProgress(formData.get("overallProgress"));
  const currentPhase = String(formData.get("currentPhase") ?? "").trim();

  await prisma.home.update({
    where: { id: homeId },
    data: {
      overallProgress,
      currentPhase: currentPhase || undefined,
    },
  });

  revalidatePath("/");
}
