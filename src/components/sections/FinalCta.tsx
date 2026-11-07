import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Phone } from "@/components/ui/Icons";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { defaultBiz } from "@/lib/biz";
import { telOf, type Biz } from "@/lib/biz-core";

type Props = {
  title?: React.ReactNode;
  body?: string;
  image?: string;
  imageAlt?: string;
  biz?: Biz;
};

/** Full-bleed closing call to action with rings rippling out from the buttons. */
export function FinalCta({
  title = (
    <>
      Water on the floor? <span className="accent font-normal text-spray">Breathe.</span> We&apos;re on the way.
    </>
  ),
  body = "Call any hour and a real person answers. Flat price before we start, shoe covers on, and the same rate at 2 am as 2 pm.",
  image = "/images/house-brick.jpg",
  imageAlt = "Brick family home in a quiet North Texas neighborhood",
  biz = defaultBiz,
}: Props) {
  return (
    <section data-pipe data-header="dark" aria-labelledby="cta-heading" className="on-dark relative isolate overflow-hidden bg-abyss text-white">
      <Image src={image} alt={imageAlt} fill sizes="100vw" quality={65} className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,34,47,0.94)_0%,rgba(6,34,47,0.78)_45%,rgba(6,34,47,0.35)_100%)]" />
      <div className="container-x py-28 lg:py-40 phone:py-8">
        <div className="max-w-3xl">
          <OpenBadge tone="dark" />
          <SplitReveal as="h2" id="cta-heading" className="t-1 mt-6 font-display font-semibold phone:mt-3">
            {title}
          </SplitReveal>
          <Reveal>
            <p className="mt-6 max-w-xl text-lg text-white/80 phone:mt-3 phone:text-[0.98rem]">{body}</p>
            <div className="relative mt-10 inline-flex flex-wrap gap-3 phone:mt-4 phone:flex phone:flex-nowrap phone:gap-2 phone:[&>a]:flex-auto phone:[&>a]:whitespace-nowrap phone:[&>a]:!px-3 phone:[&>a]:!py-3 phone:[&>a]:!text-[0.92rem] phone:[&_svg]:hidden">
              <span aria-hidden className="pointer-events-none absolute left-24 top-1/2 -z-10 phone:hidden">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="cta-ring absolute size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-spray/40"
                    style={{ animationDelay: `${i * 1.1}s` }}
                  />
                ))}
              </span>
              <Button href="/book" size="lg" icon={<ArrowRight size={18} />}>
                Book a plumber
              </Button>
              {biz.phone && (
                <Button href={telOf(biz)!} size="lg" variant="light" icon={<Phone size={18} />}>
                  {biz.phoneDisplay}
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
