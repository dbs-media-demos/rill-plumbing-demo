"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/*
 * The Pipeline: one continuous pipe runs down the page beside the sections in
 * `children` (each marked with [data-pipe]). At every section seam it crosses
 * to the other side of the page. As you scroll, water fills it, with a glowing
 * droplet at the front, and each joint lights up as the water passes.
 */

const CROSS_SPAN = 140; // scroll distance (px) over which water crosses a seam
const R = 26; // elbow radius

type Geometry = {
  d: string;
  total: number;
  map: { y: number; l: number }[];
  joints: { x: number; y: number; l: number }[];
};

function build(width: number, height: number, seams: number[], gutter: number): Geometry {
  const xs = [gutter, width - gutter];
  let side = 0;
  let x = xs[side];
  let y = 0;
  let l = 0;
  let d = `M${x} ${y}`;
  const map = [{ y: 0, l: 0 }];
  const joints: Geometry["joints"] = [];
  const arc = (Math.PI * R) / 2;

  for (const s of seams) {
    if (s - R <= y + 10 || s + R >= height - 10) continue;
    const nx = xs[1 - side];
    const dir = nx > x ? 1 : -1;
    // down to the elbow
    l += s - R - y;
    d += ` L${x} ${s - R}`;
    map.push({ y: s - CROSS_SPAN / 2, l });
    d += ` Q${x} ${s} ${x + dir * R} ${s}`;
    l += arc;
    joints.push({ x, y: s, l });
    // across the page
    d += ` L${nx - dir * R} ${s}`;
    l += Math.abs(nx - x) - 2 * R;
    d += ` Q${nx} ${s} ${nx} ${s + R}`;
    l += arc;
    joints.push({ x: nx, y: s, l });
    map.push({ y: s + CROSS_SPAN / 2, l });
    x = nx;
    y = s + R;
    side = 1 - side;
  }
  l += height - y;
  d += ` L${x} ${height}`;
  map.push({ y: height, l });
  return { d, total: l, map, joints };
}

function lengthAt(map: Geometry["map"], y: number) {
  if (y <= map[0].y) return 0;
  for (let i = 1; i < map.length; i++) {
    const a = map[i - 1];
    const b = map[i];
    if (y <= b.y) return a.l + ((y - a.y) / Math.max(1, b.y - a.y)) * (b.l - a.l);
  }
  return map[map.length - 1].l;
}

export function Pipeline({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const s = svg.current;
    if (!el || !s) return;
    const base = s.querySelector<SVGPathElement>("[data-base]")!;
    const water = s.querySelector<SVGPathElement>("[data-water]")!;
    const shine = s.querySelector<SVGPathElement>("[data-shine]")!;
    const head = s.querySelector<SVGGElement>("[data-head]")!;
    const jointsG = s.querySelector<SVGGElement>("[data-joints]")!;
    const reduce = prefersReducedMotion();

    let geo: Geometry | null = null;
    let current = 0;
    let target = 0;
    let raf = 0;

    const render = () => {
      if (!geo) return;
      const len = Math.max(0, Math.min(geo.total, current));
      water.style.strokeDashoffset = String(geo.total - len);
      const p = water.getPointAtLength(len);
      head.setAttribute("transform", `translate(${p.x} ${p.y})`);
      head.style.opacity = len > 4 && len < geo.total - 4 ? "1" : "0";
      jointsG.querySelectorAll<SVGCircleElement>("circle").forEach((c) => {
        c.classList.toggle("is-wet", Number(c.dataset.l) <= len);
      });
    };

    const tick = () => {
      raf = 0;
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.5) current = target;
      render();
      if (current !== target) raf = requestAnimationFrame(tick);
    };

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const width = el.clientWidth;
      const height = el.scrollHeight;
      const top = rect.top + window.scrollY;
      const seams: number[] = [];
      el.querySelectorAll<HTMLElement>("[data-pipe]").forEach((sec, i) => {
        if (i === 0) return;
        const box = sec.parentElement?.classList.contains("pin-spacer") ? sec.parentElement : sec;
        seams.push(box.getBoundingClientRect().top + window.scrollY - top);
      });
      const gutter = width < 640 ? 7 : width < 1024 ? 14 : Math.max(24, Math.min(40, (width - 1408) / 2 + 30));
      geo = build(width, height, seams, gutter);
      s.setAttribute("viewBox", `0 0 ${width} ${height}`);
      s.style.height = `${height}px`;
      base.setAttribute("d", geo.d);
      water.setAttribute("d", geo.d);
      shine.setAttribute("d", geo.d);
      water.style.strokeDasharray = String(geo.total);
      jointsG.innerHTML = geo.joints
        .map((j) => `<circle cx="${j.x}" cy="${j.y}" r="7" data-l="${j.l}"></circle>`)
        .join("");
      update(true);
    };

    const update = (instant = false) => {
      if (!geo) return;
      if (reduce) {
        target = current = geo.total;
      } else {
        const top = el.getBoundingClientRect().top;
        const line = window.innerHeight * 0.62 - top;
        target = lengthAt(geo.map, line);
        if (instant) current = target;
      }
      if (instant || reduce) render();
      else if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => update();
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    ScrollTrigger.addEventListener("refresh", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    const late = window.setTimeout(measure, 1200);
    return () => {
      ro.disconnect();
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(late);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="pipeline relative">
      {children}
      <svg ref={svg} aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="pipe-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0e86a6" />
            <stop offset="0.5" stopColor="#35c2e0" />
            <stop offset="1" stopColor="#5a48e0" />
          </linearGradient>
        </defs>
        <path data-base className="pipe-base" strokeLinecap="round" strokeLinejoin="round" />
        <path data-water className="pipe-water" stroke="url(#pipe-water)" strokeLinecap="round" strokeLinejoin="round" />
        <path data-shine className="pipe-shine" strokeLinecap="round" strokeLinejoin="round" />
        <g data-joints className="pipe-joints" />
        <g data-head className="pipe-head" style={{ opacity: 0 }}>
          <circle r="16" fill="rgba(53,194,224,0.25)" />
          <circle r="6.5" fill="#cdeff5" />
        </g>
      </svg>
    </div>
  );
}
