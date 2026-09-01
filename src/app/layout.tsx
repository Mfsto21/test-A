import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

// Fraunces is a variable font whose optical-size (opsz) axis reshapes
// letterforms — most noticeably the "j"/"J" — between a calligraphic,
// ink-trap "text" cut at low opsz and a cleaner "display" cut at high opsz.
// Pinning discrete static weights (the old config) locks every heading to
// a single low-opsz instance regardless of how large it's rendered, which
// is what made the "j" look broken/glitchy at display sizes. Loading the
// true variable font with the opsz axis exposed lets the browser's default
// `font-optical-sizing: auto` pick the right cut per element automatically.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: "variable",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Future Home Platform | MJF Construction & Development",
  description:
    "A private digital residence experience by MJF Construction & Development.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-paper font-sans text-ink-900 antialiased">
        {children}
      </body>
    </html>
  );
}
