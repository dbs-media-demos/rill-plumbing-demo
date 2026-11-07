/**
 * "Phone" for this site: under 768 px, or a touch screen under 1024 px. Same query as the `phone:`
 * Tailwind variant in globals.css (a CSS file can't import it, so change both together).
 * From 1024 px up everything stays the desktop site.
 */
export const PHONE_MEDIA = "(max-width: 47.98rem), (hover: none) and (pointer: coarse) and (max-width: 63.98rem)";

export const isPhone = () => typeof window !== "undefined" && window.matchMedia(PHONE_MEDIA).matches;
