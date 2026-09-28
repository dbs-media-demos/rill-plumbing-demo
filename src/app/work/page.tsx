import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { WorkGallery } from "@/components/sections/WorkGallery";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema } from "@/lib/schema";

const title = "Our Work: Recent Plumbing Projects";
const description =
  "Recent Rill Plumbing projects across Plano, Frisco, Allen, Richardson, Carrollton and North Dallas: bath remodels, tankless conversions, repipes, slab leak reroutes and more.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/work", eyebrow: "Recent projects" });

export default function WorkPage() {
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ path: "/work", name: title, description, type: "CollectionPage" }))} />
      <PageHero
        eyebrow="Our work"
        title={
          <>
            Fresh from <span className="accent font-normal text-spray">the van.</span>
          </>
        }
        intro="A look at recent jobs around North Dallas, from 11 pm emergencies to spa-grade primary baths."
        image="/images/bath-marble-shower.jpg"
        imageAlt="Marble walk-in shower with frameless glass, plumbed by Rill"
        crumbs={[{ name: "Our work", path: "/work" }]}
      />
      <section className="section-y bg-porcelain" aria-label="Project gallery">
        <div className="container-x">
          <WorkGallery />
        </div>
      </section>
      <FinalCta
        image="/images/bath-freestanding.jpg"
        imageAlt="Modern bathroom with freestanding tub"
        title={
          <>
            Planning a remodel? <span className="accent font-normal text-spray">Let&apos;s talk pipes.</span>
          </>
        }
        body="We coordinate rough-in and trim-out with your designer or contractor, pull the permit, and pass inspection the first time."
      />
    </PageShell>
  );
}
