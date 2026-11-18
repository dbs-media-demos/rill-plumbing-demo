"use client";

/**
 * The only door to three.js. Nothing imports a 3D module statically: callers run `after3DGate`
 * in an effect, and the `import()` happens inside its callback, so phones, tablets, reduced
 * motion and Save-Data never download a byte of it.
 *
 * It also keeps the 3D from ever stuttering: the scenes start one after another (`order`), each
 * when the browser is idle, and a scene that can't hold its frame rate (`watchFrames`) gives up
 * for this page load (`demote3D`), so the next scene starts as a still too. Two slow page loads
 * keep the stills for the rest of the visit. One slow start (the GPU's first draw on a refresh)
 * used to keep them for the whole tab (the old "rill:3d-off" flag, no longer read): on 18 Nov
 * every refresh got the still.
 */
export const DESKTOP_3D_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

const DEMOTED = "rill:3d-off";
const SLOW_KEY = "rill:3d-slow";
const SLOW_LIMIT = 2;

// This page load ran slow (counted once)
let slowHere = false;

export function is3DDemoted() {
  if (slowHere) return true;
  try {
    return Number(sessionStorage.getItem(SLOW_KEY) || 0) >= SLOW_LIMIT;
  } catch {
    return false;
  }
}

/** This computer can't keep the 3D smooth: stills for this page load (two slow loads: the rest of the visit), starting with any scene that's live now. */
export function demote3D() {
  if (!slowHere) {
    slowHere = true;
    try {
      sessionStorage.setItem(SLOW_KEY, String(Number(sessionStorage.getItem(SLOW_KEY) || 0) + 1));
    } catch {}
  }
  window.dispatchEvent(new Event(DEMOTED));
}

/** A live scene steps back to its still when any scene gives up. Returns an unsubscribe. */
export function onDemoted(cb: () => void) {
  window.addEventListener(DEMOTED, cb);
  return () => window.removeEventListener(DEMOTED, cb);
}

export function can3D() {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia(DESKTOP_3D_QUERY).matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  if (is3DDemoted()) return false;
  return typeof WebGL2RenderingContext !== "undefined";
}

// The scenes take turns: the next one starts warming up only once the one before it is showing
// and has passed its frame check (or given up), and then only when the browser is idle.
type Job = { order: number; run: () => Promise<void> | void; cancelled: boolean };
const queue: Job[] = [];
let busy = false;

const idle = (fn: () => void) =>
  typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout: 1500 }) : window.setTimeout(fn, 200);

function pump() {
  if (busy) return;
  queue.sort((a, b) => a.order - b.order);
  const job = queue.shift();
  if (!job) return;
  busy = true;
  idle(async () => {
    try {
      // a scene that never settles (scrolled away before it showed) doesn't hold up the next one
      if (!job.cancelled && can3D()) await Promise.race([job.run(), new Promise((r) => window.setTimeout(r, 6000))]);
    } catch {}
    busy = false;
    pump();
  });
}

/**
 * After the page has loaded (and the browser has had a breath), call `yes` on a big screen with a
 * mouse, otherwise `no`. `yes` may return a promise: the next scene in line (higher `order`) waits
 * for it, so resolve it once your scene is settled (shown and through `watchFrames`, or given up).
 * Returns a cancel function.
 */
export function after3DGate(yes: () => Promise<void> | void, no?: () => void, order = 0) {
  const job: Job = { order, run: yes, cancelled: false };
  const onLoad = () => {
    if (job.cancelled) return;
    if (!can3D()) return no?.();
    queue.push(job);
    pump();
  };
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad, { once: true });
  return () => {
    job.cancelled = true;
    window.removeEventListener("load", onLoad);
    const i = queue.indexOf(job);
    if (i >= 0) queue.splice(i, 1);
  };
}

/**
 * Watches a scene's first 2 seconds of running frames. Call `frame(now)` from the render loop and
 * `pause()` whenever the loop stops (off screen, tab hidden), so the gap doesn't count. The first
 * few frames are warm-up and don't count either: they pay one-off costs (the GPU's first real draw
 * took 371 ms on a refresh of a PC that then ran 112 fps, 18 Nov). Under ~45 fps on average, or a
 * 3rd frame over 100 ms (or one over 400 ms) after warm-up, it calls `fail` (once): a hitch or two
 * (a font, an image decode) isn't a slow computer. After 2 good seconds it calls `pass`.
 */
export function watchFrames({ fail, pass }: { fail: (why: string) => void; pass: () => void }) {
  const WARM = 5;
  const WINDOW = 2000;
  let last = 0;
  let seen = 0;
  let hitches = 0;
  let time = 0;
  let frames = 0;
  let done = false;
  return {
    get done() {
      return done;
    },
    frame(now: number) {
      if (done) return;
      const dt = last ? now - last : 0;
      last = now;
      if (!dt || ++seen <= WARM) return;
      if (dt > 100 && (++hitches >= 3 || dt > 400)) {
        done = true;
        return fail(`a ${Math.round(dt)} ms frame (hitch ${hitches})`);
      }
      time += dt;
      frames++;
      if (time < WINDOW) return;
      done = true;
      const fps = (frames * 1000) / time;
      if (fps < 45) fail(`${fps.toFixed(1)} fps`);
      else pass();
    },
    pause() {
      last = 0;
    },
  };
}

/** How the scenes started, kept on `window.__3d` (and logged with ?perf in the URL) for checking the build. */
export function perfLog(msg: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & { __3d?: string[] };
  (w.__3d ??= []).push(`${Math.round(performance.now())} ${msg}`);
  if (/[?&]perf\b/.test(location.search)) console.info(`[3d] ${msg}`);
}
