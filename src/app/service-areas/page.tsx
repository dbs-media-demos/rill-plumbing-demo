import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { EtaMap } from "@/components/sections/EtaMap";
import { FinalCta } from "@/components/sections/FinalCta";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { cities } from "@/content/cities";
import { buildMetadata } from "@/lib/seo";
import { graph, itemListSchema, webPageSchema } from "@/lib/schema";

const title = "Service Areas: Plano, Frisco, Allen, Richardson, Carrollton & North Dallas";
const description =
  "Rill Plumbing serves 25 ZIP codes across Collin, Denton and Dallas counties with 24/7 emergency service and average arrivals under an hour.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/service-areas", eyebrow: "Where we work" });

export default function ServiceAreasPage() {
  return (
    <PageShell>
      <JsonLd
        data={graph(
          webPageSchema({ path: "/service-areas", name: title, description, type: "CollectionPage" }),
          itemListSchema(cities.map((c) => ({ name: `Plumber in ${c.name}, TX`, path: `/service-areas/${c.slug}` }))),
        )}
      />
      <PageHero
        eyebrow="Service areas"
        title={
          <>
            North Dallas, <span className="accent font-normal text-spray">covered.</span>
          </>
        }
        intro="Six cities, 25 ZIP codes, seven stocked vans on the road day and night."
        image="/images/aerial-highway.jpg"
        imageAlt="Aerial view of highways and neighborhoods in Frisco, Texas"
        crumbs={[{ name: "Service areas", path: "/service-areas" }]}
      />
      <EtaMap />
      <section className="section-y bg-porcelain" aria-labelledby="cities-heading">
        <div className="container-x">
          <SplitReveal as="h2" id="cities-heading" className="t-2 font-display font-semibold">
            Pick your <span className="accent font-normal text-bonnet">city.</span>
          </SplitReveal>
          <Reveal as="ul" stagger={0.07} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link href={`/service-areas/${c.slug}`} data-cursor="View" className="group block">
                  <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[1.8rem] bg-abyss">
                    <Image
                      src={c.image}
                      alt={c.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      quality={65}
                      className="-z-10 object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-abyss/85 to-transparent" />
                    <div className="flex h-full flex-col justify-end p-6 text-white">
                      <span className="flex items-end justify-between gap-4">
                        <span>
                          <span className="block font-display text-3xl font-semibold tracking-tight">{c.name}, TX</span>
                          <span className="text-sm text-white/80">~{c.eta} min average arrival</span>
                        </span>
                        <span className="grid size-11 place-items-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-bonnet">
                          <ArrowUpRight size={20} />
                        </span>
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate">ZIPs {c.zips.join(", ")}</p>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
      <FinalCta />
    </PageShell>
  );
}
