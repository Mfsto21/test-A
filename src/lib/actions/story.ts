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

export async function publishStoryUpdate(homeId: string, formData: FormData) {
  const session = await requireBuilder();

  const title = String(formData.get("title") ?? "").trim();
  const weekLabel = String(formData.get("weekLabel") ?? "").trim();
  const narrative = String(formData.get("narrative") ?? "").trim();
  const whatWeSee = String(formData.get("whatWeSee") ?? "").trim();

  if (!title || !weekLabel || !narrative) return;

  await prisma.storyUpdate.create({
    data: {
      homeId,
      title,
      weekLabel,
      narrative,
      whatWeSee: whatWeSee || null,
      authorId: session.sub,
    },
  });

  revalidatePath("/story");
  revalidatePath("/");
}

export async function addStoryMedia(storyUpdateId: string, homeId: string, formData: FormData) {
  await requireBuilder();

  const type = String(formData.get("type") ?? "photo");
  const room = String(formData.get("room") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();

  await prisma.media.create({
    data: {
      homeId,
      storyUpdateId,
      type,
      room: room || null,
      caption: caption || null,
      url: url || null,
    },
  });

  revalidatePath(`/story/${storyUpdateId}`);
}
