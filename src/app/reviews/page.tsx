import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { ReviewsBrowser } from "@/components/sections/ReviewsBrowser";
import { FinalCta } from "@/components/sections/FinalCta";
import { Google, Star } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { ratingBreakdown, reviews } from "@/content/reviews";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema, bizId } from "@/lib/schema";
import { site } from "@/lib/site";

const title = "Plumbing Reviews from North Dallas Homeowners";
const description = `Rated ${site.rating} from ${site.reviewCount} Google reviews. Read what homeowners in Plano, Frisco, Allen, Richardson, Carrollton and North Dallas say about Rill Plumbing.`;

export const metadata: Metadata = buildMetadata({ title, description, path: "/reviews", eyebrow: `${site.rating}★ · ${site.reviewCount} reviews` });

export default function ReviewsPage() {
  return (
    <PageShell>
      <JsonLd
        data={graph({
          ...webPageSchema({ path: "/reviews", name: title, description }),
          about: { "@id": bizId },
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            datePublished: r.date,
            reviewBody: r.text,
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            itemReviewed: { "@id": bizId },
          })),
        })}
      />
      <PageHero
        eyebrow="Reviews"
        title={
          <>
            {site.reviewCount} neighbors, <span className="accent font-normal text-spray">one verdict.</span>
          </>
        }
        intro="Real words from North Dallas homeowners about arrival times, prices and how we leave the house."
        image="/images/hands-water.jpg"
        imageAlt="Hands cupping clean running water"
        crumbs={[{ name: "Reviews", path: "/reviews" }]}
        compact
      />

      <section className="section-y bg-foam" aria-labelledby="summary-heading">
        <div className="container-x">
          <Reveal className="grid gap-8 rounded-[2rem] bg-white p-7 ring-1 ring-abyss/8 sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-16">
            <div>
              <h2 id="summary-heading" className="flex items-center gap-2 text-sm font-semibold text-slate">
                <Google /> Google rating
              </h2>
              <p className="mt-2 font-display text-8xl font-semibold leading-none tracking-tighter">{site.rating}</p>
              <span role="img" className="mt-2 flex text-sunny" aria-label={`${site.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={22} />
                ))}
              </span>
              <p className="mt-2 text-slate">{site.reviewCount} reviews</p>
            </div>
            <ul className="grid content-center gap-3" aria-label="Rating breakdown">
              {ratingBreakdown.map((b) => (
                <li key={b.stars} className="grid grid-cols-[3rem_1fr_3rem] items-center gap-3 text-sm">
                  <span className="font-semibold">{b.stars} ★</span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-abyss/8">
                    <span className="block h-full rounded-full bg-sunny" style={{ width: `${Math.max(1, b.pct)}%` }} />
                  </span>
                  <span className="text-right text-slate">{b.pct}%</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-14">
            <ReviewsBrowser />
          </div>
          <p className="mt-6 text-sm text-slate">Reviews shown are fictional examples written for this concept site.</p>
        </div>
      </section>

      <FinalCta />
    </PageShell>
  );
}
