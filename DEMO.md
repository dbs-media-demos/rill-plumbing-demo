# Rill Plumbing Co. (Scale by Noon demo)

- Niche: Plumbing         (matches scale-by-noon.vercel.app industry id: plumbing)
- Market / city: US – North Dallas / Plano, TX (Plano, Frisco, Allen, Richardson, Carrollton, North Dallas)
- Languages: en
- Live URL: https://rill-plumbing-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/rill-plumbing-demo
- Folder: DBS Media Portfolio/Demo Websites/plumbing
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3 (ScrollTrigger, SplitText, Flip, MotionPath), Lenis, WebGL
- Palette: #06222F abyss · #0A6B85 river · #CDEFF5 spray · #F6F8F7 porcelain · #5A48E0 bluebonnet (CTA) · #FFCB47 sunny
  Fonts: Bricolage Grotesque (display, self-hosted static subset) · Figtree (body) · Fraunces Italic (accent)
- Pages: 27 routes, all statically generated, plus the 404 and a dynamic OG image route.
  Home, Services + 9 service pages, Pricing, Our work, About, Reviews, FAQ, Emergency tips, Book, Contact, Service areas + 6 city pages, Privacy.
- Signature features:
  - **Live water hero:** a real-time WebGL wave simulation refracts the hero photo. The cursor or a tap drags ripples through it, with idle raindrops.
  - **The Pipeline:** one pipe runs down the home page, crossing the page at each section seam, and fills with water as you scroll. Joints light up as the water passes.
  - **Droplet zoom:** a droplet-shaped window over a plumber at work floods the screen while the house rules land ("Shoe covers on. Price agreed. Water off.").
  - **"What's the problem?" picker:** 7 animated icon tiles. Each shows an urgency meter, "do this now" steps, the likely fix, a price range and a "Send a plumber" button that pre-fills booking.
  - **Live ETA map:** a stylised North Dallas highway map with vans patrolling. Pick a city or ZIP and the nearest van is dispatched along a drawn route with a counting ETA (labelled illustrative).
  - **Upfront price menu:** category chips with smoothly expanding rows (includes, typical range, "book this job").
  - **Water-heater guide:** a tank-vs-tankless drag comparison, plus a sizing helper with an animated tank level and a GPM gauge.
  - **Other pieces:**
    - sticky stacking promise cards and a pinned horizontal work rail;
    - a Flip-filtered project gallery with lightbox;
    - an interactive shut-off valve finder (house diagram);
    - a 4-step booking form with validation, prefill and a success state;
    - rising-water page transitions, magnetic ripple buttons, a custom cursor, and a sticky Call/Book bar on mobile.
- Lighthouse (live, mobile): home P 83–89 / A 100 / BP 100 / SEO 69*. Inner pages P 91–92 / A 100 / BP 100 / SEO 69*. Desktop home P 99.
  *SEO 69 is only the intentional noindex (demo kept out of Google). Everything else passes; set NEXT_PUBLIC_NOINDEX=false for 100.

## Portfolio copy
EN title: Rill Plumbing Co.
EN one-liner (≤ 120 chars): A 24/7 plumber site with a live water hero, a problem triage tool and a real-time van ETA map.
EN summary (2–3 sentences): A concept site for a North Dallas plumbing company, built to win the 11 pm emergency call. Visitors stir a live WebGL water surface, get triage and shut-off steps for their exact problem, see upfront prices and watch the nearest van get dispatched on a map. The booking flow takes under a minute on a phone.
SR title: Rill Plumbing Co.
SR one-liner: Sajt za vodoinstalatere 24/7: živa vodena površina, alat za trijažu kvara i mapa sa vremenom dolaska kombija.
SR summary: Koncept sajt za vodoinstalatersku firmu iz severnog Dalasa, napravljen da dobije hitan poziv u 11 uveče. Posetilac pomera živu WebGL vodenu površinu, dobija uputstvo za svoj tačan kvar (i kako da zatvori glavni ventil), vidi cene unapred i gleda kako najbliži kombi kreće ka njemu na mapi. Zakazivanje na telefonu traje manje od minuta.

## Screenshots
handoff/desktop-home.png, handoff/desktop-feature.png (ETA map dispatch), handoff/mobile-home.png, handoff/scroll.mp4

## Notes for maintainers
- Business facts live in `src/lib/site.ts`. Content lives in `src/content/*` (services, problems, pricing, reviews, cities, FAQs, team/work).
- The business is fictional. Phone numbers are in the 555-01xx range, and the licence number is a placeholder. Forms validate but send nothing.
- Deploy: the Vercel project `rill-plumbing-demo` (team "Dimitrije's projects"). `vercel.json` pins the Next.js framework preset; projects created with `vercel project add` default to "Other" and 404 everywhere otherwise.
- Photos: Unsplash (see `public/images/SOURCES.md`).
