"use client";

import Link from "@/components/ui/Link";
import { useEffect, useId, useState } from "react";
import clsx from "clsx";
import { priceGroups, usd as usdFmt, type PriceItem } from "@/content/pricing";
import { useBiz } from "@/components/preview/BizContext";
import { isPhone } from "@/lib/phone";

/** Serbian previews price in dinars, at Serbian plumbing levels (~30 din per US dollar of the job), rounded to 500. */
const rsd = (n: number) => `${(Math.round((n * 30) / 500) * 500).toLocaleString("sr-RS")} din`;
import { Check, Clock, Plus } from "@/components/ui/Icons";

/** Upfront price menu: category chips + smoothly expanding rows. */
export function PriceMenu({ groups = priceGroups.map((g) => g.id), initialOpen }: { groups?: string[]; initialOpen?: string }) {
  const visible = priceGroups.filter((g) => groups.includes(g.id));
  const [tab, setTab] = useState(visible[0]?.id ?? "drains");
  const [open, setOpen] = useState<string | null>(initialOpen ?? visible[0]?.items[0]?.id ?? null);
  const group = visible.find((g) => g.id === tab) ?? visible[0];

  // Phones start with every row closed: CSS until hydration, state after, so nothing moves.
  const [settled, setSettled] = useState(!!initialOpen);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- media query is client-only
    setSettled(true);
    if (!initialOpen && isPhone()) setOpen(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-w-0">
      {visible.length > 1 && (
        <div role="tablist" aria-label="Price categories" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {visible.map((g) => {
            const on = g.id === tab;
            return (
              <button
                key={g.id}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls={`panel-${g.id}`}
                id={`tab-${g.id}`}
                onClick={() => {
                  setTab(g.id);
                  setOpen(g.items[0]?.id ?? null);
                }}
                className={clsx(
                  "min-h-11 shrink-0 rounded-full px-5 text-[0.95rem] font-semibold transition-colors duration-300",
                  on ? "bg-abyss text-white" : "bg-abyss/5 text-abyss hover:bg-abyss/10",
                )}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      )}

      <div role="tabpanel" id={`panel-${group.id}`} aria-labelledby={`tab-${group.id}`} className="mt-6 phone:mt-3">
        <ul className="border-t border-abyss/12">
          {group.items.map((item) => (
            <PriceRow key={item.id} item={item} open={open === item.id} closedOnPhone={!settled} onToggle={() => setOpen(open === item.id ? null : item.id)} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function PriceRow({ item, open, closedOnPhone, onToggle }: { item: PriceItem; open: boolean; closedOnPhone: boolean; onToggle: () => void }) {
  const usd = useBiz().lang === "sr" ? rsd : usdFmt;
  const id = useId();
  return (
    <li className="border-b border-abyss/12">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-5 text-left sm:gap-8 sm:py-6 phone:!gap-2.5 phone:!py-3"
        >
          <span>
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl phone:!text-[1.02rem] phone:leading-[1.1]">{item.name}</span>
              {item.popular && (
                <span className="rounded-full bg-sunny/40 px-2.5 py-0.5 text-xs font-semibold text-abyss">Most booked</span>
              )}
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-sm text-slate">
              <Clock size={15} /> {item.time}
            </span>
          </span>
          <span className="text-right">
            <span className="block text-xs font-medium uppercase tracking-wider text-slate">from</span>
            <span className="font-display text-2xl font-semibold tracking-tight text-river sm:text-3xl phone:!text-[1.2rem]">{usd(item.from)}</span>
          </span>
          <span
            className={clsx(
              "grid size-10 place-items-center rounded-full transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)] phone:size-8",
              open ? "rotate-45 bg-bonnet text-white" : "bg-abyss/5 group-hover:bg-abyss/10",
              closedOnPhone && "phone:!rotate-0 phone:!bg-abyss/5 phone:!text-abyss",
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
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          closedOnPhone && "phone:!grid-rows-[0fr] phone:!opacity-0",
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="grid gap-6 pb-7 sm:grid-cols-[1.5fr_1fr] phone:gap-3 phone:pb-4">
            <ul className="grid gap-2 sm:grid-cols-2 phone:gap-1">
              {item.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2 text-[0.98rem] phone:text-[0.92rem]">
                  <Check size={18} className="mt-0.5 shrink-0 text-river" /> {inc}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl bg-foam p-4 text-sm phone:p-3">
              <p>
                Typical range{" "}
                <strong className="font-display text-lg tracking-tight">
                  {usd(item.from)}
                  {item.to ? ` – ${usd(item.to)}` : "+"}
                </strong>
              </p>
              <p className="mt-1 text-slate">Exact flat price confirmed on site, before work starts.</p>
              <Link href={`/book?service=${item.service}`} className="mt-3 inline-flex font-semibold phone:mt-1.5 text-bonnet underline-offset-4 hover:underline">
                Book this job →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
