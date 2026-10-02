import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { ShutoffFinder } from "@/components/sections/ShutoffFinder";
import { FinalCta } from "@/components/sections/FinalCta";
import { Button } from "@/components/ui/Button";
import { Phone } from "@/components/ui/Icons";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema } from "@/lib/schema";
import { absoluteUrl, site, telHref } from "@/lib/site";

const title = "Plumbing Emergency Tips: Find Your Water Shut-Off";
const description =
  "Where to find your main water shut-off valve in a North Texas home, and exactly what to do in the first 10 minutes of a burst pipe, frozen pipe, sewer backup or leaking water heater.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/emergency-tips", eyebrow: "Emergency tips" });

const scenarios = [
  {
    t: "Burst or leaking pipe",
    steps: ["Close the main shut-off (valve 1 or 2).", "Turn off the water heater.", "Open a low outside faucet to drain the lines.", "Switch off power to wet rooms at the breaker.", "Call us, then photograph the damage for insurance."],
  },
  {
    t: "Frozen pipes (Texas cold snap)",
    steps: ["Keep faucets dripping on nights below 28°F.", "Open cabinet doors on outside walls.", "Never thaw with an open flame; use a hair dryer.", "If a pipe has split, close the main before it thaws."],
  },
  {
    t: "Sewer backing up",
    steps: ["Stop using all water: no flushing, showers or laundry.", "Keep kids and pets away; it's contaminated.", "Don't use chemical drain cleaner.", "Call us for a camera inspection and main-line clearing."],
  },
  {
    t: "Water heater leaking",
    steps: ["Close the cold-water valve on top of the tank (valve 3).", "Gas: set to 'Pilot'. Electric: breaker off.", "Smell gas? Leave, then call 911 from outside.", "Most tanks are replaced the same day."],
  },
];

const howTo = {
  "@type": "HowTo",
  "@id": `${absoluteUrl("/emergency-tips")}#howto`,
  name: "How to shut off your home's water in an emergency",
  step: [
    { "@type": "HowToStep", name: "Find the curb meter box", text: "Lift the lid of the meter box near the street; the valve is on the house side of the meter." },
    { "@type": "HowToStep", name: "Close the valve", text: "Turn it a quarter turn so the handle is across the pipe, using a meter key or wrench." },
    { "@type": "HowToStep", name: "Turn off the water heater", text: "Set a gas unit to Pilot or switch off the breaker for an electric unit." },
    { "@type": "HowToStep", name: "Drain the lines", text: "Open a low outside faucet to relieve pressure, then call a plumber." },
  ],
};

export default function EmergencyTipsPage() {
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ path: "/emergency-tips", name: title, description }), howTo)} />
      <PageHero
        eyebrow="Emergency tips"
        title={
          <>
            First, <span className="accent font-normal text-spray">stop the water.</span>
          </>
        }
        intro="Ten calm minutes can save thousands in damage. Find your shut-off now, before you ever need it."
        image="/images/water-meter.jpg"
        imageAlt="Main water line with meter and shut-off valve"
        crumbs={[{ name: "Emergency tips", path: "/emergency-tips" }]}
      >
        <Button href={telHref} size="lg" variant="sunny" icon={<Phone size={18} />}>
          Emergency? Call {site.phoneDisplay}
        </Button>
      </PageHero>

      <section className="section-y bg-porcelain" aria-labelledby="finder-heading">
        <div className="container-x">
          <p className="eyebrow text-river">Shut-off finder</p>
          <SplitReveal as="h2" id="finder-heading" className="t-2 mt-4 max-w-3xl font-display font-semibold">
            Seven valves every Texas home <span className="accent font-normal text-bonnet">should know.</span>
          </SplitReveal>
          <p className="mt-4 max-w-2xl text-lg text-slate">Tap a number to see where it usually is and how to close it.</p>
          <div className="mt-12">
            <ShutoffFinder />
          </div>
        </div>
      </section>

      <section className="section-y bg-white" aria-labelledby="scenarios-heading">
        <div className="container-x">
          <SplitReveal as="h2" id="scenarios-heading" className="t-2 font-display font-semibold">
            The first <span className="accent font-normal text-bonnet">ten minutes.</span>
          </SplitReveal>
          <Reveal as="ul" stagger={0.08} className="mt-12 grid gap-5 md:grid-cols-2">
            {scenarios.map((sc) => (
              <li key={sc.t} className="rounded-[1.8rem] bg-porcelain p-7 sm:p-9">
                <h3 className="font-display text-2xl font-semibold tracking-tight">{sc.t}</h3>
                <ol className="mt-5 space-y-3">
                  {sc.steps.map((st, i) => (
                    <li key={st} className="flex gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-abyss text-sm font-bold text-white">{i + 1}</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </PageShell>
  );
}
