"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import clsx from "clsx";
import { work, type WorkItem } from "@/content/company";
import { Close } from "@/components/ui/Icons";
import { Flip } from "gsap/Flip";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);

const cats = ["All", "Bathrooms", "Kitchens", "Water heaters", "Repipes & leaks", "Emergency"] as const;

/** Filterable project gallery. Filtering animates with GSAP Flip; tapping opens a lightbox. */
export function WorkGallery() {
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [open, setOpen] = useState<WorkItem | null>(null);

  const choose = (c: (typeof cats)[number]) => {
    if (c === cat) return;
    if (grid.current && !prefersReducedMotion()) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip]"));
    setCat(c);
  };

  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, {
        duration: 0.8,
        ease: "expo.out",
        scale: true,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.7 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }),
      });
      flipState.current = null;
    },
    { dependencies: [cat], scope: grid },
  );

  const items = work.filter((w) => cat === "All" || w.category === cat);

  return (
    <>
      <div role="group" aria-label="Filter projects" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => choose(c)}
            className={clsx(
              "min-h-11 shrink-0 rounded-full px-5 text-[0.95rem] font-semibold transition-colors",
              cat === c ? "bg-abyss text-white" : "bg-abyss/5 hover:bg-abyss/10",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <ul ref={grid} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((w, i) => (
          <li key={w.id} data-flip data-flip-id={w.id} className={clsx(i % 5 === 0 && "sm:col-span-2 lg:col-span-1 lg:row-span-2")}>
            <button type="button" onClick={() => setOpen(w)} data-cursor="Open" className="group block h-full w-full text-left">
              <span className={clsx("relative block overflow-hidden rounded-[1.6rem] bg-mist", i % 5 === 0 ? "aspect-[4/5] lg:h-[calc(100%-4.5rem)] lg:aspect-auto" : "aspect-[4/3]")}>
                <Image
                  src={w.image}
                  alt={w.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                  quality={65}
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur">{w.category}</span>
              </span>
              <span className="mt-3 block">
                <span className="block font-display text-xl font-semibold tracking-tight">{w.title}</span>
                <span className="text-sm text-slate">
                  {w.place} · {w.note}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          className="anim-fade fixed inset-0 z-[70] grid place-items-center bg-abyss/85 p-4 backdrop-blur-md"
          onClick={() => setOpen(null)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(null)}
        >
          <figure className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[3/2] overflow-hidden rounded-[1.6rem]">
              <Image src={open.image} alt={open.alt} fill sizes="90vw" quality={80} className="object-cover" />
            </div>
            <figcaption className="mt-4 text-white">
              <strong className="font-display text-2xl tracking-tight">{open.title}</strong>
              <span className="block text-white/75">
                {open.place} · {open.note}
              </span>
            </figcaption>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute -top-3 right-3 grid size-11 -translate-y-full place-items-center rounded-full bg-white text-abyss"
            >
              <Close size={20} />
            </button>
          </figure>
        </div>
      )}
    </>
  );
}
