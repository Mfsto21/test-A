"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function postMessage(homeId: string, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Not signed in.");

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await prisma.message.create({
    data: { homeId, authorId: session.sub, body },
  });

  revalidatePath("/ask-mjf");
}
