import Link from "@/components/ui/Link";
import clsx from "clsx";
import { reviews, type Review } from "@/content/reviews";
import { cityBySlug } from "@/content/cities";
import { serviceBySlug } from "@/content/services";
import { Google, Star, ArrowRight } from "@/components/ui/Icons";
import { Counter, SplitReveal } from "@/components/ui/Reveal";
import { WrenchDrip } from "@/components/fx/WrenchDrip";
import { site } from "@/lib/site";
import { defaultBiz } from "@/lib/biz";
import type { Biz } from "@/lib/biz-core";

export function ReviewCard({ r, className, area, job }: { r: Review; className?: string; area?: string; job?: boolean }) {
  const city = cityBySlug(r.city);
  return (
    <figure className={clsx("flex h-full flex-col justify-between rounded-[1.6rem] bg-white p-6 ring-1 ring-abyss/8 phone:rounded-[1.3rem] phone:!px-4 phone:!py-3.5", className)}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <span role="img" className="flex text-sunny" aria-label={`${r.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={17} className={i < r.rating ? "" : "text-abyss/15"} />
            ))}
          </span>
          {/* Phones: which job this review is about */}
          {job && <span className="ml-auto truncate text-[0.78rem] font-semibold text-river">{serviceBySlug(r.service)?.name}</span>}
          <Google size={18} className="shrink-0" />
        </div>
        <blockquote className="mt-4 text-[0.98rem] leading-relaxed text-abyss/90 phone:mt-2 phone:text-[0.93rem] phone:leading-snug">
          <p>&ldquo;{r.text}&rdquo;</p>
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3 phone:mt-2.5 phone:gap-2.5">
        <span className="grid size-10 place-items-center rounded-full bg-foam font-display font-semibold text-river phone:size-8 phone:text-sm" aria-hidden>
          {r.name[0]}
        </span>
        <span className="text-sm leading-tight">
          <strong className="block">{r.name}</strong>
          <span className="text-slate">
            {area ?? (
              <>
                {r.area}, {city?.name}
                {r.tech ? ` · with ${r.tech}` : ""}
              </>
            )}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse, speed, area }: { items: Review[]; reverse?: boolean; speed: string; area?: string }) {
  return (
    <div className="marquee relative overflow-hidden">
      <div
        className="marquee-track flex w-max gap-4"
        style={{ ["--speed" as string]: speed, ["--dir" as string]: reverse ? "reverse" : "normal" }}
      >
        {[...items, ...items].map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} r={r} area={area} className="w-[20rem] sm:w-[24rem]" />
        ))}
      </div>
    </div>
  );
}

export function ReviewsWall({ biz = defaultBiz }: { biz?: Biz }) {
  const sr = biz.lang === "sr";
  const area = biz.preview ? biz.area : undefined;
  const a = reviews.slice(0, 6);
  const b = reviews.slice(6);
  // Phones: the emergency jobs in full, the rest a swipe away
  const lead = ["Megan T.", "Marcus J.", "Kevin O."].map((n) => reviews.find((r) => r.name === n)!);
  const rest = reviews.filter((r) => !lead.includes(r));
  return (
    <section data-pipe aria-labelledby="reviews-heading" className="section-y relative overflow-hidden bg-foam">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end phone:gap-3">
        <div>
          <div className="flex items-end justify-between gap-4">
            <p className="eyebrow text-river">Reviews</p>
            {/* phones: the rating row has no room for it */}
            <WrenchDrip className="-mb-3 h-auto w-16 shrink-0 sm:hidden phone:hidden" />
          </div>
          <SplitReveal as="h2" id="reviews-heading" className="t-1 mt-4 font-display font-semibold phone:mt-2">
            {biz.preview ? (sr ? "Komšije, " : `${biz.area}, `) : "North Dallas, "}
            <span className="accent font-normal text-bonnet">{sr ? "njihovim rečima." : "in their words."}</span>
          </SplitReveal>
        </div>
        {(biz.rating || !biz.preview) && (
        <div className="flex items-center gap-5 phone:gap-3">
          <WrenchDrip className="hidden shrink-0 sm:block phone:hidden" />
          <Counter value={(biz.rating ?? { value: site.rating }).value} decimals={1} className="font-display text-8xl font-semibold leading-none tracking-tighter phone:text-[3.25rem]" />
          <div>
            <span className="flex text-sunny phone:hidden" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} />
              ))}
            </span>
            <p className="mt-1 text-sm text-slate phone:mt-0">
              <Counter value={(biz.rating ?? { count: site.reviewCount }).count} /> {sr ? "Google recenzija" : "Google reviews"}
            </p>
            <Link href="/reviews" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-abyss underline-offset-4 hover:underline phone:mt-0.5">
              Read them all <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        )}
      </div>

      <div className="mt-14 space-y-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] phone:hidden">
        <Row area={area} items={a} speed="70s" />
        <Row area={area} items={b} speed="80s" reverse />
      </div>

      <div className="container-x mt-3 hidden phone:block">
        <div className="space-y-2.5">
          {lead.map((r) => (
            <ReviewCard key={r.name} r={r} area={area} job />
          ))}
        </div>
        <div className="rail mt-2.5">
          {rest.map((r) => (
            <ReviewCard key={r.name} r={r} area={area} job className="!h-auto w-[min(80vw,22rem)]" />
          ))}
        </div>
      </div>
    </section>
  );
}
