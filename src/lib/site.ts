/** Business facts for the fictional Rill Plumbing Co. (a Scale by Noon concept site). */

/** The agency that built this concept site. Change the URL here only (custom domain coming later). */
export const agencyName = "Scale by Noon";
export const agencyUrl = "https://scale-by-noon.vercel.app";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rill-plumbing-demo.vercel.app").replace(/\/$/, "");

export const site = {
  name: "Rill Plumbing Co.",
  short: "Rill",
  legalName: "Rill Plumbing Co. LLC",
  tagline: "Water where it belongs.",
  description:
    "Licensed 24/7 plumbers for Plano, Frisco, Allen, Richardson, Carrollton and North Dallas. Upfront prices, no overtime charges, shoe covers on, and a 1-year labor warranty.",
  url: siteUrl,
  phone: "+19725550147",
  phoneDisplay: "(972) 555-0147",
  sms: "+19725550147",
  email: "hello@rillplumbing.com",
  license: "TSBPE M-00000 (demo)",
  founded: 2012,
  vans: 7,
  plumbers: 16,
  rating: 4.9,
  reviewCount: 612,
  jobsDone: "21,400+",
  address: {
    locality: "Plano",
    region: "TX",
    postalCode: "75024",
    country: "US",
    display: "Shop & dispatch: Plano, TX 75024",
  },
  geo: { lat: 33.0198, lng: -96.6989 },
  areaServed: ["Plano", "Frisco", "Allen", "Richardson", "Carrollton", "Dallas"],
  hours: {
    emergency: "24/7, 365 days",
    office: "Mon–Sat, 7 am – 7 pm",
  },
  warranty: "1-year labor warranty",
  agencyUrl,
} as const;

export const telHref = `tel:${site.phone}`;
export const smsHref = `sms:${site.sms}`;
export const mailHref = `mailto:${site.email}`;

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** Robots stay off unless NEXT_PUBLIC_NOINDEX is explicitly "false". Demos must never pose as real businesses. */
export const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";
