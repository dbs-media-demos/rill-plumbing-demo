"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import type GsapType from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { isPhone } from "./phone";

// GSAP is its own chunk. Desktop fetches it straight away; phones never do, unless a visitor drives a
// tool that needs it (the ETA map's van). Both names below are filled in once it has loaded, so use them
// inside useGSAP, whenGsap or after `await loadGsap()`.
export let gsap: typeof GsapType;
export let ScrollTrigger: typeof ScrollTriggerType;

let loading: Promise<void> | null = null;

export const loadGsap = () =>
  (loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    gsap = g.default;
    ScrollTrigger = st.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "expo.out", duration: 1.1 });
  }));

// MotionPath, SplitText and Flip are loaded by the few components that need them.
export const loadMotionPath = () =>
  loadGsap()
    .then(() => import("gsap/MotionPathPlugin"))
    .then((m) => {
      gsap.registerPlugin(m.MotionPathPlugin);
    });

/** Run `fn` once GSAP is here (desktop only: on phones nothing below should start). */
export function whenGsap(fn: () => void) {
  if (isPhone()) return;
  if (gsap) fn();
  else loadGsap().then(fn);
}

if (typeof window !== "undefined" && !isPhone()) loadGsap();

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

type Options = {
  scope?: RefObject<Element | null>;
  dependencies?: unknown[];
  /** Anything else the callback needs loaded first (a plugin). */
  before?: () => Promise<unknown>;
};

/**
 * Same contract as @gsap/react's useGSAP (one context per component, reverted on unmount, the callback
 * re-runs when dependencies change without reverting), but it waits for the GSAP chunk, and on phones
 * it does nothing: the animations it starts are the desktop's.
 */
export function useGSAP(callback: () => void | (() => void), { scope, dependencies = [], before }: Options = {}) {
  const context = useRef<gsap.Context | null>(null);
  const alive = useRef(false);

  useLayoutEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      context.current?.revert();
      context.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (isPhone()) return;
    const run = () => {
      if (!alive.current) return;
      context.current ??= gsap.context(() => {}, scope as never);
      context.current.add(callback as never, scope as never);
    };
    if (gsap && !before) run();
    else Promise.all([loadGsap(), before?.()]).then(run);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
