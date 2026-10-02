import Link from "next/link";
import clsx from "clsx";
import { reviews, type Review } from "@/content/reviews";
import { cityBySlug } from "@/content/cities";
import { Google, Star, ArrowRight } from "@/components/ui/Icons";
import { Counter, SplitReveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { defaultBiz } from "@/lib/biz";
import type { Biz } from "@/lib/biz-core";

export function ReviewCard({ r, className, area }: { r: Review; className?: string; area?: string }) {
  const city = cityBySlug(r.city);
  return (
    <figure className={clsx("flex h-full flex-col justify-between rounded-[1.6rem] bg-white p-6 ring-1 ring-abyss/8", className)}>
      <div>
        <div className="flex items-center justify-between">
          <span role="img" className="flex text-sunny" aria-label={`${r.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={17} className={i < r.rating ? "" : "text-abyss/15"} />
            ))}
          </span>
          <Google size={18} />
        </div>
        <blockquote className="mt-4 text-[0.98rem] leading-relaxed text-abyss/90">
          <p>&ldquo;{r.text}&rdquo;</p>
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-foam font-display font-semibold text-river" aria-hidden>
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
  return (
    <section data-pipe aria-labelledby="reviews-heading" className="section-y relative overflow-hidden bg-foam">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow text-river">Reviews</p>
          <SplitReveal as="h2" id="reviews-heading" className="t-1 mt-4 font-display font-semibold">
            {biz.preview ? (sr ? "Komšije, " : `${biz.area}, `) : "North Dallas, "}
            <span className="accent font-normal text-bonnet">{sr ? "njihovim rečima." : "in their words."}</span>
          </SplitReveal>
        </div>
        {(biz.rating || !biz.preview) && (
        <div className="flex items-center gap-5">
          <Counter value={(biz.rating ?? { value: site.rating }).value} decimals={1} className="font-display text-8xl font-semibold leading-none tracking-tighter" />
          <div>
            <span className="flex text-sunny" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} />
              ))}
            </span>
            <p className="mt-1 text-sm text-slate">
              <Counter value={(biz.rating ?? { count: site.reviewCount }).count} /> {sr ? "Google recenzija" : "Google reviews"}
            </p>
            <Link href="/reviews" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-abyss underline-offset-4 hover:underline">
              Read them all <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        )}
      </div>

      <div className="mt-14 space-y-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <Row area={area} items={a} speed="70s" />
        <Row area={area} items={b} speed="80s" reverse />
      </div>
    </section>
  );
}
