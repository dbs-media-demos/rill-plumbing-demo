export type Review = {
  name: string;
  area: string;
  city: string;
  rating: number;
  date: string;
  service: string;
  text: string;
  tech?: string;
};

/** Fictional reviews for a concept site. */
export const reviews: Review[] = [
  {
    name: "Megan T.",
    area: "Willow Bend",
    city: "plano",
    rating: 5,
    date: "2026-09-12",
    service: "emergency-plumbing",
    tech: "Marcus",
    text: "Supply line under our upstairs vanity burst at 11:40 pm. Rosa picked up on the second ring and talked me through the shut-off in the meter box while Marcus drove over. He was here in 41 minutes, wore shoe covers the whole time and had it fixed before 1 am. Same price they quoted on the phone.",
  },
  {
    name: "David R.",
    area: "Canyon Creek",
    city: "richardson",
    rating: 5,
    date: "2026-08-28",
    service: "slab-leak-repair",
    tech: "Dana",
    text: "Two other companies wanted to jackhammer our kitchen. Rill found the slab leak within inches and rerouted the line through the attic in one day. Drywall patch was so clean I couldn't find it. Our water bill dropped $74 the next month.",
  },
  {
    name: "Priya S.",
    area: "Starwood",
    city: "frisco",
    rating: 5,
    date: "2026-09-03",
    service: "water-heaters",
    tech: "Andre",
    text: "We used their sizing guide, then Andre confirmed it on site: tankless made sense for our family of five. Install took a day, permit and all. Endless hot showers and we got a chunk of the garage back.",
  },
  {
    name: "Tom & Lisa G.",
    area: "Twin Creeks",
    city: "allen",
    rating: 5,
    date: "2026-07-19",
    service: "drain-cleaning",
    text: "Kitchen sink backed up two hours before 20 people came over for our daughter's graduation party. They had someone here in under an hour, cleared the line and even showed us the camera footage of the grease clog. Lifesavers.",
  },
  {
    name: "James W.",
    area: "Prestonwood",
    city: "north-dallas",
    rating: 5,
    date: "2026-06-30",
    service: "sewer-line-repair",
    tech: "Andre",
    text: "Roots from our old live oak had crushed the clay sewer line. Andre sent me the video before recommending anything. Trenchless replacement meant two small holes instead of tearing up the yard. Professional start to finish.",
  },
  {
    name: "Carmen L.",
    area: "Castle Hills",
    city: "carrollton",
    rating: 5,
    date: "2026-09-21",
    service: "water-filtration",
    text: "Free water test showed 12 grains of hardness. They installed a softener and carbon filter in one morning and explained every step. Our shower glass is finally clear.",
  },
  {
    name: "Brian K.",
    area: "Legacy West",
    city: "plano",
    rating: 5,
    date: "2026-08-14",
    service: "fixtures-remodel",
    tech: "Marcus",
    text: "Coordinated rough-in with our contractor for a full primary bath remodel. On time for every visit, passed inspection first try, and the freestanding tub filler is perfectly centered. Would hire again tomorrow.",
  },
  {
    name: "Aisha M.",
    area: "Richardson Heights",
    city: "richardson",
    rating: 5,
    date: "2026-05-22",
    service: "repiping",
    tech: "Dana",
    text: "Our 1958 house still had galvanized pipes. Rill repiped the whole thing with PEX in two and a half days and we had water every night. Pressure is incredible now.",
  },
  {
    name: "Kevin O.",
    area: "Phillips Creek Ranch",
    city: "frisco",
    rating: 5,
    date: "2026-09-08",
    service: "leak-detection",
    text: "Meter was spinning with everything off. They found a leak in the irrigation backflow line in 40 minutes and fixed it the same visit. The detection fee came off the repair, like they said.",
  },
  {
    name: "Holly B.",
    area: "Watters Creek",
    city: "allen",
    rating: 4,
    date: "2026-04-11",
    service: "water-heaters",
    text: "Water heater replaced same day. Only reason for 4 stars: the arrival window slipped by 30 minutes, but they texted ahead to tell me. Great install and they hauled the old tank away.",
  },
  {
    name: "Marcus J.",
    area: "Bent Tree",
    city: "north-dallas",
    rating: 5,
    date: "2026-07-02",
    service: "emergency-plumbing",
    text: "Sunday morning, no water to the whole house. They found a failed main shut-off and replaced it by lunch. No weekend upcharge, which I didn't believe until I saw the invoice.",
  },
  {
    name: "Nicole P.",
    area: "Indian Creek",
    city: "carrollton",
    rating: 5,
    date: "2026-08-02",
    service: "drain-cleaning",
    text: "Fair price, super polite, left the bathroom cleaner than before. Booked online in two minutes and got a text with the plumber's photo before he arrived. This is how it should work.",
  },
];

export const ratingBreakdown = [
  { stars: 5, pct: 93 },
  { stars: 4, pct: 5 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 0.5 },
  { stars: 1, pct: 0.5 },
];
