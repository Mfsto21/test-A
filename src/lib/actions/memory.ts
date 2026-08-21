"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function addTimeCapsuleEntry(homeId: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "BUILDER") throw new Error("Only the MJF team can do that.");

  const room = String(formData.get("room") ?? "").trim();
  const system = String(formData.get("system") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const mediaUrl = String(formData.get("mediaUrl") ?? "").trim();

  if (!room || !system || !description) return;

  await prisma.timeCapsuleEntry.create({
    data: { homeId, room, system, description, mediaUrl: mediaUrl || null },
  });

  revalidatePath("/home-memory");
}
