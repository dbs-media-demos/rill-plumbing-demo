"use client";

import { useEffect, useId, useState } from "react";
import clsx from "clsx";
import { isPhone } from "@/lib/phone";
import { Plus } from "./Icons";

type Item = { q: string; a: string };

/** Accessible accordion that expands with a grid-rows transition (no layout jank). */
export function Accordion({ items, initial = 0, tone = "light" }: { items: Item[]; initial?: number | null; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState<number | null>(initial);
  const base = useId();

  // Phones start with every answer closed: CSS until hydration, state after, so nothing moves.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- media query is client-only
    setSettled(true);
    if (isPhone()) setOpen(null);
  }, []);
  return (
    <ul className={clsx("border-t", tone === "dark" ? "border-white/15" : "border-abyss/12")}>
      {items.map((it, i) => {
        const on = open === i;
        const id = `${base}-${i}`;
        return (
          <li key={it.q} className={clsx("border-b", tone === "dark" ? "border-white/15" : "border-abyss/12")}>
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={id}
                onClick={() => setOpen(on ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6 phone:gap-3 phone:!py-3"
              >
                <span className="font-display text-xl font-semibold tracking-tight sm:text-[1.6rem] phone:!text-[1.05rem] phone:leading-[1.15]">{it.q}</span>
                <span
                  className={clsx(
                    "grid size-10 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)] phone:size-8",
                    on ? "rotate-45 bg-bonnet text-white" : tone === "dark" ? "bg-white/10" : "bg-abyss/5",
                    !settled && "phone:!rotate-0 phone:!bg-abyss/5 phone:!text-current",
                  )}
                >
                  <Plus size={18} />
                </span>
              </button>
            </h3>
            <div
              id={id}
              role="region"
              className={clsx(
                "grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-out-expo)]",
                on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                !settled && "phone:!grid-rows-[0fr] phone:!opacity-0",
              )}
            >
              <div className="overflow-hidden" inert={!on}>
                <p className={clsx("max-w-3xl pb-6 text-lg leading-relaxed phone:pb-3.5 phone:text-[0.95rem] phone:leading-snug", tone === "dark" ? "text-white/75" : "text-slate")}>{it.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
