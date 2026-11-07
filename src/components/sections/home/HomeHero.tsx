import Image, { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { LazyWaterSurface } from "@/components/fx/LazyWaterSurface";
import { ConceptNote } from "@/components/layout/ConceptNote";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Google, Phone, Shield, Star } from "@/components/ui/Icons";
import { defaultBiz } from "@/lib/biz";
import { L, num, telOf, type Biz } from "@/lib/biz-core";
import { PHONE_MEDIA } from "@/lib/phone";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HomeHero({ biz = defaultBiz }: { biz?: Biz }) {
  const sr = biz.lang === "sr";
  // One <img>, two photos: the water still behind the desktop's WebGL, a plumber at work on phones.
  const { props: still } = getImageProps({
    src: "/images/hero-water.jpg",
    alt: "",
    fill: true,
    fetchPriority: "high",
    loading: "eager",
    sizes: "100vw",
    quality: 60,
    className: "-z-20 object-cover phone:!h-[66%] phone:object-[60%_30%]",
  });
  // The landscape photo is cropped to a portrait box, so it renders about 1.6 screens wide: ask for that to keep it sharp.
  const { props: phoneStill } = getImageProps({ src: "/images/plumber-under-sink.jpg", alt: "", fill: true, sizes: "160vw", quality: 60 });

  return (
    <section data-hero data-header="dark" className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-abyss text-white phone:min-h-[min(calc(100svh-8.75rem),46rem)]">
      <picture>
        <source media={PHONE_MEDIA} srcSet={phoneStill.srcSet} sizes={phoneStill.sizes} />
        <img {...still} alt="" />
      </picture>
      <LazyWaterSurface src="/tex/hero-water.webp" srcSmall="/tex/hero-water-sm.webp" className="-z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,34,47,0.55)_0%,rgba(6,34,47,0)_28%,rgba(6,34,47,0.05)_55%,rgba(6,34,47,0.85)_100%)] phone:hidden"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_0%_100%,rgba(6,34,47,0.7),transparent_60%)] phone:hidden" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-[66%] bg-[linear-gradient(180deg,rgba(6,34,47,0.6)_0%,rgba(6,34,47,0)_24%,rgba(6,34,47,0)_46%,rgba(6,34,47,0.82)_70%,#06222f_92%)] phone:block"
      />

      <ConceptNote biz={biz} className="absolute right-3 top-[4.75rem] z-10 hidden rounded-full bg-white/90 px-3 py-1 text-[0.75rem] text-abyss phone:block" />

      <p
        className="anim-fade pointer-events-none absolute right-5 top-28 hidden items-center gap-2 text-sm text-white/60 lg:flex phone:hidden"
        style={d(1.6)}
        aria-hidden
      >
        <span className="inline-block size-1.5 rounded-full bg-spray" /> The water&apos;s live. Stir it.
      </p>

      <div className="container-x relative mt-auto pb-10 pt-36 lg:pb-14 phone:pb-5 phone:pt-40">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="anim-fade flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] font-medium text-white/85 phone:hidden" style={d(0.05)}>
              <span className="pulse-dot" aria-hidden />
              {biz.preview ? `${sr ? "Vodoinstalateri dežurni 24/7" : "Plumbers on call 24/7"} · ${biz.area}` : "Plumbers on call 24/7 · Plano & North Dallas"}
            </p>
            <p className="hidden text-[0.95rem] font-medium text-spray phone:block">{biz.tagline ?? L(biz, "Water where it belongs.", "Voda tamo gde joj je mesto.")}</p>
            <h1 className="t-display mt-5 font-display font-semibold phone:mt-1.5">
              {/* Phones lead with the service and the town */}
              <span className="hidden phone:block">
                {L(biz, "24/7 plumbers in ", "Vodoinstalater 24/7, ")}
                <span className="accent font-normal text-spray">{biz.area}.</span>
              </span>
              <span className="anim-line block overflow-hidden pb-[0.06em] phone:hidden">
                <span style={d(0.1)}>{biz.tagline ?? "Water where"}</span>
              </span>
              {!biz.tagline && (
                <span className="anim-line block overflow-hidden pb-[0.12em] phone:hidden">
                  <span style={d(0.22)}>
                    it <span className="accent font-normal text-spray">belongs.</span>
                  </span>
                </span>
              )}
            </h1>
            <div className="mt-3 hidden phone:block">
              {biz.rating && (
                <p className="flex flex-wrap items-center gap-x-2 text-[0.95rem] text-white/90">
                  <span className="flex text-sunny" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={15} />
                    ))}
                  </span>
                  <strong className="text-white">{num(biz, biz.rating.value)}</strong>
                  <span>
                    · {biz.rating.count} {sr ? "Google recenzija" : "Google reviews"}
                  </span>
                </p>
              )}
              {biz.phone ? (
                <Button href={telOf(biz)!} size="lg" magnetic={false} className="mt-3.5 w-full !py-3.5">
                  <Phone size={18} />
                  {L(biz, "Call", "Pozovite")} {biz.phoneDisplay}
                </Button>
              ) : (
                <Button href="/book" size="lg" magnetic={false} className="mt-3.5 w-full !py-3.5" icon={<ArrowRight size={18} />}>
                  {L(biz, "Book a plumber", "Zakažite majstora")}
                </Button>
              )}
            </div>
            <p className="anim-fade mt-6 max-w-xl text-lg text-white/85 lg:text-xl phone:mt-3.5 phone:text-pretty phone:text-[0.95rem] phone:leading-snug phone:text-white/75" style={d(0.45)}>
              {sr ? (
                "Curenja, zapušenja i pokvareni bojleri, rešeni danas. Licencirani majstori koji kažu cenu unapred, nose navlake za cipele i naplaćuju isto u 2 noću kao u 2 popodne."
              ) : (
                <>
                  Leaks, clogs and dead water heaters, fixed today by licensed plumbers who quote upfront, wear shoe covers, and
                  charge the same at 2&nbsp;am as 2&nbsp;pm.
                </>
              )}
            </p>
            <div className="anim-fade mt-8 flex flex-wrap gap-3 phone:hidden" style={d(0.6)}>
              <Button href="/book" size="lg" icon={<ArrowRight size={18} />}>
                Book a plumber
              </Button>
              {biz.phone && (
                <Button href={telOf(biz)!} size="lg" variant="outline-light" icon={<Phone size={18} />}>
                  {biz.phoneDisplay}
                </Button>
              )}
            </div>
          </div>

          <div className="anim-drop relative hidden w-[clamp(15rem,22vw,20rem)] lg:block" style={d(0.5)}>
            <div className="mask-drop relative aspect-[100/130] w-full">
              <Image
                src="/images/plumber-under-sink.jpg"
                alt={biz.preview ? "Plumber replacing a supply line under a kitchen sink" : "Rill plumber replacing a supply line under a kitchen sink"}
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
                <strong className="block">{biz.preview ? (sr ? "Vodoinstalater je blizu" : "A plumber is nearby") : "Marcus is nearby"}</strong>
                <span className="text-slate">{biz.preview ? (sr ? "Stiže brzo" : "On the way fast") : "~38 min to Plano"}</span>
              </span>
            </div>
          </div>
        </div>

        <ul
          className="anim-fade mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-sm text-white/80 phone:hidden"
          style={d(0.75)}
        >
          {biz.rating && (
          <li className="flex items-center gap-2">
            <Google size={16} />
            <span className="flex text-sunny" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} />
              ))}
            </span>
            <strong className="text-white">{num(biz, biz.rating.value)}</strong> {sr ? `· ${biz.rating.count} recenzija` : `from ${biz.rating.count} reviews`}
          </li>
          )}
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
