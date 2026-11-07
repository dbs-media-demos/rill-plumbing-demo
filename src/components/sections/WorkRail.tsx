"use client";

import Image from "next/image";
import Link from "@/components/ui/Link";
import { useEffect, useRef } from "react";
import { work } from "@/content/company";
import { useBiz } from "@/components/preview/BizContext";
import { ArrowRight } from "@/components/ui/Icons";
import { gsap, useGSAP, prefersReducedMotion, isTouch } from "@/lib/gsap";

/** Recent jobs. Desktop: pinned horizontal scroll. Touch: native swipe with snap. */
export function WorkRail() {
  const biz = useBiz();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pipe = useRef<HTMLDivElement>(null);

  // A pipe under the rail fills with water as you move through the jobs; each joint lights up as the water reaches it.
  const flow = (p: number) => {
    const el = pipe.current;
    if (!el) return;
    el.style.setProperty("--flow", String(p));
    el.querySelectorAll<HTMLElement>("[data-at]").forEach((j) => j.classList.toggle("is-wet", Number(j.dataset.at) <= p + 0.001));
  };
  const pinned = () => !prefersReducedMotion() && !isTouch() && window.innerWidth >= 1024;

  useEffect(() => {
    const tr = track.current;
    if (!tr) return;
    if (prefersReducedMotion()) return flow(1);
    if (pinned()) return;
    const onScroll = () => {
      const max = tr.scrollWidth - tr.clientWidth;
      flow(max > 0 ? tr.scrollLeft / max : 1);
    };
    onScroll();
    tr.addEventListener("scroll", onScroll, { passive: true });
    return () => tr.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      const tr = track.current;
      if (!el || !tr || !pinned()) return;
      const distance = () => tr.scrollWidth - window.innerWidth + 64;
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => flow(self.progress),
        },
      });
      // Each photo drifts inside its frame as the rail moves.
      gsap.utils.toArray<HTMLElement>("[data-par]", tr).forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  const items = work.slice(0, 8);

  return (
    <section ref={root} data-pipe aria-labelledby="work-heading" className="relative overflow-hidden bg-white py-20 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0 phone:py-8">
      <div className="container-x flex flex-wrap items-end justify-between gap-6 phone:gap-2">
        <div>
          <p className="eyebrow text-river">Recent work</p>
          <h2 id="work-heading" className="t-2 mt-3 font-display font-semibold phone:mt-2">
            Fresh from the <span className="accent font-normal text-bonnet">van.</span>
          </h2>
        </div>
        <Link href="/work" className="inline-flex items-center gap-2 font-semibold text-abyss underline-offset-4 hover:underline">
          See all projects <ArrowRight size={18} />
        </Link>
      </div>

      <div
        ref={track}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:px-8 lg:mt-14 lg:snap-none lg:gap-6 lg:overflow-visible lg:pl-[max(4.5rem,calc((100vw-88rem)/2+4.5rem))] phone:mt-4 phone:gap-3 phone:scroll-px-4 sm:phone:scroll-px-8"
      >
        {items.map((w, i) => (
          <Link
            key={w.id}
            href="/work"
            data-cursor="View"
            className="group relative w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30rem] phone:!w-[min(64vw,21rem)]"
          >
            <div className={`relative overflow-hidden rounded-[1.6rem] ${i % 2 ? "aspect-[4/5]" : "aspect-[5/6]"} lg:aspect-auto lg:h-[56vh] phone:!aspect-[3/2] phone:rounded-[1.3rem]`}>
              <div data-par className="absolute -inset-x-[10%] inset-y-0">
                <Image
                  src={w.image}
                  alt={w.alt}
                  fill
                  sizes="(min-width: 1024px) 34rem, 80vw"
                  quality={70}
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
              </div>
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-abyss backdrop-blur">
                {w.category}
              </span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4 phone:mt-2 phone:block">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight phone:text-[1.05rem] phone:leading-tight">{w.title}</h3>
                <p className="text-sm text-slate">{biz.preview ? biz.area : w.place}</p>
              </div>
              <p className="max-w-[12rem] text-right text-sm text-slate phone:mt-0.5 phone:max-w-none phone:text-left phone:leading-snug">{w.note}</p>
            </div>
          </Link>
        ))}
        <div className="w-4 shrink-0 lg:w-16" aria-hidden />
      </div>

      <div className="container-x mt-8 lg:mt-10 phone:hidden" aria-hidden>
        <div ref={pipe} className="relative h-2 rounded-full bg-tide/35">
          <div
            className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-river-2 to-[#35c2e0] shadow-[0_0_8px_rgba(53,194,224,0.5)]"
            style={{ transform: "scaleX(var(--flow, 0))" }}
          />
          {items.map((w, i) => (
            <span
              key={w.id}
              data-at={i / (items.length - 1)}
              className="rail-joint absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${(i / (items.length - 1)) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
