export type City = {
  slug: string;
  name: string;
  /** Name used in schema / titles ("North Dallas" → Dallas). */
  schemaName: string;
  county: string;
  image: string;
  imageAlt: string;
  /** Position on the illustrative service map (viewBox 0 0 1000 1000). */
  x: number;
  y: number;
  eta: number;
  zips: string[];
  neighborhoods: string[];
  intro: string;
  local: { title: string; body: string }[];
  faq: { q: string; a: string };
};

export const cities: City[] = [
  {
    slug: "plano",
    name: "Plano",
    schemaName: "Plano",
    county: "Collin County",
    image: "/images/plano-balloons.jpg",
    imageAlt: "Hot air balloons over Plano, Texas",
    x: 700,
    y: 500,
    eta: 38,
    zips: ["75023", "75024", "75025", "75074", "75075", "75093", "75094"],
    neighborhoods: ["Willow Bend", "Legacy West", "Deerfield", "Kings Ridge", "Hunters Glen", "Downtown Plano"],
    intro:
      "Plano is home base. Our shop and dispatch sit just off the Tollway, so Plano calls get our fastest arrivals, often under 40 minutes, day or night.",
    local: [
      {
        title: "Slab leaks in 1980s–90s homes",
        body: "Many Plano homes from that era have copper under the slab, and Collin County clay puts it under stress. We reroute through the attic instead of breaking floors.",
      },
      {
        title: "Water heaters hitting 12+ years",
        body: "A wave of original tanks in Deerfield and Hunters Glen is reaching end of life. We keep 40- and 50-gallon units on every van.",
      },
      {
        title: "Hard water scale",
        body: "Scale shortens tankless and tank life. A free water test tells you whether a softener is worth it.",
      },
    ],
    faq: {
      q: "Do you charge a trip fee in Plano?",
      a: "No. There's no trip fee anywhere in our service area, and our price is the same 24/7.",
    },
  },
  {
    slug: "frisco",
    name: "Frisco",
    schemaName: "Frisco",
    county: "Collin & Denton Counties",
    image: "/images/frisco-water-tower.jpg",
    imageAlt: "Historic Frisco water tower against a blue sky",
    x: 405,
    y: 205,
    eta: 46,
    zips: ["75033", "75034", "75035", "75036"],
    neighborhoods: ["Starwood", "Stonebriar", "Newman Village", "Phillips Creek Ranch", "The Trails", "Richwoods"],
    intro:
      "Frisco's newer homes mean PEX supply lines, tankless water heaters and lots of irrigation. We know these systems inside out, from builder-grade fittings to smart leak sensors.",
    local: [
      {
        title: "Builder-grade fittings",
        body: "Plastic PEX fittings and compression valves in 2000s–2010s builds are a common leak source. We upgrade to brass and crimp rings that last.",
      },
      {
        title: "Tankless descaling",
        body: "Frisco water scales tankless heat exchangers. Annual descaling keeps flow strong and warranties valid.",
      },
      {
        title: "Irrigation backflow leaks",
        body: "A spinning meter with everything off is often the sprinkler backflow. We test and repair it the same visit.",
      },
    ],
    faq: {
      q: "Can you service my tankless brand?",
      a: "Yes: Navien, Rinnai, Noritz, Rheem and A.O. Smith. We carry common parts on the van.",
    },
  },
  {
    slug: "allen",
    name: "Allen",
    schemaName: "Allen",
    county: "Collin County",
    image: "/images/aerial-suburbs.jpg",
    imageAlt: "Aerial view of North Texas suburbs at golden hour",
    x: 790,
    y: 300,
    eta: 44,
    zips: ["75002", "75013"],
    neighborhoods: ["Twin Creeks", "Star Creek", "Watters Creek", "Montgomery Farm", "Waterford Parks", "Bethany Lakes"],
    intro:
      "Allen families call us for everything from last-minute party clogs to full bath remodels. With a van staged along US-75, most Allen calls are covered in under 45 minutes.",
    local: [
      {
        title: "Main-line clogs",
        body: "Mature trees in Twin Creeks and Bethany Lakes mean root intrusion. We camera, clear and show you the footage.",
      },
      {
        title: "Water heater replacements",
        body: "Same-day installs with permits, pans and expansion tanks, all to Allen code.",
      },
      {
        title: "Remodel plumbing",
        body: "We coordinate rough-in and trim-out with your contractor and schedule inspections.",
      },
    ],
    faq: {
      q: "Do you pull permits in Allen?",
      a: "Yes, for water heaters, repipes, sewer replacements and remodel plumbing. It's included in our price.",
    },
  },
  {
    slug: "richardson",
    name: "Richardson",
    schemaName: "Richardson",
    county: "Dallas & Collin Counties",
    image: "/images/house-brick.jpg",
    imageAlt: "Two-story brick home in a North Texas neighborhood",
    x: 625,
    y: 700,
    eta: 41,
    zips: ["75080", "75081", "75082"],
    neighborhoods: ["Canyon Creek", "Richardson Heights", "Prairie Creek", "Cottonwood Heights", "Duck Creek", "Breckinridge Park"],
    intro:
      "Richardson has some of the area's most charming mid-century homes, and the plumbing that comes with them. Galvanized supply lines, cast-iron drains and clay sewers are our daily work here.",
    local: [
      {
        title: "Galvanized & cast-iron pipe",
        body: "1950s–70s homes in Richardson Heights and Cottonwood Heights often need repiping or drain lining. We give you the honest timeline.",
      },
      {
        title: "Slab leaks",
        body: "Shifting clay plus aging copper means slab leaks. We find them electronically and reroute cleanly.",
      },
      {
        title: "Low water pressure",
        body: "Failed pressure-reducing valves and corroded lines are common. Most PRV swaps take under two hours.",
      },
    ],
    faq: {
      q: "Is it worth repiping an older Richardson home?",
      a: "If you've had two or more leaks or see rusty water, usually yes. We'll show you the pipe condition and give a fixed price.",
    },
  },
  {
    slug: "carrollton",
    name: "Carrollton",
    schemaName: "Carrollton",
    county: "Dallas, Denton & Collin Counties",
    image: "/images/house-porch.jpg",
    imageAlt: "Classic home with a porch and mature trees",
    x: 230,
    y: 620,
    eta: 49,
    zips: ["75006", "75007", "75010"],
    neighborhoods: ["Castle Hills", "Indian Creek", "Country Place", "Downtown Carrollton", "Oak Creek", "Josey Ranch"],
    intro:
      "From Castle Hills estates to Downtown Carrollton bungalows, we cover every corner of Carrollton with a van staged near the George Bush Turnpike.",
    local: [
      {
        title: "Water quality",
        body: "Carrollton households often ask about taste and hardness. We test on site for free and size filtration to the results.",
      },
      {
        title: "Sewer backups after storms",
        body: "Heavy spring rain exposes cracked lines. Our camera shows exactly where.",
      },
      {
        title: "Fixture upgrades",
        body: "Faucets, toilets and disposals installed the right way, with new supply lines every time.",
      },
    ],
    faq: {
      q: "How fast can you get to Carrollton?",
      a: "Most Carrollton calls see a plumber in 45–55 minutes, and often faster at night when traffic is light.",
    },
  },
  {
    slug: "north-dallas",
    name: "North Dallas",
    schemaName: "Dallas",
    county: "Dallas County",
    image: "/images/dallas-skyline.jpg",
    imageAlt: "Dallas skyline on a clear day",
    x: 460,
    y: 790,
    eta: 47,
    zips: ["75230", "75240", "75248", "75252", "75254", "75287"],
    neighborhoods: ["Preston Hollow", "Prestonwood", "Bent Tree", "Hillcrest Forest", "Glen Abbey", "Highlands of McKamy"],
    intro:
      "North Dallas homes range from 1960s ranches to modern estates. We handle both, from cast-iron drain replacement to luxury fixture installs.",
    local: [
      {
        title: "Root intrusion",
        body: "Big old trees in Preston Hollow and Prestonwood mean roots in sewer lines. Trenchless replacement protects the landscaping.",
      },
      {
        title: "Luxury fixture installs",
        body: "Thermostatic shower valves, freestanding tub fillers and pot fillers, installed to spec.",
      },
      {
        title: "Recirculation pumps",
        body: "Long runs in large homes mean waiting for hot water. A recirc pump fixes that.",
      },
    ],
    faq: {
      q: "Do you work on high-end fixtures?",
      a: "Yes: Kohler, Waterworks, Brizo, California Faucets and more. We follow manufacturer specs so warranties stay intact.",
    },
  },
];

export const cityBySlug = (slug: string) => cities.find((c) => c.slug === slug);

export const zipToCity = (zip: string) => cities.find((c) => c.zips.includes(zip.trim()));
