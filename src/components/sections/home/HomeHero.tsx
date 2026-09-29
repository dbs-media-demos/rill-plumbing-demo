import Image from "next/image";
import type { CSSProperties } from "react";
import { WaterSurface } from "@/components/fx/WaterSurface";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Google, Phone, Shield, Star } from "@/components/ui/Icons";
import { site, telHref } from "@/lib/site";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HomeHero() {
  return (
    <section data-header="dark" className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-abyss text-white">
      <Image
        src="/images/hero-water.jpg"
        alt=""
        fill
        fetchPriority="high"
        loading="eager"
        sizes="100vw"
        quality={60}
        className="-z-20 object-cover"
      />
      <WaterSurface src="/tex/hero-water.webp" srcSmall="/tex/hero-water-sm.webp" className="-z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,34,47,0.55)_0%,rgba(6,34,47,0)_28%,rgba(6,34,47,0.05)_55%,rgba(6,34,47,0.85)_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_0%_100%,rgba(6,34,47,0.7),transparent_60%)]" />

      <p
        className="anim-fade pointer-events-none absolute right-5 top-28 hidden items-center gap-2 text-sm text-white/60 lg:flex"
        style={d(1.6)}
        aria-hidden
      >
        <span className="inline-block size-1.5 rounded-full bg-spray" /> The water&apos;s live. Stir it.
      </p>

      <div className="container-x relative mt-auto pb-10 pt-36 lg:pb-14">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="anim-fade flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] font-medium text-white/85" style={d(0.05)}>
              <span className="pulse-dot" aria-hidden />
              Plumbers on call 24/7 · Plano &amp; North Dallas
            </p>
            <h1 className="t-display mt-5 font-display font-semibold">
              <span className="anim-line block overflow-hidden pb-[0.06em]">
                <span style={d(0.1)}>Water where</span>
              </span>
              <span className="anim-line block overflow-hidden pb-[0.12em]">
                <span style={d(0.22)}>
                  it <span className="accent font-normal text-spray">belongs.</span>
                </span>
              </span>
            </h1>
            <p className="anim-fade mt-6 max-w-xl text-lg text-white/85 lg:text-xl" style={d(0.45)}>
              Leaks, clogs and dead water heaters, fixed today by licensed plumbers who quote upfront, wear shoe covers, and
              charge the same at 2&nbsp;am as 2&nbsp;pm.
            </p>
            <div className="anim-fade mt-8 flex flex-wrap gap-3" style={d(0.6)}>
              <Button href="/book" size="lg" icon={<ArrowRight size={18} />}>
                Book a plumber
              </Button>
              <Button href={telHref} size="lg" variant="outline-light" icon={<Phone size={18} />}>
                {site.phoneDisplay}
              </Button>
            </div>
          </div>

          <div className="anim-drop relative hidden w-[clamp(15rem,22vw,20rem)] lg:block" style={d(0.5)}>
            <div className="mask-drop relative aspect-[100/130] w-full">
              <Image
                src="/images/plumber-under-sink.jpg"
                alt="Rill plumber replacing a supply line under a kitchen sink"
                fill
                sizes="320px"
                quality={70}
                className="object-cover"
              />
            </div>
            <div className="absolute -left-10 bottom-10 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 text-abyss shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
              <span className="relative grid size-9 place-items-center rounded-full bg-foam text-river">
                <span className="pulse-dot" style={{ ["--dot" as string]: "#3ddc97" }} />
              </span>
              <span className="text-sm leading-tight">
                <strong className="block">Marcus is nearby</strong>
                <span className="text-slate">~38 min to Plano</span>
              </span>
            </div>
          </div>
        </div>

        <ul
          className="anim-fade mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-sm text-white/80"
          style={d(0.75)}
        >
          <li className="flex items-center gap-2">
            <Google size={16} />
            <span className="flex text-sunny" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} />
              ))}
            </span>
            <strong className="text-white">{site.rating}</strong> from {site.reviewCount} reviews
          </li>
          <li className="flex items-center gap-2">
            <Shield size={18} /> Licensed &amp; insured
          </li>
          <li>No overtime charges, ever</li>
          <li>1-year labor warranty</li>
        </ul>
      </div>
    </section>
  );
}
