import type { CSSProperties, ReactNode } from "react";
import { HeroRunValve } from "./HeroRunValve";

/**
 * The /v2 hero's centrepiece, with no three.js: a copper supply line that plumbs itself on the
 * wall in the first three seconds. The runs lay down from the ceiling, each joint flashes as it's
 * sweated, the brass main shut-off and the gauge go on, then the lever turns, the needle climbs to
 * working pressure, the sight glass fills and water pours from the spout. Click the valve (or tab
 * to it) to shut the water off: the lever turns across the pipe, the stream falls away, the glass
 * drains and the gauge drops to zero, like the 3D hero on /.
 *
 * SVG and CSS only (globals.css, "v2 hero"), drawn on the server so it's moving at first paint,
 * before any JavaScript. Each moving part is two nested groups: the inner one plays the intro, the
 * outer one follows the valve (`data-valve` on the hero <section>, set by HeroRunValve), so the two
 * never fight over a transform. Desktop only (phones keep the photo, as on /); reduced motion gets
 * the finished picture.
 */

const COPPER = ["#4a2210", "#8c4522", "#b8693d", "#d88a5c"];

/** One copper tube along `d`, shaded by stacked strokes, light from the top left. */
function Tube({ d, cls, w = 34, style }: { d: string; cls?: string; w?: number; style?: CSSProperties }) {
  const p = { d, pathLength: 1, className: cls, style };
  return (
    <g fill="none">
      <path {...p} stroke={COPPER[0]} strokeWidth={w} />
      <path {...p} stroke={COPPER[1]} strokeWidth={w - 7} />
      <path {...p} stroke={COPPER[2]} strokeWidth={w - 16} transform="translate(-3 -2.5)" />
      <path {...p} stroke={COPPER[3]} strokeWidth={w - 26} transform="translate(-6 -5)" />
      <path {...p} stroke="#ffe0c2" strokeOpacity={0.75} strokeWidth={2.4} transform="translate(-8.5 -7)" />
    </g>
  );
}

/** The soft shadow a tube throws on the wall. */
function TubeShadow({ d, cls, w = 34, style }: { d: string; cls?: string; w?: number; style?: CSSProperties }) {
  const p = { d, pathLength: 1, className: cls, style, fill: "none", stroke: "#01121a" };
  return (
    <g transform="translate(13 17)">
      <path {...p} strokeWidth={w + 26} strokeOpacity={0.07} />
      <path {...p} strokeWidth={w + 12} strokeOpacity={0.1} />
      <path {...p} strokeWidth={w} strokeOpacity={0.16} />
    </g>
  );
}

/** A part popping on at `--d` seconds, with its shadow behind it. */
function Part({ d, o, children, shadow, className = "" }: { d: number; o?: [number, number]; children: ReactNode; shadow?: ReactNode; className?: string }) {
  // `o`: scale about this point (viewBox units) rather than the part's own centre, so a part split
  // across the two layers (the gauge and its needle) pops on as one
  const origin: CSSProperties = o ? { transformBox: "view-box", transformOrigin: `${o[0]}px ${o[1]}px` } : {};
  return (
    <g className={`run-pop ${className}`} style={{ "--d": `${d}s`, ...origin } as CSSProperties}>
      {shadow && (
        <g transform="translate(12 16)" fill="#01121a" fillOpacity={0.2}>
          {shadow}
        </g>
      )}
      {children}
    </g>
  );
}

/** A joint being sweated: a bright flash where the solder runs. */
function Flash({ x, y, d }: { x: number; y: number; d: number }) {
  return <circle cx={x} cy={y} r={30} fill="url(#run-flash)" className="run-flash" style={{ "--d": `${d}s`, transformOrigin: `${x}px ${y}px` } as CSSProperties} />;
}

function Clip({ x, y, across = false, d }: { x: number; y: number; across?: boolean; d: number }) {
  return across ? (
    <Part d={d} shadow={<rect x={x - 5} y={y - 23} width={10} height={46} rx={2} />}>
      <circle cx={x} cy={y + 36} r={6} fill="#6d5524" />
      <circle cx={x - 1} cy={y + 35} r={2.5} fill="#e2c27a" />
      <rect x={x - 5} y={y - 23} width={10} height={46} rx={2} fill="url(#run-brass-v)" />
    </Part>
  ) : (
    <Part d={d} shadow={<rect x={x - 23} y={y - 5} width={46} height={10} rx={2} />}>
      <circle cx={x + 36} cy={y} r={6} fill="#6d5524" />
      <circle cx={x + 35} cy={y - 1} r={2.5} fill="#e2c27a" />
      <rect x={x - 23} y={y - 5} width={46} height={10} rx={2} fill="url(#run-brass)" />
    </Part>
  );
}

// The gauge's centre
const GX = 515;
const GY = 390;

// The runs, in viewBox units (640 × 1000; they reach past it into the hero's edges).
const RUN_A = "M400 -200 V172"; // ceiling to the valve
const RUN_B = "M400 288 V690 A50 50 0 0 1 350 740 H240 A50 50 0 0 0 190 790 V846"; // valve to the spout
const RUN_G = "M400 520 H465 A50 50 0 0 0 515 470 V458"; // the gauge's branch
const RUN_H = "M620 -200 V780 A50 50 0 0 0 670 830 H900"; // the line beside it
const ELBOWS = [
  { d: "M400 676 V690 A50 50 0 0 1 350 740 H336", t: 1.1, x: 385, y: 725 },
  { d: "M254 740 H240 A50 50 0 0 0 190 790 V804", t: 1.33, x: 205, y: 755 },
  { d: "M451 520 H465 A50 50 0 0 0 515 470 V456", t: 1.0, x: 500, y: 505 },
  { d: "M620 766 V780 A50 50 0 0 0 670 830 H684", t: 1.08, x: 635, y: 815 },
];

export function HeroRun({ sr, labels }: { sr: boolean; labels: { open: string; closed: string; button: string; buttonClosed: string } }) {
  // The gauge reads psi here and bar for a Serbian business: working pressure, about 60 psi / 3.5 bar
  const max = sr ? 10 : 160;
  const major = sr ? 2 : 20;
  const minor = sr ? 0.5 : 5;
  const work = sr ? 3.5 : 60;
  const ang = (v: number) => -135 + (270 * v) / max;
  const at = (v: number, r: number) => {
    const a = (ang(v) * Math.PI) / 180;
    return [GX + r * Math.sin(a), GY - r * Math.cos(a)].map((n) => Math.round(n * 10) / 10);
  };
  const ticks = Array.from({ length: Math.round(max / minor) + 1 }, (_, i) => i * minor);
  const drop = ang(0) - ang(work);

  return (
    <>
      {/* a soft pool of light on the wall behind the pipework */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(32%_52%_at_80%_42%,rgba(70,140,160,0.42),rgba(18,65,87,0.18)_55%,transparent_80%)] phone:hidden" />
      <div aria-hidden className="run-par pointer-events-none absolute inset-y-0 right-0 -z-10 w-[42vw] pr-[2vw] [mask-image:linear-gradient(180deg,transparent_0,transparent_64px,#000_200px)] phone:hidden" style={{ "--drop": `${drop}deg` } as CSSProperties}>
        <svg aria-hidden viewBox="0 0 640 1000" preserveAspectRatio="xMidYMid meet" className="run h-full w-full overflow-visible">
          <defs>
            <linearGradient id="run-brass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6dc93" />
              <stop offset="0.35" stopColor="#c99c45" />
              <stop offset="1" stopColor="#6a4f1c" />
            </linearGradient>
            <linearGradient id="run-brass-v" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f6dc93" />
              <stop offset="0.35" stopColor="#c99c45" />
              <stop offset="1" stopColor="#6a4f1c" />
            </linearGradient>
            <linearGradient id="run-brass-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5b4317" />
              <stop offset="0.22" stopColor="#c59a43" />
              <stop offset="0.38" stopColor="#f8e3a3" />
              <stop offset="0.6" stopColor="#b58a35" />
              <stop offset="1" stopColor="#4d3812" />
            </linearGradient>
            <radialGradient id="run-brass-ball" cx="0.36" cy="0.32" r="0.75">
              <stop offset="0" stopColor="#fff1c4" />
              <stop offset="0.25" stopColor="#dcb35c" />
              <stop offset="0.7" stopColor="#8d6a27" />
              <stop offset="1" stopColor="#4d3812" />
            </radialGradient>
            <linearGradient id="run-lever" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ff7a5c" />
              <stop offset="0.45" stopColor="#e24a35" />
              <stop offset="1" stopColor="#a5281a" />
            </linearGradient>
            <linearGradient id="run-chrome" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.45" stopColor="#aeb9bd" />
              <stop offset="0.55" stopColor="#e6ecee" />
              <stop offset="1" stopColor="#5f6c71" />
            </linearGradient>
            <radialGradient id="run-face" cx="0.42" cy="0.36" r="0.7">
              <stop offset="0" stopColor="#fbf8f0" />
              <stop offset="1" stopColor="#e3ddd0" />
            </radialGradient>
            <linearGradient id="run-glass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#cdeff5" stopOpacity="0.55" />
              <stop offset="0.2" stopColor="#0b3142" stopOpacity="0.9" />
              <stop offset="0.75" stopColor="#0b3142" stopOpacity="0.9" />
              <stop offset="1" stopColor="#cdeff5" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="run-water" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7fd6ea" />
              <stop offset="0.5" stopColor="#1f9fc2" />
              <stop offset="1" stopColor="#0e6f8c" />
            </linearGradient>
            <linearGradient id="run-stream" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#e8f7fa" stopOpacity="0.85" />
              <stop offset="0.25" stopColor="#7fd6ea" stopOpacity="0.4" />
              <stop offset="0.6" stopColor="#35c2e0" stopOpacity="0.22" />
              <stop offset="0.85" stopColor="#cdeff5" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="run-stream-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.5" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="run-stream-mask" maskUnits="userSpaceOnUse" x="110" y="890" width="160" height="130">
              <rect x="110" y="890" width="160" height="130" fill="url(#run-stream-fade)" />
            </mask>
            <radialGradient id="run-flash">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.18" stopColor="#fff2c8" />
              <stop offset="0.45" stopColor="#ffb347" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ff8a2a" stopOpacity="0" />
            </radialGradient>
            <clipPath id="run-glass-clip">
              <rect x="387" y="576" width="26" height="82" rx="3" />
            </clipPath>
          </defs>

          {/* shadows on the wall */}
          <TubeShadow d={RUN_H} cls="run-draw" style={{ "--d": "0.15s", "--t": "1.2s" } as CSSProperties} />
          <TubeShadow d={RUN_A} cls="run-draw" style={{ "--d": "0s", "--t": "0.55s" } as CSSProperties} />
          <TubeShadow d={RUN_B} cls="run-draw" style={{ "--d": "0.55s", "--t": "1s" } as CSSProperties} />
          <TubeShadow d={RUN_G} cls="run-draw" style={{ "--d": "0.8s", "--t": "0.4s" } as CSSProperties} />

          {/* the copper */}
          <Tube d={RUN_H} cls="run-draw" style={{ "--d": "0.15s", "--t": "1.2s" } as CSSProperties} />
          <Tube d={RUN_A} cls="run-draw" style={{ "--d": "0s", "--t": "0.55s" } as CSSProperties} />
          <Tube d={RUN_B} cls="run-draw" style={{ "--d": "0.55s", "--t": "1s" } as CSSProperties} />
          <Tube d={RUN_G} cls="run-draw" style={{ "--d": "0.8s", "--t": "0.4s" } as CSSProperties} />

          {/* fittings, each going on as the pipe reaches it */}
          {ELBOWS.map((e) => (
            <g key={e.d} className="run-pop" style={{ "--d": `${e.t}s` } as CSSProperties}>
              <Tube d={e.d} w={41} />
            </g>
          ))}
          {/* the tee for the gauge */}
          <g className="run-pop" style={{ "--d": "0.8s" } as CSSProperties}>
            <Tube d="M400 496 V544" w={41} />
            <Tube d="M408 520 H430" w={40} />
          </g>
          {/* couplings */}
          <g className="run-pop" style={{ "--d": "0.6s" } as CSSProperties}>
            <Tube d="M620 392 V420" w={40} />
          </g>
          <Clip x={400} y={96} d={0.3} />
          <Clip x={620} y={150} d={0.4} />
          <Clip x={620} y={620} d={0.9} />
          <Clip x={310} y={740} across d={1.22} />
          <Clip x={190} y={808} d={1.45} />

          {/* the main shut-off: a brass ball valve */}
          <Part
            d={0.5}
            shadow={
              <>
                <rect x="360" y="156" width="80" height="30" rx="4" />
                <ellipse cx="400" cy="230" rx="48" ry="56" />
                <rect x="360" y="274" width="80" height="30" rx="4" />
              </>
            }
          >
            <rect x="360" y="156" width="80" height="30" rx="4" fill="url(#run-brass-body)" />
            <rect x="360" y="274" width="80" height="30" rx="4" fill="url(#run-brass-body)" />
            <path d="M383 156 V186 M417 156 V186 M383 274 V304 M417 274 V304" stroke="#3f2d0c" strokeOpacity="0.45" strokeWidth="1.5" />
            <ellipse cx="400" cy="230" rx="46" ry="54" fill="url(#run-brass-ball)" />
            <ellipse cx="386" cy="210" rx="12" ry="18" fill="#fff6d8" opacity="0.35" />
          </Part>

          {/* the gauge on its branch (its needle is on the live layer) */}
          <Part
            d={1.25}
            o={[GX, GY]}
            shadow={
              <>
                <circle cx={GX} cy={GY} r="74" />
                <rect x={GX - 12} y={GY + 62} width="24" height="18" />
              </>
            }
          >
            <rect x={GX - 16} y={GY + 58} width="32" height="18" rx="3" fill="url(#run-brass-body)" />
            <rect x={GX - 5} y={GY + 68} width="10" height="8" fill="#8f6c2a" />
            <circle cx={GX} cy={GY} r="74" fill="url(#run-chrome)" />
            <circle cx={GX} cy={GY} r="66" fill="#59656a" />
            <circle cx={GX} cy={GY} r="64" fill="url(#run-face)" />
            <g stroke="#2b3438" strokeLinecap="round">
              {ticks.map((v) => {
                const big = Math.abs(v / major - Math.round(v / major)) < 1e-6;
                const [x1, y1] = at(v, big ? 50 : 54);
                const [x2, y2] = at(v, 59);
                return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={big ? 2 : 1} strokeOpacity={big ? 0.9 : 0.55} />;
              })}
            </g>
            <path d={`M${at(work * 0.92, 57).join(" ")} A57 57 0 0 1 ${at(Math.min(max, work * 1.1), 57).join(" ")}`} stroke="#0e86a6" strokeWidth="4" fill="none" opacity="0.8" />
            <g fontFamily="var(--font-sans), sans-serif" fontSize="10.5" fontWeight="600" fill="#2b3438" textAnchor="middle" data-no-translate>
              {ticks
                .filter((v) => Math.abs(v / (sr ? major : major * 2) - Math.round(v / (sr ? major : major * 2))) < 1e-6)
                .map((v) => {
                  const [x, y] = at(v, 39);
                  return (
                    <text key={v} x={x} y={y + 3.6}>
                      {v}
                    </text>
                  );
                })}
              <text x={GX} y={GY + 38} fontSize="10" fill="#5a6a70" letterSpacing="1">
                {sr ? "BAR" : "PSI"}
              </text>
            </g>
          </Part>

          {/* the tag every plumber hangs on a main shut-off */}
          <g className="run-tag-scroll">
            <Part d={1.4} className="run-tag">
              <path d="M396 120 L353.5 159" stroke="#cdbf9f" strokeWidth="1.4" fill="none" />
              <g transform="rotate(-8 302 166)">
                <path d="M248 146 H356 L368 166 L356 186 H248 Q242 186 242 180 V152 Q242 146 248 146 Z" fill="#efe8d8" />
                <path d="M248 146 H356 L368 166 L356 186 H248 Q242 186 242 180 V152 Q242 146 248 146 Z" fill="#06222f" fillOpacity="0.06" transform="translate(3 4)" />
                <circle cx="354" cy="166" r="4.5" fill="#06222f" fillOpacity="0.85" />
                <circle cx="354" cy="166" r="2.5" fill="#0b3142" />
                <rect x="242" y="146" width="7" height="40" fill="#e5484d" />
                <text x="296" y="171" fontFamily="var(--font-sans), sans-serif" fontSize="13" fontWeight="700" fill="#06222f" textAnchor="middle" letterSpacing="0.3">
                  Main shut-off
                </text>
              </g>
            </Part>
          </g>

          {/* the lever: along the pipe is open, across it is shut */}
          <Part d={0.6}>
            <g className="run-lever-state">
              <g className="run-lever-in">
                <g className="run-lever">
                  <rect x="388" y="222" width="24" height="168" rx="8" fill="#5e140c" opacity="0.35" transform="translate(9 12)" />
                  <rect x="388" y="222" width="24" height="168" rx="8" fill="url(#run-lever)" />
                  <rect x="392" y="238" width="5" height="140" rx="2.5" fill="#fff" opacity="0.28" />
                  <circle cx="400" cy="374" r="5" fill="#7a1d12" />
                </g>
              </g>
            </g>
            <circle cx="400" cy="230" r="14" fill="#31383b" />
            <path d="M400 220 L408.7 225 V235 L400 240 L391.3 235 V225 Z" fill="#6b7478" />
            <circle cx="397" cy="227" r="3" fill="#c3cbce" />
          </Part>

          {/* the spout */}
          <Part
            d={1.5}
            shadow={
              <>
                <rect x="156" y="838" width="68" height="26" rx="3" />
                <rect x="170" y="862" width="40" height="42" rx="3" />
              </>
            }
          >
            <rect x="156" y="838" width="68" height="26" rx="3" fill="url(#run-brass-body)" />
            <path d="M178 838 V864 M202 838 V864" stroke="#3f2d0c" strokeOpacity="0.45" strokeWidth="1.5" />
            <rect x="170" y="862" width="40" height="38" rx="2" fill="url(#run-brass-body)" />
            <rect x="166" y="894" width="48" height="10" rx="3" fill="url(#run-brass-body)" />
          </Part>

          {/* the joints being sweated */}
          <Flash x={400} y={172} d={0.5} />
          <Flash x={400} y={520} d={0.8} />
          <Flash x={ELBOWS[2].x} y={ELBOWS[2].y} d={ELBOWS[2].t} />
          <Flash x={ELBOWS[0].x} y={ELBOWS[0].y} d={ELBOWS[0].t} />
          <Flash x={ELBOWS[3].x} y={ELBOWS[3].y} d={ELBOWS[3].t} />
          <Flash x={ELBOWS[1].x} y={ELBOWS[1].y} d={ELBOWS[1].t} />
          <Flash x={190} y={846} d={1.5} />
        </svg>
        {/* The live layer: everything that keeps moving, on its own layer so the pipework above never repaints */}
        <svg aria-hidden viewBox="0 0 640 1000" preserveAspectRatio="xMidYMid meet" className="run run-live absolute left-0 top-0 h-full w-[calc(100%-2vw)] overflow-visible">
          {/* the sight glass: water you can see moving */}
          <Part d={1.2} shadow={<rect x="379" y="564" width="42" height="106" rx="4" />}>
            <rect x="381" y="570" width="38" height="94" rx="4" fill="url(#run-glass)" />
            <g clipPath="url(#run-glass-clip)">
              <g className="run-glass-state">
                <g className="run-glass-in">
                  <rect x="387" y="576" width="26" height="82" fill="url(#run-water)" />
                  <g className="run-glass-flow" fill="#e8f7fa">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <g key={i}>
                        <rect x={390 + (i % 3) * 7} y={536 + i * 22} width="2.2" height="14" rx="1.1" opacity={0.55} />
                        <circle cx={392 + ((i * 5) % 18)} cy={548 + i * 22} r="1.6" opacity={0.7} />
                      </g>
                    ))}
                  </g>
                </g>
              </g>
            </g>
            <rect x="385" y="572" width="3" height="90" rx="1.5" fill="#fff" opacity="0.45" />
            <rect x="377" y="562" width="46" height="13" rx="2.5" fill="url(#run-brass)" />
            <rect x="377" y="659" width="46" height="13" rx="2.5" fill="url(#run-brass)" />
          </Part>

          {/* the needle, on the gauge */}
          <Part d={1.25} o={[GX, GY]}>
            <g className="run-needle-state">
              <g className="run-needle-in">
                <g className="run-needle-flutter">
                  <g transform={`rotate(${ang(work)} ${GX} ${GY})`}>
                    <path d={`M${GX - 2.8} ${GY + 10} L${GX + 2.8} ${GY + 10} L${GX + 0.9} ${GY - 50} L${GX - 0.9} ${GY - 50} Z`} fill="#e5484d" />
                  </g>
                </g>
              </g>
            </g>
            <circle cx={GX} cy={GY} r="7" fill="#2b3438" />
            <circle cx={GX - 1.5} cy={GY - 1.5} r="2.4" fill="#9aa6aa" />
            <path d={`M${GX - 46} ${GY - 40} A62 62 0 0 1 ${GX + 32} ${GY - 58}`} stroke="#fff" strokeOpacity="0.55" strokeWidth="5" fill="none" strokeLinecap="round" />
          </Part>

          {/* the water */}
          <g className="run-stream-state">
            <g className="run-stream-in" mask="url(#run-stream-mask)">
              <path d="M176 903 C177 940 179 980 180 1040 L200 1040 C201 980 203 940 204 903 Z" fill="url(#run-stream)" />
              <g className="run-stream-flow" fill="none" stroke="#ffffff" strokeLinecap="round">
                <path d="M183 802 V1040" strokeWidth="2.2" strokeOpacity="0.75" strokeDasharray="38 66" />
                <path d="M194.5 802 V1040" strokeWidth="1.6" strokeOpacity="0.6" strokeDasharray="22 82" />
                <path d="M189 802 V1040" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="60 44" />
              </g>
            </g>
          </g>
        </svg>
      </div>
      <HeroRunValve labels={labels} />
    </>
  );
}
