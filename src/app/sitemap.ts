import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { cities } from "@/content/cities";
import { siteUrl } from "@/lib/site";

const lastModified = new Date("2026-09-29");

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/services", 0.9),
    ...services.map((s) => page(`/services/${s.slug}`, 0.85)),
    page("/pricing", 0.8),
    page("/book", 0.8),
    page("/service-areas", 0.8),
    ...cities.map((c) => page(`/service-areas/${c.slug}`, 0.8)),
    page("/emergency-tips", 0.7),
    page("/reviews", 0.6, "weekly"),
    page("/work", 0.6),
    page("/about", 0.5),
    page("/faq", 0.5),
    page("/contact", 0.5),
    page("/privacy", 0.2, "yearly"),
  ];
}
