"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect, type KeyboardEvent, type PointerEvent } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/ui/Icons";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/* ─────────────── Tank vs tankless drag comparison ─────────────── */

export function HeaterCompare() {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromX = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  }, []);

  // A gentle "try me" sweep the first time it scrolls into view.
  useEffect(() => {
    const el = box.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { v: 50 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap
          .timeline({ onUpdate: () => !dragging.current && setPos(obj.v) })
          .to(obj, { v: 30, duration: 0.9, ease: "power2.inOut" })
          .to(obj, { v: 68, duration: 1.1, ease: "power2.inOut" })
          .to(obj, { v: 50, duration: 0.9, ease: "power2.inOut" });
      },
    });
    return () => st.kill();
  }, []);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromX(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => dragging.current && setFromX(e.clientX);
  const onUp = () => (dragging.current = false);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 5));
    if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 5));
  };

  return (
    <div
      ref={box}
      data-cursor="Drag"
      className="relative aspect-[4/5] touch-pan-y select-none overflow-hidden rounded-[2rem] bg-abyss sm:aspect-[16/10]"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <Image src="/images/water-heater-wrench.jpg" alt="Tank water heater being serviced" fill sizes="(min-width: 1024px) 60vw, 100vw" quality={70} className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Image src="/images/tankless-heater.jpg" alt="Wall-mounted tankless water heater" fill sizes="(min-width: 1024px) 60vw, 100vw" quality={70} className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent to-abyss/20" />

      <div className="pointer-events-none absolute bottom-5 left-5 max-w-[42%] text-white">
        <p className="eyebrow text-spray">Tank</p>
        <p className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">From $1,895</p>
        <p className="mt-1 hidden text-sm text-white/80 sm:block">Lower upfront · 8–12 yrs · 40–75 gal stored</p>
      </div>
      <div className="pointer-events-none absolute bottom-5 right-5 max-w-[42%] text-right text-white">
        <p className="eyebrow text-spray">Tankless</p>
        <p className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">From $3,900</p>
        <p className="mt-1 hidden text-sm text-white/80 sm:block">Endless hot water · up to 20 yrs · wall-mounted</p>
      </div>

      <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white/90" />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Compare tank and tankless water heaters"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% tank, ${100 - Math.round(pos)}% tankless`}
          onKeyDown={onKey}
          className="absolute top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-abyss shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Sizing helper ─────────────── */

const fixtures = [
  { id: "shower2", label: "Two showers at once", gpm: 2.0 },
  { id: "kitchen", label: "Kitchen faucet", gpm: 1.5 },
  { id: "dish", label: "Dishwasher", gpm: 1.5 },
  { id: "washer", label: "Washing machine", gpm: 2.0 },
  { id: "tub", label: "Soaking tub", gpm: 4.0 },
];

function recommend(people: number, baths: number, on: Set<string>) {
  let tank = people <= 2 ? 40 : people <= 4 ? 50 : people === 5 ? 65 : 75;
  if (on.has("tub")) tank += 10;
  if (baths >= 3 && tank < 65) tank += 10;
  tank = Math.min(tank, 80);
  let gpm = 2.0; // one shower is always part of peak use
  fixtures.forEach((f) => on.has(f.id) && (gpm += f.gpm));
  if (baths >= 3 && on.has("shower2")) gpm += 0.5;
  gpm = Math.round(gpm * 10) / 10;
  const btu = gpm <= 5 ? "150,000" : gpm <= 7 ? "180,000" : gpm <= 9.5 ? "199,000" : "2 × 199,000 (linked)";
  const pick = people >= 4 || gpm >= 6.5 || on.has("tub") ? "tankless" : "tank";
  return { tank, gpm, btu, pick } as const;
}

export function HeaterSizer() {
  const [people, setPeople] = useState(4);
  const [baths, setBaths] = useState(2);
  const [on, setOn] = useState<Set<string>>(new Set(["shower2", "kitchen"]));
  const r = recommend(people, baths, on);
  const toggle = (id: string) =>
    setOn((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const fill = Math.min(1, r.tank / 80);
  const needle = -120 + Math.min(1, r.gpm / 12) * 240;

  return (
    <div id="sizer" className="grid gap-8 rounded-[2rem] bg-white p-6 ring-1 ring-abyss/8 sm:p-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="sz-people" className="flex items-baseline justify-between font-semibold">
            People in the home <output className="font-display text-3xl tracking-tight">{people === 8 ? "8+" : people}</output>
          </label>
          <input
            id="sz-people"
            type="range"
            min={1}
            max={8}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="range mt-2"
            style={{ ["--p" as string]: `${((people - 1) / 7) * 100}%` }}
          />
        </div>
        <div>
          <label htmlFor="sz-baths" className="flex items-baseline justify-between font-semibold">
            Bathrooms <output className="font-display text-3xl tracking-tight">{baths === 4 ? "4+" : baths}</output>
          </label>
          <input
            id="sz-baths"
            type="range"
            min={1}
            max={4}
            value={baths}
            onChange={(e) => setBaths(Number(e.target.value))}
            className="range mt-2"
            style={{ ["--p" as string]: `${((baths - 1) / 3) * 100}%` }}
          />
        </div>
        <fieldset>
          <legend className="font-semibold">At your busiest moment, what runs at the same time?</legend>
          <p className="text-sm text-slate">One shower is already counted.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {fixtures.map((f) => {
              const checked = on.has(f.id);
              return (
                <label
                  key={f.id}
                  className={clsx(
                    "flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-[0.95rem] font-medium ring-1 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-bonnet",
                    checked ? "bg-abyss text-white ring-abyss" : "bg-white ring-abyss/15 hover:ring-abyss/40",
                  )}
                >
                  <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(f.id)} />
                  {checked && <Check size={16} />}
                  {f.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      </form>

      <div aria-live="polite" className="relative overflow-hidden rounded-[1.6rem] bg-abyss p-6 text-white sm:p-8">
        <p className="eyebrow text-spray">Our starting recommendation</p>
        <p className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {r.pick === "tankless" ? (
            <>
              Go <span className="accent font-normal text-spray">tankless.</span>
            </>
          ) : (
            <>
              A quality <span className="accent font-normal text-spray">tank.</span>
            </>
          )}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className={clsx("transition-opacity", r.pick === "tank" ? "opacity-100" : "opacity-70")}>
            <svg viewBox="0 0 80 120" className="h-36 w-auto" aria-hidden>
              <defs>
                <clipPath id="tankClip">
                  <rect x="12" y="12" width="56" height="96" rx="14" />
                </clipPath>
              </defs>
              <rect x="12" y="12" width="56" height="96" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <g clipPath="url(#tankClip)">
                <rect
                  x="12"
                  width="56"
                  height="96"
                  fill="url(#tankFill)"
                  style={{ transform: `translateY(${12 + 96 * (1 - fill)}px)`, transition: "transform 1s cubic-bezier(0.16,1,0.3,1)" }}
                />
              </g>
              <linearGradient id="tankFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#cdeff5" />
                <stop offset="1" stopColor="#0e86a6" />
              </linearGradient>
              <path d="M30 12V4M50 12V4" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className="mt-3 font-display text-4xl font-semibold tracking-tight">{r.tank} gal</p>
            <p className="text-sm text-white/70">tank size</p>
          </div>
          <div className={clsx("transition-opacity", r.pick === "tankless" ? "opacity-100" : "opacity-70")}>
            <svg viewBox="0 0 120 120" className="h-36 w-auto" aria-hidden>
              <path d="M20 90 A48 48 0 1 1 100 90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" strokeLinecap="round" />
              <path
                d="M20 90 A48 48 0 1 1 100 90"
                fill="none"
                stroke="#ffcb47"
                strokeWidth="10"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                style={{ strokeDashoffset: 1 - Math.min(1, r.gpm / 12), transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
              />
              <g style={{ transform: `rotate(${needle}deg)`, transformOrigin: "60px 62px", transition: "transform 1s cubic-bezier(0.34,1.45,0.64,1)" }}>
                <path d="M60 62 60 24" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
              </g>
              <circle cx="60" cy="62" r="6" fill="#fff" />
            </svg>
            <p className="mt-3 font-display text-4xl font-semibold tracking-tight">{r.gpm} GPM</p>
            <p className="text-sm text-white/70">tankless at a 65°F rise (≈{r.btu} BTU)</p>
          </div>
        </div>

        <p className="mt-8 text-sm text-white/60">
          Estimates for North Texas groundwater temperatures. We confirm sizing, gas line and venting on site before quoting.
        </p>
        <div className="mt-5">
          <Button href="/book?service=water-heaters" icon={<ArrowRight size={18} />}>
            Get a flat quote
          </Button>
        </div>
      </div>
    </div>
  );
}
