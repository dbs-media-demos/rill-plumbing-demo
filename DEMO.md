# Rill Plumbing Co. (Scale by Noon demo)

- Niche: Plumbing         (matches www.scalebynoon.com industry id: plumbing)
- Market / city: US – North Dallas / Plano, TX (Plano, Frisco, Allen, Richardson, Carrollton, North Dallas)
- Languages: en
- Live URL: https://rill-plumbing-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/rill-plumbing-demo
- Folder: DBS Media Portfolio/Demo Websites/plumbing
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3 (ScrollTrigger, SplitText, Flip, MotionPath), Lenis, three.js 0.187 (desktop only)
- Palette: #06222F abyss · #0A6B85 river · #CDEFF5 spray · #F6F8F7 porcelain · #5A48E0 bluebonnet (CTA) · #FFCB47 sunny
  Fonts: Bricolage Grotesque (display) · Figtree (body), one self-hosted Latin + Latin Extended file each · Fraunces Italic (accent, desktop only)
- Pages: 27 routes, all statically generated, plus the 404 and a dynamic OG image route.
  Home, Services + 9 service pages, Pricing, Our work, About, Reviews, FAQ, Emergency tips, Book, Contact, Service areas + 6 city pages, Privacy.
- Signature features:
  - **3D copper hero (three.js):** copper pipework on a dark wall, lit by one warm key light that throws soft shadows: a cold line through a brass ball valve with a red lever (the main shut-off), a dual psi/bar gauge, and a brass spout pouring a real water stream; a hot line beside it. Click the valve: the lever turns a quarter, the stream thins and falls away, the gauge drops to 0 (click again to reopen). The cursor leans the camera, the scroll follows the water down, and a warm glint runs down the copper on arrival. Built from primitives, no downloaded model. `components/fx/pipes3d/heroScene.ts`, mounted by `components/fx/HeroPipes.tsx`.
  - **The Pipeline, in 3D:** one pipe runs down the home page, crossing the page at each section seam, and fills with water as you scroll. On desktop it is a glass tube with copper elbows (solder rings and all) and brass clips, the water visibly flowing inside it, and a soft shadow on the page. One fixed transparent canvas draws it on GSAP's ticker right after Lenis moves the page, so it never lags the scroll, and stops when no pipe is on screen (`components/fx/pipes3d/pipeline.ts`). Without 3D it is the SVG version.
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
EN one-liner (≤ 120 chars): A 24/7 plumber site with a 3D copper-pipework hero, a problem triage tool and a real-time van ETA map.
EN summary (2–3 sentences): A concept site for a North Dallas plumbing company, built to win the 11 pm emergency call. Visitors shut off a real 3D valve, watch water run through a glass-and-copper pipe down the page, get triage and shut-off steps for their exact problem, see upfront prices and watch the nearest van get dispatched on a map. The booking flow takes under a minute on a phone.
SR title: Rill Plumbing Co.
SR one-liner: Sajt za vodoinstalatere 24/7: 3D bakarne cevi sa ventilom u hero sekciji, alat za trijažu kvara i mapa sa vremenom dolaska kombija.
SR summary: Koncept sajt za vodoinstalatersku firmu iz severnog Dalasa, napravljen da dobije hitan poziv u 11 uveče. Posetilac zatvara pravi 3D ventil, gleda kako voda teče kroz staklenu cev sa bakarnim kolenima niz stranicu, dobija uputstvo za svoj tačan kvar (i kako da zatvori glavni ventil), vidi cene unapred i gleda kako najbliži kombi kreće ka njemu na mapi. Zakazivanje na telefonu traje manje od minuta.

## Screenshots
handoff/desktop-home.png, handoff/desktop-feature.png (ETA map dispatch), handoff/mobile-home.png, handoff/scroll.mp4

## Phones
"Phone" is under 768 px, or a touch screen under 1024 px: `lib/phone.ts` and the `phone:` variant in `globals.css` (same query, change both). From 1024 px up it stays the desktop site.
- Section order: the source order is the desktop's; `phone:order-*` in `HomeContent` sets the phone's (problems, services, licence and address, reviews, fee, photos, form, FAQ).
- No pinned scenes, Pipeline, WebGL, Lenis, GSAP or Fraunces on first load. `lib/gsap` loads GSAP on desktop only, and on phones when a visitor drives the ETA map. Hero: a still, never faded in.
- Zero bytes of three.js: `lib/three-gate` is the only door to it. After load, on a big screen with a mouse (`(min-width: 1024px) and (hover: hover) and (pointer: fine)`), no reduced motion, no Save-Data, the hero and the Pipeline `await import()` their scenes; everyone else keeps the still and the SVG pipe. The hero's heading, text and buttons are in the server HTML and never animate in.
- Hero on phones: the plumber photo is the first paint (LCP), then crossfades once, after load, to `hero-pipes-phone.jpg` (the same 3D pipework, framed for a phone); skipped with reduced motion or if it takes over 4 s.
- Stills: `public/images/hero-pipes.jpg` (desktop, cropped by CSS exactly as the live camera crops, `object-[74%_42%]` = `ANCHOR` in the scene) and `hero-pipes-phone.jpg` are rendered from the live scene by `scripts/render-hero.mjs`. Re-run it after changing the scene, and clear `.next/cache/images` before checking locally (the image optimiser keeps the old one).
- Motion: tap feedback, one fade-and-rise per section (`SectionRise`), swipe rails (`.rail`), the tools, and one niche touch (the price gauge's needle).
- The concept marker sits in the page on phones (hero photo, footer) so it never floats over anything.
- Client components get `serviceLinks` / `cityLinks` as props: importing `content/services` or `content/cities` into one ships the whole service and city copy.

## Notes for maintainers
- Business facts live in `src/lib/site.ts`. Content lives in `src/content/*` (services, problems, pricing, reviews, cities, FAQs, team/work).
- The business is fictional. Phone numbers are in the 555-01xx range, and the licence number is a placeholder. Forms validate but send nothing.
- Deploy: the Vercel project `rill-plumbing-demo` (team "Dimitrije's projects"). `vercel.json` pins the Next.js framework preset; projects created with `vercel project add` default to "Other" and 404 everywhere otherwise.
- Photos: Unsplash (see `public/images/SOURCES.md`). The 3D is built from primitives in code: no third-party models or textures.
