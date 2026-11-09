// Renders the hero stills from the live 3D scene (src/components/fx/pipes3d/heroScene.ts), so the
// still in the server HTML, the phone hero and the canvas that fades in over it are the same frame:
//   public/images/hero-pipes.jpg        2400 x 1500, the desktop framing (FRAME, cropped like object-cover)
//   public/images/hero-pipes-phone.jpg  1080 x 1350, the phones' closer framing
// Run again after changing the scene, a pose or a frame.
//
// Needs esbuild and playwright (with a Chromium) somewhere node can resolve them, e.g. a scratch folder:
//   npm i esbuild playwright sharp && npx playwright install chromium
//   NODE_PATH=<scratch>/node_modules node scripts/render-hero.mjs [--preview]
// It bundles the scene, serves it to Chromium from memory (no server), and uses the real GPU.
// --preview writes PNGs to ./.stills-preview instead (for looking, not shipping).
import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(path.join(process.env.NODE_PATH ?? process.cwd(), "x.js"));
const esbuild = require("esbuild");
const { chromium } = require("playwright");
const sharp = require("sharp");
const ROOT = process.cwd();
const preview = process.argv.includes("--preview");

const entry = `
import { createHeroPipes } from "${path.join(ROOT, "src/components/fx/pipes3d/heroScene.ts").split(path.sep).join("/")}";
window.snap = async (view, w, h) => {
  const c = document.getElementById("c");
  c.style.width = w + "px"; c.style.height = h + "px";
  const s = window.S ?? (window.S = await createHeroPipes(c, { still: true }));
  s.resize(); s.still(view);
  return c.toDataURL("image/png");
};`;
const { outputFiles } = await esbuild.build({
  stdin: { contents: entry, resolveDir: ROOT, loader: "ts" },
  bundle: true,
  write: false,
  format: "iife",
  nodePaths: [path.join(ROOT, "node_modules")],
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("console", (m) => console.log("[page]", m.text()));
page.on("pageerror", (e) => console.log("[error]", e.message));
await page.route("http://stills.local/**", (r) => {
  const u = new URL(r.request().url()).pathname;
  if (u === "/") return r.fulfill({ contentType: "text/html", body: `<body style="margin:0"><canvas id="c"></canvas><script src="/b.js"></script>` });
  if (u === "/b.js") return r.fulfill({ contentType: "text/javascript", body: outputFiles[0].text });
  return r.fulfill({ status: 404, body: "" });
});
await page.goto("http://stills.local/");
const outDir = preview ? path.join(ROOT, ".stills-preview") : path.join(ROOT, "public/images");
fs.mkdirSync(outDir, { recursive: true });
for (const [view, w, h, file, width] of [
  ["desktop", 2400, 1500, "hero-pipes.jpg", 2400],
  ["phone", 1080, 1350, "hero-pipes-phone.jpg", 1080],
]) {
  const url = await page.evaluate(([v, w, h]) => window.snap(v, w, h), [view, w, h]);
  const buf = Buffer.from(url.split(",")[1], "base64");
  if (preview) await sharp(buf).resize(Math.round(width / 2)).png().toFile(path.join(outDir, file.replace(".jpg", ".png")));
  else await sharp(buf).resize(width).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(outDir, file));
  console.log(file);
}
await browser.close();
