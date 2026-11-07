import { agencyName, agencyUrl } from "@/lib/site";
import type { Biz } from "@/lib/biz-core";

/** Phones: the concept-site marker sits in the page (on the hero photo, in the footer), so it never floats over anything. */
export function ConceptNote({ biz, className }: { biz: Biz; className?: string }) {
  return (
    <a href={agencyUrl} target="_blank" rel="noopener" className={className}>
      <span className="inline-block max-w-[15rem] truncate align-bottom">
        {biz.preview ? (biz.lang === "sr" ? `Pregled za ${biz.shortName} · ` : `Preview for ${biz.shortName} · by `) : "Concept site by "}
        <strong>{agencyName}</strong> ↗
      </span>
    </a>
  );
}
