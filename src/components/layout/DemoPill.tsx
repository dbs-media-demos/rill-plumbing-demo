"use client";

import { useEffect, useState } from "react";
import { Close } from "@/components/ui/Icons";
import { agencyName, agencyUrl } from "@/lib/site";
import { useBiz } from "@/components/preview/BizContext";

const KEY = "rill-demo-pill";

/** Small, tasteful marker that this is a concept site. */
export function DemoPill() {
  const biz = useBiz();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (dismissed) return;
    const id = window.setTimeout(() => setShow(true), 1800);
    return () => window.clearTimeout(id);
  }, []);

  if (!show) return null;

  return (
    <div className="anim-fade fixed bottom-[5.6rem] left-3 z-40 flex items-center rounded-full bg-white/90 py-1 pl-3.5 pr-1 text-[0.8rem] text-abyss shadow-[0_10px_30px_-10px_rgba(6,34,47,0.4)] ring-1 ring-abyss/10 backdrop-blur-md md:bottom-5 md:left-5">
      <a href={agencyUrl} target="_blank" rel="noopener" className="font-medium hover:underline">
        {biz.preview ? (
          <span className="inline-block max-w-[15rem] truncate align-bottom sm:max-w-none">
            {biz.lang === "sr" ? `Pregled za ${biz.shortName} · ` : `Preview for ${biz.shortName} · by `}
            <strong>{agencyName}</strong> ↗
          </span>
        ) : (
          <>
            <span className="hidden sm:inline">Concept site by </span><span className="sm:hidden">Concept by </span><strong>{agencyName}</strong> ↗
          </>
        )}
      </a>
      <button
        type="button"
        onClick={() => {
          setShow(false);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
        }}
        aria-label="Dismiss concept site notice"
        className="ml-1 grid size-8 place-items-center rounded-full text-slate hover:bg-abyss/5"
      >
        <Close size={14} />
      </button>
    </div>
  );
}
