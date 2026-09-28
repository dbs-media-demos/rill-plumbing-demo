import type { Metadata } from "next";
import { absoluteUrl, noindex, site } from "./site";

type Input = {
  title: string;
  description: string;
  path: string;
  /** Small label shown above the title on the generated share image. */
  eyebrow?: string;
  absoluteTitle?: boolean;
  image?: string;
};

export const ogImageUrl = (title: string, eyebrow?: string) => {
  const p = new URLSearchParams({ title });
  if (eyebrow) p.set("eyebrow", eyebrow);
  return `/api/og?${p.toString()}`;
};

export function buildMetadata({ title, description, path, eyebrow, absoluteTitle, image }: Input): Metadata {
  const og = image ?? ogImageUrl(title, eyebrow);
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: "en_US",
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [og] },
    robots: noindex ? { index: false, follow: false, googleBot: { index: false, follow: false } } : undefined,
  };
}

export { absoluteUrl };
