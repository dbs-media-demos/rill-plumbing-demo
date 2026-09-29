import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBar } from "@/components/layout/MobileBar";
import { DemoPill } from "@/components/layout/DemoPill";
import { Cursor } from "@/components/layout/Cursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JsonLd } from "@/components/ui/JsonLd";
import { businessSchema, graph, websiteSchema } from "@/lib/schema";
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
const sans = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const serif = Fraunces({
  subsets: ["latin"],
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
    <html lang="en-US" className={`${display.variable} ${sans.variable} ${serif.variable}`}>
      <body>
        <JsonLd data={graph(businessSchema(), websiteSchema())} />
        <SmoothScroll />
        <Header />
        {children}
        <Footer />
        <MobileBar />
        <DemoPill />
        <Cursor />
      </body>
    </html>
  );
}
