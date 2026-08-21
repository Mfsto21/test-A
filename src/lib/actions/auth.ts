"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "We don't recognize that email." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "That password isn't right." };
  }

  await setSessionCookie({
    sub: user.id,
    role: user.role as "BUILDER" | "OWNER",
    homeId: user.homeId,
    name: user.name,
    email: user.email,
  });

  redirect("/");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}
