"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/*
 * Interactive water surface.
 *
 * A small height-field wave simulation runs on the CPU (≈200×120 cells, trivial
 * cost). Its slope is uploaded each frame as a tiny texture, and a fragment
 * shader uses it to refract the hero photo and add glints. Pointer movement
 * drags ripples through the water; idle drops keep it alive on phones.
 *
 * Starts on idle (never competes with first paint), 30fps on coarse pointers,
 * pauses off-screen, and falls back to a CSS caustic layer without WebGL.
 */

const VERT = `
attribute vec2 a;
varying vec2 vUv;
void main() {
  vUv = a * 0.5 + 0.5;
  gl_Position = vec4(a, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uImg;
uniform sampler2D uWave;
uniform vec2 uScale;
uniform float uTime;
uniform float uFade;

void main() {
  vec2 g = texture2D(uWave, vUv).ra * 2.0 - 1.0;
  vec2 uv = (vUv - 0.5) * uScale + 0.5;

  // Slow ambient current so the photo breathes even when nobody touches it.
  float t = uTime * 0.25;
  uv += 0.0035 * vec2(sin(uv.y * 9.0 + t * 1.3), cos(uv.x * 7.0 - t));

  vec2 ruv = clamp(uv + g * 0.045, 0.001, 0.999);
  vec3 col = texture2D(uImg, ruv).rgb;

  // Glints on ripple crests facing the light, soft shadow on the back side.
  float facing = dot(g, normalize(vec2(-0.55, 0.85)));
  col += vec3(0.78, 0.94, 1.0) * smoothstep(0.08, 0.55, facing) * 0.42;
  col *= 1.0 - smoothstep(0.1, 0.7, -facing) * 0.18;

  gl_FragColor = vec4(col, uFade);
}
`;

type Props = {
  src: string;
  srcSmall?: string;
  className?: string;
  /** Element that receives pointer input (defaults to window within the canvas bounds). */
  interactive?: boolean;
};

export function WaterSurface({ src, srcSmall, className, interactive = true }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "live" | "fallback">("idle");

  function start(image: HTMLImageElement): (() => void) | undefined {
    const el = canvas.current;
    if (!el) return;
    const gl = el.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: "high-performance" });
    if (!gl) {
      setState("fallback");
      return;
    }

    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (process.env.NODE_ENV !== "production" && !gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("WaterSurface shader:", gl.getShaderInfoLog(s));
      }
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setState("fallback");
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const makeTex = (unit: number) => {
      const t = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };

    const imgTex = makeTex(0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    const waveTex = makeTex(1);

    gl.uniform1i(gl.getUniformLocation(prog, "uImg"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "uWave"), 1);
    const uScale = gl.getUniformLocation(prog, "uScale");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uFade = gl.getUniformLocation(prog, "uFade");

    const coarse = window.matchMedia("(pointer: coarse)").matches;

    // ── simulation grid ──
    let W = 0;
    let H = 0;
    let cur = new Float32Array(0);
    let prev = new Float32Array(0);
    let slope = new Uint8Array(0);

    const resize = () => {
      if (!el.clientWidth || !el.clientHeight) return;
      const dpr = Math.min(window.devicePixelRatio, 1.5) * (coarse ? 0.6 : 0.85);
      const cw = Math.max(1, Math.floor(el.clientWidth * dpr));
      const ch = Math.max(1, Math.floor(el.clientHeight * dpr));
      el.width = cw;
      el.height = ch;
      gl.viewport(0, 0, cw, ch);
      const canvasAspect = el.clientWidth / Math.max(1, el.clientHeight);
      const imgAspect = image.width / image.height;
      if (canvasAspect < imgAspect) gl.uniform2f(uScale, canvasAspect / imgAspect, 1);
      else gl.uniform2f(uScale, 1, imgAspect / canvasAspect);

      const nW = coarse ? 120 : 200;
      const nH = Math.max(40, Math.round(nW / canvasAspect));
      if (nW !== W || nH !== H) {
        W = nW;
        H = nH;
        cur = new Float32Array(W * H);
        prev = new Float32Array(W * H);
        slope = new Uint8Array(W * H * 2);
      }
    };
    resize();
    if (!W) {
      W = coarse ? 120 : 200;
      H = Math.round(W * 0.6);
      cur = new Float32Array(W * H);
      prev = new Float32Array(W * H);
      slope = new Uint8Array(W * H * 2);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const drop = (gx: number, gy: number, radius: number, strength: number) => {
      const r2 = radius * radius;
      const x0 = Math.max(1, Math.floor(gx - radius));
      const x1 = Math.min(W - 2, Math.ceil(gx + radius));
      const y0 = Math.max(1, Math.floor(gy - radius));
      const y1 = Math.min(H - 2, Math.ceil(gy + radius));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const d2 = (x - gx) ** 2 + (y - gy) ** 2;
          if (d2 < r2) cur[y * W + x] += strength * Math.cos((Math.sqrt(d2) / radius) * Math.PI * 0.5);
        }
      }
    };

    const step = () => {
      const damp = 0.984;
      for (let y = 1; y < H - 1; y++) {
        const row = y * W;
        for (let x = 1; x < W - 1; x++) {
          const i = row + x;
          const v = (cur[i - 1] + cur[i + 1] + cur[i - W] + cur[i + W]) * 0.5 - prev[i];
          prev[i] = v * damp;
        }
      }
      const t = prev;
      prev = cur;
      cur = t;
      // Slope → 2 bytes per cell (luminance = dx, alpha = dy).
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          const l = cur[x > 0 ? i - 1 : i];
          const r = cur[x < W - 1 ? i + 1 : i];
          const d = cur[y > 0 ? i - W : i];
          const u = cur[y < H - 1 ? i + W : i];
          const dx = Math.max(-1, Math.min(1, (r - l) * 1.6));
          const dy = Math.max(-1, Math.min(1, (u - d) * 1.6));
          slope[i * 2] = (dx * 0.5 + 0.5) * 255;
          slope[i * 2 + 1] = (dy * 0.5 + 0.5) * 255;
        }
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, waveTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE_ALPHA, W, H, 0, gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, slope);
    };

    // ── input ──
    const last = { x: -1, y: -1 };
    const toGrid = (clientX: number, clientY: number) => {
      const r = el.getBoundingClientRect();
      if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return null;
      return { gx: ((clientX - r.left) / r.width) * W, gy: (1 - (clientY - r.top) / r.height) * H };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const p = toGrid(e.clientX, e.clientY);
      if (!p) {
        last.x = -1;
        return;
      }
      if (last.x >= 0) {
        const dist = Math.hypot(p.gx - last.x, p.gy - last.y);
        const n = Math.min(6, Math.ceil(dist / 2));
        for (let k = 1; k <= n; k++) {
          const f = k / n;
          drop(last.x + (p.gx - last.x) * f, last.y + (p.gy - last.y) * f, 2.6, Math.min(0.9, 0.18 + dist * 0.05));
        }
      }
      last.x = p.gx;
      last.y = p.gy;
    };
    const onDown = (e: PointerEvent) => {
      const p = toGrid(e.clientX, e.clientY);
      if (p) drop(p.gx, p.gy, coarse ? 5 : 4, 3.2);
    };
    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
    }

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const t0 = performance.now();
    let raf = 0;
    let lastFrame = 0;
    let nextDrop = 600;
    const minDelta = coarse ? 1000 / 30 : 1000 / 62;
    setState("live");

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || now - lastFrame < minDelta) return;
      lastFrame = now;
      const t = now - t0;
      if (t > nextDrop) {
        // Idle raindrops keep the surface alive.
        drop(Math.random() * W, H * (0.25 + Math.random() * 0.7), 2.4 + Math.random() * 2, 1.2 + Math.random() * 1.4);
        nextDrop = t + 700 + Math.random() * 1400;
      }
      step();
      if (coarse) step(); // keep wave speed consistent at 30fps
      gl.uniform1f(uTime, t / 1000);
      gl.uniform1f(uFade, Math.min(1, t / 900));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      // Free GPU resources but keep the context (StrictMode remounts reuse it).
      gl.deleteTexture(imgTex);
      gl.deleteTexture(waveTex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- media query is client-only
      setState("fallback");
      return;
    }
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const ric: (cb: () => void, o?: { timeout: number }) => number =
      window.requestIdleCallback?.bind(window) ?? ((cb: () => void) => window.setTimeout(cb, 400));
    const cic: (h: number) => void = window.cancelIdleCallback?.bind(window) ?? window.clearTimeout;
    const boot = () => {
      if (cancelled) return;
      const img = new Image();
      img.decoding = "async";
      img.src = window.innerWidth < 768 && srcSmall ? srcSmall : src;
      img.onload = () => {
        if (!cancelled) cleanup = start(img);
      };
      img.onerror = () => setState("fallback");
    };
    let handle = 0;
    // Phones: the static photo is already on screen, so wake the water on the first
    // touch/scroll (or after 5 s) to keep the main thread free during load.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const wake = () => {
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("scroll", wake);
      window.clearTimeout(timer);
      if (!handle) handle = ric(boot, { timeout: 2500 });
    };
    const timer = coarse ? window.setTimeout(wake, 5000) : 0;
    if (coarse) {
      window.addEventListener("pointerdown", wake, { passive: true, once: true });
      window.addEventListener("scroll", wake, { passive: true, once: true });
    } else {
      handle = ric(boot, { timeout: 2500 });
    }
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("scroll", wake);
      if (handle) cic(handle);
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, srcSmall]);

  return (
    <div aria-hidden className={clsx("absolute inset-0 overflow-hidden", className)}>
      {state === "fallback" ? (
        <div className="caustic-fallback absolute inset-0" />
      ) : (
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
