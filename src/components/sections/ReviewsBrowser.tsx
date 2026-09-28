"use client";

import { useState } from "react";
import clsx from "clsx";
import { reviews } from "@/content/reviews";
import { services } from "@/content/services";
import { ReviewCard } from "./ReviewsWall";

/** Filter reviews by service. */
export function ReviewsBrowser() {
  const used = services.filter((s) => reviews.some((r) => r.service === s.slug));
  const [f, setF] = useState<string>("all");
  const list = reviews.filter((r) => f === "all" || r.service === f);
  return (
    <>
      <div role="group" aria-label="Filter reviews by service" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ slug: "all", short: "All reviews" }, ...used].map((s) => (
          <button
            key={s.slug}
            type="button"
            aria-pressed={f === s.slug}
            onClick={() => setF(s.slug)}
            className={clsx(
              "min-h-11 shrink-0 rounded-full px-5 text-[0.95rem] font-semibold transition-colors",
              f === s.slug ? "bg-abyss text-white" : "bg-abyss/5 hover:bg-abyss/10",
            )}
          >
            {s.short}
          </button>
        ))}
      </div>
      <ul className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3" aria-live="polite">
        {list.map((r) => (
          <li key={r.name + r.date} className="anim-fade mb-5 break-inside-avoid">
            <ReviewCard r={r} />
          </li>
        ))}
      </ul>
    </>
  );
}
