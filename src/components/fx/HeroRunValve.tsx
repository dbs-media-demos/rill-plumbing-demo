"use client";

import { useEffect, useRef, useState } from "react";

type Labels = { open: string; closed: string; button: string; buttonClosed: string };

/**
 * The /v2 hero's main shut-off, as something you can use: an invisible button laid exactly over
 * the drawn valve (same viewBox and fit as HeroRun's picture). It flips `data-valve` on the hero
 * <section>; the CSS in globals.css ("v2 hero") turns the lever, drops the gauge, drains the sight
 * glass and lets the stream fall away. `data-live` goes on once the pipework has finished plumbing
 * itself in, which also shows the "Click the valve" hint in the trust row.
 */
export function HeroRunValve({ labels }: { labels: Labels }) {
  const ref = useRef<SVGGElement>(null);
  const [open, setOpen] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    // Usable once the intro ends with the stream reaching the floor (straight away if it already has)
    const go = () => {
      section.dataset.live = "";
      setLive(true);
    };
    const stream = section.querySelector<SVGGElement>(".run-stream-in");
    const running = stream?.getAnimations().some((a) => a.playState === "running") ?? false;
    let t = 0;
    if (!running) go();
    else {
      stream!.addEventListener("animationend", go, { once: true });
      t = window.setTimeout(go, 4000);
    }
    return () => {
      window.clearTimeout(t);
      stream?.removeEventListener("animationend", go);
      delete section.dataset.live;
      delete section.dataset.valve;
    };
  }, []);

  const toggle = (at?: { x: number; y: number }) => {
    const section = ref.current?.closest("section");
    if (!section || !live) return;
    const next = !open;
    setOpen(next);
    // the cursor ring reads its label on pointermove: give it one so "Open it" shows straight away
    if (at) {
      const target = ref.current;
      requestAnimationFrame(() =>
        target?.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: at.x, clientY: at.y, pointerType: "mouse" })),
      );
    }
    if (!next) {
      section.dataset.valve = "closed";
      return;
    }
    // Reopening: the stream starts again from the spout, so it first jumps (unseen) back up to it
    section.dataset.valve = "opening";
    requestAnimationFrame(() => requestAnimationFrame(() => (section.dataset.valve = "open")));
  };

  return (
    <div className="run-par pointer-events-none absolute inset-y-0 right-0 z-10 w-[42vw] pr-[2vw] phone:hidden">
      <svg viewBox="0 0 640 1000" preserveAspectRatio="xMidYMid meet" className="h-full w-full overflow-visible">
        <g
          ref={ref}
          role="button"
          tabIndex={live ? 0 : -1}
          aria-pressed={!open}
          aria-label={open ? labels.button : labels.buttonClosed}
          data-cursor={live ? (open ? labels.open : labels.closed) : undefined}
          className="run-hit"
          style={{ pointerEvents: live ? "all" : "none", cursor: "pointer" }}
          onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          onPointerEnter={(e) => e.currentTarget.closest("section")?.setAttribute("data-valve-hover", "")}
          onPointerLeave={(e) => e.currentTarget.closest("section")?.removeAttribute("data-valve-hover")}
        >
          <rect x="340" y="146" width="120" height="256" rx="24" fill="transparent" />
        </g>
      </svg>
    </div>
  );
}
