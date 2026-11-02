"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** A stat's left rule as a riser pipe: it fills with water as the number counts up, and its cap turns yellow like the Pipeline's wet joints. */
export function StatRiser({ delay = 0 }: { delay?: number }) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const fill = el.querySelector("[data-fill]");
      const cap = el.querySelector("[data-cap]");
      gsap.set(fill, { scaleY: 0 });
      gsap.set(cap, { backgroundColor: "rgba(255,255,255,0.25)", scale: 0.7 });
      const tl = gsap
        .timeline({ paused: true })
        .to(fill, { scaleY: 1, duration: 2, ease: "expo.out" }, delay)
        .to(cap, { backgroundColor: "#ffcb47", scale: 1, duration: 0.5, ease: "back.out(3)" }, delay + 0.55);
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => tl.play() });
    },
    { scope: root },
  );

  return (
    <span ref={root} aria-hidden className="pointer-events-none absolute -left-px top-0 bottom-0 w-0.5">
      <span data-fill className="absolute inset-0 origin-bottom rounded-full bg-gradient-to-t from-river-2 to-[#35c2e0]" />
      <span data-cap className="absolute -left-[3px] -top-1 size-2 rounded-full bg-sunny" />
    </span>
  );
}
