"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Calendar } from "@/components/ui/Icons";
import { useBiz } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";

/** Sticky Call + Book bar on phones. */
export function MobileBar() {
  const biz = useBiz();
  const pathname = usePathname();
  const onBook = pathname.startsWith("/book");
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="grid grid-cols-2 gap-2 rounded-[1.4rem] bg-abyss/90 p-2 shadow-[0_20px_40px_-10px_rgba(6,34,47,0.6)] backdrop-blur-xl">
        <a
          href={telOf(biz)}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white font-semibold text-abyss active:scale-[0.98]"
        >
          <Phone size={18} />
          Call 24/7
        </a>
        <Link
          href={onBook ? "#booking" : "/book"}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-bonnet font-semibold text-white active:scale-[0.98]"
        >
          <Calendar size={18} />
          Book a plumber
        </Link>
      </div>
    </div>
  );
}
