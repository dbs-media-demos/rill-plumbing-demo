"use client";

import { useState } from "react";
import clsx from "clsx";

type Spot = {
  id: string;
  n: number;
  x: number;
  y: number;
  title: string;
  where: string;
  how: string;
  tip: string;
  priority?: boolean;
};

const spots: Spot[] = [
  {
    id: "curb",
    n: 1,
    x: 110,
    y: 452,
    title: "City meter box (curb)",
    where: "A rectangular concrete or plastic lid near the street or sidewalk, usually in the front yard.",
    how: "Lift the lid. The valve sits on the house side of the meter. Turn it a quarter turn so the handle is across the pipe. A meter key or large adjustable wrench helps.",
    tip: "Most North Texas homes shut off fastest here. Keep a meter key in the garage.",
    priority: true,
  },
  {
    id: "main",
    n: 2,
    x: 262,
    y: 402,
    title: "House main shut-off",
    where: "Where the line enters the house: often behind a hose bib at the front, on the garage wall, or in a small box in a flower bed.",
    how: "Round handle: turn clockwise until it stops. Lever (ball valve): turn a quarter turn so it's across the pipe.",
    tip: "Not every slab home has one. If you can't find it in 2 minutes, use the curb valve.",
    priority: true,
  },
  {
    id: "heater",
    n: 3,
    x: 338,
    y: 300,
    title: "Water heater cold-water valve",
    where: "On the cold (blue) pipe at the top of the tank, in the garage, attic or a closet.",
    how: "Turn clockwise to close. Then set gas to 'Pilot' or switch the electric breaker off.",
    tip: "If the tank itself is leaking, close this valve first, then call us.",
  },
  {
    id: "sink",
    n: 4,
    x: 585,
    y: 372,
    title: "Under-sink valves",
    where: "Two small oval handles under kitchen and bathroom sinks: hot and cold.",
    how: "Turn clockwise by hand until snug. Don't force stuck valves; they can snap.",
    tip: "Great for faucet or supply-line leaks. The rest of the house keeps water.",
  },
  {
    id: "toilet",
    n: 5,
    x: 700,
    y: 400,
    title: "Toilet supply valve",
    where: "On the wall or floor behind and below the toilet tank.",
    how: "Turn clockwise to stop the tank from refilling. Flush once to empty it.",
    tip: "Overflowing? Lift the tank lid and push the flapper down while you close the valve.",
  },
  {
    id: "washer",
    n: 6,
    x: 418,
    y: 352,
    title: "Washing machine valves",
    where: "In the laundry box on the wall behind the washer.",
    how: "Turn both handles clockwise, or flip the single lever down.",
    tip: "Rubber washer hoses burst without warning. Upgrade to braided steel.",
  },
  {
    id: "irrigation",
    n: 7,
    x: 190,
    y: 432,
    title: "Sprinkler backflow valve",
    where: "A brass assembly above ground near the front of the house, often behind shrubs.",
    how: "Turn the handles so they're across the pipe.",
    tip: "A spinning meter with everything off often means an irrigation leak.",
  },
];

/** Interactive house diagram: tap a numbered valve to learn where it is and how to close it. */
export function ShutoffFinder() {
  const [active, setActive] = useState("curb");
  const s = spots.find((x) => x.id === active) ?? spots[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
      <div className="relative overflow-hidden rounded-[2rem] bg-foam ring-1 ring-abyss/8">
        <svg viewBox="0 0 1000 560" className="block h-auto w-full" role="img" aria-label="Diagram of a North Texas slab home showing seven water shut-off valves">
          {/* sky & ground */}
          <rect width="1000" height="440" fill="#e8f7fa" />
          <rect y="440" width="1000" height="120" fill="#cfe3d4" />
          <rect y="440" width="1000" height="8" fill="#b7d3bf" />
          <path d="M0 462 H1000" stroke="#9fb9a6" strokeDasharray="6 10" />
          {/* underground service line */}
          <path d="M110 470 H262 V402" stroke="#0a6b85" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* house */}
          <path d="M230 205 L505 70 L790 205 Z" fill="#06222f" />
          <rect x="250" y="200" width="520" height="240" fill="#fff" stroke="#06222f" strokeWidth="4" />
          <rect x="250" y="200" width="200" height="240" fill="#f3f6f6" stroke="#06222f" strokeWidth="4" />
          <rect x="272" y="330" width="156" height="110" rx="6" fill="#dfe8ea" stroke="#9fc3cd" strokeWidth="3" />
          {[345, 366, 387, 408].map((y) => (
            <path key={y} d={`M272 ${y} H428`} stroke="#9fc3cd" strokeWidth="2" />
          ))}
          <text x="350" y="228" textAnchor="middle" fontSize="18" fill="#3d5560" fontWeight="600">Garage</text>
          <text x="610" y="228" textAnchor="middle" fontSize="18" fill="#3d5560" fontWeight="600">Kitchen &amp; baths</text>
          {/* water heater */}
          <rect x="318" y="250" width="42" height="72" rx="12" fill="#fff" stroke="#06222f" strokeWidth="3" />
          <path d="M330 250 V238 M348 250 V238" stroke="#06222f" strokeWidth="3" />
          {/* washer */}
          <rect x="396" y="360" width="44" height="46" rx="6" fill="#fff" stroke="#06222f" strokeWidth="3" />
          <circle cx="418" cy="384" r="12" fill="none" stroke="#06222f" strokeWidth="3" />
          {/* kitchen sink */}
          <rect x="540" y="352" width="100" height="14" rx="4" fill="#06222f" />
          <rect x="548" y="366" width="84" height="74" fill="#fff" stroke="#06222f" strokeWidth="3" />
          <path d="M590 352 V330 H604" stroke="#06222f" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* toilet */}
          <rect x="680" y="350" width="40" height="30" rx="4" fill="#fff" stroke="#06222f" strokeWidth="3" />
          <path d="M672 384 H728 C728 410 712 424 700 424 C688 424 672 410 672 384Z" fill="#fff" stroke="#06222f" strokeWidth="3" />
          {/* supply lines */}
          <path d="M262 402 V430 H760 M339 430 V322 M418 430 V406 M590 430 V440 M700 430 V424" stroke="#0a6b85" strokeWidth="4" fill="none" opacity="0.6" />
          {/* curb meter box */}
          <rect x="80" y="440" width="60" height="26" rx="4" fill="#8aa39a" stroke="#06222f" strokeWidth="3" />
          {/* backflow */}
          <path d="M190 470 V432 H206" stroke="#b08d57" strokeWidth="6" fill="none" />
          {/* shrubs */}
          <circle cx="215" cy="428" r="18" fill="#7fb08f" />
          <circle cx="800" cy="424" r="24" fill="#7fb08f" />

          {spots.map((p) => {
            const on = p.id === active;
            return (
              <g key={p.id} className="cursor-pointer" onClick={() => setActive(p.id)} aria-hidden>
                {on && <circle cx={p.x} cy={p.y} r="30" fill="none" stroke="#5a48e0" strokeWidth="3" className="animate-ping [transform-box:fill-box] [transform-origin:center]" />}
                <circle cx={p.x} cy={p.y} r={on ? 22 : 18} fill={on ? "#5a48e0" : p.priority ? "#e5484d" : "#06222f"} stroke="#fff" strokeWidth="4" />
                <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff">
                  {p.n}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="px-5 pb-4 text-xs text-slate">Illustration. Valve locations vary by home; red markers stop water to the whole house.</p>
      </div>

      <div>
        <div role="tablist" aria-label="Shut-off valves" className="flex flex-wrap gap-2">
          {spots.map((p) => (
            <button
              key={p.id}
              role="tab"
              type="button"
              aria-selected={p.id === active}
              onClick={() => setActive(p.id)}
              className={clsx(
                "flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
                p.id === active ? "bg-bonnet text-white" : "bg-abyss/5 hover:bg-abyss/10",
              )}
            >
              <span
                className={clsx(
                  "grid size-6 place-items-center rounded-full text-xs text-white",
                  p.id === active ? "bg-white/25" : p.priority ? "bg-alert" : "bg-abyss",
                )}
              >
                {p.n}
              </span>
              {p.title.split(" (")[0]}
            </button>
          ))}
        </div>
        <div key={s.id} role="tabpanel" aria-live="polite" className="anim-fade mt-6 rounded-[1.8rem] bg-white p-7 ring-1 ring-abyss/8">
          {s.priority && <p className="eyebrow text-[#b4232a]">Whole-house shut-off</p>}
          <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight">{s.title}</h3>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="eyebrow text-slate">Where to look</dt>
              <dd className="mt-1">{s.where}</dd>
            </div>
            <div>
              <dt className="eyebrow text-slate">How to close it</dt>
              <dd className="mt-1">{s.how}</dd>
            </div>
          </dl>
          <p className="mt-5 rounded-2xl bg-sunny/25 p-4 text-[0.98rem]">
            <strong>Tip:</strong> {s.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
