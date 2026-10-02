import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/sections/PageHero";
import { BookingForm } from "@/components/forms/BookingForm";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";
import { site, telHref } from "@/lib/site";

const title = "Book a Plumber Online";
const description =
  "Book a licensed Rill plumber in Plano, Frisco, Allen, Richardson, Carrollton or North Dallas in under a minute. Same-day and 24/7 emergency service, flat upfront prices.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/book", eyebrow: "Book in under a minute" });

export default function BookPage() {
  return (
    <PageShell>
      <JsonLd
        data={graph(
          { ...webPageSchema({ path: "/book", name: title, description }), potentialAction: { "@type": "ReserveAction", target: `${site.url}/book` } },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Book", path: "/book" },
          ]),
        )}
      />
      <section data-header="light" className="relative overflow-hidden bg-porcelain pb-24 pt-32 lg:pt-40">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-spray/60 blur-[100px]" />
        <div className="container-x relative">
          <div className="anim-fade">
            <Breadcrumbs
              tone="light"
              items={[
                { name: "Home", path: "/" },
                { name: "Book", path: "/book" },
              ]}
            />
          </div>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="t-1 anim-heading font-display font-semibold">
                Book a <span className="accent font-normal text-bonnet">plumber.</span>
              </h1>
              <p className="anim-fade mt-4 max-w-xl text-lg text-slate" style={{ ["--d" as string]: "0.2s" }}>
                Four quick steps. No payment needed. Emergencies are faster by phone:{" "}
                <a href={telHref} className="font-semibold text-abyss underline underline-offset-4">
                  {site.phoneDisplay}
                </a>
                .
              </p>
            </div>
            <OpenBadge />
          </div>
          <div className="anim-fade mt-12" style={{ ["--d" as string]: "0.3s" }}>
            <BookingForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
