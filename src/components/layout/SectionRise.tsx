"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isPhone } from "@/lib/phone";

/**
 * Phones: each section's content fades and rises once as it comes into view (CSS in globals.css,
 * transform and opacity only). Whatever is already on screen when the page loads is left alone.
 */
export function SectionRise() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isPhone() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          e.target.classList.add("risen");
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("main section").forEach((section) => {
      if (section.getBoundingClientRect().top < window.innerHeight) return;
      section.classList.add("rise");
      io.observe(section);
    });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
