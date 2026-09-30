import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { services } from "@/content/services";
import { cities } from "@/content/cities";
import { site, telHref, mailHref, agencyName, agencyUrl } from "@/lib/site";
import { Google, Star } from "@/components/ui/Icons";
import { OpenBadge } from "./OpenBadge";

const company = [
  { label: "About us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Our work", href: "/work" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Emergency tips", href: "/emergency-tips" },
  { label: "Book service", href: "/book" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer data-header="dark" className="on-dark relative overflow-hidden bg-abyss pb-24 text-white md:pb-0">
      <div className="container-x pt-20 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="max-w-sm font-display text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
              Water where it <span className="accent text-spray">belongs.</span>
            </p>
            <div className="mt-8 space-y-3 text-white/80">
              <a href={telHref} className="block font-display text-3xl font-semibold tracking-tight text-white hover:text-spray">
                {site.phoneDisplay}
              </a>
              <a href={mailHref} className="block hover:text-white">
                {site.email}
              </a>
              <p>{site.address.display}</p>
              <OpenBadge tone="dark" />
            </div>
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
              <Google />
              <span className="flex text-sunny" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} />
                ))}
              </span>
              <span className="text-sm">
                <strong>{site.rating}</strong> · {site.reviewCount} Google reviews
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol title="Services" links={services.map((s) => ({ label: s.name, href: `/services/${s.slug}` }))} />
            <FooterCol
              title="Service areas"
              links={[
                ...cities.map((c) => ({ label: `${c.name}, TX`, href: `/service-areas/${c.slug}` })),
                { label: "All areas", href: "/service-areas" },
              ]}
            />
            <FooterCol title="Company" links={company} />
          </div>
        </div>

        <div className="mt-16 grid gap-6 border-t border-white/10 pt-8 text-sm text-white/60 md:grid-cols-2">
          <div className="space-y-1.5">
            <p>
              Licensed &amp; insured · Texas State Board of Plumbing Examiners · {site.license}
            </p>
            <p>{site.hours.emergency} emergency service · Office {site.hours.office}</p>
          </div>
          <div className="space-y-1.5 md:text-right">
            <p>
              © {new Date().getFullYear()} {site.legalName}. A fictional company.{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-white">
                Privacy
              </Link>
            </p>
            <p>
              Design &amp; development:{" "}
              <a href={agencyUrl} className="font-semibold text-white underline-offset-4 hover:underline">
                {agencyName}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none mt-12 h-[17vw] max-h-[16rem] select-none overflow-hidden text-white/[0.06]" aria-hidden>
        <Wordmark className="mx-auto w-[46vw] max-w-[44rem]" drop="rgba(205,239,245,0.12)" />
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow text-spray">{title}</h2>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
