import { getImageProps } from "next/image";
import { HeroPipes } from "@/components/fx/HeroPipes";
import { ConceptNote } from "@/components/layout/ConceptNote";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Google, Phone, Shield, Star } from "@/components/ui/Icons";
import { defaultBiz } from "@/lib/biz";
import { L, num, telOf, type Biz } from "@/lib/biz-core";
import { PHONE_MEDIA } from "@/lib/phone";

export function HomeHero({ biz = defaultBiz }: { biz?: Biz }) {
  const sr = biz.lang === "sr";
  const longTitle = sr || (biz.tagline?.length ?? 0) > 22;
  // One <img>, two pictures: on desktop the still of the 3D pipework (rendered from the live scene by
  // scripts/render-hero.mjs and cropped the way its camera crops), a plumber at work on phones.
  const { props: still } = getImageProps({
    src: "/images/hero-pipes.jpg",
    alt: "",
    width: 2400,
    height: 1500,
    fetchPriority: "high",
    loading: "eager",
    sizes: "100vw",
    quality: 70,
    className: "absolute inset-0 -z-20 h-full w-full object-cover object-[74%_42%] phone:!h-[66%] phone:object-[60%_30%]",
  });
  // The same pipework, framed for a phone: crossfades in over the photo once the page has loaded.
  const { props: pipesPhone } = getImageProps({ src: "/images/hero-pipes-phone.jpg", alt: "", width: 1080, height: 1350, sizes: "100vw", quality: 60 });
  // The landscape photo is cropped to a portrait box, so it renders about 1.6 screens wide: ask for that to keep it sharp.
  const { props: phoneStill } = getImageProps({ src: "/images/plumber-under-sink.jpg", alt: "", fill: true, sizes: "160vw", quality: 60 });

  return (
    <section data-hero data-header="dark" className="group on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-abyss text-white phone:min-h-[min(calc(100svh-8.75rem),46rem)]">
      <picture>
        <source media={PHONE_MEDIA} srcSet={phoneStill.srcSet} sizes={phoneStill.sizes} />
        <img {...still} alt="" />
      </picture>
      <HeroPipes
        phoneStill={{ src: pipesPhone.src, srcSet: pipesPhone.srcSet, sizes: pipesPhone.sizes }}
        labels={
          sr
            ? { open: "Zatvori", closed: "Pusti" }
            : { open: "Shut it", closed: "Open it" }
        }
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,34,47,0.55)_0%,rgba(6,34,47,0)_28%,rgba(6,34,47,0.05)_55%,rgba(6,34,47,0.62)_100%)] phone:hidden"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_0%_100%,rgba(6,34,47,0.7),transparent_60%)] phone:hidden" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-[66%] bg-[linear-gradient(180deg,rgba(6,34,47,0.6)_0%,rgba(6,34,47,0)_24%,rgba(6,34,47,0)_46%,rgba(6,34,47,0.82)_70%,#06222f_92%)] phone:block"
      />

      <ConceptNote biz={biz} className="absolute right-3 top-[4.75rem] z-10 hidden rounded-full bg-white/90 px-3 py-1 text-[0.75rem] text-abyss phone:block" />

      <div className="container-x relative mt-auto pb-10 pt-36 lg:pb-20 phone:pb-5 phone:pt-40">
        <div className="grid items-end gap-10">
          <div className="max-w-[min(62vw,64rem)] phone:max-w-none">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] font-medium text-white/85 phone:hidden">
              <span className="pulse-dot" aria-hidden />
              {biz.preview ? `${sr ? "Vodoinstalateri dežurni 24/7" : "Plumbers on call 24/7"} · ${biz.area}` : "Plumbers on call 24/7 · Plano & North Dallas"}
            </p>
            <p className="hidden text-[0.95rem] font-medium text-spray phone:block">{biz.tagline ?? L(biz, "Water where it belongs.", "Voda tamo gde joj je mesto.")}</p>
            {/* Serbian and long CRM taglines run to three lines: a size down keeps the buttons on the first screen */}
            <h1 className={`t-display mt-5 font-display font-semibold phone:mt-1.5 ${longTitle ? "lg:!text-[clamp(3rem,7.6vw,8.5rem)]" : ""}`}>
              {/* Phones lead with the service and the town */}
              <span className="hidden phone:block">
                {L(biz, "24/7 plumbers in ", "Vodoinstalater 24/7, ")}
                <span className="accent font-normal text-spray">{biz.area}.</span>
              </span>
              <span className="block pb-[0.06em] phone:hidden">
                <span>{biz.tagline ?? "Water where"}</span>
              </span>
              {!biz.tagline && (
                <span className="block pb-[0.12em] phone:hidden">
                  <span>
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
            <p className="mt-6 max-w-xl text-lg text-white/85 lg:text-xl phone:mt-3.5 phone:text-pretty phone:text-[0.95rem] phone:leading-snug phone:text-white/75">
              {sr ? (
                "Curenja, zapušenja i pokvareni bojleri, rešeni danas. Licencirani majstori koji kažu cenu unapred, nose navlake za cipele i naplaćuju isto u 2 noću kao u 2 popodne."
              ) : (
                <>
                  Leaks, clogs and dead water heaters, fixed today by licensed plumbers who quote upfront, wear shoe covers, and
                  charge the same at 2&nbsp;am as 2&nbsp;pm.
                </>
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 phone:hidden">
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
        </div>

        <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-sm text-white/80 phone:hidden">
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
          {/* The 3D valve's hint: its space is always there, it shows once the live scene does (HeroPipes) */}
          <li aria-hidden className="invisible ml-auto flex items-center gap-2 text-white/65 opacity-0 transition-opacity duration-700 group-data-[live]:visible group-data-[live]:opacity-100">
            <span className="inline-block size-1.5 rounded-full bg-spray group-data-[valve=closed]:bg-alert" />
            <span className="group-data-[valve=closed]:hidden">{L(biz, "Click the valve to shut the water off", "Kliknite na ventil i zatvorite vodu")}</span>
            <span className="hidden group-data-[valve=closed]:inline">{L(biz, "Water off. Click it again to open", "Voda je zatvorena. Kliknite ponovo")}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
