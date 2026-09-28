import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { Accordion } from "@/components/ui/Accordion";
import { SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { allFaqs, faqGroups } from "@/content/faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, webPageSchema } from "@/lib/schema";

const title = "Plumbing FAQ";
const description =
  "Answers about Rill Plumbing's upfront pricing, 24/7 emergency service, arrival times, licensing, permits and warranty in Plano and North Dallas.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/faq", eyebrow: "Frequently asked" });

export default function FaqPage() {
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ path: "/faq", name: title, description, type: "FAQPage" }), faqSchema(allFaqs))} />
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Straight answers, <span className="accent font-normal text-spray">no fine print.</span>
          </>
        }
        image="/images/drop-ripple.jpg"
        imageAlt="A single drop of water rippling a calm surface"
        crumbs={[{ name: "FAQ", path: "/faq" }]}
        compact
      />
      <section className="section-y bg-white" aria-label="Questions">
        <div className="container-x space-y-20">
          {faqGroups.map((g) => (
            <div key={g.id} className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <SplitReveal as="h2" id={`faq-${g.id}`} className="t-3 font-display font-semibold lg:sticky lg:top-32 lg:self-start">
                {g.label}
              </SplitReveal>
              <Accordion items={g.items} initial={null} />
            </div>
          ))}
        </div>
      </section>
      <FinalCta />
    </PageShell>
  );
}
