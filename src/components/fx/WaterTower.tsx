"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const WAVE = "M-40 0 q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 V40 H-40 Z";

/** A North Texas water tower: water climbs the riser, then the tank fills with a gentle slosh. */
export function WaterTower({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const riser = el.querySelector<SVGPathElement>("[data-riser]");
      const water = el.querySelector("[data-water]");
      if (!riser) return;
      gsap.set(riser, { strokeDasharray: 46, strokeDashoffset: 46 });
      gsap.set(water, { y: 30 });
      const tl = gsap
        .timeline({ paused: true })
        .to(riser, { strokeDashoffset: 0, duration: 0.9, ease: "power1.in" })
        .to(water, { y: 0, duration: 1.8, ease: "power2.out" });
      ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => tl.play() });
    },
    { scope: root },
  );

  return (
    <svg ref={root} viewBox="0 0 64 96" width="56" height="84" aria-hidden className={className}>
      <defs>
        <clipPath id="tower-tank">
          <rect x="10" y="16" width="44" height="28" rx="9" />
        </clipPath>
      </defs>
      {/* legs and bracing */}
      <g stroke="#06222f" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round">
        <path d="M16 42 10 92M48 42l6 50" />
        <path d="M13 64h38M11.5 80h41M13 64l40 16M51 64 11.5 80" strokeOpacity="0.25" />
      </g>
      <path d="M32 92V44" stroke="#9fc3cd" strokeWidth="5" strokeLinecap="round" />
      <path data-riser d="M32 92V46" stroke="#0e86a6" strokeWidth="3" strokeLinecap="round" />
      {/* tank */}
      <rect x="10" y="16" width="44" height="28" rx="9" fill="#e8f7fa" />
      <g clipPath="url(#tower-tank)">
        <g data-water>
          <g transform="translate(0 22)">
            <path className="wave-slide" d={WAVE} fill="#0e86a6" />
          </g>
        </g>
      </g>
      <rect x="10" y="16" width="44" height="28" rx="9" fill="none" stroke="#06222f" strokeWidth="2.2" />
      <path d="M7 17 32 4l25 13" fill="none" stroke="#06222f" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M32 4V1" stroke="#06222f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
