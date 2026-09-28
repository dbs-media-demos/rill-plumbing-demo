/** Office hours in Dallas time. Plumbers are on call 24/7; the office (booking desk) keeps these hours. */

export const OFFICE = { open: 7, close: 19, days: [1, 2, 3, 4, 5, 6] }; // Mon–Sat, 7 am – 7 pm

export type OfficeStatus = { open: boolean; label: string };

const fmt = (h: number) => `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? "am" : "pm"}`;

export function officeStatus(now = new Date()): OfficeStatus {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 12) % 24;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
  const openToday = OFFICE.days.includes(day);
  if (openToday && hour >= OFFICE.open && hour < OFFICE.close) {
    return { open: true, label: `Office open · closes ${fmt(OFFICE.close)}` };
  }
  const nextOpenDay = hour < OFFICE.open && openToday ? "today" : day === 6 ? "Monday" : "tomorrow";
  return { open: false, label: `Office opens ${fmt(OFFICE.open)} ${nextOpenDay}` };
}
