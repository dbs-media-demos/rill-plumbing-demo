import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Cursor } from "@/components/layout/Cursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { noindex, site, siteUrl } from "@/lib/site";
import { ogImageUrl } from "@/lib/seo";

// Static Bricolage Grotesque 600 (opsz 96), subset to Latin: ~18 KB instead of the ~77 KB variable file.
const display = localFont({
  src: "./fonts/bricolage-600.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-bricolage",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});
// č ć š ž đ for Serbian previews: the local subset above is Latin-only, so these come from Google's
// latin-ext Bricolage (listed first in --font-display; only downloaded when such letters appear).
const displayExt = Bricolage_Grotesque({ subsets: ["latin-ext"], weight: "600", variable: "--font-bricolage-ext", display: "swap", preload: false });
const sans = Figtree({ subsets: ["latin", "latin-ext"], variable: "--font-figtree", display: "swap" });
const serif = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["italic"],
  axes: ["SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "swap",
  // Accent words only: never the LCP, so don't compete with the critical path.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | 24/7 Plumbers in Plano & North Dallas`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  category: "Home services",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [{ url: ogImageUrl(site.tagline, "24/7 plumbers · Plano & North Dallas"), width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: noindex ? { index: false, follow: false, googleBot: { index: false, follow: false } } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06222f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={`${display.variable} ${displayExt.variable} ${sans.variable} ${serif.variable}`}>
      <body>
        <SmoothScroll />
        {/* Header, footer and the rest come from (site)/layout or for/[token]/layout (SiteChrome) */}
        {children}
        <Cursor />
      </body>
    </html>
  );
}
