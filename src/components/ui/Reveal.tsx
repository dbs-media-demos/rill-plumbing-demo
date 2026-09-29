"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import clsx from "clsx";
import type { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// SplitText is only fetched when the first split headline scrolls near the viewport.
let splitTextPromise: Promise<typeof SplitText> | null = null;
const loadSplitText = () =>
  (splitTextPromise ??= import("gsap/SplitText").then((m) => {
    gsap.registerPlugin(m.SplitText);
    return m.SplitText;
  }));

/*
 * Scroll-driven reveals. Content is always visible in the HTML; `immediate`
 * variants (top of the page) animate with pure CSS so they paint instantly.
 * Everything else is hidden by JS (opacity only) while below the fold, then
 * animated in as it arrives.
 */

const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
const delayStyle = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

type SplitProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
  stagger?: number;
  id?: string;
};

/** Headline that rises line by line out of a mask as it scrolls into view. */
export function SplitReveal({ children, as: Tag = "h2", className, delay = 0, immediate, stagger = 0.09, id }: SplitProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || immediate || prefersReducedMotion() || !belowFold(el)) return;
      gsap.set(el, { opacity: 0 });
      let split: SplitText | null = null;
      let dead = false;
      const io = new IntersectionObserver(
        async ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          const Split = await loadSplitText();
          if (dead) return;
          split = Split.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { opacity: 1 });
              return gsap.from(self.lines, { yPercent: 118, rotate: 2, duration: 1.25, stagger, delay, ease: "expo.out" });
            },
          });
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
      // Warm the chunk shortly after load so the first reveal isn't delayed.
      const warm = window.setTimeout(loadSplitText, 2500);
      return () => {
        dead = true;
        window.clearTimeout(warm);
        io.disconnect();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx(immediate && "anim-heading", className)} style={immediate ? delayStyle(delay) : undefined}>
      {children}
    </Tag>
  );
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  immediate?: boolean;
  id?: string;
};

/** Fade + rise when scrolled into view. `stagger` animates direct children. */
export function Reveal({ children, as: Tag = "div", className, delay = 0, y = 40, stagger, immediate, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || immediate || prefersReducedMotion() || !belowFold(el)) return;
      const targets = stagger ? Array.from(el.children) : [el];
      gsap.set(targets, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () =>
          gsap.to(targets, { opacity: 1, y: 0, duration: 1.2, delay, stagger: stagger ?? 0, ease: "expo.out", clearProps: "transform" }),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx(immediate && "anim-fade", className)} style={immediate ? delayStyle(delay) : undefined}>
      {children}
    </Tag>
  );
}

/** Paragraph whose words brighten one by one as you scroll through it. */
export function ScrubWords({ text, className, as: Tag = "p", start = 0.62 }: { text: string; className?: string; as?: ElementType; start?: number }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const words = el.querySelectorAll<HTMLElement>("[data-w]");
      gsap.fromTo(
        words,
        // Never below ~0.6 so resting words keep 3:1+ contrast (large text).
        { opacity: Math.max(start, 0.62) },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: 0.6 } },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w className="inline">
          {w}{" "}
        </span>
      ))}
    </Tag>
  );
}

/** Image frame that unmasks on enter and drifts with scroll. */
export function Parallax({
  children,
  className,
  amount = 12,
  reveal = true,
  style,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  reveal?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.firstElementChild as HTMLElement | null;
      if (!el || !inner || prefersReducedMotion()) return;
      gsap.set(inner, { scale: 1 + amount / 100 });
      gsap.fromTo(
        inner,
        { yPercent: -amount / 2 },
        { yPercent: amount / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
      if (reveal && belowFold(el)) {
        gsap.fromTo(
          el,
          { clipPath: "inset(14% 10% 14% 10% round 48px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            clearProps: "clipPath",
          },
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)} style={style}>
      {children}
    </div>
  );
}

/** Animated number that counts up when it scrolls into view. */
export function Counter({ value, decimals = 0, suffix = "", className }: { value: number; decimals?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || !belowFold(el)) return;
      const obj = { n: 0 };
      el.textContent = format(0) + suffix;
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            n: value,
            duration: 2.2,
            ease: "expo.out",
            onUpdate: () => {
              el.textContent = format(obj.n) + suffix;
            },
          }),
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {format(value) + suffix}
    </span>
  );
}
