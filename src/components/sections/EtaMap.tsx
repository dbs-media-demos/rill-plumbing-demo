"use client";

import { useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { cities, zipToCity, type City } from "@/content/cities";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { SplitReveal } from "@/components/ui/Reveal";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/* Stylised North Dallas map (viewBox 0 0 1000 1000). Not to scale. */
const roads = [
  { id: "us75", label: "US-75", d: "M525 1000 L560 900 L610 800 L640 710 L665 620 L690 520 L700 450 L740 380 L790 300 L840 200 L880 60", major: true },
  { id: "dnt", label: "Tollway", d: "M405 1000 L410 880 L412 780 L410 680 L408 580 L405 480 L402 380 L400 280 L395 180 L385 60", major: true },
  { id: "pgbt", label: "PGBT", d: "M150 610 C250 590 330 585 410 580 S600 575 680 580 C760 590 820 640 880 760", major: true },
  { id: "i635", label: "I-635", d: "M110 810 C300 795 450 800 600 812 S820 830 960 850", major: true },
  { id: "sh121", label: "SH-121", d: "M60 430 C180 385 300 305 400 262 S620 192 760 180 L960 160", major: true },
  { id: "i35e", label: "I-35E", d: "M330 1000 L290 880 L240 760 L190 650 L150 560 L90 440 L40 340", major: true },
  { id: "legacy", label: "", d: "M160 470 C320 470 480 455 620 445 S820 430 940 420", major: false },
  { id: "parker", label: "", d: "M200 530 C360 525 520 520 700 515 S860 510 960 505", major: false },
  { id: "preston", label: "", d: "M470 1000 L468 800 L470 600 L472 400 L470 150", major: false },
  { id: "coit", label: "", d: "M560 1000 L560 820 L566 620 L570 420 L574 200", major: false },
  { id: "belt", label: "", d: "M80 700 C300 690 520 700 760 705 S900 710 980 712", major: false },
];

type Van = { id: string; driver: string; road: string; from: number; to: number; dur: number };
const vans: Van[] = [
  { id: "V1", driver: "Marcus H.", road: "us75", from: 0.35, to: 0.62, dur: 16 },
  { id: "V2", driver: "Andre O.", road: "dnt", from: 0.55, to: 0.85, dur: 19 },
  { id: "V3", driver: "Dana W.", road: "pgbt", from: 0.1, to: 0.55, dur: 21 },
  { id: "V4", driver: "Luis R.", road: "sh121", from: 0.3, to: 0.7, dur: 18 },
  { id: "V5", driver: "Jess K.", road: "i635", from: 0.2, to: 0.6, dur: 20 },
];

type Result = { city: City; van: Van; eta: number };

export function EtaMap() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const tweens = useRef<Record<string, gsap.core.Tween>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [zip, setZip] = useState("");
  const [zipError, setZipError] = useState("");
  const [busy, setBusy] = useState(false);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      vans.forEach((v, i) => {
        const el = svg.current?.querySelector<SVGGElement>(`[data-van="${v.id}"]`);
        const path = svg.current?.querySelector<SVGPathElement>(`[data-road="${v.road}"]`);
        if (!el || !path) return;
        const start = v.from + ((v.to - v.from) * i) / vans.length;
        gsap.set(el, {
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start, end: start, autoRotate: false },
        });
        if (reduce) return;
        tweens.current[v.id] = gsap.fromTo(
          el,
          { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: v.from, end: v.from } },
          {
            motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: v.from, end: v.to },
            duration: v.dur,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
        tweens.current[v.id].progress(i / vans.length);
      });
      // Draw the major roads in once when the map scrolls into view.
      if (!reduce) {
        gsap.from(svg.current!.querySelectorAll("[data-draw]"), {
          strokeDashoffset: 1,
          duration: 2.4,
          stagger: 0.12,
          ease: "power2.inOut",
          scrollTrigger: { trigger: svg.current, start: "top 80%", once: true },
        });
      }
    },
    { scope: root },
  );

  function dispatch(city: City) {
    const map = svg.current;
    if (!map || busy) return;
    // Resume any van that was sent out before.
    Object.values(tweens.current).forEach((t) => t.resume());

    // Nearest van right now.
    let best: { v: Van; x: number; y: number; d: number } | null = null;
    for (const v of vans) {
      const el = map.querySelector<SVGGElement>(`[data-van="${v.id}"]`);
      if (!el) continue;
      const x = Number(gsap.getProperty(el, "x")) + 14;
      const y = Number(gsap.getProperty(el, "y")) + 14;
      const d = Math.hypot(x - city.x, y - city.y);
      if (!best || d < best.d) best = { v, x, y, d };
    }
    if (!best) return;
    const eta = Math.max(22, Math.min(58, Math.round(20 + best.d * 0.075 + (city.eta - 40) * 0.4)));
    const route = map.querySelector<SVGPathElement>("[data-route]");
    const van = map.querySelector<SVGGElement>(`[data-van="${best.v.id}"]`);
    if (!route || !van) return;

    const mx = (best.x + city.x) / 2 + (city.y - best.y) * 0.18;
    const my = (best.y + city.y) / 2 - (city.x - best.x) * 0.18;
    route.setAttribute("d", `M${best.x} ${best.y} Q${mx} ${my} ${city.x} ${city.y}`);
    setResult({ city, van: best.v, eta });

    if (prefersReducedMotion()) {
      gsap.set(route, { strokeDashoffset: 0, opacity: 1 });
      return;
    }
    setBusy(true);
    tweens.current[best.v.id]?.pause();
    gsap
      .timeline({ onComplete: () => setBusy(false) })
      .fromTo(route, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
      .to(
        van,
        {
          motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], start: 0, end: 0.92 },
          duration: 2.6,
          ease: "power2.inOut",
        },
        0.5,
      )
      .fromTo(
        map.querySelector(`[data-city="${city.slug}"] [data-ring]`),
        { scale: 0.4, opacity: 0.9, transformOrigin: "50% 50%" },
        { scale: 3.2, opacity: 0, duration: 1.2, repeat: 2, ease: "expo.out" },
        1.6,
      );
  }

  // Count the ETA up whenever a new result lands.
  useGSAP(
    () => {
      const el = root.current?.querySelector<HTMLElement>("[data-eta]");
      if (!el || !result || prefersReducedMotion()) return;
      const obj = { n: 0 };
      gsap.to(obj, {
        n: result.eta,
        duration: 1.6,
        delay: 0.2,
        ease: "expo.out",
        onUpdate: () => {
          el.textContent = String(Math.round(obj.n));
        },
      });
    },
    { dependencies: [result], scope: root },
  );

  const onZip = (e: FormEvent) => {
    e.preventDefault();
    const clean = zip.replace(/\D/g, "").slice(0, 5);
    if (clean.length !== 5) {
      setZipError("Enter a 5-digit ZIP code.");
      return;
    }
    const c = zipToCity(clean);
    if (!c) {
      setZipError("That ZIP is just outside our map. Call us, we may still cover it.");
      return;
    }
    setZipError("");
    dispatch(c);
  };

  return (
    <section
      ref={root}
      data-pipe
      data-header="dark"
      aria-labelledby="eta-heading"
      className="on-dark section-y relative overflow-hidden bg-abyss text-white"
    >
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[40rem] rounded-full bg-river/25 blur-[120px]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="eyebrow flex items-center gap-2 text-spray">
            <span className="pulse-dot" style={{ ["--dot" as string]: "#3ddc97" }} /> 5 vans on the road
          </p>
          <SplitReveal as="h2" id="eta-heading" className="t-1 mt-4 font-display font-semibold">
            How fast can we <span className="accent font-normal text-spray">get there?</span>
          </SplitReveal>
          <p className="mt-5 max-w-md text-lg text-white/75">
            Pick your city or enter your ZIP. We&apos;ll send the nearest van on the map and show you the arrival estimate.
          </p>

          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Choose your city">
            {cities.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => dispatch(c)}
                aria-pressed={result?.city.slug === c.slug}
                className={clsx(
                  "min-h-11 rounded-full px-4 text-[0.95rem] font-semibold transition-colors",
                  result?.city.slug === c.slug ? "bg-spray text-abyss" : "bg-white/8 text-white ring-1 ring-white/15 hover:bg-white/15",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <form onSubmit={onZip} className="mt-4 flex max-w-sm gap-2" noValidate>
            <label htmlFor="eta-zip" className="sr-only">
              ZIP code
            </label>
            <input
              id="eta-zip"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="or your ZIP, e.g. 75024"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              aria-invalid={!!zipError}
              aria-describedby={zipError ? "eta-zip-error" : undefined}
              className="min-h-12 w-full rounded-full bg-white/8 px-5 text-white ring-1 ring-white/15 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-spray"
            />
            <button type="submit" aria-label="Check arrival time" className="grid size-12 shrink-0 place-items-center rounded-full bg-bonnet text-white hover:bg-bonnet-deep">
              <ArrowRight size={20} />
            </button>
          </form>
          {zipError && (
            <p id="eta-zip-error" className="mt-2 text-sm text-[#ffb4b4]">
              {zipError}
            </p>
          )}

          <div aria-live="polite" className="mt-8 min-h-[9.5rem] rounded-[1.6rem] bg-white/6 p-6 ring-1 ring-white/10">
            {result ? (
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="text-sm text-white/70">
                    {result.van.id} · {result.van.driver} → {result.city.name}
                  </p>
                  <p className="mt-1 font-display font-semibold leading-none tracking-tight">
                    <span className="text-lg text-white/80">~</span>
                    <span data-eta className="text-7xl">
                      {result.eta}
                    </span>
                    <span className="ml-1 text-2xl text-white/80">min</span>
                  </p>
                </div>
                <Button href={`/book?city=${result.city.slug}`} icon={<ArrowRight size={18} />}>
                  Send this van
                </Button>
              </div>
            ) : (
              <p className="text-white/70">
                <span className="block font-display text-2xl font-semibold text-white">Average emergency arrival: 47 min.</span>
                Choose a city to see the nearest van.
              </p>
            )}
          </div>
          <p className="mt-4 text-xs text-white/50">Illustrative: vans and arrival times are simulated for this concept site.</p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#082a39] ring-1 ring-white/10">
            <svg ref={svg} viewBox="0 60 1000 880" className="block h-auto w-full" role="img" aria-label="Illustrative service map of North Dallas, Plano, Frisco, Allen, Richardson and Carrollton with vans on major roads">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0H0V40" fill="none" stroke="rgba(205,239,245,0.05)" strokeWidth="1" />
                </pattern>
                <radialGradient id="cover" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(14,134,166,0.35)" />
                  <stop offset="100%" stopColor="rgba(14,134,166,0)" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="1000" height="1000" fill="url(#grid)" />
              {/* Lake Lewisville & creeks */}
              <path d="M0 150 C60 170 110 210 120 270 C130 330 90 360 60 390 C40 410 20 400 0 395 Z" fill="rgba(14,134,166,0.35)" />
              <path d="M0 520 C120 540 200 600 260 700 S380 900 420 1000" fill="none" stroke="rgba(14,134,166,0.4)" strokeWidth="3" />
              <path d="M760 60 C740 180 780 260 820 360 S900 560 1000 620" fill="none" stroke="rgba(14,134,166,0.35)" strokeWidth="3" />

              {cities.map((c) => (
                <circle key={c.slug} cx={c.x} cy={c.y} r="120" fill="url(#cover)" />
              ))}

              {roads.map((r) => (
                <path
                  key={r.id}
                  data-road={r.id}
                  data-draw={r.major ? "" : undefined}
                  pathLength={1}
                  strokeDasharray={r.major ? 1 : undefined}
                  d={r.d}
                  fill="none"
                  stroke={r.major ? "rgba(205,239,245,0.55)" : "rgba(205,239,245,0.14)"}
                  strokeWidth={r.major ? 4 : 2}
                  strokeLinecap="round"
                />
              ))}
              {[
                ["US-75", 704, 430],
                ["Tollway", 360, 330],
                ["PGBT", 250, 575],
                ["I-635", 780, 845],
                ["SH-121", 560, 205],
                ["I-35E", 110, 470],
              ].map(([l, x, y]) => (
                <text key={l as string} x={x as number} y={y as number} fill="rgba(205,239,245,0.55)" fontSize="18" fontWeight="600" letterSpacing="1">
                  {l}
                </text>
              ))}

              <path data-route pathLength={1} strokeDasharray="1" strokeDashoffset="1" d="M0 0" fill="none" stroke="#ffcb47" strokeWidth="5" strokeLinecap="round" opacity="0" />

              {cities.map((c) => (
                <g key={c.slug} data-city={c.slug}>
                  <circle data-ring cx={c.x} cy={c.y} r="14" fill="none" stroke="#ffcb47" strokeWidth="3" opacity="0" />
                  <circle cx={c.x} cy={c.y} r={result?.city.slug === c.slug ? 10 : 7} fill={result?.city.slug === c.slug ? "#ffcb47" : "#fff"} />
                  <text x={c.x + 16} y={c.y + 7} fill="#fff" fontSize="26" fontWeight="700" style={{ fontFamily: "var(--font-bricolage)" }}>
                    {c.name}
                  </text>
                </g>
              ))}

              {vans.map((v) => (
                <g key={v.id} data-van={v.id}>
                  <circle cx="14" cy="14" r="22" fill="rgba(90,72,224,0.25)" />
                  <rect x="0" y="4" width="28" height="20" rx="6" fill="#5a48e0" />
                  <path d="M6 14h10M11 9v10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              ))}
            </svg>
            <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-4 rounded-full bg-abyss/70 px-4 py-2 text-xs text-white/80 backdrop-blur">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-4 rounded-[3px] bg-bonnet" /> Rill van
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-full bg-white" /> Service city
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
