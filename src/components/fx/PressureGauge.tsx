"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const CX = 50;
const CY = 54;
const REST = 30; // where the needle settles: inside the green "fair price" band

const at = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)].map((n) => n.toFixed(2)).join(" ");
};
const arc = (from: number, to: number, r: number) => `M${at(from, r)} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${at(to, r)}`;
const ticks = Array.from({ length: 9 }, (_, i) => -135 + i * 33.75);

/** Pressure gauge for the price section: the needle swings past and settles in the green as it scrolls in. */
export function PressureGauge({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const needle = root.current?.querySelector("[data-needle]");
      if (!needle || prefersReducedMotion()) return;
      gsap.set(needle, { rotation: -135, svgOrigin: `${CX} ${CY}` });
      const tl = gsap
        .timeline({ paused: true })
        .to(needle, { rotation: 100, duration: 0.75, ease: "power2.in" })
        .to(needle, { rotation: REST, duration: 2, ease: "elastic.out(1, 0.28)" });
      ScrollTrigger.create({ trigger: root.current, start: "top 85%", once: true, onEnter: () => tl.play() });
    },
    { scope: root },
  );

  return (
    <svg ref={root} viewBox="0 0 100 100" width="76" height="76" aria-hidden className={className}>
      <circle cx={CX} cy={50} r="46" fill="#fff" stroke="rgba(6,34,47,0.1)" strokeWidth="2" />
      <path d={arc(-135, 135, 38)} fill="none" stroke="rgba(6,34,47,0.1)" strokeWidth="5" strokeLinecap="round" />
      <path d={arc(8, 62, 38)} fill="none" stroke="#3ddc97" strokeWidth="5" strokeLinecap="round" />
      <path d={arc(100, 135, 38)} fill="none" stroke="#e5484d" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />
      {ticks.map((t) => (
        <path key={t} d={`M${at(t, 27)} L${at(t, 31)}`} stroke="rgba(6,34,47,0.35)" strokeWidth="2" strokeLinecap="round" />
      ))}
      <g data-needle transform={`rotate(${REST} ${CX} ${CY})`}>
        <path d={`M${CX - 2.4} ${CY} L${CX} ${CY - 33} L${CX + 2.4} ${CY} Z`} fill="#06222f" />
      </g>
      <circle cx={CX} cy={CY} r="5.5" fill="#06222f" />
      <circle cx={CX} cy={CY} r="2" fill="#ffcb47" />
      <rect x="40" y="78" width="20" height="6" rx="3" fill="rgba(6,34,47,0.08)" />
    </svg>
  );
}
