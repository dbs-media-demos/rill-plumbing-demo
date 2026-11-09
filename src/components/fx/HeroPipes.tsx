"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { after3DGate } from "@/lib/three-gate";
import { isPhone } from "@/lib/phone";
import type { HeroPipes as Scene } from "./pipes3d/heroScene";

type Still = { src: string; srcSet?: string; sizes?: string };

/**
 * The hero's 3D copper pipework (pipes3d/heroScene), fading in over the still rendered from the
 * same scene. Desktop only: after load, on a big screen with a mouse, no reduced motion or
 * Save-Data, three.js is fetched inside lib/three-gate's callback; everyone else keeps the still.
 * Click the valve to shut the water off; the cursor leans the camera; the scroll follows the water.
 *
 * Phones: zero bytes of three.js. The plumber photo is the first paint; once the page has loaded,
 * it crossfades once to the phone still of the same pipework (or not at all if that takes > 4 s).
 */
/**
 * The scene's state is mirrored on the hero <section> for CSS: `data-live` once the canvas shows,
 * `data-valve="closed"` while the water is off (the trust row's hint reads them).
 */
export function HeroPipes({ phoneStill, labels }: { phoneStill: Still; labels: { open: string; closed: string } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const [phase, setPhase] = useState<"none" | "loading" | "shown">("none");

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest("section");
    if (!canvas || !section) return;
    let scene: Scene | null = null;
    let disposed = false;
    const off: (() => void)[] = [];

    const cancel = after3DGate(async () => {
      try {
        const { createHeroPipes } = await import("./pipes3d/heroScene");
        if (disposed) return;
        scene = await createHeroPipes(canvas);
      } catch {
        return; // no WebGL after all: the still stays
      }
      if (disposed) {
        scene.dispose();
        return;
      }
      const s = scene;
      s.onReady(() => {
        setLive(true);
        section.dataset.live = "";
      });
      s.onValve((o) => (section.dataset.valve = o ? "open" : "closed"));

      const ro = new ResizeObserver(() => s.resize());
      ro.observe(canvas);
      const io = new IntersectionObserver(([e]) => s.setVisible(e.isIntersecting));
      io.observe(section);

      const onScroll = () => {
        const r = section.getBoundingClientRect();
        s.scroll(Math.max(0, Math.min(1, -r.top / Math.max(1, r.height))));
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      // Is the pointer on the valve (and not on the text or a button)?
      const overValve = (e: PointerEvent | MouseEvent) => {
        const t = e.target as Element | null;
        if (t?.closest("a, button, input, label, p, h1, li")) return false;
        const r = canvas.getBoundingClientRect();
        return s.hitValve(e.clientX - r.left, e.clientY - r.top);
      };
      let hovering = false;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = section.getBoundingClientRect();
        s.pointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
        const h = overValve(e);
        if (h !== hovering) {
          hovering = h;
          s.setHover(h);
          section.style.cursor = h ? "pointer" : "";
        }
        if (h) section.dataset.cursor = section.dataset.valve === "closed" ? labels.closed : labels.open;
        else delete section.dataset.cursor;
      };
      const onLeave = () => {
        s.pointer(0, 0);
        hovering = false;
        s.setHover(false);
        section.style.cursor = "";
        delete section.dataset.cursor;
      };
      const onClick = (e: MouseEvent) => {
        if (!overValve(e)) return;
        section.dataset.cursor = s.toggle() ? labels.open : labels.closed;
        // the cursor ring reads its label on pointermove: give it one so "Open it" shows straight away
        e.target?.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: e.clientX, clientY: e.clientY, pointerType: "mouse" }));
      };
      section.addEventListener("pointermove", onMove, { passive: true });
      section.addEventListener("pointerleave", onLeave);
      section.addEventListener("click", onClick);
      off.push(() => {
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
        section.removeEventListener("click", onClick);
        section.style.cursor = "";
        delete section.dataset.cursor;
        delete section.dataset.live;
        delete section.dataset.valve;
      });
    });

    return () => {
      disposed = true;
      cancel();
      off.forEach((f) => f());
      scene?.dispose();
    };
  }, [labels]);

  // Phones: one crossfade from the photo to the still of the pipework, done within 5 s of load.
  useEffect(() => {
    if (!isPhone() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    const start = () => {
      t = window.setTimeout(() => setPhase("loading"), 500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(t);
    };
  }, []);
  useEffect(() => {
    if (phase !== "loading") return;
    const giveUp = window.setTimeout(() => setPhase("none"), 3500);
    return () => window.clearTimeout(giveUp);
  }, [phase]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={clsx("absolute inset-0 -z-20 h-full w-full transition-opacity duration-700 phone:hidden", live ? "opacity-100" : "opacity-0")}
      />
      {phase !== "none" && (
        // eslint-disable-next-line @next/next/no-img-element -- srcSet comes from getImageProps on the server
        <img
          src={phoneStill.src}
          srcSet={phoneStill.srcSet}
          sizes={phoneStill.sizes}
          alt=""
          aria-hidden
          decoding="async"
          onLoad={() => setPhase((p) => (p === "loading" ? "shown" : p))}
          className={clsx(
            "absolute inset-x-0 top-0 -z-20 hidden h-[66%] w-full object-cover object-[50%_40%] transition-opacity duration-[900ms] phone:block",
            phase === "shown" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </>
  );
}
