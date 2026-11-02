"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** A leaking pipe joint: it drips twice, a ring wrench gives the nut two turns, the drip stops, and it glints. */
export function WrenchDrip({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const wrench = el.querySelector("[data-wrench]");
      const drop = el.querySelector("[data-drop]");
      const glint = el.querySelector("[data-glint]");
      gsap.set(wrench, { rotation: -28, svgOrigin: "40 36" });
      const drip = () =>
        gsap
          .timeline()
          .fromTo(drop, { y: -4, scale: 0.3, opacity: 0, transformOrigin: "50% 0%" }, { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: "power1.out" })
          .to(drop, { y: 22, opacity: 0, duration: 0.45, ease: "power2.in" });
      const tl = gsap
        .timeline({ paused: true })
        .add(drip(), 0.3)
        .add(drip(), "+=0.1")
        .to(wrench, { rotation: 6, duration: 0.5, ease: "power3.inOut" }, "-=0.35")
        .to(wrench, { rotation: -16, duration: 0.3, ease: "power1.inOut" })
        .to(wrench, { rotation: 0, duration: 0.5, ease: "back.out(2)" })
        .fromTo(glint, { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)" }, "-=0.1")
        .to(glint, { opacity: 0, duration: 0.6 }, "+=0.5");
      ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => tl.play() });
    },
    { scope: root },
  );

  return (
    <svg ref={root} viewBox="0 0 80 72" width="92" height="83" aria-hidden className={className}>
      {/* pipe, then the ring wrench sitting on the coupling nut */}
      <rect x="2" y="31" width="76" height="10" rx="2" fill="#9fc3cd" />
      <rect x="2" y="32.5" width="76" height="2" fill="#fff" opacity="0.45" />
      <g data-wrench>
        <path d="M40 36 57 11.5" stroke="#06222f" strokeWidth="6.5" strokeLinecap="round" />
        <circle cx="40" cy="36" r="11" fill="#06222f" />
        <circle cx="58.5" cy="9.5" r="5" fill="none" stroke="#06222f" strokeWidth="3.2" />
      </g>
      <path d="M36 29.5h8l4 6.5-4 6.5h-8l-4-6.5z" fill="#0a6b85" />
      <circle cx="40" cy="36" r="2.2" fill="#9fc3cd" />
      <path data-drop d="M40 46c-2.2 3-3.2 4.8-3.2 6.2a3.2 3.2 0 0 0 6.4 0c0-1.4-1-3.2-3.2-6.2Z" fill="#0e86a6" opacity="0" />
      <g data-glint opacity="0" stroke="#ffcb47" strokeWidth="2" strokeLinecap="round">
        <path d="M18 14v6M15 17h6M12 24l-3-3" />
      </g>
    </svg>
  );
}
