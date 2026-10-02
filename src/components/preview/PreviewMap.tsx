import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { DAY_NAMES, L, dayRange, weekFromMonday, type Biz } from "@/lib/biz-core";

/** A preview's "where we are": the business's real address on a Google map, hours and directions. */
export function PreviewMap({ biz }: { biz: Biz }) {
  const query = [biz.name, biz.address.full].filter(Boolean).join(", ");
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  return (
    <section data-pipe aria-labelledby="where-heading" className="section-y relative bg-foam">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="eyebrow text-river">{L(biz, "Where we are", "Gde smo")}</p>
          <SplitReveal as="h2" id="where-heading" className="t-1 mt-4 font-display font-semibold">
            {biz.lang === "sr" ? (
              <>
                Brzo <span className="accent font-normal text-bonnet">do vas.</span>
              </>
            ) : (
              <>
                {biz.area}, <span className="accent font-normal text-bonnet">fast.</span>
              </>
            )}
          </SplitReveal>
          {biz.address.full && <p className="mt-6 max-w-md text-lg text-slate">{biz.address.full}</p>}
          <Reveal className="mt-6 space-y-6">
            <OpenBadge />
            {biz.hours && (
              <dl className="grid max-w-sm grid-cols-[auto_1fr] gap-x-8 gap-y-1.5">
                {weekFromMonday(biz.hours).map((h) => (
                  <div key={h.day} className="contents">
                    <dt className="text-slate">{DAY_NAMES[biz.lang][h.day]}</dt>
                    <dd className="text-right font-medium">{dayRange(h, biz.lang)}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Button href={directions} variant="dark" icon={<ArrowRight size={18} />}>
              {L(biz, "Get directions", "Kako do nas")}
            </Button>
          </Reveal>
        </div>
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] ring-1 ring-abyss/10">
            <iframe src={embed} title={L(biz, `Map: ${query}`, `Mapa: ${query}`)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
