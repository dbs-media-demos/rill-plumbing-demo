import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { DropletZoom } from "@/components/sections/home/DropletZoom";
import { ProblemPicker } from "@/components/sections/ProblemPicker";
import { ServicesList } from "@/components/sections/ServicesList";
import { EtaMap } from "@/components/sections/EtaMap";
import { PriceMenu } from "@/components/sections/PriceMenu";
import { PromiseStack } from "@/components/sections/PromiseStack";
import { HeaterCompare } from "@/components/sections/HeaterGuide";
import { WorkRail } from "@/components/sections/WorkRail";
import { ReviewsWall } from "@/components/sections/ReviewsWall";
import { AreaPanels } from "@/components/sections/AreaPanels";
import { FinalCta } from "@/components/sections/FinalCta";
import { Pipeline } from "@/components/fx/Pipeline";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { Counter, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { homeFaqs } from "@/content/faqs";
import { stats } from "@/content/company";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, webPageSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description = site.description;

export const metadata: Metadata = buildMetadata({
  title: `${site.name} | 24/7 Plumbers in Plano, Frisco & North Dallas`,
  absoluteTitle: true,
  description,
  path: "/",
  eyebrow: "24/7 plumbers · Plano & North Dallas",
});

export default function HomePage() {
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ path: "/", name: site.name, description }), faqSchema(homeFaqs))} />
      <HomeHero />
      <DropletZoom />

      <Pipeline>
        <ProblemPicker />
        <ServicesList />
        <EtaMap />

        <section data-pipe aria-labelledby="prices-heading" className="section-y relative bg-white">
          <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="eyebrow text-river">Upfront pricing</p>
              <SplitReveal as="h2" id="prices-heading" className="t-1 mt-4 font-display font-semibold">
                Know the price <span className="accent font-normal text-bonnet">first.</span>
              </SplitReveal>
              <p className="mt-6 max-w-md text-lg text-slate">
                Flat prices per job, never per hour. These are our most-booked jobs; your exact price is confirmed on site before
                any work starts.
              </p>
              <div className="mt-8">
                <Button href="/pricing" variant="dark" icon={<ArrowRight size={18} />}>
                  Full price menu
                </Button>
              </div>
            </div>
            <PriceMenu groups={["drains", "heaters", "fixtures", "leaks"]} />
          </div>
        </section>

        <PromiseStack />

        <section data-pipe aria-labelledby="heater-heading" className="section-y relative bg-white">
          <div className="container-x grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="eyebrow text-river">Water heaters</p>
              <SplitReveal as="h2" id="heater-heading" className="t-1 mt-4 font-display font-semibold">
                Tank or <span className="accent font-normal text-bonnet">tankless?</span>
              </SplitReveal>
              <p className="mt-6 max-w-md text-lg text-slate">
                Drag to compare. Most replacements happen the same day you call, and our sizing guide tells you which one your
                household actually needs.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/services/water-heaters#sizer" icon={<ArrowRight size={18} />}>
                  Size my water heater
                </Button>
                <Button href="/book?problem=hot" variant="outline">
                  No hot water now
                </Button>
              </div>
            </div>
            <Reveal>
              <HeaterCompare />
            </Reveal>
          </div>
        </section>
      </Pipeline>

      <WorkRail />

      <Pipeline>
        <ReviewsWall />

        <section data-pipe aria-label="Rill Plumbing by the numbers" className="relative bg-abyss py-16 text-white lg:py-20" data-header="dark">
          <div className="container-x">
            <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="border-l border-white/15 pl-5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <Counter
                      value={s.value}
                      decimals={s.decimals ?? 0}
                      suffix={s.suffix}
                      className="block font-display text-5xl font-semibold tracking-tight lg:text-6xl"
                    />
                    <span className="mt-2 block text-white/70">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <AreaPanels />

        <section data-pipe aria-labelledby="faq-heading" className="section-y relative bg-white">
          <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow text-river">FAQ</p>
              <SplitReveal as="h2" id="faq-heading" className="t-1 mt-4 font-display font-semibold">
                Good <span className="accent font-normal text-bonnet">questions.</span>
              </SplitReveal>
              <p className="mt-6 max-w-sm text-lg text-slate">Straight answers about pricing, timing and who shows up at your door.</p>
              <div className="mt-8">
                <Button href="/faq" variant="outline" icon={<ArrowRight size={18} />}>
                  All FAQs
                </Button>
              </div>
            </div>
            <Accordion items={homeFaqs} />
          </div>
        </section>

        <FinalCta />
      </Pipeline>
    </PageShell>
  );
}
