import { LeadLogo } from "@/components/brand/LeadLogo";
import { loaderSvg } from "@/lib/lead-logo";
import { loaderScript } from "@/lib/loader";

/** How long the exit takes in globals.css (the deep water draining down off the page) */
const EXIT_MS = 820;

/**
 * A preview's first view in a tab opens on the business's own logo, on the hero's deep water blue: the
 * mark's outlines draw themselves like pipe runs laid on a wall, their fills come in, the name flows out of
 * a mask from the left, and the water level drops off the page (top first) as the hero comes in. ~2.4 s;
 * a click or key skips it; reduced motion shows the finished logo for 0.6 s, then fades. It's in the
 * server HTML, so it's the first paint; the inline script before it skips it on a reload in the same tab
 * and times it (lib/loader.ts). The CSS hides it at 3 s whatever happens.
 */
export function LeadLoader({ token, svg }: { token: string; svg: string }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: loaderScript(token, EXIT_MS) }} />
      <div className="lead-loader on-dark" aria-hidden>
        <div className="lead-loader__glow" />
        <LeadLogo svg={loaderSvg(svg)} className="lead-loader__logo" />
      </div>
    </>
  );
}
