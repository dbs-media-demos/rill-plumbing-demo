"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { isPhone } from "@/lib/phone";

type Still = { src: string; srcSet?: string; sizes?: string };

/**
 * Phones only, on both homepages (/ and /v2): the plumber photo is the first paint; once the page
 * has loaded it crossfades once to the phone still of the copper pipework, done within 5 s of load
 * (or not at all if the picture takes longer). Skipped with reduced motion.
 */
export function HeroPhoneFade({ still }: { still: Still }) {
  const [phase, setPhase] = useState<"none" | "loading" | "shown">("none");

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

  if (phase === "none") return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- srcSet comes from getImageProps on the server
    <img
      src={still.src}
      srcSet={still.srcSet}
      sizes={still.sizes}
      alt=""
      aria-hidden
      decoding="async"
      onLoad={() => setPhase((p) => (p === "loading" ? "shown" : p))}
      className={clsx(
        "absolute inset-x-0 top-0 -z-20 hidden h-[66%] w-full object-cover object-[50%_40%] transition-opacity duration-[900ms] phone:block",
        phase === "shown" ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
