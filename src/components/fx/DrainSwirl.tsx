"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * A sink drain: a pool of water spirals down it and the drain runs clear. It plays when the
 * section scrolls in and again each time a question in the same section is opened or closed.
 */
export function DrainSwirl({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const el = root.current;
    const water = el?.querySelector("[data-water]");
    if (!el || !water || prefersReducedMotion()) return;
    let tween: gsap.core.Tween | null = null;
    const play = () => {
      tween?.kill();
      tween = gsap.fromTo(
        water,
        { opacity: 1, scale: 1, rotation: 0, svgOrigin: "36 36" },
        { opacity: 0, scale: 0.15, rotation: 600, duration: 1.7, ease: "power2.in", svgOrigin: "36 36" },
      );
    };
    const st = ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: play });
    const section = el.closest("section");
    const onClick = (e: Event) => (e.target as Element).closest("button[aria-expanded]") && play();
    section?.addEventListener("click", onClick);
    return () => {
      st.kill();
      tween?.kill();
      section?.removeEventListener("click", onClick);
    };
  });

  return (
    <svg ref={root} viewBox="0 0 72 72" width="64" height="64" aria-hidden className={className}>
      <circle cx="36" cy="36" r="33" fill="#fff" stroke="rgba(6,34,47,0.1)" strokeWidth="2" />
      <g data-water opacity="0">
        <circle cx="36" cy="36" r="29" fill="#0e86a6" fillOpacity="0.16" />
        <g fill="none" stroke="#0e86a6" strokeWidth="2.4" strokeLinecap="round">
          <path d="M36 9a27 27 0 0 1 25 17" />
          <path d="M36 63a27 27 0 0 1-25-17" />
          <path d="M53 41a18 18 0 0 1-14 13" strokeOpacity="0.6" />
          <path d="M19 31a18 18 0 0 1 14-13" strokeOpacity="0.6" />
        </g>
      </g>
      <circle cx="36" cy="36" r="10.5" fill="#06222f" />
      <g stroke="#9fc3cd" strokeWidth="1.6" strokeLinecap="round">
        <path d="M36 27.5v17M27.5 36h17" />
        <circle cx="36" cy="36" r="4.5" fill="none" />
      </g>
    </svg>
  );
}
