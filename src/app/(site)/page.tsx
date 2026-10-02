import type { Metadata } from "next";
import { HomeContent } from "@/components/sections/home/HomeContent";
import { JsonLd } from "@/components/ui/JsonLd";
import { homeFaqs } from "@/content/faqs";
import { buildMetadata, ogImageUrl } from "@/lib/seo";
import { faqSchema, graph, webPageSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description = site.description;

export const metadata: Metadata = buildMetadata({
  title: `${site.name} | 24/7 Plumbers in Plano, Frisco & North Dallas`,
  absoluteTitle: true,
  description,
  path: "/",
  eyebrow: "24/7 plumbers · Plano & North Dallas",
  image: ogImageUrl("Water where it belongs.", "24/7 plumbers · Plano & North Dallas"),
});

export default function HomePage() {
  return (
    <HomeContent>
      <JsonLd data={graph(webPageSchema({ path: "/", name: site.name, description }), faqSchema(homeFaqs))} />
    </HomeContent>
  );
}
