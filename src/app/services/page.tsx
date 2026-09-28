import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { ProblemPicker } from "@/components/sections/ProblemPicker";
import { FinalCta } from "@/components/sections/FinalCta";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Phone } from "@/components/ui/Icons";
import { SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { graph, itemListSchema, webPageSchema } from "@/lib/schema";
import { telHref } from "@/lib/site";

const title = "Plumbing Services in Plano & North Dallas";
const description =
  "Emergency plumbing, drain cleaning, water heaters, leak detection, slab leaks, sewer lines, repiping, fixtures and water filtration. Flat prices, 24/7, no overtime.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/services", eyebrow: "Services" });

export default function ServicesPage() {
  return (
    <PageShell>
      <JsonLd
        data={graph(
          webPageSchema({ path: "/services", name: title, description, type: "CollectionPage" }),
          itemListSchema(services.map((s) => ({ name: s.name, path: `/services/${s.slug}` }))),
        )}
      />
      <PageHero
        eyebrow="Services"
        title={
          <>
            Nine services. <span className="accent font-normal text-spray">Zero surprises.</span>
          </>
        }
        intro="From a 2 am burst pipe to a full primary-bath remodel: licensed plumbers, flat prices quoted before work starts, and a van stocked to finish most jobs on the first visit."
        image="/images/plumber-cabinet.jpg"
        imageAlt="Rill plumber working on pipes inside a sink cabinet"
        crumbs={[{ name: "Services", path: "/services" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/book" size="lg" icon={<ArrowRight size={18} />}>
            Book a plumber
          </Button>
          <Button href={telHref} size="lg" variant="outline-light" icon={<Phone size={18} />}>
            Call 24/7
          </Button>
        </div>
      </PageHero>

      <section className="section-y bg-porcelain" aria-labelledby="all-services">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SplitReveal as="h2" id="all-services" className="t-2 font-display font-semibold">
              What we <span className="accent font-normal text-bonnet">fix.</span>
            </SplitReveal>
            <p className="max-w-md text-slate">Tap any service for what&apos;s included, typical prices and how the job runs.</p>
          </div>
          <ServiceCards items={services} className="mt-12" />
        </div>
      </section>

      <ProblemPicker initial="clog" />
      <FinalCta />
    </PageShell>
  );
}
