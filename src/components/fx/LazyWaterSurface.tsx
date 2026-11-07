"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ComponentProps } from "react";
import { isPhone } from "@/lib/phone";

const WaterSurface = dynamic(() => import("./WaterSurface").then((m) => m.WaterSurface), { ssr: false });

/** The live water: phones never fetch its code. */
export function LazyWaterSurface(props: ComponentProps<typeof WaterSurface>) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- media query is client-only
    if (!isPhone()) setOn(true);
  }, []);
  return on ? <WaterSurface {...props} /> : null;
}
