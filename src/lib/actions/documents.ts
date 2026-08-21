"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function addDocument(homeId: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "BUILDER") throw new Error("Only the MJF team can do that.");

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const fileUrl = String(formData.get("fileUrl") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name || !category) return;

  await prisma.document.create({
    data: { homeId, name, category, fileUrl: fileUrl || null, notes: notes || null },
  });

  revalidatePath("/home-bible");
}
