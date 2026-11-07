import type { ReactNode } from "react";
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
import { CallbackForm } from "@/components/forms/CallbackForm";
import { Pipeline } from "@/components/fx/Pipeline";
import { PressureGauge } from "@/components/fx/PressureGauge";
import { PilotFlame } from "@/components/fx/PilotFlame";
import { StatRiser } from "@/components/fx/StatRiser";
import { DrainSwirl } from "@/components/fx/DrainSwirl";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check, Pin, Shield } from "@/components/ui/Icons";
import { Counter, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { homeFaqs } from "@/content/faqs";
import { stats } from "@/content/company";
import { serviceLinks } from "@/content/services";
import { cityLinks } from "@/content/cities";
import { defaultBiz } from "@/lib/biz";
import { L, openDays, type Biz } from "@/lib/biz-core";
import { site } from "@/lib/site";
import { PreviewMap } from "@/components/preview/PreviewMap";

type Stat = { value: number; suffix?: string; label: string; decimals?: number };

/** A preview states only what's true of the real business: its rating and opening days. */
function previewStats(biz: Biz): Stat[] {
  const days = openDays(biz);
  return [
    ...(biz.rating ? [{ value: biz.rating.value, suffix: "★", decimals: 1, label: L(biz, "average Google rating", "prosečna ocena na Google-u") }] : []),
    ...(biz.rating ? [{ value: biz.rating.count, suffix: "", label: L(biz, "Google reviews", "Google recenzija") }] : []),
    ...(days ? [{ value: days, suffix: "", label: L(biz, "days a week the office is open", "dana nedeljno radimo") }] : []),
    { value: 24, suffix: "/7", label: L(biz, "plumbers on call for emergencies", "dežurni vodoinstalateri za hitne slučajeve") },
  ];
}

/** Phones only: licence, insurance and the local address, straight after the services. */
function TrustStrip({ biz }: { biz: Biz }) {
  return (
    <section aria-label={L(biz, "Licence, insurance and address", "Licenca, osiguranje i adresa")} className="relative hidden bg-abyss py-5 text-white phone:order-4 phone:block" data-header="dark">
      <ul className="container-x grid gap-1.5 text-[0.9rem] leading-snug">
        <li className="flex items-start gap-2.5">
          <Shield size={18} className="mt-0.5 shrink-0 text-spray" />
          <span>
            Licensed &amp; insured
            {!biz.preview && <span className="text-white/65"> · {site.license}</span>}
          </span>
        </li>
        {biz.address.full && (
          <li className="flex items-start gap-2.5">
            <Pin size={18} className="mt-0.5 shrink-0 text-spray" />
            <span>{biz.address.full}</span>
          </li>
        )}
        <li className="flex items-start gap-2.5">
          <Check size={18} className="mt-0.5 shrink-0 text-spray" />
          <span>
            No overtime charges, ever <span className="text-white/65">·</span> 1-year labor warranty
          </span>
        </li>
      </ul>
    </section>
  );
}

/**
 * The homepage sections. The concept site renders them as they are; a personalised preview
 * (/for/<token>) passes a real business: its name, phone, hours, rating and a map of its address
 * replace Rill's, and the North Dallas arrival map and area panels step aside.
 * The source order is the desktop's. On phones `phone:order-*` reads as an emergency call goes:
 * problems and services, who you're letting in, reviews, the fee, photos, the form, the FAQ.
 */
export function HomeContent({ biz = defaultBiz, children }: { biz?: Biz; children?: ReactNode }) {
  const statList = biz.preview ? previewStats(biz) : stats;
  return (
    <PageShell>
      {children}
      <div className="home-flow">
        <div className="phone:order-1">
          <HomeHero biz={biz} />
        </div>
        <div className="phone:order-9">
          <DropletZoom />
        </div>

        <Pipeline>
          <div className="phone:order-2">
            <ProblemPicker services={serviceLinks} />
          </div>
          <div className="phone:order-3">
            <ServicesList services={serviceLinks} />
          </div>
          <TrustStrip biz={biz} />
          <div className="phone:order-13">{biz.preview ? <PreviewMap biz={biz} /> : <EtaMap cities={cityLinks} />}</div>

          <section data-pipe aria-labelledby="prices-heading" className="section-y relative bg-white phone:order-7">
            <div className="container-x grid gap-12 max-lg:grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 phone:gap-5">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <p className="eyebrow text-river">Upfront pricing</p>
                <SplitReveal as="h2" id="prices-heading" className="t-1 mt-4 font-display font-semibold phone:mt-2">
                  Know the price <span className="accent font-normal text-bonnet">first.</span>
                </SplitReveal>
                <p className="mt-6 max-w-md text-lg text-slate phone:mt-3 phone:text-[0.98rem]">
                  Flat prices per job, never per hour. These are our most-booked jobs; your exact price is confirmed on site before
                  any work starts.
                </p>
                {/* Phones: the call-out fee, up front */}
                <ul className="mt-4 hidden grid-cols-3 gap-2 phone:grid">
                  {[
                    ["$0", "trip fee"],
                    ["$0", "overtime"],
                    ["$79", "diagnostic, waived"],
                  ].map(([a, b]) => (
                    <li key={b} className="rounded-2xl bg-foam p-3">
                      <p className="font-display text-2xl font-semibold tracking-tight text-river">{a}</p>
                      <p className="mt-0.5 text-[0.8rem] leading-tight text-slate">{b}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center gap-6 phone:mt-4 phone:justify-between">
                  <Button href="/pricing" variant="dark" icon={<ArrowRight size={18} />}>
                    Full price menu
                  </Button>
                  <PressureGauge className="shrink-0 phone:size-14" />
                </div>
              </div>
              <PriceMenu groups={["drains", "heaters", "fixtures", "leaks"]} />
            </div>
          </section>

          <div className="phone:order-8">
            <PromiseStack />
          </div>

          <section data-pipe aria-labelledby="heater-heading" className="section-y relative bg-white phone:order-11">
            <div className="container-x grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 phone:gap-5">
              <div>
                <div className="flex items-end gap-3">
                  <PilotFlame className="shrink-0 phone:hidden" />
                  <p className="eyebrow text-river">Water heaters</p>
                </div>
                <SplitReveal as="h2" id="heater-heading" className="t-1 mt-4 font-display font-semibold phone:mt-2">
                  Tank or <span className="accent font-normal text-bonnet">tankless?</span>
                </SplitReveal>
                <p className="mt-6 max-w-md text-lg text-slate phone:mt-3 phone:text-[0.98rem]">
                  Drag to compare. Most replacements happen the same day you call, and our sizing guide tells you which one your
                  household actually needs.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 phone:mt-3.5 phone:flex-nowrap phone:gap-2 phone:[&>*]:flex-auto phone:[&>*]:whitespace-nowrap phone:[&>*]:!px-3 phone:[&>*]:!text-[0.9rem] phone:[&_svg]:hidden">
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

        <div className="phone:order-10">
          <WorkRail />
        </div>

        <Pipeline>
          <div className="phone:order-5">
            <ReviewsWall biz={biz} />
          </div>

          <section data-pipe aria-label={biz.preview ? biz.name : "Rill Plumbing by the numbers"} className="relative bg-abyss py-16 text-white lg:py-20 phone:order-6 phone:py-7" data-header="dark">
            <div className="container-x">
              <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4 phone:gap-y-5">
                {statList.map((s, i) => (
                  <div key={s.label} className="relative border-l border-white/15 pl-5 phone:pl-3.5">
                    <StatRiser delay={i * 0.12} />
                    <dt className="sr-only">{s.label}</dt>
                    <dd>
                      <Counter
                        value={s.value}
                        decimals={s.decimals ?? 0}
                        suffix={s.suffix}
                        className="block font-display text-5xl font-semibold tracking-tight lg:text-6xl phone:text-[2rem]"
                      />
                      <span className="mt-2 block text-white/70 phone:mt-1 phone:text-[0.85rem] phone:leading-snug">{s.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {!biz.preview && (
            <div className="phone:order-16">
              <AreaPanels cities={cityLinks} />
            </div>
          )}

          {/* Phones only: the desktop sends people to /book, a phone gets the short form right here */}
          <section aria-labelledby="request-heading" className="section-y relative hidden bg-porcelain phone:order-14 phone:block">
            <div className="container-x">
              <p className="eyebrow text-river">Send a plumber</p>
              <h2 id="request-heading" className="t-1 mt-2 font-display font-semibold">
                Tell us <span className="accent font-normal text-bonnet">what&apos;s wrong.</span>
              </h2>
              <CallbackForm />
            </div>
          </section>

          <section data-pipe aria-labelledby="faq-heading" className="section-y relative bg-white phone:order-15">
            <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 phone:gap-5">
              <div>
                <p className="eyebrow text-river">FAQ</p>
                <SplitReveal as="h2" id="faq-heading" className="t-1 mt-4 font-display font-semibold phone:mt-2">
                  Good <span className="accent font-normal text-bonnet">questions.</span>
                </SplitReveal>
                <p className="mt-6 max-w-sm text-lg text-slate phone:mt-3 phone:text-[0.98rem]">Straight answers about pricing, timing and who shows up at your door.</p>
                <div className="mt-8 flex items-center gap-6 phone:hidden">
                  <Button href="/faq" variant="outline" icon={<ArrowRight size={18} />}>
                    All FAQs
                  </Button>
                  <DrainSwirl className="shrink-0" />
                </div>
              </div>
              <div className="min-w-0">
                <Accordion items={homeFaqs} />
                <div className="mt-4 hidden phone:block">
                  <Button href="/faq" variant="outline" icon={<ArrowRight size={18} />}>
                    All FAQs
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <div className="phone:order-17">
            <FinalCta biz={biz} />
          </div>
        </Pipeline>
      </div>
    </PageShell>
  );
}
