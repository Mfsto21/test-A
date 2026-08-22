"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

// Only the Residence page has a full-bleed dark hero behind the nav at
// scroll position 0 — everywhere else starts on the plain cream page
// background, so a "transparent" header there would just be illegible.
const HERO_PAGE = "/";
const SCROLL_THRESHOLD = 64;

export function Nav({
  homeName,
  role,
  userName,
  logoUrlLight,
  logoUrlDark,
}: {
  homeName: string;
  role: "BUILDER" | "OWNER";
  userName: string;
  logoUrlLight?: string | null;
  logoUrlDark?: string | null;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset to transparent immediately on navigating back to the hero page,
  // rather than waiting for a scroll event to fire.
  useEffect(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, [pathname]);

  const transparent = pathname === HERO_PAGE && !scrolled;
  const logoSrc = transparent ? logoUrlDark : logoUrlLight;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ${
        transparent
          ? "border-transparent bg-transparent"
          : "hairline bg-paper/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt="MJF Construction & Development" className="h-7 w-auto" />
          ) : (
            <LogoMark className={`h-6 w-6 transition-colors duration-300 ${transparent ? "text-paper" : "text-ink-900"}`} />
          )}
          <div className="leading-none">
            <div
              className={`text-[11px] font-semibold uppercase tracking-widest2 transition-colors duration-300 ${
                transparent ? "text-paper" : "text-ink-900"
              }`}
            >
              MJF
            </div>
            <div
              className={`text-[9px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                transparent ? "text-paper/60" : "text-ink-700/60"
              }`}
            >
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
                className={`relative py-1 text-[12px] uppercase tracking-wide transition-colors duration-300 ${
                  active
                    ? transparent
                      ? "text-paper"
                      : "text-ink-900"
                    : transparent
                    ? "text-paper/60 hover:text-paper"
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
            <div
              className={`text-[11px] font-medium transition-colors duration-300 ${
                transparent ? "text-paper" : "text-ink-900"
              }`}
            >
              {userName}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-bronze-500">
              {role === "BUILDER" ? "MJF Team" : "Homeowner"}
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className={`rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-wide transition-colors duration-300 ${
                transparent
                  ? "border-paper/30 text-paper/80 hover:border-paper hover:text-paper"
                  : "hairline text-ink-700 hover:border-ink-900 hover:text-ink-900"
              }`}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <nav
        className={`flex gap-4 overflow-x-auto border-t px-6 py-2 transition-colors duration-300 lg:hidden ${
          transparent ? "border-paper/10" : "hairline"
        }`}
      >
        {LINKS.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-[11px] uppercase tracking-wide transition-colors duration-300 ${
                active
                  ? "text-bronze-500"
                  : transparent
                  ? "text-paper/50"
                  : "text-ink-700/55"
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
