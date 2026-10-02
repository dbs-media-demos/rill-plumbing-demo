"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { openStatus } from "@/lib/biz-core";
import { useBiz } from "@/components/preview/BizContext";

/**
 * Live status badge. Plumbers are on call 24/7; the office line has hours (the business's own on
 * a preview). Rendered generically on the server, then refined on the client.
 */
export function OpenBadge({ className, tone = "light", compact }: { className?: string; tone?: "light" | "dark"; compact?: boolean }) {
  const biz = useBiz();
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setLabel(openStatus(biz)?.text ?? null);
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [biz]);

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 text-sm font-medium",
        tone === "dark" ? "text-white/90" : "text-abyss",
        className,
      )}
    >
      <span className="pulse-dot" style={{ ["--dot" as string]: "#3ddc97" }} aria-hidden />
      <span>
        <strong className="font-semibold">Open now</strong> · plumbers on call 24/7
        {!compact && label && <span className={tone === "dark" ? "text-white/60" : "text-slate"}> · {label}</span>}
      </span>
    </span>
  );
}
