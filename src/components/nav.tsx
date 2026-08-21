"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { LogoMark } from "@/components/logo-mark";

const LINKS = [
  { href: "/", label: "Residence" },
  { href: "/story", label: "The Home Story" },
  { href: "/progress", label: "Build Progress" },
  { href: "/plans", label: "Explore Your Home" },
  { href: "/design-studio", label: "Design Studio" },
  { href: "/timeline", label: "Timeline" },
  { href: "/home-memory", label: "Home Memory" },
  { href: "/home-bible", label: "Home Bible" },
  { href: "/ask-mjf", label: "Ask MJF" },
];

export function Nav({
  homeName,
  role,
  userName,
}: {
  homeName: string;
  role: "BUILDER" | "OWNER";
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-6 w-6 text-ink-900" />
          <div className="leading-none">
            <div className="text-[11px] font-semibold uppercase tracking-widest2 text-ink-900">
              MJF
            </div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-ink-700/60">
              {homeName}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-[12px] uppercase tracking-wide transition-colors ${
                  active
                    ? "text-ink-900"
                    : "text-ink-700/55 hover:text-ink-900"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-[15px] left-0 right-0 h-[2px] bg-bronze-500" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-[11px] font-medium text-ink-900">{userName}</div>
            <div className="text-[10px] uppercase tracking-wide text-bronze-600">
              {role === "BUILDER" ? "MJF Team" : "Homeowner"}
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border hairline px-3 py-1.5 text-[11px] uppercase tracking-wide text-ink-700 transition hover:border-ink-900 hover:text-ink-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <nav className="flex gap-4 overflow-x-auto border-t hairline px-6 py-2 lg:hidden">
        {LINKS.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-[11px] uppercase tracking-wide ${
                active ? "text-bronze-600" : "text-ink-700/55"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
