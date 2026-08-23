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

  const logoIconUrl = String(formData.get("logoIconUrl") ?? "").trim();
  const logoWordmarkUrl = String(formData.get("logoWordmarkUrl") ?? "").trim();
  const loginHeroImageUrl = String(formData.get("loginHeroImageUrl") ?? "").trim();

  await prisma.builder.update({
    where: { id: builderId },
    data: {
      logoIconUrl: logoIconUrl || null,
      logoWordmarkUrl: logoWordmarkUrl || null,
      loginHeroImageUrl: loginHeroImageUrl || null,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/login");
}
