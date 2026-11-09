// The VSM blur shader three.js's shadow map uses (pipes3d/warm compiles it ahead of time).
declare module "three/src/renderers/shaders/ShaderLib/vsm.glsl.js" {
  export const vertex: string;
  export const fragment: string;
}
