import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type { Service } from "@/content/services";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

/** Image cards for services. Tall, rounded, with a zoom + arrow on hover. */
export function ServiceCards({ items, className }: { items: Service[]; className?: string }) {
  return (
    <Reveal as="ul" stagger={0.07} className={clsx("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((s) => (
        <li key={s.slug}>
          <Link href={`/services/${s.slug}`} data-cursor="View" className="group block">
            <div className="relative isolate aspect-[4/5] overflow-hidden rounded-[1.8rem] bg-abyss">
              <Image
                src={s.image}
                alt={s.imageAlt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                quality={65}
                className="-z-10 object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-abyss/90 via-abyss/20 to-transparent" />
              <div className="flex h-full flex-col justify-between p-6 text-white">
                <span className="self-start rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-abyss">From {s.from}</span>
                <div>
                  <h3 className="font-display text-3xl font-semibold leading-none tracking-tight">{s.name}</h3>
                  <p className="mt-3 text-[0.98rem] text-white/80">{s.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-spray">
                    Learn more
                    <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}
