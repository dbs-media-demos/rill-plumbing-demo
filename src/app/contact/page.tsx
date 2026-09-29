import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, Mail, Phone, Pin } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { cities } from "@/content/cities";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema, bizId } from "@/lib/schema";
import { mailHref, site, smsHref, telHref } from "@/lib/site";

const title = "Contact Rill Plumbing";
const description = `Call ${site.phoneDisplay} 24/7, text us, or send a message. Rill Plumbing serves Plano, Frisco, Allen, Richardson, Carrollton and North Dallas.`;

export const metadata: Metadata = buildMetadata({ title, description, path: "/contact", eyebrow: "Contact · 24/7" });

const hours = [
  ["Emergency line", "24 hours, 7 days"],
  ["Office & booking", "Mon–Sat, 7 am – 7 pm"],
  ["Sunday", "Emergency line only"],
];

export default function ContactPage() {
  return (
    <PageShell>
      <JsonLd data={graph({ ...webPageSchema({ path: "/contact", name: title, description, type: "ContactPage" }), mainEntity: { "@id": bizId } })} />
      <PageHero
        eyebrow="Contact"
        title={
          <>
            A real person answers. <span className="accent font-normal text-spray">Day or night.</span>
          </>
        }
        image="/images/faucet-stream-dark.jpg"
        imageAlt="Faucet running in a dark kitchen at night"
        crumbs={[{ name: "Contact", path: "/contact" }]}
        compact
      >
        <OpenBadge tone="dark" />
      </PageHero>

      <section className="section-y bg-porcelain" aria-label="Ways to reach us">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <Reveal stagger={0.08} className="grid content-start gap-4">
            <a href={telHref} className="group rounded-[1.6rem] bg-abyss p-7 text-white">
              <span className="flex items-center gap-2 text-sm text-white/70">
                <Phone size={18} /> Call 24/7
              </span>
              <span className="mt-2 block font-display text-4xl font-semibold tracking-tight group-hover:text-spray">{site.phoneDisplay}</span>
            </a>
            <div className="grid gap-4 sm:grid-cols-2">
              <a href={smsHref} className="rounded-[1.6rem] bg-white p-6 ring-1 ring-abyss/8 hover:ring-abyss/30">
                <span className="flex items-center gap-2 text-sm text-slate">
                  <Calendar size={18} /> Text us
                </span>
                <span className="mt-1 block font-semibold">Photos welcome</span>
              </a>
              <a href={mailHref} className="rounded-[1.6rem] bg-white p-6 ring-1 ring-abyss/8 hover:ring-abyss/30">
                <span className="flex items-center gap-2 text-sm text-slate">
                  <Mail size={18} /> Email
                </span>
                <span className="mt-1 block break-all font-semibold">{site.email}</span>
              </a>
            </div>
            <div className="rounded-[1.6rem] bg-white p-6 ring-1 ring-abyss/8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate">
                <Clock size={18} /> Hours
              </h2>
              <dl className="mt-3 divide-y divide-abyss/8">
                {hours.map(([a, b]) => (
                  <div key={a} className="flex justify-between gap-4 py-2.5">
                    <dt>{a}</dt>
                    <dd className="font-semibold">{b}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-[1.6rem] bg-white p-6 ring-1 ring-abyss/8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate">
                <Pin size={18} /> {site.address.display}
              </h2>
              <p className="mt-2 text-slate">Service-area business: we come to you in {cities.map((c) => c.name).join(", ")}.</p>
            </div>
            <Button href="/book" variant="dark" size="lg">
              Or book online in a minute
            </Button>
          </Reveal>
          <ContactForm />
        </div>
      </section>
    </PageShell>
  );
}
