import {
  ACESFilmicToneMapping,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Curve,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  PointLight,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SpotLight,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  VSMShadowMap,
  WebGLRenderer,
  type Material,
  type Object3D,
  type Texture,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { assertRealGPU, bakeEnvironment, warm } from "./warm";

/*
 * The hero: copper pipework on a dark wall, the way a proud plumber leaves it. A cold line comes
 * down through a brass ball valve with a red lever (the main shut-off), past a pressure gauge, and
 * bends out to a brass spout that pours a real stream of water; a hot line runs beside it. One warm
 * key light from the upper left throws the pipes' soft shadows onto the wall behind them.
 *
 * The visitor can click the valve: the lever swings a quarter turn, the stream thins and falls
 * away, the gauge drops to zero, and a click more opens it again. The cursor leans the camera so
 * the pipes slide over their own shadows; the scroll follows the water down into the page.
 *
 * Built from primitives (no downloaded model). Desktop only: the hero imports this module with
 * `await import()` behind lib/three-gate, so phones never download three.js. The same scene renders
 * the stills (scripts/render-hero.mjs) that sit in the server HTML and on phones.
 */

/** The reference frame the still is rendered at; the live camera crops it like CSS object-cover. */
export const FRAME = { w: 1600, h: 1000 };
/** Where the crop is anchored, as CSS object-position. Keep in step with the hero's still. */
export const ANCHOR = { x: 0.74, y: 0.42 };

const Z = 0.36; // pipe axis, out from the wall
const R = 0.1; // copper pipe radius
const FR = R * 1.16; // fitting radius
const BEND = 0.2; // elbow bend radius
const COLD_X = 2.72;
const HOT_X = 3.36;
const VALVE_Y = 1.62;
const TEE_Y = 0.32;
const TURN_Y = -0.62;
const SPOUT_X = 1.62;
const SPOUT_Y = -1.5; // where the spout's nozzle opens
const LOOK = new Vector3(0.05, 0.3, 0);
const EYE = new Vector3(-1.75, 0.95, 12.6);
const FOV = 21;

const PHONE = { eye: new Vector3(1.1, 1.6, 10.2), look: new Vector3(2.62, 0.95, 0), fov: 26, aspect: 0.8 };

const v3 = (x: number, y: number, z = Z) => new Vector3(x, y, z);
const pause = () => new Promise<void>((r) => setTimeout(r, 0));
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

/** Fine draw marks along a copper tube: the roughness varies around the pipe, never along it. */
function drawMarks(): Texture {
  const w = 256;
  const h = 8;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let walk = 0;
  for (let x = 0; x < w; x++) {
    walk = walk * 0.7 + (rnd() - 0.5) * 0.6;
    const g = Math.max(0, Math.min(255, (0.78 + walk * 0.25 + (rnd() - 0.5) * 0.08) * 255));
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = g;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

/** A trowelled plaster wall: soft value noise, used for both the colour and a faint bump. */
function plaster(): Texture {
  const n = 256;
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(n, n);
  let seed = 3;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const octave = (cells: number) => {
    const g: number[] = [];
    for (let i = 0; i < cells * cells; i++) g.push(rnd());
    return (x: number, y: number) => {
      const fx = (x / n) * cells;
      const fy = (y / n) * cells;
      const x0 = Math.floor(fx) % cells;
      const y0 = Math.floor(fy) % cells;
      const x1 = (x0 + 1) % cells;
      const y1 = (y0 + 1) % cells;
      const sx = fx - Math.floor(fx);
      const sy = fy - Math.floor(fy);
      const u = sx * sx * (3 - 2 * sx);
      const w = sy * sy * (3 - 2 * sy);
      const a = g[y0 * cells + x0] + (g[y0 * cells + x1] - g[y0 * cells + x0]) * u;
      const b = g[y1 * cells + x0] + (g[y1 * cells + x1] - g[y1 * cells + x0]) * u;
      return a + (b - a) * w;
    };
  };
  const os = [octave(4), octave(8), octave(16), octave(64)];
  const amp = [0.45, 0.28, 0.17, 0.1];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let s = 0;
      for (let k = 0; k < os.length; k++) s += os[k](x, y) * amp[k];
      const v = Math.max(0, Math.min(255, (0.74 + (s - 0.5) * 0.36) * 255));
      const i = (y * n + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(3, 2);
  return t;
}

/** The gauge face: a dual scale, psi outside in black, bar inside in red, as real gauges have. */
function dial(): Texture {
  const n = 512;
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const ctx = c.getContext("2d")!;
  const m = n / 2;
  ctx.fillStyle = "#f3f0e8";
  ctx.beginPath();
  ctx.arc(m, m, m, 0, Math.PI * 2);
  ctx.fill();
  const a = (f: number) => (-225 + f * 270) * (Math.PI / 180); // 0 at lower left, clockwise to lower right
  ctx.strokeStyle = "#16242a";
  ctx.lineCap = "butt";
  for (let i = 0; i <= 80; i++) {
    const f = i / 80;
    const major = i % 10 === 0;
    const mid = i % 5 === 0;
    const r1 = m * 0.86;
    const r0 = r1 - (major ? 34 : mid ? 22 : 13);
    ctx.lineWidth = major ? 5 : 2.4;
    ctx.beginPath();
    ctx.moveTo(m + Math.cos(a(f)) * r0, m + Math.sin(a(f)) * r0);
    ctx.lineTo(m + Math.cos(a(f)) * r1, m + Math.sin(a(f)) * r1);
    ctx.stroke();
  }
  ctx.fillStyle = "#16242a";
  ctx.font = "600 34px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 8; i++) {
    const f = i / 8;
    const r = m * 0.58;
    ctx.fillText(String(i * 20), m + Math.cos(a(f)) * r, m + Math.sin(a(f)) * r);
  }
  // bar: 0-11 against 160 psi (11.03 bar)
  ctx.fillStyle = "#b8322b";
  ctx.strokeStyle = "#b8322b";
  ctx.font = "600 22px Arial, Helvetica, sans-serif";
  for (let b = 0; b <= 11; b++) {
    const f = (b * 14.5038) / 160;
    const r = m * 0.36;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m + Math.cos(a(f)) * (m * 0.43), m + Math.sin(a(f)) * (m * 0.43));
    ctx.lineTo(m + Math.cos(a(f)) * (m * 0.48), m + Math.sin(a(f)) * (m * 0.48));
    ctx.stroke();
    if (b % 2 === 0) ctx.fillText(String(b), m + Math.cos(a(f)) * r, m + Math.sin(a(f)) * r);
  }
  ctx.font = "600 26px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "#16242a";
  ctx.fillText("psi", m, m + m * 0.42);
  ctx.fillStyle = "#b8322b";
  ctx.font = "600 20px Arial, Helvetica, sans-serif";
  ctx.fillText("bar", m, m + m * 0.58);
  // the chrome bezel's inner shadow
  const g = ctx.createRadialGradient(m, m, m * 0.8, m, m, m);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(m, m, m, 0, Math.PI * 2);
  ctx.fill();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/**
 * A room for the metal to reflect: dark teal, one big warm softbox where the key light is (upper
 * left), a cool strip on the right and a faint ceiling. Copper and brass are only what they reflect.
 */
async function studio(renderer: WebGLRenderer): Promise<Texture> {
  const room = new Scene();
  room.background = new Color(0x04161e);
  const panel = (w: number, h: number, rgb: [number, number, number], pos: [number, number, number]) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(...rgb), side: DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    room.add(m);
  };
  panel(5, 4, [7.5, 6.2, 4.8], [-5, 5.5, 5]); // the key softbox, warm
  panel(1.4, 8, [1.2, 1.7, 1.9], [7, 0.5, 3]); // a cool strip, right
  panel(1.2, 6, [1.5, 1.4, 1.2], [-7, -0.5, 1]); // a thin rim, left
  panel(12, 12, [0.25, 0.3, 0.3], [0, 8, 0]); // ceiling
  panel(14, 14, [0.03, 0.1, 0.12], [0, -6, 0]); // floor, deep teal
  panel(14, 10, [0.05, 0.16, 0.2], [0, 0, -6]); // the wall behind, teal
  panel(14, 10, [0.12, 0.13, 0.13], [0, 0, 9]); // the room in front
  const env = await bakeEnvironment(renderer, room, 0.03);
  room.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as Material).dispose();
    }
  });
  return env;
}

/** A quarter circle from `a` (travelling `dirIn`) to `b` (leaving along `dirOut`). */
class Arc extends Curve<Vector3> {
  constructor(
    private c: Vector3,
    private u: Vector3,
    private v: Vector3,
    private r: number,
  ) {
    super();
  }
  getPoint(t: number, target = new Vector3()) {
    const a = (t * Math.PI) / 2;
    return target
      .copy(this.c)
      .addScaledVector(this.u, Math.cos(a) * this.r)
      .addScaledVector(this.v, Math.sin(a) * this.r);
  }
}

type Mats = { copper: Material; brass: Material; solder: Material; steel: Material };

/** Everything that makes up one pipe run: straight copper, fittings, solder rings and brackets. */
class Kit {
  group = new Group();
  constructor(private m: Mats) {}

  add(mesh: Mesh, shadow = true) {
    mesh.castShadow = shadow;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    return mesh;
  }

  /** A cylinder from a to b. */
  rod(a: Vector3, b: Vector3, r: number, mat: Material, seg = 40, uvLen = true) {
    const len = a.distanceTo(b);
    const g = new CylinderGeometry(r, r, len, seg, 1, true);
    if (uvLen) {
      const uv = g.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * len * 3);
    }
    const mesh = new Mesh(g, mat);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return this.add(mesh);
  }

  /** A thin ring of solder where a pipe enters a fitting. */
  ring(at: Vector3, dir: Vector3, r: number, tube = 0.0075) {
    const mesh = new Mesh(new TorusGeometry(r, tube, 10, 48), this.m.solder);
    mesh.position.copy(at);
    mesh.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), dir.clone().normalize());
    return this.add(mesh, false);
  }

  /** A socket: the fitting's slightly fatter mouth, with its solder ring. */
  socket(at: Vector3, dir: Vector3, len = 0.13) {
    const d = dir.clone().normalize();
    this.rod(at, at.clone().addScaledVector(d, len), FR, this.m.copper, 40);
    this.add(this.capRing(at.clone().addScaledVector(d, len), d));
    this.ring(at.clone().addScaledVector(d, len + 0.004), d, R + 0.006);
  }

  /** The flat shoulder where a socket steps down to the pipe. */
  capRing(at: Vector3, dir: Vector3) {
    const g = new TorusGeometry(R + (FR - R) / 2, (FR - R) / 2, 8, 40);
    const mesh = new Mesh(g, this.m.copper);
    mesh.position.copy(at);
    mesh.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), dir);
    return mesh;
  }

  /** A 90° elbow at `corner`: the pipe arrives along `dirIn` and leaves along `dirOut`. */
  elbow(corner: Vector3, dirIn: Vector3, dirOut: Vector3) {
    const a = corner.clone().addScaledVector(dirIn, -BEND);
    const c = a.clone().addScaledVector(dirOut, BEND);
    const curve = new Arc(c, dirOut.clone().negate(), dirIn.clone(), BEND);
    this.add(new Mesh(new TubeGeometry(curve, 24, FR, 40, false), this.m.copper));
    this.socket(a, dirIn.clone().negate(), 0.1);
    this.socket(corner.clone().addScaledVector(dirOut, BEND), dirOut, 0.1);
  }

  /** A tee on a straight run (along `dir`) with a branch along `branch`. */
  tee(at: Vector3, dir: Vector3, branch: Vector3) {
    const d = dir.clone().normalize();
    this.rod(at.clone().addScaledVector(d, -0.2), at.clone().addScaledVector(d, 0.2), FR, this.m.copper);
    this.add(this.capRing(at.clone().addScaledVector(d, -0.2), d.clone().negate()));
    this.add(this.capRing(at.clone().addScaledVector(d, 0.2), d));
    this.ring(at.clone().addScaledVector(d, -0.204), d, R + 0.006);
    this.ring(at.clone().addScaledVector(d, 0.204), d, R + 0.006);
    const b = branch.clone().normalize();
    this.rod(at, at.clone().addScaledVector(b, 0.2), FR, this.m.copper);
    this.add(this.capRing(at.clone().addScaledVector(b, 0.2), b));
    this.ring(at.clone().addScaledVector(b, 0.204), b, R + 0.006);
  }

  /** A stand-off bracket: a rose on the wall, a brass rod, and a clamp ring round the pipe. */
  bracket(at: Vector3, pipeDir: Vector3) {
    const rose = new Mesh(new CylinderGeometry(0.085, 0.095, 0.03, 32), this.m.brass);
    rose.rotation.x = Math.PI / 2;
    rose.position.set(at.x, at.y, 0.015);
    this.add(rose);
    this.rod(new Vector3(at.x, at.y, 0.02), new Vector3(at.x, at.y, at.z - R - 0.01), 0.026, this.m.brass, 16, false);
    const clamp = new Mesh(new TorusGeometry(R + 0.018, 0.02, 10, 48), this.m.brass);
    clamp.position.copy(at);
    clamp.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), pipeDir.clone().normalize());
    this.add(clamp);
    const bolt = new Mesh(new CylinderGeometry(0.022, 0.022, 0.06, 6), this.m.steel);
    bolt.position.copy(at).add(new Vector3(0, 0, -R - 0.02));
    bolt.rotation.x = Math.PI / 2;
    this.add(bolt);
  }

  /** A hex nut along `dir`. */
  hex(at: Vector3, dir: Vector3, r: number, h: number, mat: Material) {
    const mesh = new Mesh(new CylinderGeometry(r, r, h, 6), mat);
    mesh.position.copy(at);
    mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize());
    return this.add(mesh);
  }
}

export type HeroPipes = {
  /** Pointer across the hero, -1…1 on both axes. */
  pointer: (x: number, y: number) => void;
  /** How far the hero has scrolled away, 0…1. */
  scroll: (p: number) => void;
  /** Is the valve (or its lever) under this point of the canvas, in CSS px? */
  hitValve: (x: number, y: number) => boolean;
  /** Open or close the main valve; returns the new state. */
  toggle: () => boolean;
  /** Called with the valve's state each time it changes. */
  onValve: (cb: (open: boolean) => void) => void;
  setHover: (on: boolean) => void;
  resize: () => void;
  setVisible: (v: boolean) => void;
  onReady: (cb: () => void) => void;
  /** Render one frame of a framing, at rest (scripts/render-hero.mjs). */
  still: (view: "desktop" | "phone") => void;
  dispose: () => void;
};

/** Called from the render loop: each drawn frame, and whenever the loop stops (lib/three-gate's watchFrames). */
type FrameWatch = { frame: (now: number) => void; pause: () => void };

/**
 * Resolves once the scene is built and every shader is compiled (one frame drawn, the canvas still
 * hidden), so its first visible frame never hitches. Throws on software WebGL or a GPU the browser
 * flags as slow: the still stays.
 */
export async function createHeroPipes(canvas: HTMLCanvasElement, opts: { still?: boolean; watch?: FrameWatch } = {}): Promise<HeroPipes> {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: !opts.still,
    preserveDrawingBuffer: !!opts.still,
  });
  if (!opts.still) assertRealGPU(renderer);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = VSMShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.transmissionResolutionScale = 0.6;

  const scene = new Scene();
  scene.background = new Color(0x06222f);
  const camera = new PerspectiveCamera(FOV, FRAME.w / FRAME.h, 1, 60);

  await pause();
  const env = await studio(renderer);
  scene.environment = env;
  await pause();
  const marks = drawMarks();
  const wallTex = plaster();
  await pause();

  // ── materials ──
  const copper = new MeshPhysicalMaterial({
    color: new Color(0.95, 0.5, 0.32),
    metalness: 1,
    roughness: 0.34,
    roughnessMap: marks,
    envMapIntensity: 1.25,
  });
  const brass = new MeshPhysicalMaterial({ color: new Color(0.86, 0.62, 0.27), metalness: 1, roughness: 0.3, envMapIntensity: 1.2 });
  const solder = new MeshStandardMaterial({ color: new Color(0.36, 0.35, 0.33), metalness: 1, roughness: 0.5 });
  const steel = new MeshStandardMaterial({ color: new Color(0.7, 0.72, 0.74), metalness: 1, roughness: 0.22 });
  const vinyl = new MeshPhysicalMaterial({ color: new Color(0.62, 0.035, 0.025), roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3, envMapIntensity: 0.8 });
  const wallMat = new MeshStandardMaterial({ color: new Color(0.022, 0.095, 0.15), roughness: 0.92, map: wallTex, bumpMap: wallTex, bumpScale: 0.35, envMapIntensity: 0.25 });

  // ── the wall ──
  const wall = new Mesh(new PlaneGeometry(26, 16), wallMat);
  wall.receiveShadow = true;
  scene.add(wall);

  // ── lights ──
  const key = new SpotLight(0xffe2c4, 520, 0, 0.36, 0.9, 2);
  key.position.set(0.2, 6.8, 6.8);
  key.target.position.set(2.9, -0.2, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 4;
  key.shadow.camera.far = 20;
  key.shadow.radius = 9;
  key.shadow.blurSamples = 20;
  key.shadow.bias = -0.0004;
  scene.add(key, key.target);
  const hemi = new HemisphereLight(0x9fd6e4, 0x06222f, 0.55);
  scene.add(hemi);
  const rim = new DirectionalLight(0xbfe9f5, 0.9);
  rim.position.set(6, 1, 3);
  scene.add(rim);
  // the arrival: a warm glint runs down the cold line, over the valve and out to the spout, once
  const glint = new PointLight(0xffd2a1, 0, 2.2, 2);
  scene.add(glint);

  const m: Mats = { copper, brass, solder, steel };
  const kit = new Kit(m);
  scene.add(kit.group);
  const up = new Vector3(0, 1, 0);
  const down = new Vector3(0, -1, 0);
  const left = new Vector3(-1, 0, 0);
  const right = new Vector3(1, 0, 0);
  const out = new Vector3(0, 0, 1);

  // ── the cold line: down from the top, the valve, the gauge tee, out to the spout ──
  const VALVE_HALF = 0.46;
  kit.rod(v3(COLD_X, 5), v3(COLD_X, VALVE_Y + VALVE_HALF), R, copper);
  kit.rod(v3(COLD_X, VALVE_Y - VALVE_HALF), v3(COLD_X, TEE_Y + 0.2), R, copper);
  kit.tee(v3(COLD_X, TEE_Y), down, left);
  kit.rod(v3(COLD_X, TEE_Y - 0.2), v3(COLD_X, TURN_Y + BEND + 0.1), R, copper);
  kit.elbow(v3(COLD_X, TURN_Y), down, left);
  kit.rod(v3(COLD_X - BEND - 0.1, TURN_Y), v3(SPOUT_X + BEND + 0.1, TURN_Y), R, copper);
  kit.elbow(v3(SPOUT_X, TURN_Y), left, down);
  kit.rod(v3(SPOUT_X, TURN_Y - BEND - 0.1), v3(SPOUT_X, SPOUT_Y + 0.26), R, copper);
  kit.bracket(v3(COLD_X, 2.45), up);
  kit.bracket(v3(2.18, TURN_Y), right);

  // the gauge branch: left from the tee, a bend up, a brass adapter, the gauge
  const GX = COLD_X - 0.56;
  kit.rod(v3(COLD_X - 0.2, TEE_Y), v3(GX + BEND + 0.1, TEE_Y), R, copper);
  kit.elbow(v3(GX, TEE_Y), left, up);
  kit.rod(v3(GX, TEE_Y + BEND + 0.1), v3(GX, TEE_Y + 0.42), R, copper);
  kit.hex(v3(GX, TEE_Y + 0.47), up, 0.13, 0.1, brass);
  kit.rod(v3(GX, TEE_Y + 0.5), v3(GX, TEE_Y + 0.6), 0.045, brass, 16, false);
  const GR = 0.34;
  const gaugeC = v3(GX, TEE_Y + 0.6 + GR, Z + 0.02);
  const caseMesh = kit.add(new Mesh(new CylinderGeometry(GR, GR, 0.18, 64), steel));
  caseMesh.rotation.x = Math.PI / 2;
  caseMesh.position.copy(gaugeC);
  const bezel = kit.add(new Mesh(new TorusGeometry(GR - 0.012, 0.03, 16, 72), steel));
  bezel.position.copy(gaugeC).add(new Vector3(0, 0, 0.09));
  const face = new Mesh(new PlaneGeometry(GR * 1.86, GR * 1.86), new MeshStandardMaterial({ map: dial(), roughness: 0.55, transparent: true, alphaTest: 0.5 }));
  face.position.copy(gaugeC).add(new Vector3(0, 0, 0.0905));
  face.receiveShadow = true;
  kit.group.add(face);
  const needle = new Group();
  needle.position.copy(gaugeC).add(new Vector3(0, 0, 0.1));
  const needleMat = new MeshStandardMaterial({ color: new Color(0.55, 0.03, 0.02), roughness: 0.4 });
  const nBlade = new Mesh(new PlaneGeometry(0.016, GR * 0.95), needleMat);
  nBlade.position.y = GR * 0.32;
  const nCap = new Mesh(new CylinderGeometry(0.032, 0.032, 0.014, 24), steel);
  nCap.rotation.x = Math.PI / 2;
  nCap.position.z = 0.006;
  needle.add(nBlade, nCap);
  kit.group.add(needle);
  const glass = new Mesh(
    new SphereGeometry(GR * 1.6, 48, 16, 0, Math.PI * 2, 0, 0.66),
    new MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, transparent: true, opacity: 0.12, envMapIntensity: 2.2, depthWrite: false }),
  );
  glass.rotation.x = Math.PI / 2;
  glass.position.copy(gaugeC).add(new Vector3(0, 0, 0.09 - GR * 1.6 * Math.cos(0.66)));
  kit.group.add(glass);

  // the ball valve: a brass body turned round the pipe, hex ends, stem and the red lever
  const valveProfile = [
    new Vector2(FR, -VALVE_HALF),
    new Vector2(FR + 0.02, -VALVE_HALF + 0.02),
    new Vector2(0.15, -0.31),
    new Vector2(0.21, -0.22),
    new Vector2(0.235, -0.12),
    new Vector2(0.24, 0),
    new Vector2(0.235, 0.12),
    new Vector2(0.21, 0.22),
    new Vector2(0.15, 0.31),
    new Vector2(FR + 0.02, VALVE_HALF - 0.02),
    new Vector2(FR, VALVE_HALF),
  ];
  const valveBody = kit.add(new Mesh(new LatheGeometry(valveProfile, 56), brass));
  valveBody.position.set(COLD_X, VALVE_Y, Z);
  kit.hex(v3(COLD_X, VALVE_Y + 0.36), up, 0.19, 0.13, brass);
  kit.hex(v3(COLD_X, VALVE_Y - 0.36), down, 0.19, 0.13, brass);
  kit.ring(v3(COLD_X, VALVE_Y + VALVE_HALF + 0.004), up, R + 0.006);
  kit.ring(v3(COLD_X, VALVE_Y - VALVE_HALF - 0.004), down, R + 0.006);
  const stemBase = Z + 0.22;
  kit.rod(v3(COLD_X, VALVE_Y, stemBase - 0.04), v3(COLD_X, VALVE_Y, stemBase + 0.16), 0.055, brass, 24, false);
  kit.hex(v3(COLD_X, VALVE_Y, stemBase + 0.06), out, 0.09, 0.07, brass);
  const lever = new Group();
  lever.position.set(COLD_X, VALVE_Y, stemBase + 0.2);
  const LEVER = 0.98;
  const blade = new Mesh(new RoundedBoxGeometry(0.17, LEVER, 0.055, 4, 0.026), vinyl);
  blade.position.set(0, -LEVER / 2 + 0.09, 0);
  blade.castShadow = true;
  blade.receiveShadow = true;
  const steelNeck = new Mesh(new RoundedBoxGeometry(0.15, 0.24, 0.05, 3, 0.02), steel);
  steelNeck.position.set(0, 0, -0.012);
  steelNeck.castShadow = true;
  const leverNut = new Mesh(new CylinderGeometry(0.05, 0.05, 0.05, 6), steel);
  leverNut.rotation.x = Math.PI / 2;
  leverNut.position.z = 0.04;
  leverNut.castShadow = true;
  lever.add(blade, steelNeck, leverNut);
  kit.group.add(lever);

  // the hot line beside it, out to the right
  kit.rod(v3(HOT_X, 5), v3(HOT_X, TURN_Y + BEND + 0.1), R, copper);
  kit.elbow(v3(HOT_X, TURN_Y), down, right);
  kit.rod(v3(HOT_X + BEND + 0.1, TURN_Y), v3(9, TURN_Y), R, copper);
  kit.bracket(v3(HOT_X, 2.45), up);
  kit.bracket(v3(HOT_X, 0.55), up);
  kit.bracket(v3(4.6, TURN_Y), right);

  // the spout: a turned brass nozzle at the end of the line
  const spoutProfile = [
    new Vector2(0.0, 0.3),
    new Vector2(FR + 0.01, 0.3),
    new Vector2(FR + 0.01, 0.16),
    new Vector2(0.15, 0.13),
    new Vector2(0.15, 0.04),
    new Vector2(0.125, 0.0),
    new Vector2(0.105, -0.05),
    new Vector2(0.1, -0.18),
    new Vector2(0.112, -0.2),
    new Vector2(0.112, -0.235),
    new Vector2(0.09, -0.25),
    new Vector2(0.075, -0.25),
    new Vector2(0.075, -0.1),
  ];
  const spout = kit.add(new Mesh(new LatheGeometry(spoutProfile, 48), brass));
  spout.position.set(SPOUT_X, SPOUT_Y + 0.25, Z);
  kit.ring(v3(SPOUT_X, SPOUT_Y + 0.554), up, R + 0.006);
  kit.hex(v3(SPOUT_X, SPOUT_Y + 0.33), up, 0.165, 0.1, brass);
  await pause();

  // ── the water ──
  const FALL = 7;
  const r0 = 0.082;
  const prof: Vector2[] = [];
  for (let i = 0; i <= 160; i++) {
    const d = (i / 160) * FALL;
    prof.push(new Vector2(r0 / Math.pow(1 + d * 1.6, 0.25), -d));
  }
  const streamGeo = new LatheGeometry(prof, 40);
  const flow = { time: { value: 0 }, top: { value: 0 }, bot: { value: FALL }, girth: { value: 1 } };
  const waterMat = new MeshPhysicalMaterial({
    color: new Color(0.9, 0.98, 1),
    transmission: 1,
    thickness: 0.12,
    ior: 1.33,
    roughness: 0.04,
    metalness: 0,
    envMapIntensity: 2.6,
    attenuationColor: new Color(0.55, 0.85, 0.9),
    attenuationDistance: 0.6,
    specularIntensity: 1,
    side: DoubleSide,
  });
  waterMat.onBeforeCompile = (s) => {
    s.uniforms.uTime = flow.time;
    s.uniforms.uTop = flow.top;
    s.uniforms.uBot = flow.bot;
    s.uniforms.uGirth = flow.girth;
    s.vertexShader = s.vertexShader
      .replace(
        "void main() {",
        `uniform float uTime; uniform float uGirth; varying float vD; varying float vA;
        void main() {`,
      )
      .replace(
        "#include <begin_vertex>",
        `vec3 transformed = vec3(position);
        float d = -position.y;
        vD = d;
        vA = atan(position.z, position.x);
        float pulse = sin(d * 21.0 - uTime * 26.0) * 0.07 + sin(d * 9.0 - uTime * 13.0 + vA) * 0.05;
        transformed.xz *= uGirth * (1.0 + pulse * smoothstep(0.05, 0.6, d));
        transformed.x += sin(d * 2.7 - uTime * 6.0) * 0.012 * d;
        transformed.z += cos(d * 2.1 - uTime * 5.0) * 0.009 * d;`,
      );
    s.fragmentShader = s.fragmentShader
      .replace(
        "void main() {",
        `uniform float uTime; uniform float uTop; uniform float uBot; varying float vD; varying float vA;
        void main() {
          if (vD < uTop || vD > uBot) discard;`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        float ripple = cos(vD * 21.0 - uTime * 26.0) + 0.6 * cos(vD * 37.0 - uTime * 41.0 + vA * 2.0);
        normal = normalize(normal + vec3(0.0, 0.18 * ripple, 0.0));`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float rimF = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.5);
        totalEmissiveRadiance += vec3(0.42, 0.7, 0.78) * (rimF * 0.85 + 0.035) + vec3(0.5, 0.75, 0.8) * max(0.0, ripple) * 0.07;`,
      );
  };
  const stream = new Mesh(streamGeo, waterMat);
  stream.position.set(SPOUT_X, SPOUT_Y, Z);
  stream.renderOrder = 2;
  scene.add(stream);
  const drops: Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new Mesh(new SphereGeometry(0.05, 20, 14), waterMat);
    d.scale.set(1, 1.25, 1);
    d.visible = false;
    scene.add(d);
    drops.push(d);
  }
  await pause();

  // ── state ──
  let open = true;
  let leverA = 0; // 0 open (along the pipe), 1 closed (a quarter turn)
  let leverFrom = 0;
  let leverT = 1;
  let flowT = 10; // seconds since the valve last changed
  let detach = 0; // where the stream's top is, once it falls away
  let reach = FALL; // where the stream's front is, once it starts again
  let psi = 62;
  let hover = 0;
  let hoverTarget = 0;
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollP = 0;
  let scrollT = 0;
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let clock = 0;
  let ready: (() => void) | null = null;
  let glintT = -1; // seconds into the glint's run; -1 until the canvas is showing
  let firstFrame = false;
  let valveCb: ((o: boolean) => void) | null = null;
  const hitList: Object3D[] = [lever, valveBody];

  const W = { w: 1, h: 1 };
  const frameCamera = (view: "desktop" | "phone", dx = 0, dy = 0, sp = 0) => {
    if (view === "phone") {
      camera.fov = PHONE.fov;
      camera.aspect = PHONE.aspect;
      camera.clearViewOffset();
      camera.position.copy(PHONE.eye);
      camera.lookAt(PHONE.look);
      camera.updateProjectionMatrix();
      return;
    }
    camera.fov = FOV;
    camera.aspect = FRAME.w / FRAME.h;
    // crop the reference frame exactly as CSS object-cover + object-position crops the still
    const s = Math.max(W.w / FRAME.w, W.h / FRAME.h);
    const vw = W.w / s;
    const vh = W.h / s;
    camera.setViewOffset(FRAME.w, FRAME.h, (FRAME.w - vw) * ANCHOR.x, (FRAME.h - vh) * ANCHOR.y, vw, vh);
    camera.position.set(EYE.x + dx * 0.55, EYE.y + dy * 0.32 - sp * 1.6, EYE.z);
    camera.lookAt(LOOK.x + dx * 0.08, LOOK.y - sp * 2.1, LOOK.z);
    camera.updateProjectionMatrix();
  };

  const resize = () => {
    const w = canvas.clientWidth || FRAME.w;
    const h = canvas.clientHeight || FRAME.h;
    W.w = w;
    W.h = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.still ? 1 : 1.5));
    renderer.setSize(w, h, false);
    kick();
  };

  const apply = (dt: number) => {
    // lever: a quarter turn in 0.45 s, eased
    if (leverT < 1) {
      leverT = clamp01(leverT + dt / 0.45);
      const target = open ? 0 : 1;
      leverA = leverFrom + (target - leverFrom) * ease(leverT);
      renderer.shadowMap.needsUpdate = true;
    }
    lever.rotation.z = leverA * (Math.PI / 2);
    // water: thins as the ball turns; once shut the column falls away, opened it reaches down again
    flowT += dt;
    const g = 9.5;
    if (open) {
      flow.girth.value = Math.max(0.15, 1 - leverA * 0.85);
      detach = 0;
      reach = Math.min(FALL, 1.3 * flowT + 0.5 * g * flowT * flowT);
    } else {
      flow.girth.value = Math.max(0.15, 1 - leverA * 0.85);
      const t = Math.max(0, flowT - 0.32);
      detach = 0.5 * g * t * t;
    }
    flow.top.value = detach;
    flow.bot.value = reach;
    stream.visible = detach < FALL && reach > 0.01;
    // a few last drips after the valve shuts
    drops.forEach((d, i) => {
      const t0 = 0.9 + i * 0.85;
      const t = flowT - t0;
      d.visible = !open && t > 0 && t < 1.4;
      if (d.visible) d.position.set(SPOUT_X, SPOUT_Y - 0.06 - 0.5 * g * t * t, Z);
    });
    // the gauge: line pressure while it flows, nothing past a shut valve
    const want = open ? 62 + Math.sin(clock * 9.0) * 0.6 + Math.sin(clock * 23.0) * 0.35 : 0;
    psi += (want - psi) * Math.min(1, dt * (open ? 3.5 : 5));
    needle.rotation.z = -((-225 + (psi / 160) * 270 + 90) * Math.PI) / 180;
    // hover: the lever warms up a touch
    hover += (hoverTarget - hover) * Math.min(1, dt * 10);
    vinyl.emissive.setRGB(0.3 * hover, 0.02 * hover, 0.01 * hover);
    // the arrival glint: down the riser, along the bend, down to the spout
    if (glintT >= 0 && glintT < 3) {
      glintT += dt;
      const u = clamp01((glintT - 0.6) / 2.2);
      const path = [v3(COLD_X, 3.2), v3(COLD_X, TURN_Y), v3(SPOUT_X, TURN_Y), v3(SPOUT_X, SPOUT_Y)];
      const seg = [3.82, 1.1, 0.88];
      let k = u * (seg[0] + seg[1] + seg[2]);
      let i = 0;
      while (i < 2 && k > seg[i]) k -= seg[i++];
      glint.position.lerpVectors(path[i], path[i + 1], Math.min(1, k / seg[i])).add(new Vector3(-0.25, 0.1, 0.55));
      glint.intensity = Math.sin(Math.PI * u) * 2.4;
    } else glint.intensity = 0;
    // camera: lean towards the pointer, follow the water down on scroll
    ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt * 3.2);
    ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt * 3.2);
    scrollP += (scrollT - scrollP) * Math.min(1, dt * 8);
    frameCamera("desktop", ptr.x, ptr.y, scrollP);
  };

  const draw = () => {
    renderer.render(scene, camera);
    if (!firstFrame) {
      firstFrame = true;
      glintT = 0;
      ready?.();
    }
  };

  // Render on demand: while the water runs there's always something moving; once it's shut off and
  // everything has come to rest, the loop sleeps until the pointer, the scroll or a click wakes it.
  const moving = () =>
    open ||
    leverT < 1 ||
    flowT < 0.9 + drops.length * 0.85 + 1.4 ||
    psi > 0.05 ||
    (glintT >= 0 && glintT < 3) ||
    Math.abs(ptr.tx - ptr.x) > 1e-3 ||
    Math.abs(ptr.ty - ptr.y) > 1e-3 ||
    Math.abs(scrollT - scrollP) > 1e-4 ||
    Math.abs(hoverTarget - hover) > 1e-3;

  const loop = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += dt;
    flow.time.value = clock;
    apply(dt);
    draw();
    opts.watch?.frame(now);
    if (visible && moving()) raf = requestAnimationFrame(loop);
    else opts.watch?.pause();
  };
  let warmed = false;
  function kick() {
    if (!raf && visible && warmed && !opts.still) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  }

  const ray = new Raycaster();
  const ndc = new Vector2();

  renderer.shadowMap.needsUpdate = true;
  resize();
  if (!opts.still) {
    await pause();
    frameCamera("desktop");
    await warm(renderer, scene, camera, "hero");
    warmed = true;
    kick();
  }

  return {
    pointer(x, y) {
      ptr.tx = x;
      ptr.ty = y;
      kick();
    },
    scroll(p) {
      scrollT = p;
      kick();
    },
    hitValve(x, y) {
      ndc.set((x / W.w) * 2 - 1, -(y / W.h) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      return ray.intersectObjects(hitList, true).length > 0;
    },
    toggle() {
      open = !open;
      leverFrom = leverA;
      leverT = 0;
      flowT = 0;
      if (open) reach = 0;
      valveCb?.(open);
      kick();
      return open;
    },
    onValve(cb) {
      valveCb = cb;
    },
    setHover(on) {
      hoverTarget = on ? 1 : 0;
      kick();
    },
    resize,
    setVisible(v) {
      visible = v;
      if (v) kick();
      else {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        opts.watch?.pause();
      }
    },
    onReady(cb) {
      if (firstFrame) cb();
      else ready = cb;
    },
    still(view) {
      clock = 1.7;
      flow.time.value = clock;
      apply(0);
      frameCamera(view);
      renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, camera);
    },
    dispose() {
      if (raf) cancelAnimationFrame(raf);
      scene.traverse((o) => {
        if (o instanceof Mesh) {
          (o.geometry as BufferGeometry).dispose();
          const mm = o.material as Material | Material[];
          (Array.isArray(mm) ? mm : [mm]).forEach((x) => x.dispose());
        }
      });
      env.dispose();
      marks.dispose();
      wallTex.dispose();
      renderer.dispose();
      if (!opts.still) renderer.forceContextLoss();
    },
  };
}
