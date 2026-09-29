import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

// Brand fonts and the water backdrop are read once at module scope. URLs relative
// to this file are traced into the deployment bundle.
const [display, sans, serif, bg] = await Promise.all([
  readFile(new URL("../../../assets/fonts/Bricolage-600.ttf", import.meta.url)),
  readFile(new URL("../../../assets/fonts/Figtree-500.ttf", import.meta.url)),
  readFile(new URL("../../../assets/fonts/Fraunces-Italic.ttf", import.meta.url)),
  readFile(new URL("../../../assets/og-bg.jpg", import.meta.url)),
]);
const bgSrc = `data:image/jpeg;base64,${bg.toString("base64")}`;

/** Branded 1200×630 share image: /api/og?title=…&eyebrow=… */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Water where it belongs.").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "24/7 plumbers · Plano & North Dallas").slice(0, 60);
  const size = title.length > 70 ? 56 : title.length > 42 ? 68 : 84;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Figtree", color: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bgSrc} width={1200} height={630} alt="" style={{ position: "absolute", inset: 0 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "linear-gradient(90deg, rgba(6,34,47,0.92) 0%, rgba(6,34,47,0.6) 60%, rgba(6,34,47,0.25) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="60" height="60" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="16" fill="#5a48e0" />
              <path d="M21 30v9a11 11 0 0 0 22 0v-9" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
              <path d="M32 6s-7.5 9.6-7.5 14.2a7.5 7.5 0 0 0 15 0C39.5 15.6 32 6 32 6Z" fill="#ffcb47" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "Bricolage", fontSize: 38, letterSpacing: -1 }}>rill</span>
              <span style={{ fontSize: 15, letterSpacing: 4, opacity: 0.75 }}>PLUMBING CO.</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 940 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#cdeff5", fontSize: 24, letterSpacing: 3, textTransform: "uppercase" }}>
              <div style={{ width: 12, height: 12, borderRadius: 12, background: "#ffcb47" }} />
              {eyebrow}
            </div>
            <div style={{ display: "flex", fontFamily: "Bricolage", fontSize: size, lineHeight: 1.02, letterSpacing: -2.5 }}>{title}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24, color: "rgba(255,255,255,0.75)" }}>
            <div style={{ display: "flex", fontFamily: "Fraunces", fontStyle: "italic", fontSize: 34, color: "#cdeff5" }}>Water where it belongs.</div>
            <div style={{ display: "flex" }}>(972) 555-0147 · 24/7</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Bricolage", data: display, weight: 600, style: "normal" },
        { name: "Figtree", data: sans, weight: 500, style: "normal" },
        { name: "Fraunces", data: serif, weight: 400, style: "italic" },
      ],
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
