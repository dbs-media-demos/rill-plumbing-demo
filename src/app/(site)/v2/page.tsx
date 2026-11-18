import type { Metadata } from "next";
import { HomeContent } from "@/components/sections/home/HomeContent";
import { JsonLd } from "@/components/ui/JsonLd";
import { homeFaqs } from "@/content/faqs";
import { buildMetadata, ogImageUrl } from "@/lib/seo";
import { faqSchema, graph, webPageSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description = site.description;

/**
 * The homepage without any 3D, for a slow laptop or a lead who'd rather not have it: the same
 * sections, words and photos as /, only the hero is the SVG pipework (and the Pipeline its SVG
 * version). Zero bytes of three.js. Canonical to /, so search engines see one homepage.
 */
export const metadata: Metadata = {
  ...buildMetadata({
    title: `${site.name} | 24/7 Plumbers in Plano, Frisco & North Dallas`,
    absoluteTitle: true,
    description,
    path: "/",
    eyebrow: "24/7 plumbers · Plano & North Dallas",
    image: ogImageUrl("Water where it belongs.", "24/7 plumbers · Plano & North Dallas"),
  }),
  robots: { index: false, follow: false },
};

export default function HomePageV2() {
  return (
    <HomeContent hero="flat">
      <JsonLd data={graph(webPageSchema({ path: "/", name: site.name, description }), faqSchema(homeFaqs))} />
    </HomeContent>
  );
}
