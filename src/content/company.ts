export const team = [
  {
    name: "Dana Whitfield",
    role: "Founder & Master Plumber",
    image: "/images/team-dana.jpg",
    bio: "Started Rill in 2012 with one van and a promise: quote first, clean up after. Still runs the toughest slab-leak jobs herself.",
  },
  {
    name: "Marcus Hale",
    role: "Lead Service Plumber",
    image: "/images/team-marcus.jpg",
    bio: "Twelve years on the tools. Known for the fastest emergency turnarounds in Plano and for explaining every option in plain English.",
  },
  {
    name: "Andre Okafor",
    role: "Drain, Sewer & Tankless Specialist",
    image: "/images/team-andre.jpg",
    bio: "Runs our camera and hydro-jetting rigs. If there's a root in your sewer line, Andre will find it and show you the footage.",
  },
  {
    name: "Rosa Delgado",
    role: "Dispatch & Customer Care",
    image: "/images/team-rosa.jpg",
    bio: "The calm voice at 2 am. Rosa walks callers through shutting off their water while the nearest van is already on the way.",
  },
];

export const promises = [
  {
    kicker: "01",
    title: "The price before the wrench.",
    body: "Flat, upfront pricing on every job. You see the options and the total before we touch a thing, and that's the number on the invoice.",
    image: "/images/plumber-hands.jpg",
    alt: "Plumber explaining a repair under a kitchen sink",
  },
  {
    kicker: "02",
    title: "Shoe covers on. Floors covered.",
    body: "Booties at the door, drop cloths down, and a full clean-up before we leave. Your home should look like we were never there, except the leak's gone.",
    image: "/images/bath-white.jpg",
    alt: "Spotless white bathroom with freestanding tub",
  },
  {
    kicker: "03",
    title: "2 am costs the same as 2 pm.",
    body: "Nights, weekends and holidays at the same flat price. No overtime, no after-hours fees, no surprises.",
    image: "/images/faucet-stream-dark.jpg",
    alt: "Faucet running in a dark kitchen at night",
  },
  {
    kicker: "04",
    title: "One year. Every job.",
    body: "Every repair and install is backed by a 1-year labor warranty, and we register manufacturer warranties in your name.",
    image: "/images/plumber-red-gloves.jpg",
    alt: "Plumber in red gloves tightening a fitting",
  },
];

export const stats = [
  { value: 14, suffix: "", label: "years serving North Dallas" },
  { value: 21400, suffix: "+", label: "jobs completed" },
  { value: 4.9, suffix: "★", label: "average Google rating", decimals: 1 },
  { value: 47, suffix: " min", label: "average emergency arrival" },
];

export type WorkItem = {
  id: string;
  title: string;
  place: string;
  category: "Bathrooms" | "Kitchens" | "Water heaters" | "Repipes & leaks" | "Emergency";
  image: string;
  alt: string;
  note: string;
};

export const work: WorkItem[] = [
  {
    id: "willow-bend-bath",
    title: "Primary bath re-plumb",
    place: "Willow Bend, Plano",
    category: "Bathrooms",
    image: "/images/bath-marble-shower.jpg",
    alt: "Marble walk-in shower with frameless glass",
    note: "Curbless shower, thermostatic valve, linear drain.",
  },
  {
    id: "starwood-tankless",
    title: "Tankless conversion",
    place: "Starwood, Frisco",
    category: "Water heaters",
    image: "/images/tankless-heater.jpg",
    alt: "Newly installed tankless water heater",
    note: "Family of five, 9.8 GPM unit, recirculation loop.",
  },
  {
    id: "prestonwood-freestanding",
    title: "Freestanding tub & double vanity",
    place: "Prestonwood, North Dallas",
    category: "Bathrooms",
    image: "/images/bath-freestanding.jpg",
    alt: "Bathroom with freestanding tub and wood double vanity",
    note: "Floor-mount tub filler, relocated drains.",
  },
  {
    id: "twin-creeks-kitchen",
    title: "Kitchen remodel rough-in",
    place: "Twin Creeks, Allen",
    category: "Kitchens",
    image: "/images/kitchen-white.jpg",
    alt: "White kitchen with marble island and pendant lights",
    note: "Island sink, pot filler, ice-maker line.",
  },
  {
    id: "richardson-repipe",
    title: "Whole-home PEX repipe",
    place: "Richardson Heights",
    category: "Repipes & leaks",
    image: "/images/pipes-white.jpg",
    alt: "New white supply pipes neatly routed along a wall",
    note: "1958 home, galvanized to PEX-A in 2.5 days.",
  },
  {
    id: "canyon-creek-slab",
    title: "Slab leak reroute",
    place: "Canyon Creek, Richardson",
    category: "Repipes & leaks",
    image: "/images/pipes-wall.jpg",
    alt: "New supply lines being installed inside an open wall",
    note: "Hot line rerouted through the attic, no floor demo.",
  },
  {
    id: "legacy-wood-shower",
    title: "Spa shower with body sprays",
    place: "Legacy West, Plano",
    category: "Bathrooms",
    image: "/images/bath-wood-shower.jpg",
    alt: "Walk-in shower with wood-look tile and rain head",
    note: "Rain head, handheld and bench, all on one valve.",
  },
  {
    id: "castle-hills-sink",
    title: "Vanity & faucet upgrade",
    place: "Castle Hills, Carrollton",
    category: "Bathrooms",
    image: "/images/sink-blue-tile.jpg",
    alt: "Matte black faucet on a white vanity with blue tile",
    note: "Widespread faucet, new valves and P-trap.",
  },
  {
    id: "bent-tree-burst",
    title: "11 pm burst supply line",
    place: "Bent Tree, North Dallas",
    category: "Emergency",
    image: "/images/plumber-under-sink.jpg",
    alt: "Plumber replacing a burst supply line under a sink",
    note: "On site in 39 min, dry and fixed by 12:30 am.",
  },
  {
    id: "deerfield-heater",
    title: "Same-day tank replacement",
    place: "Deerfield, Plano",
    category: "Water heaters",
    image: "/images/water-heater-wrench.jpg",
    alt: "Plumber tightening fittings on a new tank water heater",
    note: "50-gal gas, new pan, expansion tank and permit.",
  },
  {
    id: "frisco-kitchen-filter",
    title: "RO drinking water system",
    place: "Newman Village, Frisco",
    category: "Kitchens",
    image: "/images/kitchen-filter.jpg",
    alt: "Filling a bottle from a kitchen filtration faucet",
    note: "Under-sink RO with dedicated brushed faucet.",
  },
  {
    id: "allen-bath",
    title: "Guest bath refresh",
    place: "Star Creek, Allen",
    category: "Bathrooms",
    image: "/images/bath-tub-plant.jpg",
    alt: "White bathtub with a green plant beside it",
    note: "New tub, valve, and wall-mount faucet.",
  },
];
