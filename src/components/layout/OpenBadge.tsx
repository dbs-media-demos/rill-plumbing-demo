"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { officeStatus } from "@/lib/hours";

/**
 * Live status badge. Plumbers are on call 24/7; the office line has hours.
 * Rendered generically on the server, then refined on the client (Dallas time).
 */
export function OpenBadge({ className, tone = "light", compact }: { className?: string; tone?: "light" | "dark"; compact?: boolean }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setLabel(officeStatus().label);
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

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
