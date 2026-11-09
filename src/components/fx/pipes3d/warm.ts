import {
  BufferAttribute,
  BufferGeometry,
  BackSide,
  DoubleSide,
  FrontSide,
  Mesh,
  MeshDepthMaterial,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  VSMShadowMap,
  WebGLRenderTarget,
  type Camera,
  type Material,
  type Object3D,
  type Side,
  type Texture,
  type WebGLRenderer,
} from "three";
import { fragment as vsmFrag, vertex as vsmVert } from "three/src/renderers/shaders/ShaderLib/vsm.glsl.js";
import { perfLog } from "@/lib/three-gate";

/*
 * Getting a scene ready before anyone sees it, so nothing compiles mid-scroll. compileAsync only
 * covers the main pass; three.js would still compile the shadow pass (depth + VSM blur) and the
 * transmission pass (every opaque material again, drawn into a target: linear colour, no tone
 * mapping) synchronously in the first frame, which froze the page for most of a second. So all of
 * those are compiled here too, off the main thread, and then one frame is drawn while the canvas
 * is still invisible (geometry and textures upload there).
 */

/** Software WebGL (SwiftShader, llvmpipe, Microsoft Basic Render): no proper graphics chip. */
export function isSoftwareGL(renderer: WebGLRenderer) {
  const gl = renderer.getContext();
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
}

/** Throw (so the still stays) unless this is a real GPU. Frees the context first. */
export function assertRealGPU(renderer: WebGLRenderer) {
  if (!isSoftwareGL(renderer)) return;
  renderer.dispose();
  renderer.forceContextLoss();
  throw new Error("software WebGL");
}

/** compileAsync, as if drawing into a render target (the shadow and transmission passes do). */
function compileInTarget(renderer: WebGLRenderer, scene: Object3D, camera: Camera, lights: Scene, rt: WebGLRenderTarget) {
  const prev = renderer.getRenderTarget();
  renderer.setRenderTarget(rt);
  // the programs are picked synchronously, so the target only needs to be set for this call
  const done = renderer.compileAsync(scene, camera, lights);
  renderer.setRenderTarget(prev);
  return done;
}

// three.js's build strips comments and blank lines from its shaders; the cache only matches the same text
const asBuilt = (glsl: string) =>
  glsl
    .trim()
    .replace(/\r/g, "")
    .replace(/[ \t]*\/\/.*\n/g, "")
    .replace(/[ \t]*\/\*[\s\S]*?\*\//g, "")
    .replace(/\n{2,}/g, "\n");

/**
 * pmrem.fromScene(room, sigma), without its shaders compiling on the main thread: a dry run first,
 * where every draw only picks its program (compiled in parallel), then the real bake.
 */
export async function bakeEnvironment(renderer: WebGLRenderer, room: Scene, sigma: number): Promise<Texture> {
  const pmrem = new PMREMGenerator(renderer);
  const render = renderer.render;
  const jobs: Promise<unknown>[] = [];
  renderer.render = (scene, camera) => void jobs.push(renderer.compileAsync(scene, camera));
  try {
    pmrem.fromScene(room, sigma).dispose();
  } finally {
    renderer.render = render;
  }
  await Promise.all(jobs);
  const env = pmrem.fromScene(room, sigma).texture;
  pmrem.dispose();
  return env;
}

type Light = Object3D & { isLight?: boolean; castShadow: boolean; shadow?: { blurSamples?: number } };

/** Stand-ins for what three.js's shadow map draws: the depth materials, and the VSM blur. */
function shadowPass(renderer: WebGLRenderer, scene: Scene) {
  const out = new Scene();
  const owned: (Material | BufferGeometry)[] = [];
  const vsm = renderer.shadowMap.type === VSMShadowMap;
  const depth = new Map<string, MeshDepthMaterial>();
  let blur = 0;
  scene.traverse((o) => {
    const l = o as Light;
    if (vsm && l.isLight && l.castShadow) blur = l.shadow?.blurSamples ?? 8;
    if (!(o instanceof Mesh) || !(o.castShadow || (vsm && o.receiveShadow))) return;
    for (const m of (Array.isArray(o.material) ? o.material : [o.material]) as Material[]) {
      // the depth material three.js's shadow map draws this one with (WebGLShadowMap.getDepthMaterial)
      const side = m.shadowSide ?? (vsm ? m.side : ([1, 0, 2] as Side[])[m.side]);
      const t = m as Material & Partial<Pick<MeshDepthMaterial, "map" | "alphaMap" | "displacementMap" | "displacementScale">>;
      const key = [side, !!t.map, !!t.alphaMap, m.alphaTest, !!t.displacementMap].join();
      let d = depth.get(key);
      if (!d) {
        d = new MeshDepthMaterial({ side, map: t.map, alphaMap: t.alphaMap, alphaTest: m.alphaTest, displacementMap: t.displacementMap, displacementScale: t.displacementScale });
        depth.set(key, d);
        owned.push(d);
      }
      out.add(new Mesh(o.geometry, d));
    }
  });
  if (blur) {
    const tri = new BufferGeometry();
    tri.setAttribute("position", new BufferAttribute(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3));
    owned.push(tri);
    for (const defines of [{ VSM_SAMPLES: blur }, { VSM_SAMPLES: blur, HORIZONTAL_PASS: 1 }]) {
      const m = new ShaderMaterial({ defines, vertexShader: asBuilt(vsmVert), fragmentShader: asBuilt(vsmFrag) });
      owned.push(m);
      out.add(new Mesh(tri, m));
    }
  }
  return { scene: out, dispose: () => owned.forEach((x) => x.dispose()) };
}

/** Compile every program the scene will use (hidden things too), then draw one frame unseen. */
export async function warm(renderer: WebGLRenderer, scene: Scene, camera: Camera, name: string) {
  const hidden: Object3D[] = [];
  const doubles = new Set<Material>();
  scene.traverse((o) => {
    if (!o.visible) {
      hidden.push(o);
      o.visible = true;
    }
    if (o instanceof Mesh) ((Array.isArray(o.material) ? o.material : [o.material]) as Material[]).forEach((m) => m.side === DoubleSide && doubles.add(m));
  });
  const rt = new WebGLRenderTarget(1, 1);
  const shadows = renderer.shadowMap.enabled ? shadowPass(renderer, scene) : null;
  try {
    const t0 = performance.now();
    const jobs = [shadows && compileInTarget(renderer, shadows.scene, camera, scene, rt)];
    // a double-sided material is drawn front, back and both ways (the transparent and transmission passes)
    for (const side of doubles.size ? [FrontSide, BackSide, DoubleSide] : [DoubleSide]) {
      doubles.forEach((m) => (m.side = side));
      jobs.push(renderer.compileAsync(scene, camera), compileInTarget(renderer, scene, camera, scene, rt));
    }
    doubles.forEach((m) => (m.needsUpdate = true));
    await Promise.all(jobs);
    const before = renderer.info.programs?.length ?? 0;
    const t1 = performance.now();
    renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera);
    const left = (renderer.info.programs?.length ?? 0) - before;
    perfLog(`${name}: shaders compiled in ${Math.round(t1 - t0)} ms; first frame ${Math.round(performance.now() - t1)} ms, ${left} left to compile in it`);
  } finally {
    hidden.forEach((o) => (o.visible = false));
    renderer.shadowMap.needsUpdate = true;
    rt.dispose();
    shadows?.dispose();
  }
}
