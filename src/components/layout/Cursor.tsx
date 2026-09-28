"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop-only trailing ring. Grows over interactive elements, shows a label
 * for [data-cursor="…"] targets, and drops a water ripple where you click.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ring.current;
    const txt = label.current;
    if (!el || !txt) return;

    const pos = { x: -100, y: -100, tx: -100, ty: -100, s: 1, ts: 1 };
    let raf = 0;
    let visible = false;

    const loop = () => {
      pos.x += (pos.tx - pos.x) * 0.2;
      pos.y += (pos.ty - pos.y) * 0.2;
      pos.s += (pos.ts - pos.s) * 0.18;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${pos.s})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
      const t = e.target as Element | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      const interactive = t?.closest("a, button, [role='button'], input, select, textarea, label");
      if (labelled) {
        txt.textContent = labelled.dataset.cursor ?? "";
        el.dataset.mode = "label";
        pos.ts = 1;
      } else if (interactive) {
        el.dataset.mode = "hover";
        pos.ts = 1;
      } else {
        el.dataset.mode = "";
        pos.ts = 1;
      }
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = document.createElement("span");
      r.className = "ripple-ring";
      r.style.position = "fixed";
      r.style.left = `${e.clientX}px`;
      r.style.top = `${e.clientY}px`;
      r.style.zIndex = "90";
      r.style.color = "var(--color-river-2)";
      r.style.setProperty("--size", "120px");
      document.body.appendChild(r);
      r.addEventListener("animationend", () => r.remove());
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      data-mode=""
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden opacity-0 transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <div
        className="grid size-9 place-items-center rounded-full border border-river-2/70 text-[0] transition-[width,height,background-color,border-color,font-size] duration-500 ease-[var(--ease-out-expo)]
          [[data-mode=hover]_&]:size-14 [[data-mode=hover]_&]:border-bonnet/60 [[data-mode=hover]_&]:bg-bonnet/10
          [[data-mode=label]_&]:size-24 [[data-mode=label]_&]:border-transparent [[data-mode=label]_&]:bg-bonnet [[data-mode=label]_&]:text-[0.8rem]"
      >
        <span ref={label} className="font-semibold uppercase tracking-wider text-white" />
      </div>
    </div>
  );
}
