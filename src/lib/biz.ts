import { site } from "./site";
import { OFFICE } from "./hours";
import { type Biz, type DayHours } from "./biz-core";

export type { Biz } from "./biz-core";

const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

/** The fictional company as a Biz: what the concept site shows (previews swap in a real one). */
export const defaultBiz: Biz = {
  lang: "en",
  name: site.name,
  shortName: site.short,
  tagline: null,
  area: "Plano & North Dallas",
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
  address: { street: "", city: site.address.locality, region: site.address.region, postal: site.address.postalCode, full: site.address.display },
  timezone: "America/Chicago",
  hours: [0, 1, 2, 3, 4, 5, 6].map((day): DayHours => (OFFICE.days.includes(day) ? { day, open: hh(OFFICE.open), close: hh(OFFICE.close) } : { day, open: null, close: null })),
  hoursSummary: site.hours.office,
  rating: { value: site.rating, count: site.reviewCount },
  preview: false,
};
