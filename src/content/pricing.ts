export type PriceItem = {
  id: string;
  name: string;
  from: number;
  /** Optional upper bound for a typical range. */
  to?: number;
  time: string;
  includes: string[];
  service: string;
  popular?: boolean;
};

export type PriceGroup = { id: string; label: string; items: PriceItem[] };

export const priceGroups: PriceGroup[] = [
  {
    id: "drains",
    label: "Drains",
    items: [
      {
        id: "sink-clog",
        name: "Sink, tub or shower clog",
        from: 149,
        to: 245,
        time: "45–60 min",
        includes: ["Clear one fixture drain", "Flow test", "Hair/grease trap tips", "30-day clog-free guarantee"],
        service: "drain-cleaning",
        popular: true,
      },
      {
        id: "main-line",
        name: "Main line clearing (from cleanout)",
        from: 249,
        to: 395,
        time: "1–2 hrs",
        includes: ["Cable clearing to city tap", "Test all fixtures", "Camera look at the problem area"],
        service: "drain-cleaning",
      },
      {
        id: "jetting",
        name: "Hydro-jetting",
        from: 495,
        to: 895,
        time: "2–3 hrs",
        includes: ["Camera inspection first", "High-pressure jet cleaning", "Final camera run + video"],
        service: "sewer-line-repair",
      },
    ],
  },
  {
    id: "heaters",
    label: "Water heaters",
    items: [
      {
        id: "wh-repair",
        name: "Water heater repair",
        from: 179,
        to: 425,
        time: "1 hr",
        includes: ["Diagnosis", "Thermocouple, element or valve replacement", "Safety & combustion check"],
        service: "water-heaters",
      },
      {
        id: "wh-tank",
        name: "50-gal gas tank, installed",
        from: 1895,
        to: 2450,
        time: "Same day",
        includes: ["Unit + install", "Pan, expansion tank, code upgrades", "Permit", "Haul-away", "1-yr labor warranty"],
        service: "water-heaters",
        popular: true,
      },
      {
        id: "wh-tankless",
        name: "Tankless water heater, installed",
        from: 3900,
        to: 5600,
        time: "1 day",
        includes: ["Unit sized to your home", "Gas line and venting", "Permit", "Descaling valves", "Haul-away of old tank"],
        service: "water-heaters",
      },
    ],
  },
  {
    id: "leaks",
    label: "Leaks & pipes",
    items: [
      {
        id: "leak-detect",
        name: "Electronic leak detection",
        from: 295,
        to: 450,
        time: "1–2 hrs",
        includes: ["Meter & pressure tests", "Acoustic + thermal locate", "Written report", "Credited toward repair"],
        service: "leak-detection",
      },
      {
        id: "slab",
        name: "Slab leak reroute",
        from: 1450,
        to: 3200,
        time: "1 day",
        includes: ["PEX reroute through attic/walls", "Drywall access patched", "Pressure test", "Permit"],
        service: "slab-leak-repair",
      },
      {
        id: "prv",
        name: "Pressure-reducing valve (PRV)",
        from: 395,
        to: 595,
        time: "1–2 hrs",
        includes: ["New PRV + gauge test", "Set to 55–65 psi", "Main shut-off check"],
        service: "leak-detection",
      },
      {
        id: "repipe",
        name: "Whole-home repipe (PEX-A)",
        from: 4800,
        to: 9500,
        time: "2–3 days",
        includes: ["All supply lines", "New shut-off valves", "Drywall patch + texture", "Permit & inspection"],
        service: "repiping",
      },
    ],
  },
  {
    id: "fixtures",
    label: "Fixtures",
    items: [
      {
        id: "toilet-repair",
        name: "Toilet repair (flapper / fill valve)",
        from: 129,
        to: 195,
        time: "30–45 min",
        includes: ["Parts included", "Leak dye test", "Supply line check"],
        service: "fixtures-remodel",
        popular: true,
      },
      {
        id: "faucet",
        name: "Faucet install (your fixture or ours)",
        from: 189,
        to: 295,
        time: "1 hr",
        includes: ["Remove old faucet", "New supply lines", "Leak test + clean-up"],
        service: "fixtures-remodel",
      },
      {
        id: "disposal",
        name: "Garbage disposal install",
        from: 249,
        to: 425,
        time: "1 hr",
        includes: ["1/2 or 3/4 HP unit", "Electrical hookup to existing outlet", "Haul-away"],
        service: "fixtures-remodel",
      },
    ],
  },
  {
    id: "water",
    label: "Water quality",
    items: [
      {
        id: "ro",
        name: "Under-sink reverse osmosis",
        from: 395,
        to: 695,
        time: "1–2 hrs",
        includes: ["System + dedicated faucet", "Water test", "First filter set"],
        service: "water-filtration",
      },
      {
        id: "softener",
        name: "Whole-home softener + carbon filter",
        from: 2450,
        to: 3800,
        time: "Half day",
        includes: ["Free water test", "Loop + bypass install", "Programming", "First salt fill"],
        service: "water-filtration",
      },
    ],
  },
];

export const allPriceItems = priceGroups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })));

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
