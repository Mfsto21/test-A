"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function setPlanFileUrl(planId: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "BUILDER") {
    throw new Error("Only the MJF team can do that.");
  }

  const fileUrl = String(formData.get("fileUrl") ?? "").trim();
  await prisma.planDocument.update({
    where: { id: planId },
    data: { fileUrl: fileUrl || null },
  });

  revalidatePath("/plans");
}
