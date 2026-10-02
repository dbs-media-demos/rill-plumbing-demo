import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { ReviewCard } from "@/components/sections/ReviewsWall";
import { FinalCta } from "@/components/sections/FinalCta";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowUpRight, Phone } from "@/components/ui/Icons";
import { Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { cities, cityBySlug } from "@/content/cities";
import { reviews } from "@/content/reviews";
import { services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, serviceSchema, webPageSchema } from "@/lib/schema";
import { site, telHref } from "@/lib/site";

type Params = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) return {};
  return buildMetadata({
    title: `Plumber in ${c.name}, TX: 24/7, Upfront Prices`,
    description: `Licensed ${c.name} plumbers on call 24/7, averaging ~${c.eta} min to your door. Serving ${c.neighborhoods.slice(0, 4).join(", ")} and ZIPs ${c.zips.slice(0, 4).join(", ")}.`,
    path: `/service-areas/${c.slug}`,
    eyebrow: `Plumber in ${c.name}, TX`,
  });
}

export default async function CityPage({ params }: Params) {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) notFound();
  const path = `/service-areas/${c.slug}`;
  const local = reviews.filter((r) => r.city === c.slug);
  const shown = (local.length ? local : reviews).slice(0, 3);
  const others = cities.filter((x) => x.slug !== c.slug);
  const faqs = [
    c.faq,
    { q: `How fast can a plumber get to ${c.name}?`, a: `Our average emergency arrival in ${c.name} is about ${c.eta} minutes, day or night. Scheduled visits get a 2-hour window and a text when we're on the way.` },
    { q: `Do you charge more for nights or weekends in ${c.name}?`, a: "No. Our flat prices are the same 24/7, including holidays, and there's never a trip fee." },
  ];

  return (
    <PageShell>
      <JsonLd
        data={graph(
          webPageSchema({ path, name: `Plumber in ${c.name}, TX`, description: c.intro, image: c.image }),
          serviceSchema({ name: `Plumbing services in ${c.name}, TX`, description: c.intro, path, serviceType: "Plumbing", image: c.image, city: c.schemaName }),
          faqSchema(faqs),
        )}
      />
      <PageHero
        eyebrow={`${c.name}, TX · ${c.county}`}
        title={
          <>
            Your {c.name} plumber, <span className="accent font-normal text-spray">~{c.eta} minutes away.</span>
          </>
        }
        intro={c.intro}
        image={c.image}
        imageAlt={c.imageAlt}
        crumbs={[
          { name: "Service areas", path: "/service-areas" },
          { name: c.name, path },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Button href={`/book?city=${c.slug}`} size="lg" icon={<ArrowRight size={18} />}>
            Book in {c.name}
          </Button>
          <Button href={telHref} size="lg" variant="outline-light" icon={<Phone size={18} />}>
            {site.phoneDisplay}
          </Button>
        </div>
      </PageHero>

      <section className="section-y bg-porcelain" aria-labelledby="local-heading">
        <div className="container-x">
          <p className="eyebrow text-river">Local knowledge</p>
          <SplitReveal as="h2" id="local-heading" className="t-2 mt-4 max-w-4xl font-display font-semibold">
            What we fix most in <span className="accent font-normal text-bonnet">{c.name}.</span>
          </SplitReveal>
          <Reveal as="ul" stagger={0.08} className="mt-12 grid gap-5 md:grid-cols-3">
            {c.local.map((l, i) => (
              <li key={l.title} className="rounded-[1.8rem] bg-white p-7 ring-1 ring-abyss/8">
                <span className="font-display text-5xl font-semibold text-spray">0{i + 1}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">{l.title}</h3>
                <p className="mt-2 text-slate">{l.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section data-header="dark" className="on-dark section-y bg-abyss text-white" aria-labelledby="hoods-heading">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 id="hoods-heading" className="eyebrow text-spray">
              Neighborhoods we serve
            </h2>
            <ScrubWords text={c.neighborhoods.join(" · ")} className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight lg:text-5xl" start={0.3} />
            <p className="mt-8 text-white/70">
              ZIP codes: <span className="text-white">{c.zips.join(", ")}</span>
            </p>
          </div>
          <div>
            <h2 className="eyebrow text-spray">Services in {c.name}</h2>
            <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="group flex items-center justify-between gap-4 py-3.5">
                    <span className="text-lg font-semibold transition-colors group-hover:text-spray">{s.name}</span>
                    <span className="flex items-center gap-3 text-sm text-white/70">
                      from {s.from} <ArrowUpRight size={16} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-y bg-foam" aria-labelledby="city-reviews">
        <div className="container-x">
          <SplitReveal as="h2" id="city-reviews" className="t-2 font-display font-semibold">
            {local.length ? `${c.name} neighbors say` : "What neighbors say"}
          </SplitReveal>
          <Reveal as="ul" stagger={0.08} className="mt-10 grid gap-5 md:grid-cols-3">
            {shown.map((r) => (
              <li key={r.name}>
                <ReviewCard r={r} />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-white" aria-labelledby="city-faq">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SplitReveal as="h2" id="city-faq" className="t-2 font-display font-semibold">
              {c.name} <span className="accent font-normal text-bonnet">FAQ.</span>
            </SplitReveal>
            <p className="mt-6 text-slate">Also serving:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/service-areas/${o.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-abyss/5 px-4 text-sm font-semibold hover:bg-abyss/10">
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Accordion items={faqs} />
        </div>
      </section>

      <FinalCta />
    </PageShell>
  );
}
