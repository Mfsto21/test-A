import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getSession, type SessionPayload } from "@/lib/session";
import { redirect } from "next/navigation";

/**
 * Resolves the Home the signed-in user should see.
 * OWNER accounts are scoped to exactly one home. BUILDER/admin accounts can
 * eventually pick from many homes (multi-project future) — for now they see
 * the first home on their builder account. This is the one place that
 * decision lives, so a future project-switcher only has to change this file.
 *
 * Wrapped in React `cache()` so multiple Server Components in the same
 * request (layout + page) share one lookup instead of hitting the DB twice.
 */
export const requireSessionAndHome = cache(async function requireSessionAndHome(): Promise<{
  session: SessionPayload;
  home: NonNullable<Awaited<ReturnType<typeof prisma.home.findFirst<{ include: { builder: true } }>>>>;
}> {
  const session = await getSession();
  if (!session) redirect("/login");

  let home;
  if (session.role === "OWNER") {
    home = session.homeId
      ? await prisma.home.findUnique({ where: { id: session.homeId }, include: { builder: true } })
      : null;
  } else {
    home = await prisma.home.findFirst({ orderBy: { createdAt: "asc" }, include: { builder: true } });
  }

  if (!home) redirect("/login");

  return { session, home };
});
