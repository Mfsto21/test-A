import { prisma } from "@/lib/prisma";

/**
 * Branding assets needed by the (unauthenticated) login page. Deliberately
 * separate from current-home.ts's requireSessionAndHome, which requires a
 * session — this one is safe to call before login and returns only
 * non-sensitive display assets.
 */
export async function getLoginBranding() {
  const home = await prisma.home.findFirst({
    orderBy: { createdAt: "asc" },
    include: { builder: true },
  });

  return {
    heroImageUrl: home?.heroImageUrl ?? null,
    logoIconUrl: home?.builder.logoIconUrl ?? null,
    logoWordmarkUrl: home?.builder.logoWordmarkUrl ?? null,
  };
}
