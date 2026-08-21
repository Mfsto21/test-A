"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Not signed in.");
  return session;
}

export async function chooseDecisionOption(decisionId: string, optionId: string) {
  await requireSession();

  await prisma.decision.update({
    where: { id: decisionId },
    data: { status: "approved", selectedOptionId: optionId },
  });

  revalidatePath("/design-studio");
}

export async function setDecisionStatus(decisionId: string, status: "approved" | "declined" | "pending") {
  await requireSession();

  await prisma.decision.update({
    where: { id: decisionId },
    data: { status, selectedOptionId: status === "approved" ? undefined : null },
  });

  revalidatePath("/design-studio");
}

export async function addDecisionOption(decisionId: string, formData: FormData) {
  const session = await requireSession();
  if (session.role !== "BUILDER") throw new Error("Only the MJF team can do that.");

  const vendorName = String(formData.get("vendorName") ?? "").trim();
  if (!vendorName) return;

  const amountRaw = formData.get("amount");
  const amount = amountRaw ? Number(amountRaw) : null;

  await prisma.decisionOption.create({
    data: {
      decisionId,
      vendorName,
      amount: amount ?? undefined,
      scope: String(formData.get("scope") ?? "").trim() || null,
      inclusions: String(formData.get("inclusions") ?? "").trim() || null,
      exclusions: String(formData.get("exclusions") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      recommended: formData.get("recommended") === "on",
    },
  });

  revalidatePath("/design-studio");
}
