"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { gsap, ScrollTrigger, loadGsap, whenGsap, prefersReducedMotion, isTouch } from "@/lib/gsap";
import { isPhone } from "@/lib/phone";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling on desktop, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Phones keep native scrolling and never download Lenis.
    if (prefersReducedMotion() || isTouch() || isPhone()) return;
    let lenis: Lenis | null = null;
    let cancelled = false;
    const tick = (time: number) => lenis?.raf(time * 1000);
    Promise.all([import("lenis"), loadGsap()]).then(([{ default: L }]) => {
      if (cancelled) return;
      lenis = new L({ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -90 } });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });
    return () => {
      cancelled = true;
      gsap?.ticker.remove(tick);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  useEffect(() => {
    window.__lenis?.resize();
    const id = window.setTimeout(() => whenGsap(() => ScrollTrigger.refresh()), 400);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
