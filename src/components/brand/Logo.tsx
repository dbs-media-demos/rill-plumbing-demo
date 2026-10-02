"use client";

import clsx from "clsx";
import { useBiz } from "@/components/preview/BizContext";

/**
 * "rill" wordmark: the two l's are a single pipe that bends into a P-trap,
 * and the dot on the i is a water droplet.
 */
export function Wordmark({ className, drop = "var(--color-bonnet)" }: { className?: string; drop?: string }) {
  return (
    <svg viewBox="0 0 104 80" className={clsx("h-auto", className)} aria-hidden fill="none">
      <g stroke="currentColor" strokeWidth="10.5" strokeLinecap="round" strokeLinejoin="round">
        {/* r */}
        <path d="M8 70V44c0-8 6-13.5 14-13.5h6" />
        {/* i */}
        <path d="M43 36v34" />
        {/* ll as one trap */}
        <path d="M63 8v48a10.5 10.5 0 0 0 21 0V8" />
      </g>
      {/* droplet dot */}
      <path d="M43 3.5s-7.6 9.4-7.6 14a7.6 7.6 0 0 0 15.2 0c0-4.6-7.6-14-7.6-14Z" fill={drop} />
    </svg>
  );
}

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="16" fill="var(--color-bonnet)" />
      <path d="M21 30v9a11 11 0 0 0 22 0v-9" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <path d="M32 6s-7.5 9.6-7.5 14.2a7.5 7.5 0 0 0 15 0C39.5 15.6 32 6 32 6Z" fill="var(--color-sunny)" />
    </svg>
  );
}

/** Full lockup: wordmark + small "plumbing co." label. */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const biz = useBiz();
  if (biz.preview) {
    // A real business: its name in the display face, with the droplet mark
    return (
      <span className={clsx("inline-flex items-center gap-2.5", tone === "light" ? "text-white" : "text-abyss", className)}>
        <Mark className="size-9 shrink-0" />
        <span className="flex min-w-0 flex-col leading-none">
          <span className={clsx("block max-w-[13rem] truncate font-display font-semibold tracking-tight sm:max-w-[18rem]", biz.shortName.length > 16 ? "text-[1.05rem]" : "text-[1.35rem]")}>
            {biz.shortName}
          </span>
          <span className="mt-1 font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] opacity-80">{biz.lang === "sr" ? "Vodoinstalater" : "Plumbing"}</span>
        </span>
      </span>
    );
  }
  return (
    <span className={clsx("inline-flex items-end gap-2", tone === "light" ? "text-white" : "text-abyss", className)}>
      <Wordmark className="w-[3.1rem]" drop={tone === "light" ? "var(--color-sunny)" : "var(--color-bonnet)"} />
      <span className="mb-[0.1rem] font-display text-[0.7rem] font-semibold uppercase leading-none tracking-[0.18em] opacity-80">
        Plumbing
        <br />
        Co.
      </span>
    </span>
  );
}
