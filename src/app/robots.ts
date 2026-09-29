import type { MetadataRoute } from "next";
import { noindex, siteUrl } from "@/lib/site";

/** Demo sites stay out of search engines unless NEXT_PUBLIC_NOINDEX is explicitly "false". */
export default function robots(): MetadataRoute.Robots {
  if (noindex) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
