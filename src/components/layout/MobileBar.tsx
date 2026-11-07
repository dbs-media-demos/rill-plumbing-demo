"use client";

import Link from "@/components/ui/Link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Phone, Calendar } from "@/components/ui/Icons";
import { useBiz } from "@/components/preview/BizContext";
import { L, telOf } from "@/lib/biz-core";

/** Sticky Call + Book bar on phones. The Call button shows the number. */
export function MobileBar() {
  const biz = useBiz();
  const pathname = usePathname();
  const onBook = pathname.startsWith("/book");
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className={clsx("grid gap-2 rounded-[1.4rem] bg-abyss p-2 shadow-[0_20px_40px_-10px_rgba(6,34,47,0.6)]", biz.phone ? "grid-cols-2" : "grid-cols-1")}>
        {biz.phone && (
          <a href={telOf(biz)} className="flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl bg-white text-[0.95rem] font-semibold text-abyss max-[359px]:text-[0.84rem] max-[359px]:[&>svg]:hidden">
            <Phone size={17} />
            {biz.phoneDisplay}
          </a>
        )}
        <Link
          href={onBook ? "#booking" : "/book"}
          className="flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl bg-bonnet text-[0.95rem] font-semibold text-white max-[359px]:text-[0.84rem] max-[359px]:[&>svg]:hidden"
        >
          <Calendar size={17} />
          {L(biz, "Book a plumber", "Zakažite majstora")}
        </Link>
      </div>
    </div>
  );
}
