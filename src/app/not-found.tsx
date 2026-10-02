import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Phone } from "@/components/ui/Icons";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const links = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Emergency tips", href: "/emergency-tips" },
  { label: "Service areas", href: "/service-areas" },
];

/** 404: this page went down the drain (animated swirl). */
export default function NotFound() {
  return (
    <SiteChrome>
      <main id="main" data-header="dark" className="on-dark relative isolate flex min-h-[100svh] items-center overflow-hidden bg-abyss text-white">
        <div aria-hidden className="pointer-events-none absolute right-[-10vw] top-1/2 -z-10 size-[80vw] max-w-[56rem] -translate-y-1/2 opacity-60 lg:right-[-4vw]">
          <svg viewBox="0 0 400 400" className="drain-swirl h-full w-full">
            {Array.from({ length: 9 }).map((_, i) => (
              <circle
                key={i}
                cx="200"
                cy="200"
                r={30 + i * 20}
                fill="none"
                stroke="#35c2e0"
                strokeOpacity={0.12 + i * 0.05}
                strokeWidth={2}
                strokeDasharray={`${40 + i * 18} ${18 + i * 6}`}
              />
            ))}
            <circle cx="200" cy="200" r="20" fill="#06222f" stroke="#cdeff5" strokeOpacity="0.5" />
            <path d="M190 200h20M200 190v20" stroke="#cdeff5" strokeOpacity="0.6" strokeWidth="3" />
          </svg>
        </div>
        <div className="container-x py-32">
          <p className="eyebrow anim-fade text-spray">Error 404</p>
          <h1 className="t-display anim-heading mt-4 font-display font-semibold">
            Down the <span className="accent font-normal text-spray">drain.</span>
          </h1>
          <p className="anim-fade mt-6 max-w-lg text-lg text-white/80" style={{ ["--d" as string]: "0.2s" }}>
            This page doesn&apos;t exist, or it&apos;s been moved. Your plumbing problem is still very real, though, and we can help with that.
          </p>
          <div className="anim-fade mt-8 flex flex-wrap gap-3" style={{ ["--d" as string]: "0.3s" }}>
            <Button href="/" size="lg" icon={<ArrowRight size={18} />}>
              Back to home
            </Button>
            <Button href={telHref} size="lg" variant="outline-light" icon={<Phone size={18} />}>
              {site.phoneDisplay}
            </Button>
          </div>
          <ul className="anim-fade mt-12 flex flex-wrap gap-x-6 gap-y-2 text-white/75" style={{ ["--d" as string]: "0.4s" }}>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="underline-offset-4 hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </SiteChrome>
  );
}
