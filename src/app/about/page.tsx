import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { Counter, Parallax, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { Boot, Clock, Shield, Wrench } from "@/components/ui/Icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { stats, team } from "@/content/company";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema, bizId } from "@/lib/schema";
import { site } from "@/lib/site";

const title = "About Rill Plumbing Co.";
const description =
  "Founded in Plano in 2012 by a master plumber with one van and one rule: quote first, clean up after. Meet the team serving North Dallas 24/7.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/about", eyebrow: "Since 2012 · Plano, TX" });

const values = [
  { icon: Clock, t: "Show up when we say", b: "Two-hour windows, a text when we're on the way, and a real ETA, not 'sometime Tuesday'." },
  { icon: Shield, t: "Licensed, every time", b: "Every plumber is state licensed, background-checked and drug-tested. No day-labor subs." },
  { icon: Boot, t: "Treat it like our own", b: "Shoe covers, floor protection, and we clean up. Your home is not a job site." },
  { icon: Wrench, t: "Fix it once", b: "Stocked vans and experienced plumbers mean most jobs are done on the first visit." },
];

export default function AboutPage() {
  return (
    <PageShell>
      <JsonLd
        data={graph({
          ...webPageSchema({ path: "/about", name: title, description, type: "AboutPage" }),
          mainEntity: { "@id": bizId },
        })}
      />
      <PageHero
        eyebrow="About us"
        title={
          <>
            One van, one rule, <span className="accent font-normal text-spray">fourteen years.</span>
          </>
        }
        intro="Quote first. Clean up after. Everything else at Rill grew from that."
        image="/images/van-open.jpg"
        imageAlt="Open service van stocked with plumbing parts"
        crumbs={[{ name: "About", path: "/about" }]}
      />

      <section className="section-y bg-porcelain" aria-labelledby="story-heading">
        <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <p className="eyebrow text-river" id="story-heading">
              Our story
            </p>
            <ScrubWords
              className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:text-[2.5rem]"
              text="Dana Whitfield spent ten years working for other plumbing companies around Dallas, watching customers get surprise bills and muddy carpets. In 2012 she bought one van, put shoe covers in the glovebox and started Rill in a Plano garage."
            />
            <Reveal>
              <p className="mt-8 max-w-2xl text-lg text-slate">
                Today we&apos;re {site.plumbers} licensed plumbers and {site.vans} vans covering Plano, Frisco, Allen, Richardson,
                Carrollton and North Dallas around the clock. The rule hasn&apos;t changed: you see the price before we start, and your
                home looks better when we leave than when we arrived.
              </p>
            </Reveal>
          </div>
          <Parallax className="aspect-[4/5] rounded-[2rem]">
            <div className="absolute inset-0">
              <Image src="/images/team-dana.jpg" alt="Dana Whitfield, founder and master plumber" fill sizes="(min-width: 1024px) 40vw, 100vw" quality={70} className="object-cover" />
            </div>
          </Parallax>
        </div>
      </section>

      <section data-header="dark" className="on-dark bg-abyss py-16 text-white lg:py-20" aria-label="Rill by the numbers">
        <div className="container-x">
          <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-l border-white/15 pl-5">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <Counter value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} className="block font-display text-5xl font-semibold tracking-tight lg:text-6xl" />
                  <span className="mt-2 block text-white/70">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y bg-white" aria-labelledby="team-heading">
        <div className="container-x">
          <p className="eyebrow text-river">The team</p>
          <SplitReveal as="h2" id="team-heading" className="t-2 mt-4 font-display font-semibold">
            The people at <span className="accent font-normal text-bonnet">your door.</span>
          </SplitReveal>
          <Reveal as="ul" stagger={0.08} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <li key={m.name} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-mist">
                  <Image
                    src={m.image}
                    alt={`${m.name}, ${m.role}`}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    quality={65}
                    className="object-cover grayscale-[30%] transition-[transform,filter] duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">{m.name}</h3>
                <p className="text-sm font-semibold text-river">{m.role}</p>
                <p className="mt-2 text-slate">{m.bio}</p>
              </li>
            ))}
          </Reveal>
          <p className="mt-8 text-sm text-slate">Team members shown are fictional; photos are licensed stock used for this concept site.</p>
        </div>
      </section>

      <section className="section-y bg-porcelain" aria-labelledby="values-heading">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow text-river">What we stand for</p>
            <SplitReveal as="h2" id="values-heading" className="t-2 mt-4 font-display font-semibold">
              Boring promises, <span className="accent font-normal text-bonnet">kept.</span>
            </SplitReveal>
            <div className="mt-8 rounded-[1.6rem] bg-white p-6 ring-1 ring-abyss/8">
              <p className="font-semibold">Licensed &amp; insured</p>
              <p className="mt-1 text-slate">
                Texas State Board of Plumbing Examiners · {site.license}. General liability and workers&apos; comp on every job.
              </p>
            </div>
          </div>
          <Reveal as="ul" stagger={0.08} className="grid gap-4 sm:grid-cols-2">
            {values.map(({ icon: Icon, t, b }) => (
              <li key={t} className="rounded-[1.6rem] bg-white p-7 ring-1 ring-abyss/8">
                <span className="grid size-12 place-items-center rounded-2xl bg-foam text-river">
                  <Icon size={24} />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">{t}</h3>
                <p className="mt-2 text-slate">{b}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <FinalCta image="/images/van-white.jpg" imageAlt="White Rill service van parked on a residential street" />
    </PageShell>
  );
}
