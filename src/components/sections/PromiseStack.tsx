"use client";

import Image from "next/image";
import { useRef } from "react";
import { promises } from "@/content/company";
import { SplitReveal } from "@/components/ui/Reveal";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Four house promises as sticky cards that stack; each one settles back as the next slides over it. */
export function PromiseStack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const inner = card.querySelector("[data-inner]");
        const shade = card.querySelector("[data-shade]");
        gsap.fromTo(
          inner,
          { scale: 1 },
          { scale: 0.9, ease: "none", scrollTrigger: { trigger: next, start: "top 95%", end: "top 25%", scrub: true } },
        );
        gsap.fromTo(
          shade,
          { opacity: 0 },
          { opacity: 0.55, ease: "none", scrollTrigger: { trigger: next, start: "top 95%", end: "top 25%", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-pipe aria-labelledby="promise-stack-heading" className="section-y relative bg-porcelain">
      <div className="container-x">
        <div className="max-w-3xl">
          <p className="eyebrow text-river">The Clean-Up Promise</p>
          <SplitReveal as="h2" id="promise-stack-heading" className="t-1 mt-4 font-display font-semibold">
            Four things that <span className="accent font-normal text-bonnet">never</span> change.
          </SplitReveal>
        </div>

        <div className="mt-14 space-y-6 lg:mt-20">
          {promises.map((p, i) => (
            <article
              key={p.kicker}
              data-card
              className="sticky"
              style={{ top: `calc(var(--header-h) + 1.5rem + ${i * 1.25}rem)` }}
            >
              <div
                data-inner
                className="relative grid origin-top overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_60px_-40px_rgba(6,34,47,0.5)] ring-1 ring-abyss/6 md:grid-cols-2 lg:min-h-[60vh]"
              >
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-full">
                  <Image src={p.image} alt={p.alt} fill sizes="(min-width: 768px) 50vw, 100vw" quality={70} className="object-cover" />
                </div>
                <div className="flex flex-col justify-between gap-10 p-7 sm:p-10 lg:p-14">
                  <span className="font-display text-7xl font-semibold leading-none tracking-tighter text-spray lg:text-9xl">
                    {p.kicker}
                  </span>
                  <div>
                    <h3 className="t-3 font-display font-semibold">{p.title}</h3>
                    <p className="mt-4 max-w-md text-lg text-slate">{p.body}</p>
                  </div>
                </div>
                <div data-shade aria-hidden className="pointer-events-none absolute inset-0 bg-abyss opacity-0" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
