import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/schema";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={clsx("flex flex-wrap items-center gap-x-2 gap-y-1 text-sm", tone === "dark" ? "text-white/70" : "text-slate")}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={tone === "dark" ? "text-white" : "text-abyss"}>
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="underline-offset-4 hover:underline">
                    {c.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image: string;
  imageAlt: string;
  crumbs: Crumb[];
  children?: ReactNode;
  aside?: ReactNode;
  /** Shorter hero for utility pages. */
  compact?: boolean;
};

/** Image-led inner-page hero. CSS-only intro so the LCP paints immediately. */
export function PageHero({ eyebrow, title, intro, image, imageAlt, crumbs, children, aside, compact }: Props) {
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <section
      data-header="dark"
      className={clsx(
        "on-dark relative isolate flex flex-col overflow-hidden bg-abyss text-white",
        compact ? "min-h-[62svh]" : "min-h-[82svh]",
      )}
    >
      <JsonLd data={graph(breadcrumbSchema(all))} />
      <Image src={image} alt={imageAlt} fill fetchPriority="high" loading="eager" sizes="100vw" quality={65} className="hero-zoom -z-20 object-cover" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,34,47,0.6)_0%,rgba(6,34,47,0.25)_35%,rgba(6,34,47,0.92)_100%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_0%_100%,rgba(6,34,47,0.75),transparent_65%)]" />

      <div className="container-x relative mt-auto pb-12 pt-36 lg:pb-16">
        <div className="anim-fade" style={d(0)}>
          <Breadcrumbs items={all} />
        </div>
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow anim-fade text-spray" style={d(0.05)}>
              {eyebrow}
            </p>
            <h1 className="t-1 anim-heading mt-4 max-w-5xl font-display font-semibold text-balance" style={d(0.1)}>
              {title}
            </h1>
            {intro && (
              <div className="anim-fade mt-6 max-w-2xl text-lg text-white/85 lg:text-xl" style={d(0.3)}>
                {intro}
              </div>
            )}
            {children && (
              <div className="anim-fade mt-8" style={d(0.45)}>
                {children}
              </div>
            )}
          </div>
          {aside && (
            <div className="anim-fade" style={d(0.5)}>
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
