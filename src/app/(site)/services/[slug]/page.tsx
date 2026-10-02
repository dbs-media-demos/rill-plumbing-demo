import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { ProblemPicker } from "@/components/sections/ProblemPicker";
import { HeaterCompare, HeaterSizer } from "@/components/sections/HeaterGuide";
import { FinalCta } from "@/components/sections/FinalCta";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check, Clock, Phone } from "@/components/ui/Icons";
import { Parallax, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { serviceBySlug, services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph, serviceSchema, webPageSchema } from "@/lib/schema";
import { telHref } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return buildMetadata({
    title: `${s.name} in Plano & North Dallas`,
    description: `${s.summary} From ${s.from}. ${s.eta}. Licensed, insured, 1-year labor warranty.`,
    path: `/services/${s.slug}`,
    eyebrow: `${s.name} · from ${s.from}`,
  });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  const path = `/services/${s.slug}`;
  const related = s.related.map(serviceBySlug).filter((x) => !!x);
  const low = Number(s.from.replace(/[^0-9]/g, ""));

  return (
    <PageShell>
      <JsonLd
        data={graph(
          webPageSchema({ path, name: s.name, description: s.summary, image: s.image }),
          serviceSchema({ name: s.name, description: s.summary, path, serviceType: s.serviceType, image: s.image, lowPrice: low }),
          faqSchema(s.faqs),
        )}
      />
      <PageHero
        eyebrow={s.name}
        title={s.tagline}
        intro={s.summary}
        image={s.image}
        imageAlt={s.imageAlt}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: s.name, path },
        ]}
        aside={
          <div className="w-full rounded-[1.6rem] bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-md lg:w-80">
            <p className="text-sm text-white/70">Starting at</p>
            <p className="font-display text-5xl font-semibold tracking-tight">{s.from}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
              <Clock size={16} /> {s.eta}
            </p>
            <div className="mt-5 grid gap-2">
              <Button href={`/book?service=${s.slug}`} icon={<ArrowRight size={18} />}>
                Book this service
              </Button>
              <Button href={telHref} variant="outline-light" icon={<Phone size={18} />}>
                Call 24/7
              </Button>
            </div>
          </div>
        }
      />

      {/* Intro + warning signs */}
      <section className="section-y bg-porcelain" aria-labelledby="signs-heading">
        <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <ScrubWords text={s.intro[0]} className="font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:text-[2.35rem]" />
            {s.intro.slice(1).map((p) => (
              <Reveal key={p}>
                <p className="mt-6 max-w-2xl text-lg text-slate">{p}</p>
              </Reveal>
            ))}
            <div className="mt-12 rounded-[1.8rem] bg-white p-7 ring-1 ring-abyss/8 sm:p-9">
              <h2 id="signs-heading" className="font-display text-2xl font-semibold tracking-tight">
                Signs it&apos;s time to call
              </h2>
              <Reveal as="ul" stagger={0.05} y={16} className="mt-5 grid gap-3 sm:grid-cols-2">
                {s.signs.map((x) => (
                  <li key={x} className="flex items-start gap-3">
                    <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-sunny text-abyss">
                      <Check size={13} />
                    </span>
                    {x}
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
          <div className="grid content-start gap-5">
            {s.gallery.slice(0, 2).map((g, i) => (
              <Parallax key={g.src} className={i === 0 ? "aspect-[4/5] rounded-[2rem]" : "aspect-[4/3] rounded-[2rem] lg:ml-16"}>
                <div className="absolute inset-0">
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" quality={65} className="object-cover" />
                </div>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section data-header="dark" className="on-dark section-y relative overflow-hidden bg-abyss text-white" aria-labelledby="included-heading">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-0 size-[36rem] rounded-full bg-river/25 blur-[120px]" />
        <div className="container-x relative">
          <p className="eyebrow text-spray">Every {s.short.toLowerCase()} job includes</p>
          <SplitReveal as="h2" id="included-heading" className="t-2 mt-4 max-w-3xl font-display font-semibold">
            No add-ons. No <span className="accent font-normal text-spray">&ldquo;oh, and also…&rdquo;</span>
          </SplitReveal>
          <Reveal as="ul" stagger={0.06} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.included.map((x, i) => (
              <li key={x} className="flex gap-4 rounded-[1.4rem] bg-white/6 p-6 ring-1 ring-white/10">
                <span className="font-display text-sm font-semibold text-spray">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg">{x}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="section-y bg-white" aria-labelledby="steps-heading">
        <div className="container-x">
          <p className="eyebrow text-river">How it works</p>
          <SplitReveal as="h2" id="steps-heading" className="t-2 mt-4 font-display font-semibold">
            Four steps, <span className="accent font-normal text-bonnet">zero guesswork.</span>
          </SplitReveal>
          <Reveal as="ol" stagger={0.1} className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {s.steps.map((st, i) => (
              <li key={st.title} className="relative rounded-[1.6rem] bg-porcelain p-7">
                <span className="grid size-12 place-items-center rounded-full bg-abyss font-display text-lg font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{st.title}</h3>
                <p className="mt-2 text-slate">{st.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {s.slug === "water-heaters" && (
        <section className="section-y bg-porcelain" aria-labelledby="guide-heading">
          <div className="container-x">
            <p className="eyebrow text-river">Water-heater guide</p>
            <SplitReveal as="h2" id="guide-heading" className="t-2 mt-4 font-display font-semibold">
              Tank vs tankless, <span className="accent font-normal text-bonnet">sized for your home.</span>
            </SplitReveal>
            <Reveal className="mt-12">
              <HeaterCompare />
            </Reveal>
            <div className="mt-10 grid gap-4 text-[0.98rem] sm:grid-cols-2">
              <div className="rounded-[1.4rem] bg-white p-6 ring-1 ring-abyss/8">
                <h3 className="font-display text-xl font-semibold">Tank</h3>
                <p className="mt-2 text-slate">
                  Lower upfront cost and simple repairs. Stores 40–75 gallons, so it can run out during back-to-back showers. Lasts 8–12
                  years in North Texas.
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-white p-6 ring-1 ring-abyss/8">
                <h3 className="font-display text-xl font-semibold">Tankless</h3>
                <p className="mt-2 text-slate">
                  Heats on demand, never runs out and frees up floor space. Higher upfront cost, lower running cost, and up to 20 years
                  of life with yearly descaling.
                </p>
              </div>
            </div>
            <h3 className="mt-16 font-display text-3xl font-semibold tracking-tight">Size yours in 30 seconds</h3>
            <div className="mt-6">
              <HeaterSizer />
            </div>
          </div>
        </section>
      )}

      {s.slug === "emergency-plumbing" && <ProblemPicker initial="burst" compact />}

      <section className="section-y bg-white" aria-labelledby="svc-faq">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow text-river">FAQ</p>
            <SplitReveal as="h2" id="svc-faq" className="t-2 mt-4 font-display font-semibold">
              {s.short}, <span className="accent font-normal text-bonnet">answered.</span>
            </SplitReveal>
          </div>
          <Accordion items={s.faqs} />
        </div>
      </section>

      <section className="section-y bg-porcelain" aria-labelledby="related-heading">
        <div className="container-x">
          <h2 id="related-heading" className="t-3 font-display font-semibold">
            Often booked together
          </h2>
          <ServiceCards items={related} className="mt-10" />
        </div>
      </section>

      <FinalCta
        image={s.gallery[0]?.src ?? s.image}
        imageAlt={s.gallery[0]?.alt ?? s.imageAlt}
        title={
          <>
            Need {s.short.toLowerCase()} <span className="accent font-normal text-spray">today?</span>
          </>
        }
      />
    </PageShell>
  );
}
