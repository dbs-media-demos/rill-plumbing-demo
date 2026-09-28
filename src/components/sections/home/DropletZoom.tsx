"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const lines = ["Shoe covers on.", "Price agreed.", "Water off.", "Then we fix it."];

/**
 * Pinned scroll scene: a droplet-shaped window over a plumber at work grows
 * until it becomes the whole screen, while the house rules land one by one.
 */
export function DropletZoom() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const stage = el.querySelector<HTMLElement>("[data-stage]");
      const win = el.querySelector<HTMLElement>("[data-window]");
      const img = el.querySelector<HTMLElement>("[data-img]");
      const intro = el.querySelectorAll<HTMLElement>("[data-intro]");
      const rules = el.querySelectorAll<HTMLElement>("[data-rule]");
      const shade = el.querySelector<HTMLElement>("[data-shade]");
      if (!stage || !win || !img) return;

      el.dataset.enhanced = "true";
      gsap.set(rules, { opacity: 0, yPercent: 60 });
      gsap.set(shade, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            stage.dataset.header = self.progress > 0.62 ? "dark" : "light";
          },
        },
      });
      const vmin = () => Math.min(window.innerWidth, window.innerHeight);
      const vmax = () => Math.max(window.innerWidth, window.innerHeight);
      stage.dataset.header = "light";
      // Hold the small drop under the intro line for a beat, then flood the screen.
      tl.fromTo(
        win,
        { "--m": () => `${vmin() * 0.42}px`, "--py": "86%" },
        { "--m": () => `${vmax() * 5.6}px`, "--py": "60%", duration: 0.85, ease: "power2.in" },
        0.15,
      )
        .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
        .to(intro, { opacity: 0, y: -40, duration: 0.2, stagger: 0.04 }, 0.24)
        .to(shade, { opacity: 1, duration: 0.2 }, 0.72);
      rules.forEach((r, i) => {
        tl.to(r, { opacity: 1, yPercent: 0, duration: 0.12, ease: "power3.out" }, 0.78 + i * 0.06);
      });
      tl.to({}, { duration: 0.12 });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="promise-heading"
      className="group relative bg-porcelain data-[enhanced=true]:h-[320vh]"
    >
      <div data-stage data-header="dark" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden group-data-[enhanced=true]:sticky group-data-[enhanced=true]:top-0 group-data-[enhanced=true]:h-[100svh]">
        {/* Intro copy that frames the drop */}
        <div className="pointer-events-none absolute inset-x-0 top-[14vh] z-10 hidden text-center group-data-[enhanced=true]:block">
          <p data-intro className="eyebrow text-river">
            The Rill way
          </p>
          <p data-intro className="t-2 mx-auto mt-4 max-w-4xl px-4 font-display font-semibold text-abyss">
            Every job starts <span className="accent font-normal text-bonnet">exactly</span> the same way.
          </p>
        </div>

        <div
          data-window
          className="absolute inset-0 [mask-image:url(/brand/drop-mask.svg)] [mask-position:50%_var(--py,60%)] [mask-repeat:no-repeat] [mask-size:auto_var(--m,560vmax)] [-webkit-mask-image:url(/brand/drop-mask.svg)] [-webkit-mask-position:50%_var(--py,60%)] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:auto_var(--m,560vmax)]"
          style={{ ["--m" as string]: "560vmax" }}
        >
          <div data-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/plumber-bathroom.jpg"
              alt="Rill plumber at work in a bright modern bathroom"
              fill
              sizes="100vw"
              quality={70}
              className="object-cover"
            />
          </div>
          <div data-shade className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,34,47,0.85)_0%,rgba(6,34,47,0.35)_60%,rgba(6,34,47,0.1)_100%)]" />
        </div>

        <div className="on-dark container-x relative z-10 py-24 text-white">
          <h2 id="promise-heading" className="sr-only">
            How every Rill job starts
          </h2>
          <ul className="font-display font-semibold">
            {lines.map((l, i) => (
              <li key={l} className="overflow-hidden">
                <span data-rule className={i === 3 ? "t-1 accent block font-normal text-spray" : "t-1 block"}>
                  {l}
                </span>
              </li>
            ))}
          </ul>
          <p data-rule className="mt-8 max-w-md text-lg text-white/85">
            Flat price before we touch a thing. Floors protected, mess cleaned, 1-year labor warranty on everything we do.
          </p>
        </div>
      </div>
    </section>
  );
}
