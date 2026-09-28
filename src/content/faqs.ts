export type Faq = { q: string; a: string };
export type FaqGroup = { id: string; label: string; items: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "pricing",
    label: "Pricing",
    items: [
      {
        q: "How does your pricing work?",
        a: "Flat, upfront prices per job, not per hour. We diagnose, show you the options with a price for each, and you choose. Nothing starts until you approve it.",
      },
      {
        q: "Do you charge extra for nights, weekends or holidays?",
        a: "Never. The price at 2 am on Christmas is the same as 2 pm on a Tuesday.",
      },
      {
        q: "Is there a trip or diagnostic fee?",
        a: "No trip fee anywhere in our service area. A diagnostic visit is $79, and it's waived if you go ahead with the repair.",
      },
      {
        q: "Do you offer financing?",
        a: "Yes, for water heaters, repipes, sewer lines and larger jobs, with options from 12 to 60 months, subject to approval.",
      },
    ],
  },
  {
    id: "service",
    label: "Service",
    items: [
      {
        q: "Are you really available 24/7?",
        a: "Yes. A real dispatcher answers day and night, and a plumber is on call for every part of our service area.",
      },
      {
        q: "How fast can you get here?",
        a: "Most emergency calls see a plumber in 35–55 minutes. Scheduled work gets a 2-hour arrival window and a text when we're on the way.",
      },
      {
        q: "Which areas do you serve?",
        a: "Plano, Frisco, Allen, Richardson, Carrollton and North Dallas, plus nearby neighborhoods in Collin, Denton and Dallas counties.",
      },
      {
        q: "Will you protect my floors?",
        a: "Every time. Shoe covers on at the door, drop cloths and floor protection down, and we clean up before we leave.",
      },
    ],
  },
  {
    id: "trust",
    label: "Licensing & warranty",
    items: [
      {
        q: "Are your plumbers licensed?",
        a: "Yes. Every plumber is licensed by the Texas State Board of Plumbing Examiners, background-checked and drug-tested. We're fully insured. (License number shown is a demo placeholder.)",
      },
      {
        q: "What warranty do you offer?",
        a: "A 1-year labor warranty on all work, plus the manufacturer's warranty on parts and equipment, which we register for you.",
      },
      {
        q: "Do you pull permits?",
        a: "Yes, for water heaters, repipes, sewer replacements, gas lines and remodel plumbing. It's included in the price.",
      },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.items);

export const homeFaqs = [
  faqGroups[0].items[0],
  faqGroups[0].items[1],
  faqGroups[1].items[1],
  faqGroups[1].items[3],
  faqGroups[2].items[0],
  faqGroups[2].items[1],
];
