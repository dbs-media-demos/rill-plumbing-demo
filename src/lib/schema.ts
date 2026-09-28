import { absoluteUrl, site } from "./site";
import { reviews } from "@/content/reviews";
import { cities } from "@/content/cities";

/** schema.org builders. Every node links back to one Plumber node via @id. */

export const bizId = `${site.url}/#business`;
export const websiteId = `${site.url}/#website`;

type Json = Record<string, unknown>;

const areaServed = () =>
  cities.map((c) => ({
    "@type": "City",
    name: `${c.schemaName}, TX`,
    ...(c.slug === "north-dallas" ? { alternateName: "North Dallas" } : {}),
  }));

export function businessSchema(): Json {
  return {
    "@type": "Plumber",
    "@id": bizId,
    name: site.name,
    legalName: site.legalName,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: absoluteUrl("/images/plumber-under-sink.jpg"),
    logo: { "@type": "ImageObject", url: absoluteUrl("/brand/icon-512.png"), width: 512, height: 512 },
    priceRange: "$$",
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: areaServed(),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: `Texas Responsible Master Plumber ${site.license}`,
      recognizedBy: { "@type": "Organization", name: "Texas State Board of Plumbing Examiners" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating,
      reviewCount: site.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    })),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: site.phone,
      areaServed: "US",
      availableLanguage: ["English", "Spanish"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": bizId },
    inLanguage: "en-US",
  };
}

export function webPageSchema(opts: { path: string; name: string; description: string; type?: string; image?: string }): Json {
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.name,
    description: opts.description,
    inLanguage: "en-US",
    isPartOf: { "@id": websiteId },
    about: { "@id": bizId },
    ...(opts.image ? { primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(opts.image) } } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  image?: string;
  lowPrice?: number;
  city?: string;
}): Json {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: { "@id": bizId },
    areaServed: opts.city ? { "@type": "City", name: `${opts.city}, TX` } : areaServed(),
    ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
    ...(opts.lowPrice
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: opts.lowPrice,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function itemListSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function graph(...nodes: Json[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
