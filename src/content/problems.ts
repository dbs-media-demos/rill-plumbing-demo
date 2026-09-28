export type Urgency = 1 | 2 | 3;

export type Problem = {
  id: string;
  label: string;
  urgency: Urgency;
  urgencyLabel: string;
  headline: string;
  now: string[];
  fix: string;
  price: string;
  service: string;
};

export const urgencyCopy: Record<Urgency, { label: string; tone: string }> = {
  3: { label: "Act now", tone: "Emergency" },
  2: { label: "Today", tone: "Same-day" },
  1: { label: "This week", tone: "Schedule" },
};

export const problems: Problem[] = [
  {
    id: "burst",
    label: "Burst pipe",
    urgency: 3,
    urgencyLabel: "Shut off your main valve now",
    headline: "Water's spraying. Stop it at the source first.",
    now: [
      "Shut off the main valve: meter box at the curb, or where the line enters the house (turn clockwise).",
      "Turn off the water heater (gas: set to 'Pilot'; electric: flip the breaker).",
      "Open a low faucet outside to drain pressure from the lines.",
      "Keep people and pets away from wet outlets and ceilings.",
    ],
    fix: "Cut out the failed section, install a new line, pressure test and moisture-check the area.",
    price: "$189 – $650",
    service: "emergency-plumbing",
  },
  {
    id: "leak",
    label: "Leak",
    urgency: 2,
    urgencyLabel: "Contain it and call today",
    headline: "A drip today is a ceiling stain next month.",
    now: [
      "Close the shut-off valve under the sink or behind the toilet.",
      "Put a bowl or towel down and take a photo for reference.",
      "If you can't find the source, check your meter for movement with everything off.",
    ],
    fix: "Replace the failed supply line, valve or fitting. For hidden leaks: electronic leak detection.",
    price: "$149 – $395",
    service: "leak-detection",
  },
  {
    id: "clog",
    label: "Clogged drain",
    urgency: 2,
    urgencyLabel: "Stop running water to it",
    headline: "Slow or stopped? Don't reach for the chemicals.",
    now: [
      "Stop using the fixture, and check if other drains are slow too.",
      "Try a flat-cup plunger (sinks) or flange plunger (toilets) for a minute.",
      "Skip chemical drain cleaners; they can damage pipes and burn skin.",
      "If multiple drains are backing up, it's likely the main line. Call us.",
    ],
    fix: "Cable clearing at the fixture or cleanout; camera inspection if it's the main line.",
    price: "$149 – $395",
    service: "drain-cleaning",
  },
  {
    id: "hot",
    label: "No hot water",
    urgency: 2,
    urgencyLabel: "Safe to wait a few hours",
    headline: "Cold shower tonight? Not if we can help it.",
    now: [
      "Gas: check the pilot through the window at the bottom. Electric: check the breaker.",
      "Look for water around the base of the tank.",
      "Smell gas? Leave the house, then call 911 and your gas company.",
    ],
    fix: "Replace thermocouple, element, or gas valve, or same-day tank replacement if the tank has failed.",
    price: "$179 – $2,400",
    service: "water-heaters",
  },
  {
    id: "toilet",
    label: "Running toilet",
    urgency: 1,
    urgencyLabel: "Book at your convenience",
    headline: "That hiss can waste 200 gallons a day.",
    now: [
      "Lift the tank lid and check the flapper is seating properly.",
      "Close the valve behind the toilet if it won't stop.",
      "Drop food coloring in the tank: color in the bowl in 10 min means a leaking flapper.",
    ],
    fix: "New flapper and fill valve, or a full rebuild. Replacement if the tank is cracked.",
    price: "$129 – $295",
    service: "fixtures-remodel",
  },
  {
    id: "pressure",
    label: "Low pressure",
    urgency: 1,
    urgencyLabel: "Book at your convenience",
    headline: "Weak showers usually have one simple cause.",
    now: [
      "Check if it's one fixture (clogged aerator) or the whole house.",
      "Make sure the main valve is fully open.",
      "Ask a neighbor: if theirs is low too, it may be a city issue.",
    ],
    fix: "Clean aerators, replace the pressure-reducing valve (PRV), or find a hidden leak.",
    price: "$149 – $595",
    service: "leak-detection",
  },
  {
    id: "smell",
    label: "Sewer smell",
    urgency: 2,
    urgencyLabel: "Ventilate and call today",
    headline: "Rotten-egg smell means gas is getting in somewhere.",
    now: [
      "Pour a pitcher of water down unused floor drains and tubs (dry traps are common).",
      "Open windows and run exhaust fans.",
      "If you smell natural gas instead (sulfur, near appliances), leave and call 911.",
    ],
    fix: "Refill or replace dry traps, reseal a toilet wax ring, repair a vent, or camera the sewer line.",
    price: "$149 – $495",
    service: "sewer-line-repair",
  },
];
