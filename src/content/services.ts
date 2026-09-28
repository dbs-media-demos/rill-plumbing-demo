export type Service = {
  slug: string;
  name: string;
  /** Short name for menus and chips. */
  short: string;
  /** schema.org serviceType */
  serviceType: string;
  tagline: string;
  summary: string;
  image: string;
  imageAlt: string;
  gallery: { src: string; alt: string }[];
  from: string;
  eta: string;
  intro: string[];
  signs: string[];
  included: string[];
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "emergency-plumbing",
    name: "Emergency Plumbing",
    short: "Emergency",
    serviceType: "Emergency plumbing repair",
    tagline: "Water where it shouldn't be? We're already rolling.",
    summary: "Burst pipes, flooding, sewage backups and no-water calls, answered by a real person 24/7, with no overtime charges.",
    image: "/images/faucet-splash.jpg",
    imageAlt: "Water bursting from a kitchen faucet into a dark sink",
    gallery: [
      { src: "/images/plumber-under-sink.jpg", alt: "Rill plumber repairing a supply line under a sink" },
      { src: "/images/water-meter.jpg", alt: "Main water line with shut-off valve and meter" },
    ],
    from: "$189",
    eta: "Average arrival 52 min",
    intro: [
      "When a supply line lets go at 11 pm, you don't need a voicemail, you need a plumber. Our dispatch desk is staffed around the clock, and there's always a stocked van within reach of Plano, Frisco, Allen, Richardson, Carrollton and North Dallas.",
      "The price at 2 am is the same as the price at 2 pm. No overtime, no weekend premium, no 'after-hours trip fee'. You'll hear the flat price before we touch anything.",
    ],
    signs: [
      "Water spraying, pooling or coming through a ceiling",
      "Sewage backing up into a tub, shower or floor drain",
      "No water to the whole house",
      "A water heater leaking from the bottom of the tank",
      "Gas smell near a water heater (leave the house and call 911 first)",
      "Frozen or split pipes after a Texas cold snap",
    ],
    included: [
      "A real dispatcher answers, day or night",
      "Phone walk-through to shut off your water while we drive",
      "Flat, upfront price before work starts",
      "Shoe covers, floor protection and full clean-up",
      "Moisture check around the leak so nothing is left hidden",
      "Photos and notes for your insurance claim",
    ],
    steps: [
      { title: "Call or tap 'Send a plumber'", body: "Dispatch picks up, asks three quick questions and walks you through shutting off the water." },
      { title: "Nearest van rolls", body: "You get a text with your plumber's name, photo and live arrival window." },
      { title: "Stop the damage", body: "We isolate the leak first, then show you the options and the flat price for each." },
      { title: "Fix, test, clean up", body: "Repair, pressure test, dry the area and leave it cleaner than we found it." },
    ],
    faqs: [
      {
        q: "Do you really charge the same at night and on weekends?",
        a: "Yes. Our prices are per job, not per hour, and they don't change with the clock or the calendar. Holidays included.",
      },
      {
        q: "What should I do while I wait?",
        a: "Shut off the main water valve (usually in the meter box at the curb or where the line enters the house), switch off the water heater, and move valuables away from the water. Our emergency tips page shows exactly where to look.",
      },
      {
        q: "Will you work with my insurance?",
        a: "We document everything with photos, moisture readings and an itemized invoice, which is what adjusters ask for. We can also recommend water mitigation partners if drying is needed.",
      },
    ],
    related: ["leak-detection", "slab-leak-repair", "water-heaters"],
  },
  {
    slug: "drain-cleaning",
    name: "Drain Cleaning",
    short: "Drains",
    serviceType: "Drain cleaning",
    tagline: "From slow sink to free-flowing, usually in under an hour.",
    summary: "Kitchen, bath and main-line clogs cleared with the right tool for the pipe: cable, camera or hydro-jet.",
    image: "/images/drain-macro.jpg",
    imageAlt: "Close-up of a stainless steel sink drain",
    gallery: [
      { src: "/images/kitchen-sink.jpg", alt: "Bright kitchen with a double stainless sink" },
      { src: "/images/pipe-outflow.jpg", alt: "Water flowing from a cleared drain pipe" },
    ],
    from: "$149",
    eta: "Same-day, most calls",
    intro: [
      "Most clogs are grease, hair, wipes or roots. We don't guess which. For anything past a single fixture, we run a camera so you can see the problem on screen before we recommend a fix.",
      "Older homes in Richardson and North Dallas often have cast-iron drains with scale buildup, and Frisco's newer builds see construction debris. Different pipes need different tools, and we carry all of them.",
    ],
    signs: [
      "Gurgling when the dishwasher or washer drains",
      "More than one fixture draining slowly",
      "Water coming up in the tub when you flush",
      "Sewer smell from floor drains",
      "The same clog coming back every few months",
    ],
    included: [
      "Cable clearing at the fixture or cleanout",
      "Before-and-after water test on every fixture",
      "Camera inspection on main-line calls",
      "Enzyme maintenance tips (no harsh chemicals)",
      "30-day clog-free guarantee on cleared lines",
    ],
    steps: [
      { title: "Find the clog", body: "We test fixtures to see whether it's local or in the main line." },
      { title: "Clear it", body: "Cable, auger or hydro-jet, sized to your pipe material and condition." },
      { title: "Prove it", body: "We run water through every affected fixture, and on main lines, send a camera through." },
      { title: "Keep it clear", body: "You get the video and a simple plan to stop it coming back." },
    ],
    faqs: [
      {
        q: "Is hydro-jetting safe for old pipes?",
        a: "We always camera-inspect first. On sound pipe, jetting is the most thorough cleaning there is. On fragile cast iron, we adjust pressure or recommend cabling instead.",
      },
      {
        q: "Should I use store-bought drain cleaner first?",
        a: "Please don't. Caustic cleaners can damage older pipes and make the job hazardous for whoever clears it. A plunger or a hair snare is fine.",
      },
    ],
    related: ["sewer-line-repair", "emergency-plumbing", "fixtures-remodel"],
  },
  {
    slug: "water-heaters",
    name: "Water Heaters",
    short: "Water heaters",
    serviceType: "Water heater repair and installation",
    tagline: "Hot water back tonight: repair, replace or go tankless.",
    summary: "Tank and tankless repair, same-day replacement, and honest advice on which one fits your household.",
    image: "/images/water-heater-wrench.jpg",
    imageAlt: "Plumber tightening a fitting on a white tank water heater",
    gallery: [
      { src: "/images/tankless-heater.jpg", alt: "Wall-mounted tankless water heater with gas line" },
      { src: "/images/plumber-hands.jpg", alt: "Plumber's hands working on water heater connections" },
    ],
    from: "$179",
    eta: "Same-day replacement on common sizes",
    intro: [
      "We stock 40- and 50-gallon gas and electric tanks on every van, so most replacements happen the same day you call. Old unit hauled away, permit pulled, code-compliant install with a new expansion tank and pan if needed.",
      "Thinking tankless? It's a great fit for some homes and overkill for others. Use the sizing guide below, then we'll confirm it on site with your gas line and venting.",
    ],
    signs: [
      "Lukewarm showers or hot water that runs out fast",
      "Rumbling or popping from the tank (sediment)",
      "Rusty or metallic-smelling hot water",
      "Water around the base of the tank",
      "A pilot light that won't stay lit",
      "The tank is 10+ years old (check the label)",
    ],
    included: [
      "Diagnosis with a written repair-or-replace recommendation",
      "Same-day install on standard 40–50 gal tanks",
      "City permit and code upgrades (pan, expansion tank, venting)",
      "Haul-away and disposal of the old unit",
      "Manufacturer warranty registration",
      "1-year labor warranty on our work",
    ],
    steps: [
      { title: "Diagnose", body: "Thermocouple, element, gas valve, anode or tank: we find the actual failure." },
      { title: "Recommend", body: "Repair if it makes sense. If the tank is failing, you get flat prices for tank and tankless options." },
      { title: "Install", body: "Permit, install, test for leaks and combustion, set temperature to a safe 120°F." },
      { title: "Hand over", body: "We show you the shut-offs and register the warranty in your name." },
    ],
    faqs: [
      {
        q: "How long does a water heater last in North Texas?",
        a: "Tanks usually last 8–12 years here. Hard water shortens that, so flushing yearly helps. Tankless units can last 20 years with descaling.",
      },
      {
        q: "Is tankless worth it?",
        a: "If you have a larger family, want endless showers, or need the garage space, often yes. If you're a 1–2 person household with modest use, a quality tank is usually the better value. The sizing guide gives you a starting point.",
      },
    ],
    related: ["water-filtration", "leak-detection", "emergency-plumbing"],
  },
  {
    slug: "leak-detection",
    name: "Leak Detection",
    short: "Leak detection",
    serviceType: "Leak detection",
    tagline: "Find the leak without tearing up the house.",
    summary: "Acoustic, thermal and pressure testing to pinpoint hidden leaks in walls, ceilings, yards and under slabs.",
    image: "/images/brass-drip.jpg",
    imageAlt: "Water drop falling from a brass pipe fitting",
    gallery: [
      { src: "/images/water-meter.jpg", alt: "Water meter and shut-off valve on a supply line" },
      { src: "/images/pipes-wall.jpg", alt: "Supply pipes exposed inside an open wall" },
    ],
    from: "$295",
    eta: "Next-day, often same-day",
    intro: [
      "A spinning water meter, a warm spot on the floor or a water bill that jumped $80: all signs of a leak you can't see. We find it with listening equipment, thermal imaging and isolation tests, so the opening we make is the size of a tile, not a room.",
      "You get a written report with the location, the cause and your repair options, which is exactly what insurers want to see.",
    ],
    signs: [
      "Water bill up with no change in use",
      "Meter dial moving with every fixture off",
      "Warm or damp spots on floors",
      "Musty smell, stains or bubbling paint",
      "Sound of running water when nothing is on",
    ],
    included: [
      "Meter and pressure isolation tests",
      "Acoustic and thermal imaging",
      "Pinpointed leak location, marked on site",
      "Written report with photos for insurance",
      "Detection fee credited toward the repair",
    ],
    steps: [
      { title: "Confirm", body: "Meter and pressure tests prove there's a leak and which line it's on." },
      { title: "Pinpoint", body: "Acoustic and thermal tools narrow it down to within inches." },
      { title: "Report", body: "We mark it, photograph it and explain the options." },
      { title: "Repair", body: "Usually the same visit, and the detection fee comes off the repair price." },
    ],
    faqs: [
      {
        q: "How accurate is electronic leak detection?",
        a: "Typically within a foot, often inches. That precision is what keeps the repair small and your floors intact.",
      },
    ],
    related: ["slab-leak-repair", "repiping", "emergency-plumbing"],
  },
  {
    slug: "slab-leak-repair",
    name: "Slab Leak Repair",
    short: "Slab leaks",
    serviceType: "Slab leak repair",
    tagline: "North Texas clay moves. Your pipes shouldn't pay for it.",
    summary: "Spot repair, reroute or repipe: the least invasive fix for leaks under your foundation.",
    image: "/images/pipes-wall.jpg",
    imageAlt: "New supply lines being rerouted through an open wall",
    gallery: [
      { src: "/images/house-brick.jpg", alt: "Brick home on a slab foundation in a North Texas neighborhood" },
      { src: "/images/copper-pipes.jpg", alt: "Copper pipes bent into a clean manifold" },
    ],
    from: "$1,450",
    eta: "Detection within 24–48 hrs",
    intro: [
      "DFW's expansive clay soil swells when it's wet and shrinks when it's dry, and the copper lines under your slab take the stress. Slab leaks are one of the most common, and most misunderstood, repairs in Plano and Richardson.",
      "Jackhammering through your kitchen floor is rarely the best answer. In most homes we reroute the line through the attic or walls with PEX, which is faster, cleaner and often cheaper than breaking the slab.",
    ],
    signs: [
      "Warm spots on tile or wood floors",
      "Hissing or running water sounds under the floor",
      "Cracks in flooring or baseboards pulling away",
      "Constant water heater running",
      "Unexplained spike in water bill",
    ],
    included: [
      "Electronic slab leak detection",
      "Side-by-side quote: spot repair vs reroute",
      "Permits and city inspection where required",
      "Drywall access repaired and textured (paint-ready)",
      "Pressure test before and after",
    ],
    steps: [
      { title: "Locate", body: "Pinpoint the leak and test the other lines for weakness." },
      { title: "Choose", body: "You pick spot repair or reroute with clear flat prices for each." },
      { title: "Repair", body: "Most reroutes are done in a single day with water back on by evening." },
      { title: "Restore", body: "We patch access openings and leave the room ready for paint." },
    ],
    faqs: [
      {
        q: "Does homeowners insurance cover slab leaks?",
        a: "Many policies cover access and resulting damage, not the pipe itself. Our detection report gives your adjuster what they need.",
      },
    ],
    related: ["leak-detection", "repiping", "emergency-plumbing"],
  },
  {
    slug: "sewer-line-repair",
    name: "Sewer Line Repair",
    short: "Sewer lines",
    serviceType: "Sewer line repair and replacement",
    tagline: "See the problem on camera. Fix it without wrecking the yard.",
    summary: "Camera inspection, root removal, spot repairs and trenchless replacement of the main sewer line.",
    image: "/images/pipe-outflow.jpg",
    imageAlt: "Water flowing out of a large drain pipe",
    gallery: [
      { src: "/images/house-porch.jpg", alt: "Classic North Texas home with mature trees and front lawn" },
      { src: "/images/drain-macro.jpg", alt: "Stainless drain close-up" },
    ],
    from: "$199",
    eta: "Camera inspection same week",
    intro: [
      "Mature live oaks and cedar elms are beautiful, and their roots love clay sewer lines. We run a high-definition camera from your cleanout to the city tap and give you the video, so every recommendation is backed by footage.",
      "When replacement is needed, trenchless methods mean two small pits instead of a trench across your lawn.",
    ],
    signs: [
      "Multiple drains backing up at once",
      "Sewage smell in the yard",
      "Unusually green, soggy patches over the sewer line",
      "Backups after heavy rain",
    ],
    included: [
      "HD camera inspection with video copy",
      "Line locating and depth marking",
      "Root cutting and hydro-jetting",
      "Spot repair or trenchless replacement options",
      "City permits and inspections",
    ],
    steps: [
      { title: "Camera", body: "Inspect the whole line and locate problems to the foot." },
      { title: "Plan", body: "Clean, spot repair or replace, with a flat price for each." },
      { title: "Fix", body: "Trenchless where possible, minimal digging where not." },
      { title: "Verify", body: "Final camera run so you see the result yourself." },
    ],
    faqs: [
      {
        q: "Who is responsible for the sewer line, me or the city?",
        a: "In most North Texas cities you own the line from the house to the connection at the property line or city tap. We'll show you exactly where that is on camera.",
      },
    ],
    related: ["drain-cleaning", "emergency-plumbing", "repiping"],
  },
  {
    slug: "repiping",
    name: "Whole-Home Repiping",
    short: "Repiping",
    serviceType: "Repiping",
    tagline: "New PEX or copper, done in days, not weeks.",
    summary: "Replace failing galvanized, polybutylene or leak-prone copper with a clean, quiet new system.",
    image: "/images/pipes-white.jpg",
    imageAlt: "Neat rows of new white supply pipes",
    gallery: [
      { src: "/images/copper-pipes.jpg", alt: "Copper pipes arranged in parallel bends" },
      { src: "/images/pipes-wall.jpg", alt: "Supply lines being installed in an open wall" },
    ],
    from: "$4,800",
    eta: "Most homes in 2–3 days",
    intro: [
      "If you've had two or more slab leaks, see rusty water, or your home was built with galvanized or polybutylene pipe, repiping stops the cycle of repairs. We plan the route to minimize wall openings and keep your water on overnight.",
      "Every repipe includes new shut-off valves, drywall patching and a city inspection.",
    ],
    signs: [
      "Two or more leaks in the last few years",
      "Rust-colored or low-pressure water",
      "Galvanized steel or gray polybutylene pipe",
      "Pinhole leaks in copper lines",
    ],
    included: [
      "Room-by-room plan and fixed price",
      "PEX-A or Type L copper, your choice",
      "New fixture shut-off valves throughout",
      "Drywall patch and texture, ready for paint",
      "Permit, inspection and 1-year labor warranty",
    ],
    steps: [
      { title: "Survey", body: "We map every fixture and plan the least invasive route." },
      { title: "Protect", body: "Furniture covered, floors protected, dust barriers up." },
      { title: "Repipe", body: "New lines installed; water back on each evening." },
      { title: "Restore", body: "Patch, texture, inspect and walk you through the new system." },
    ],
    faqs: [
      {
        q: "PEX or copper?",
        a: "PEX-A is quieter, flexes with North Texas soil movement, resists freeze damage and costs less. Copper lasts decades and some owners prefer it. We install both and will give you both prices.",
      },
    ],
    related: ["slab-leak-repair", "leak-detection", "water-filtration"],
  },
  {
    slug: "fixtures-remodel",
    name: "Fixtures & Remodel Plumbing",
    short: "Fixtures & remodels",
    serviceType: "Fixture installation and remodel plumbing",
    tagline: "Beautiful fixtures, installed to last.",
    summary: "Faucets, toilets, showers, disposals and full rough-in plumbing for kitchen and bath remodels.",
    image: "/images/sink-blue-tile.jpg",
    imageAlt: "Matte black faucet on a white vanity with blue tile",
    gallery: [
      { src: "/images/bath-marble-shower.jpg", alt: "Marble walk-in shower with glass enclosure" },
      { src: "/images/bath-freestanding.jpg", alt: "Modern bathroom with freestanding tub and double vanity" },
      { src: "/images/kitchen-white.jpg", alt: "Bright white kitchen with marble island" },
    ],
    from: "$189",
    eta: "Scheduled at your convenience",
    intro: [
      "From swapping a leaky faucet to plumbing a whole primary-bath remodel, we install fixtures the way manufacturers intend, so warranties stay valid and everything works quietly for years.",
      "Working with a designer or contractor? We coordinate rough-in and trim-out with your schedule and pull the plumbing permit.",
    ],
    signs: [
      "Dripping faucets or running toilets",
      "Planning a kitchen or bath remodel",
      "Upgrading to a freestanding tub or curbless shower",
      "Adding a pot filler, ice-maker or wet bar",
    ],
    included: [
      "Install of customer-supplied or Rill-supplied fixtures",
      "New supply lines and shut-off valves",
      "Rough-in and trim-out for remodels",
      "Leak test and clean-up",
      "1-year labor warranty",
    ],
    steps: [
      { title: "Plan", body: "Confirm fixture specs, rough-in dimensions and schedule." },
      { title: "Rough-in", body: "Supply, drain and venting installed and inspected." },
      { title: "Trim-out", body: "Fixtures installed, sealed and tested." },
      { title: "Handover", body: "Walkthrough, care tips, and warranty paperwork." },
    ],
    faqs: [
      {
        q: "Can I buy my own fixtures?",
        a: "Absolutely. We'll install fixtures you've bought and check the box contents before we start so there are no surprises. Our labor warranty covers the install.",
      },
    ],
    related: ["repiping", "water-filtration", "drain-cleaning"],
  },
  {
    slug: "water-filtration",
    name: "Water Filtration & Softening",
    short: "Filtration",
    serviceType: "Water filtration and softener installation",
    tagline: "Softer skin, spotless glass, longer-lasting appliances.",
    summary: "Whole-home filtration, softeners and under-sink reverse osmosis sized to North Texas water.",
    image: "/images/glass-water.jpg",
    imageAlt: "Clear glass of filtered water on a gray surface",
    gallery: [
      { src: "/images/kitchen-filter.jpg", alt: "Filling a bottle from a kitchen filtration tap" },
      { src: "/images/filter-kitchen-wide.jpg", alt: "Modern kitchen with a countertop water filtration unit" },
    ],
    from: "$395",
    eta: "Free water test, install in 1 day",
    intro: [
      "North Texas water is safe but hard, and chlorinated, with chloramine in several cities. That means spotty glassware, scale in your water heater and dry skin. We test your water on site for free and recommend only what the results support.",
      "Options range from a single under-sink RO unit to a whole-home carbon filter plus softener loop.",
    ],
    signs: [
      "White scale on faucets and shower glass",
      "Chlorine taste or smell",
      "Water heater or tankless unit scaling up",
      "Dry skin and hair after showering",
    ],
    included: [
      "Free on-site hardness and chlorine test",
      "Sizing to your household and flow rate",
      "Loop, bypass valve and drain installation",
      "Setup, programming and first salt fill",
      "Filter reminder schedule",
    ],
    steps: [
      { title: "Test", body: "Hardness, chlorine/chloramine and TDS measured in your kitchen." },
      { title: "Recommend", body: "Only what the numbers justify, with flat prices." },
      { title: "Install", body: "Most systems installed in half a day." },
      { title: "Maintain", body: "We remind you when filters are due." },
    ],
    faqs: [
      {
        q: "Do I need a softener or a filter?",
        a: "A softener removes hardness minerals (scale). A carbon filter removes chlorine, chloramine, taste and odor. Many North Texas homes benefit from both; your test results decide.",
      },
    ],
    related: ["water-heaters", "fixtures-remodel", "repiping"],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
