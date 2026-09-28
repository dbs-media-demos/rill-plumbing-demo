"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import clsx from "clsx";
import { services } from "@/content/services";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";

/**
 * Typographic service index. On desktop a photo window follows the cursor and
 * swaps images as you move down the list; on phones each row carries its thumbnail.
 */
export function ServicesList() {
  const wrap = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });

  const loop = () => {
    const p = pos.current;
    p.x += (p.tx - p.x) * 0.14;
    p.y += (p.ty - p.y) * 0.14;
    if (float.current) float.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${(p.tx - p.x) * 0.03}deg)`;
    p.raf = requestAnimationFrame(loop);
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    pos.current.tx = e.clientX - r.left;
    pos.current.ty = e.clientY - r.top;
  };
  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    pos.current.x = pos.current.tx = e.clientX - r.left;
    pos.current.y = pos.current.ty = e.clientY - r.top;
    cancelAnimationFrame(pos.current.raf);
    pos.current.raf = requestAnimationFrame(loop);
  };
  const onLeave = () => {
    setHover(null);
    cancelAnimationFrame(pos.current.raf);
  };

  return (
    <section data-pipe aria-labelledby="services-heading" className="section-y relative bg-white">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-river">Services</p>
            <SplitReveal as="h2" id="services-heading" className="t-1 mt-4 font-display font-semibold">
              Everything wet, <span className="accent font-normal text-bonnet">handled.</span>
            </SplitReveal>
          </div>
          <p className="max-w-md text-lg text-slate lg:justify-self-end">
            Nine services, one standard: licensed plumbers, flat prices and a van stocked to finish most jobs on the first visit.
          </p>
        </div>

        <div ref={wrap} className="relative mt-14" onPointerMove={onMove} onPointerEnter={onEnter} onPointerLeave={onLeave}>
          <Reveal as="ul" stagger={0.05} y={30} className="border-t border-abyss/10">
            {services.map((s, i) => (
              <li key={s.slug} className="border-b border-abyss/10">
                <Link
                  href={`/services/${s.slug}`}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(null)}
                  data-cursor="View"
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 transition-colors sm:gap-8 lg:py-7"
                >
                  <span className="relative size-16 overflow-hidden rounded-2xl sm:size-20 lg:hidden">
                    <Image src={s.image} alt="" fill sizes="80px" quality={60} className="object-cover" />
                  </span>
                  <span className="hidden w-10 font-display text-sm font-semibold text-slate lg:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={clsx(
                        "block font-display text-[1.6rem] font-semibold leading-none tracking-tight transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] sm:text-4xl lg:text-[3.4rem]",
                        "group-hover:translate-x-3 group-hover:text-bonnet",
                      )}
                    >
                      {s.name}
                    </span>
                    <span className="mt-1.5 block text-sm text-slate lg:hidden">From {s.from}</span>
                  </span>
                  <span className="flex items-center gap-6">
                    <span className="hidden text-right lg:block">
                      <span className="block text-sm text-slate">From</span>
                      <span className="font-display text-2xl font-semibold tracking-tight">{s.from}</span>
                    </span>
                    <span className="grid size-11 place-items-center rounded-full bg-abyss/5 transition-[background-color,color,transform] duration-500 group-hover:rotate-45 group-hover:bg-bonnet group-hover:text-white">
                      <ArrowUpRight size={20} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>

          <div
            ref={float}
            aria-hidden
            className={clsx(
              "pointer-events-none absolute left-0 top-0 z-10 hidden h-[17rem] w-[13rem] transition-opacity duration-300 lg:block",
              hover === null ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="mask-drop relative h-full w-full">
              {services.map((s, i) => (
                <Image
                  key={s.slug}
                  src={s.image}
                  alt=""
                  fill
                  sizes="208px"
                  quality={60}
                  className={clsx(
                    "object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]",
                    hover === i ? "scale-100 opacity-100" : "scale-125 opacity-0",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
