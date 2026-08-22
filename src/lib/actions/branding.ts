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

export async function updateHomePhotos(homeId: string, formData: FormData) {
  await requireBuilder();

  const heroImageUrl = String(formData.get("heroImageUrl") ?? "").trim();
  const progressImageUrl = String(formData.get("progressImageUrl") ?? "").trim();

  await prisma.home.update({
    where: { id: homeId },
    data: {
      heroImageUrl: heroImageUrl || null,
      progressImageUrl: progressImageUrl || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/login");
}

export async function updateBuilderLogo(builderId: string, formData: FormData) {
  await requireBuilder();

  const logoUrlLight = String(formData.get("logoUrlLight") ?? "").trim();
  const logoUrlDark = String(formData.get("logoUrlDark") ?? "").trim();

  await prisma.builder.update({
    where: { id: builderId },
    data: {
      logoUrlLight: logoUrlLight || null,
      logoUrlDark: logoUrlDark || null,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/login");
}
