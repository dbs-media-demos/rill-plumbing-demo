"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const flames = [16, 30, 44];

/** A water heater burner: a spark, then three blue flames catch one after another and keep a soft flicker. */
export function PilotFlame({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const fl = el.querySelectorAll("[data-flame]");
      const spark = el.querySelector("[data-spark]");
      gsap.set(fl, { scaleY: 0, scaleX: 0.5, opacity: 0, transformOrigin: "50% 100%" });
      const tl = gsap
        .timeline({ paused: true })
        .fromTo(spark, { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1.4, duration: 0.12, ease: "power1.out", repeat: 1, yoyo: true })
        .to(fl, { scaleY: 1, scaleX: 1, opacity: 1, duration: 0.7, stagger: 0.12, ease: "back.out(2.6)" }, "+=0.05");
      ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => tl.play() });
    },
    { scope: root },
  );

  return (
    <svg ref={root} viewBox="0 0 60 34" width="68" height="38" aria-hidden className={className}>
      <defs>
        <linearGradient id="pilot-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#5a48e0" />
          <stop offset="0.55" stopColor="#35c2e0" />
          <stop offset="1" stopColor="#cdeff5" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {flames.map((x, i) => (
        <g key={x} data-flame>
          <g className="flame-flicker" style={{ animationDelay: `${i * -0.37}s` }}>
            <path
              d={`M${x} 27 C${x - 6} 22 ${x - 4} 15 ${x} 6 C${x + 4} 15 ${x + 6} 22 ${x} 27 Z`}
              fill="url(#pilot-flame)"
            />
            <path d={`M${x} 27 C${x - 2.5} 24 ${x - 2} 20 ${x} 16 C${x + 2} 20 ${x + 2.5} 24 ${x} 27 Z`} fill="#e8f7fa" opacity="0.85" />
          </g>
        </g>
      ))}
      <circle data-spark cx="7" cy="25" r="2.2" fill="#ffcb47" opacity="0" />
      <rect x="4" y="28" width="52" height="4" rx="2" fill="#06222f" opacity="0.75" />
    </svg>
  );
}
