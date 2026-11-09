import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Curve,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NoToneMapping,
  OrthographicCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
  type Material,
  type Texture,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { gsap, loadGsap } from "@/lib/gsap";

/*
 * The Pipeline in 3D: the page's pipe as a glass tube with copper elbows and brass clips, water
 * flowing inside it as far as you've scrolled, and a soft shadow on the page under it.
 *
 * One fixed, transparent canvas over the page draws every Pipeline that's on screen, with an
 * orthographic camera in CSS pixels, so the 3D pipe lies exactly where the SVG one would. It draws
 * on GSAP's ticker, after Lenis has moved the page, so it never lags the scroll; it stops when no
 * pipe is on screen. Desktop only, behind lib/three-gate (components/fx/Pipeline imports it).
 */

export type PipePiece =
  | { kind: "line"; a: [number, number]; b: [number, number]; l0: number; l1: number }
  | { kind: "elbow"; corner: [number, number]; din: [number, number]; dout: [number, number]; r: number };

export type PipeHandle = {
  /** The path in the wrapper's own px (y down), as components/fx/Pipeline builds it. */
  setPath: (pieces: PipePiece[]) => void;
  /** How far (px along the path) the water has reached. */
  setFill: (len: number) => void;
  dispose: () => void;
};

const R = 7; // tube radius, px
const RW = 4.4; // water inside it
const FR = 8.6; // copper fittings

/** A quarter circle, wrapper px → world (y up). */
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
    return target.copy(this.c).addScaledVector(this.u, Math.cos(a) * this.r).addScaledVector(this.v, Math.sin(a) * this.r);
  }
}

const w3 = (p: [number, number], z = 0) => new Vector3(p[0], -p[1], z);
const d3 = (d: [number, number]) => new Vector3(d[0], -d[1], 0).normalize();
const Y = new Vector3(0, 1, 0);

/** A geometry placed from a (local +y) to b. */
function along(g: BufferGeometry, a: Vector3, b: Vector3) {
  const m = new Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), new Quaternion().setFromUnitVectors(Y, b.clone().sub(a).normalize()), new Vector3(1, 1, 1));
  return g.applyMatrix4(m);
}

/** Keep only position, normal, uv (and an `along` attribute) so everything merges. */
function clean(g: BufferGeometry, l?: [number, number]) {
  const out = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(out.attributes)) if (!["position", "normal", "uv"].includes(k)) out.deleteAttribute(k);
  if (l) {
    const n = out.attributes.position.count;
    out.setAttribute("along", new BufferAttribute(new Float32Array(n).fill(0), 1));
  }
  return out;
}

/** A soft shadow strip along a polyline (world coords), offset down-right. */
function shadowStrip(pts: Vector3[], half: number): BufferGeometry {
  const pos: number[] = [];
  const acr: number[] = [];
  const off = new Vector3(5, -8, -20);
  // one normal per point (averaged at the bends), so the strip has no gaps on the outside of a curve
  const ns = pts.map((_, i) => {
    const d = pts[Math.min(pts.length - 1, i + 1)].clone().sub(pts[Math.max(0, i - 1)]).normalize();
    return new Vector3(-d.y, d.x, 0).multiplyScalar(half);
  });
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i].clone().add(off);
    const b = pts[i + 1].clone().add(off);
    const q = [a.clone().add(ns[i]), a.clone().sub(ns[i]), b.clone().add(ns[i + 1]), b.clone().sub(ns[i + 1])];
    for (const [p, s] of [
      [q[0], 1],
      [q[1], -1],
      [q[2], 1],
      [q[2], 1],
      [q[1], -1],
      [q[3], -1],
    ] as [Vector3, number][]) {
      pos.push(p.x, p.y, p.z);
      acr.push(s);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute("across", new BufferAttribute(new Float32Array(acr), 1));
  return g;
}

/** A bright, even room for small metal parts on a pale page. */
function studio(renderer: WebGLRenderer): Texture {
  const room = new Scene();
  room.background = new Color(0.32, 0.36, 0.37);
  const panel = (w: number, h: number, c: [number, number, number], pos: [number, number, number]) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(...c), side: DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    room.add(m);
  };
  panel(6, 4, [5, 4.4, 3.8], [-4, 5, 5]);
  panel(2, 8, [1.6, 1.9, 2.0], [6, 0, 3]);
  panel(16, 16, [0.08, 0.12, 0.13], [0, -7, 0]);
  panel(10, 10, [0.42, 0.45, 0.46], [0, 0, 8]);
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(room, 0.04).texture;
  pmrem.dispose();
  room.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as Material).dispose();
    }
  });
  return env;
}

const glassVert = /* glsl */ `
varying vec3 vN;
void main() {
  vN = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const glassFrag = /* glsl */ `
varying vec3 vN;
void main() {
  vec3 n = normalize(vN);
  float edge = 1.0 - abs(n.z);
  // dark refraction walls at the silhouette, a faint body, and one sharp highlight from the upper left
  float wall = smoothstep(0.8, 0.985, edge);
  vec3 L = normalize(vec3(-0.55, 0.45, 0.7));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(n, H), 0.0), 60.0);
  float spec2 = pow(max(dot(n, normalize(vec3(0.6, -0.2, 0.75))), 0.0), 30.0) * 0.35;
  vec3 col = mix(vec3(0.05, 0.2, 0.25), vec3(1.0), clamp((spec + spec2) * 3.0, 0.0, 1.0));
  float a = 0.035 + smoothstep(0.3, 0.9, edge) * 0.08 + wall * 0.55 + (spec + spec2) * 0.9;
  gl_FragColor = vec4(col, clamp(a, 0.0, 0.95));
}`;

const waterVert = /* glsl */ `
attribute float along;
varying vec3 vN;
varying float vAlong;
varying vec2 vUv;
void main() {
  vN = normalize(normalMatrix * normal);
  vAlong = along;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const waterFrag = /* glsl */ `
uniform float uFill;
uniform float uTime;
varying vec3 vN;
varying float vAlong;
varying vec2 vUv;
void main() {
  if (vAlong > uFill) discard;
  vec3 n = normalize(vN);
  float face = abs(n.z);
  float a = vAlong - uTime * 120.0;
  // long soft streaks moving down the pipe with the flow
  float streak = smoothstep(0.35, 1.0, 0.5 + 0.5 * sin(a * 0.022 + sin(vUv.x * 6.283) * 1.5)) * 0.35
               + smoothstep(0.6, 1.0, 0.5 + 0.5 * sin(a * 0.061 - vUv.x * 6.283 + 1.7)) * 0.2;
  vec3 deep = vec3(0.01, 0.25, 0.36);
  vec3 bright = vec3(0.16, 0.66, 0.82);
  vec3 col = mix(deep, bright, pow(face, 1.8));
  // the light from the upper left catches the top of the stream
  col += vec3(0.5, 0.75, 0.8) * pow(max(dot(n, normalize(vec3(-0.5, 0.45, 0.75))), 0.0), 24.0) * 0.6;
  col = mix(col, vec3(0.8, 0.96, 1.0), streak * 0.5);
  // the front of the water: a pale, foamy lip
  float lip = smoothstep(14.0, 0.0, uFill - vAlong);
  col = mix(col, vec3(0.86, 0.97, 1.0), lip * 0.7);
  gl_FragColor = vec4(col, 1.0);
}`;

const shadowFrag = /* glsl */ `
varying float vAcross;
void main() {
  float a = exp(-vAcross * vAcross * 3.2) * 0.16;
  gl_FragColor = vec4(0.02, 0.1, 0.13, a);
}`;
const shadowVert = /* glsl */ `
attribute float across;
varying float vAcross;
void main() {
  vAcross = across;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

type Entry = { wrap: HTMLElement; group: Group; fill: { value: number }; visible: boolean; io: IntersectionObserver };

type Layer = { attach: (wrap: HTMLElement) => PipeHandle };

let layer: Promise<Layer> | null = null;

export const pipeLayer = () => (layer ??= createLayer());

async function createLayer(): Promise<Layer> {
  await loadGsap();
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:20;";
  document.body.appendChild(canvas);

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  const scene = new Scene();
  const camera = new OrthographicCamera(0, 1, 0, -1, -200, 200);
  camera.position.z = 100;
  const env = studio(renderer);
  scene.environment = env;
  const sun = new DirectionalLight(0xffffff, 1.4);
  sun.position.set(-0.5, 0.6, 1);
  scene.add(sun);

  const copper = new MeshStandardMaterial({ color: new Color(0.9, 0.44, 0.26), metalness: 1, roughness: 0.26, envMapIntensity: 1.3 });
  const brass = new MeshStandardMaterial({ color: new Color(0.72, 0.5, 0.2), metalness: 1, roughness: 0.3, envMapIntensity: 1.15 });
  const solder = new MeshStandardMaterial({ color: new Color(0.5, 0.5, 0.48), metalness: 1, roughness: 0.45 });
  const glass = new ShaderMaterial({ vertexShader: glassVert, fragmentShader: glassFrag, transparent: true, depthWrite: false });
  const time = { value: 0 };
  const shadow = new ShaderMaterial({ vertexShader: shadowVert, fragmentShader: shadowFrag, transparent: true, depthWrite: false });

  const entries: Entry[] = [];
  let running = false;
  let w = 0;
  let h = 0;

  const size = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.left = 0;
    camera.right = w;
    camera.top = 0;
    camera.bottom = -h;
    camera.updateProjectionMatrix();
  };
  size();
  window.addEventListener("resize", size);

  const frame = (t: number) => {
    time.value = t;
    let any = false;
    for (const e of entries) {
      e.group.visible = e.visible;
      if (!e.visible) continue;
      any = true;
      const r = e.wrap.getBoundingClientRect();
      e.group.position.set(r.left, -r.top, 0);
    }
    renderer.render(scene, camera);
    if (!any) stop();
  };
  const start = () => {
    if (running) return;
    running = true;
    gsap.ticker.add(frame);
  };
  function stop() {
    if (!running) return;
    running = false;
    gsap.ticker.remove(frame);
  }

  const build = (e: Entry, pieces: PipePiece[]) => {
    e.group.children.slice().forEach((c) => {
      e.group.remove(c);
      if (c instanceof Mesh) c.geometry.dispose();
    });
    const tubes: BufferGeometry[] = [];
    const water: BufferGeometry[] = [];
    const metal: BufferGeometry[] = [];
    const brassParts: BufferGeometry[] = [];
    const rings: BufferGeometry[] = [];
    const shade: BufferGeometry[] = [];

    const ring = (at: Vector3, dir: Vector3, r: number, tube: number, list: BufferGeometry[]) => {
      const g = new TorusGeometry(r, tube, 8, 40);
      g.applyMatrix4(new Matrix4().compose(at, new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), dir), new Vector3(1, 1, 1)));
      list.push(clean(g));
    };
    const socket = (mouth: Vector3, dir: Vector3, len: number) => {
      const end = mouth.clone().addScaledVector(dir, -len);
      metal.push(clean(along(new CylinderGeometry(FR, FR, len, 32, 1, true), end, mouth)));
      ring(mouth, dir, (R + FR) / 2, (FR - R) / 2, metal);
      ring(mouth.clone().addScaledVector(dir, 0.6), dir, R + 0.5, 0.75, rings);
    };

    for (const p of pieces) {
      if (p.kind === "line") {
        const a = w3(p.a);
        const b = w3(p.b);
        const len = a.distanceTo(b);
        if (len < 1) continue;
        tubes.push(clean(along(new CylinderGeometry(R, R, len, 28, 1, true), a, b)));
        const wg = clean(along(new CylinderGeometry(RW, RW, len, 20, 1, true), a, b), [p.l0, p.l1]);
        // `along`: path length at each vertex, from where this run starts to where it ends
        const pos = wg.attributes.position;
        const at = wg.attributes.along as BufferAttribute;
        const dir = b.clone().sub(a).normalize();
        for (let i = 0; i < pos.count; i++) {
          const t = Math.max(0, Math.min(1, (new Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).sub(a).dot(dir)) / len));
          at.setX(i, p.l0 + t * (p.l1 - p.l0));
        }
        water.push(wg);
        shade.push(shadowStrip([a, b], 11));
        // brass clips along long runs
        const n = Math.floor(len / 380);
        for (let k = 1; k <= n; k++) {
          const c = a.clone().lerp(b, k / (n + 1));
          const q = new Quaternion().setFromUnitVectors(Y, dir);
          brassParts.push(clean(along(new CylinderGeometry(R + 1.7, R + 1.7, 5, 28, 1, true), c.clone().addScaledVector(dir, -2.5), c.clone().addScaledVector(dir, 2.5))));
          ring(c.clone().addScaledVector(dir, 2.5), dir, R + 0.85, 0.85, brassParts);
          ring(c.clone().addScaledVector(dir, -2.5), dir, R + 0.85, 0.85, brassParts);
          const plate = new RoundedBoxGeometry(2 * R + 17, 5, 1.6, 2, 0.8);
          plate.applyMatrix4(new Matrix4().compose(c.clone().setZ(-R - 1), q, new Vector3(1, 1, 1)));
          brassParts.push(clean(plate));
          const side = new Vector3(-dir.y, dir.x, 0);
          for (const s of [-1, 1]) {
            const screw = new CylinderGeometry(2, 2, 2, 16);
            screw.applyMatrix4(new Matrix4().compose(c.clone().addScaledVector(side, s * (R + 6)).setZ(-R + 1), new Quaternion().setFromUnitVectors(Y, new Vector3(0, 0, 1)), new Vector3(1, 1, 1)));
            metal.push(clean(screw));
          }
        }
      } else {
        const corner = w3(p.corner);
        const din = d3(p.din);
        const dout = d3(p.dout);
        const a = corner.clone().addScaledVector(din, -p.r);
        const c = a.clone().addScaledVector(dout, p.r);
        const arc = new Arc(c, dout.clone().negate(), din.clone(), p.r);
        metal.push(clean(new TubeGeometry(arc, 20, FR, 32, false)));
        socket(a.clone().addScaledVector(din, -7), din.clone().negate(), 7);
        socket(corner.clone().addScaledVector(dout, p.r + 7), dout, 7);
        const pts = arc.getSpacedPoints(10);
        pts.unshift(a.clone().addScaledVector(din, -7));
        pts.push(corner.clone().addScaledVector(dout, p.r + 7));
        shade.push(shadowStrip(pts, 13));
      }
    }

    const add = (list: BufferGeometry[], mat: Material, order: number) => {
      if (!list.length) return;
      const g = mergeGeometries(list);
      list.forEach((x) => x.dispose());
      if (!g) return;
      const m = new Mesh(g, mat);
      m.renderOrder = order;
      m.frustumCulled = false;
      e.group.add(m);
    };
    add(shade, shadow, 0);
    add(water, makeWater(e.fill), 1);
    add(metal, copper, 2);
    add(brassParts, brass, 2);
    add(rings, solder, 2);
    add(tubes, glass, 3);
  };

  const makeWater = (fill: { value: number }) =>
    new ShaderMaterial({ vertexShader: waterVert, fragmentShader: waterFrag, uniforms: { uFill: fill, uTime: time } });

  return {
    attach(wrap) {
      const e: Entry = {
        wrap,
        group: new Group(),
        fill: { value: 0 },
        visible: false,
        io: new IntersectionObserver(([x]) => {
          e.visible = x.isIntersecting;
          if (e.visible) start();
        }),
      };
      scene.add(e.group);
      entries.push(e);
      e.io.observe(wrap);
      return {
        setPath(pieces) {
          build(e, pieces);
          if (e.visible) start();
        },
        setFill(len) {
          e.fill.value = len;
        },
        dispose() {
          e.io.disconnect();
          scene.remove(e.group);
          e.group.traverse((o) => {
            if (o instanceof Mesh) {
              o.geometry.dispose();
              if (o.material instanceof ShaderMaterial && o.material !== glass && o.material !== shadow) o.material.dispose();
            }
          });
          entries.splice(entries.indexOf(e), 1);
          if (!entries.length) {
            stop();
            renderer.clear();
          }
        },
      };
    },
  };
}
