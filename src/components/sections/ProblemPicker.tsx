"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import clsx from "clsx";
import { problems, urgencyCopy } from "@/content/problems";
import { serviceBySlug } from "@/content/services";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Phone } from "@/components/ui/Icons";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useBiz } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";
import { ProblemIcon } from "./ProblemIcons";

export function ProblemPicker({ initial = "burst", compact }: { initial?: string; compact?: boolean }) {
  const telHref = telOf(useBiz()) ?? "";
  const [active, setActive] = useState(initial);
  const panel = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const p = problems.find((x) => x.id === active) ?? problems[0];
  const urgent = p.urgency === 3;
  const svc = serviceBySlug(p.service);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el.querySelectorAll("[data-anim]"),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "expo.out", clearProps: "transform" },
      );
      gsap.fromTo(el.querySelectorAll("[data-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.08, ease: "expo.out" });
    },
    { dependencies: [active], scope: panel },
  );

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = problems.findIndex((x) => x.id === active);
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + problems.length) % problems.length;
    setActive(problems[next].id);
    tiles.current[next]?.focus();
  };

  return (
    <section id="problem" data-pipe aria-labelledby="problem-heading" className="section-y relative bg-porcelain">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-river">Tell us what&apos;s happening</p>
            <SplitReveal as="h2" className="t-1 mt-4 font-display font-semibold" id="problem-heading">
              What&apos;s the <span className="accent font-normal text-bonnet">problem?</span>
            </SplitReveal>
          </div>
          {!compact && (
            <p className="max-w-sm text-slate">
              Pick the closest match. We&apos;ll tell you how urgent it is, what to do right now, and what it usually costs.
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          <Reveal stagger={0.05} y={24}>
            <div
              role="radiogroup"
              aria-label="Plumbing problem"
              onKeyDown={onKey}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
            >
              {problems.map((x, i) => {
                const on = x.id === active;
                return (
                  <button
                    key={x.id}
                    ref={(n) => {
                      tiles.current[i] = n;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(x.id)}
                    className={clsx(
                      "group relative flex aspect-square flex-col justify-between rounded-[1.6rem] p-4 text-left transition-[background-color,color,transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] sm:p-5",
                      on
                        ? "pi-live -translate-y-1 bg-abyss text-white shadow-[0_24px_40px_-20px_rgba(6,34,47,0.7)]"
                        : "bg-white text-abyss ring-1 ring-abyss/8 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(6,34,47,0.45)]",
                    )}
                  >
                    <span className={clsx("block", on ? "text-spray" : "text-river")}>
                      <ProblemIcon id={x.id} />
                    </span>
                    <span className="font-display text-lg font-semibold leading-tight tracking-tight sm:text-xl">{x.label}</span>
                    {x.urgency === 3 && (
                      <span className="absolute right-4 top-4 size-2.5 rounded-full bg-alert" aria-label="Emergency" />
                    )}
                  </button>
                );
              })}
              <Link
                href="/book"
                className="flex aspect-square flex-col justify-between rounded-[1.6rem] border border-dashed border-abyss/25 p-4 text-abyss transition-colors hover:border-bonnet hover:text-bonnet sm:p-5"
              >
                <span className="grid size-11 place-items-center rounded-full bg-abyss/5">
                  <ArrowRight size={20} />
                </span>
                <span className="font-display text-lg font-semibold leading-tight tracking-tight sm:text-xl">Something else</span>
              </Link>
            </div>
          </Reveal>

          <div
            ref={panel}
            aria-live="polite"
            className={clsx(
              "relative overflow-hidden rounded-[2rem] p-6 ring-1 transition-colors duration-700 sm:p-9",
              urgent ? "bg-[#fff4f2] ring-alert/25" : "bg-white ring-abyss/8",
            )}
          >
            <div data-anim className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5" aria-hidden>
                  {[1, 2, 3].map((n) => (
                    <span key={n} className="h-2 w-9 overflow-hidden rounded-full bg-abyss/10">
                      {n <= p.urgency && (
                        <span
                          data-bar
                          className={clsx("block h-full origin-left rounded-full", urgent ? "bg-alert" : p.urgency === 2 ? "bg-sunny" : "bg-river")}
                        />
                      )}
                    </span>
                  ))}
                </div>
                <span className={clsx("eyebrow", urgent ? "text-[#b4232a]" : "text-slate")}>
                  {urgencyCopy[p.urgency].label}
                </span>
              </div>
              <span className="rounded-full bg-abyss/5 px-3 py-1 text-sm font-medium">{urgencyCopy[p.urgency].tone}</span>
            </div>

            <p data-anim className={clsx("mt-6 font-display text-[1.65rem] font-semibold leading-[1.05] tracking-tight sm:text-4xl", urgent && "text-[#8f1d23]")}>
              {p.urgencyLabel}
            </p>
            <p data-anim className="mt-2 text-slate">
              {p.headline}
            </p>

            <div data-anim className="mt-7">
              <h3 className="eyebrow text-abyss">Do this now</h3>
              <ol className="mt-3 space-y-2.5">
                {p.now.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span
                      className={clsx(
                        "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                        urgent ? "bg-alert text-white" : "bg-abyss text-white",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[0.98rem] leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <dl data-anim className="mt-7 grid gap-4 border-t border-abyss/10 pt-6 sm:grid-cols-[1.4fr_1fr]">
              <div>
                <dt className="eyebrow text-slate">Likely fix</dt>
                <dd className="mt-1.5 leading-snug">{p.fix}</dd>
              </div>
              <div>
                <dt className="eyebrow text-slate">Typical price</dt>
                <dd className="mt-1 font-display text-3xl font-semibold tracking-tight">{p.price}</dd>
                <dd className="text-sm text-slate">Flat, quoted before work starts</dd>
              </div>
            </dl>

            <div data-anim className="mt-7 flex flex-wrap gap-3">
              <Button href={`/book?problem=${p.id}`} icon={<ArrowRight size={18} />}>
                Send a plumber
              </Button>
              {urgent ? (
                <Button href={telHref} variant="dark" icon={<Phone size={18} />}>
                  Call now
                </Button>
              ) : (
                svc && (
                  <Button href={`/services/${svc.slug}`} variant="outline">
                    About {svc.short.toLowerCase()}
                  </Button>
                )
              )}
            </div>
            {urgent && (
              <p data-anim className="mt-5 text-sm text-slate">
                Not sure where the valve is?{" "}
                <Link href="/emergency-tips" className="font-semibold text-abyss underline underline-offset-4">
                  Find your shut-off
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
