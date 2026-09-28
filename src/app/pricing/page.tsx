import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { PriceMenu } from "@/components/sections/PriceMenu";
import { FinalCta } from "@/components/sections/FinalCta";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqGroups } from "@/content/faqs";
import { allPriceItems, usd } from "@/content/pricing";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, webPageSchema, bizId } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

const title = "Upfront Plumbing Prices";
const description =
  "Flat, upfront plumbing prices for Plano and North Dallas: drain cleaning from $149, water heater repair from $179, installs from $1,895. No overtime, no trip fee.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/pricing", eyebrow: "Pricing · no overtime, ever" });

const how = [
  { t: "We diagnose", b: "A licensed plumber finds the real cause. The $79 diagnostic is waived when you go ahead with the repair." },
  { t: "You choose", b: "You see every option with a flat price for each, written down, before any work starts." },
  { t: "That's the bill", b: "The price you approved is the price you pay, whether the job takes 40 minutes or four hours." },
];

const offerCatalog = {
  "@type": "OfferCatalog",
  "@id": `${absoluteUrl("/pricing")}#catalog`,
  name: "Rill Plumbing price menu",
  provider: { "@id": bizId },
  itemListElement: allPriceItems.map((i) => ({
    "@type": "Offer",
    name: i.name,
    priceSpecification: { "@type": "PriceSpecification", minPrice: i.from, ...(i.to ? { maxPrice: i.to } : {}), priceCurrency: "USD" },
    itemOffered: { "@type": "Service", name: i.name, provider: { "@id": bizId } },
  })),
};

export default function PricingPage() {
  const faqs = faqGroups[0].items;
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ path: "/pricing", name: title, description }), offerCatalog, faqSchema(faqs))} />
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            The price comes <span className="accent font-normal text-spray">before</span> the wrench.
          </>
        }
        intro="Flat prices per job, never per hour. Same price nights, weekends and holidays. No trip fee anywhere we serve."
        image="/images/tools-drawer.jpg"
        imageAlt="Drawer of well-kept plumbing tools"
        crumbs={[{ name: "Pricing", path: "/pricing" }]}
        aside={
          <div className="grid grid-cols-2 gap-3 lg:w-80">
            {[
              ["$0", "trip fee"],
              ["$0", "overtime"],
              ["$79", "diagnostic, waived"],
              ["1 yr", "labor warranty"],
            ].map(([a, b]) => (
              <div key={b} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                <p className="font-display text-3xl font-semibold tracking-tight">{a}</p>
                <p className="text-sm text-white/75">{b}</p>
              </div>
            ))}
          </div>
        }
      />

      <section className="section-y bg-white" aria-labelledby="menu-heading">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SplitReveal as="h2" id="menu-heading" className="t-2 font-display font-semibold">
              The price <span className="accent font-normal text-bonnet">menu.</span>
            </SplitReveal>
            <p className="max-w-md text-slate">
              Typical flat prices for common jobs. Starting prices from {usd(129)}; your exact price is confirmed on site before work starts.
            </p>
          </div>
          <div className="mt-12">
            <PriceMenu />
          </div>
        </div>
      </section>

      <section data-header="dark" className="on-dark section-y bg-abyss text-white" aria-labelledby="how-heading">
        <div className="container-x">
          <p className="eyebrow text-spray">How pricing works</p>
          <SplitReveal as="h2" id="how-heading" className="t-2 mt-4 font-display font-semibold">
            Three steps. <span className="accent font-normal text-spray">One number.</span>
          </SplitReveal>
          <Reveal as="ol" stagger={0.1} className="mt-12 grid gap-5 md:grid-cols-3">
            {how.map((h, i) => (
              <li key={h.t} className="rounded-[1.6rem] bg-white/6 p-7 ring-1 ring-white/10">
                <span className="font-display text-6xl font-semibold text-spray/40">{i + 1}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">{h.t}</h3>
                <p className="mt-2 text-white/75">{h.b}</p>
              </li>
            ))}
          </Reveal>
          <p className="mt-10 max-w-2xl text-white/70">
            Financing is available on water heaters, repipes and sewer work, from 12 to 60 months, subject to approval.
          </p>
        </div>
      </section>

      <section className="section-y bg-porcelain" aria-labelledby="pricing-faq">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SplitReveal as="h2" id="pricing-faq" className="t-2 font-display font-semibold">
            Pricing <span className="accent font-normal text-bonnet">questions.</span>
          </SplitReveal>
          <Accordion items={faqs} />
        </div>
      </section>

      <FinalCta />
    </PageShell>
  );
}
