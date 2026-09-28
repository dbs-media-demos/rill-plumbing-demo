"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Plus } from "./Icons";

type Item = { q: string; a: string };

/** Accessible accordion that expands with a grid-rows transition (no layout jank). */
export function Accordion({ items, initial = 0, tone = "light" }: { items: Item[]; initial?: number | null; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState<number | null>(initial);
  const base = useId();
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
                className="group flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6"
              >
                <span className="font-display text-xl font-semibold tracking-tight sm:text-[1.6rem]">{it.q}</span>
                <span
                  className={clsx(
                    "grid size-10 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)]",
                    on ? "rotate-45 bg-bonnet text-white" : tone === "dark" ? "bg-white/10" : "bg-abyss/5",
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
              )}
            >
              <div className="overflow-hidden" inert={!on}>
                <p className={clsx("max-w-3xl pb-6 text-lg leading-relaxed", tone === "dark" ? "text-white/75" : "text-slate")}>{it.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
