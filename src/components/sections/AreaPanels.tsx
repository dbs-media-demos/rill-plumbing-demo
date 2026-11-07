"use client";

import Image from "next/image";
import Link from "@/components/ui/Link";
import { useState } from "react";
import clsx from "clsx";
import type { CityLink } from "@/content/cities";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SplitReveal } from "@/components/ui/Reveal";
import { WaterTower } from "@/components/fx/WaterTower";

/** Service areas as expanding photo panels (desktop) / stacked cards (mobile). */
export function AreaPanels({ cities }: { cities: CityLink[] }) {
  const [active, setActive] = useState(0);
  return (
    <section data-pipe aria-labelledby="areas-heading" className="section-y relative bg-porcelain">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6 phone:gap-2">
          <div className="flex items-end gap-5 lg:gap-7">
            <WaterTower className="mb-1 h-auto w-11 shrink-0 sm:w-14 phone:hidden" />
            <div>
              <p className="eyebrow text-river">Where we work</p>
              <SplitReveal as="h2" id="areas-heading" className="t-1 mt-4 font-display font-semibold phone:mt-2">
                Six cities. <span className="accent font-normal text-bonnet">One standard.</span>
              </SplitReveal>
            </div>
          </div>
          <Link href="/service-areas" className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline">
            All service areas <ArrowUpRight size={18} />
          </Link>
        </div>

        <ul className="mt-12 flex flex-col gap-3 lg:h-[34rem] lg:flex-row rail phone:mt-4 phone:!flex-row">
          {cities.map((c, i) => {
            const on = active === i;
            return (
              <li
                key={c.slug}
                onPointerEnter={() => setActive(i)}
                className={clsx(
                  "relative isolate overflow-hidden rounded-[1.6rem] bg-abyss transition-[flex-grow] duration-700 ease-[var(--ease-out-expo)]",
                  "h-44 sm:h-56 lg:h-auto phone:!h-40 phone:w-[min(64vw,21rem)] phone:rounded-[1.3rem]",
                  on ? "lg:grow-[4]" : "lg:grow",
                  "lg:basis-0",
                )}
              >
                <Link
                  href={`/service-areas/${c.slug}`}
                  onFocus={() => setActive(i)}
                  className="group absolute inset-0 flex flex-col justify-end p-5 text-white sm:p-6 phone:!p-3.5"
                >
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    quality={65}
                    className={clsx(
                      "-z-10 object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)]",
                      on ? "scale-100" : "scale-110 phone:scale-100",
                    )}
                  />
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-abyss/90 via-abyss/30 to-abyss/10" />
                  <span className="flex items-end justify-between gap-4">
                    <span>
                      <span
                        className={clsx(
                          "block font-display text-3xl font-semibold tracking-tight transition-all duration-700 lg:origin-bottom-left phone:text-[1.35rem]",
                          !on && "lg:-rotate-90 lg:translate-x-[calc(100%-2.5rem)] lg:translate-y-[-1rem] lg:whitespace-nowrap lg:text-2xl",
                        )}
                      >
                        {c.name}
                      </span>
                      <span className={clsx("mt-1 block text-sm text-white/80 transition-opacity duration-500 phone:mt-0.5 phone:text-[0.8rem] phone:leading-snug", !on && "lg:opacity-0")}>
                        ~{c.eta} min average arrival · {c.neighborhoods.slice(0, 3).join(", ")}
                      </span>
                    </span>
                    <span
                      className={clsx(
                        "grid size-11 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition-all duration-500 group-hover:bg-bonnet phone:hidden",
                        !on && "lg:opacity-0",
                      )}
                    >
                      <ArrowUpRight size={20} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
