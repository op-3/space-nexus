import * as THREE from "three";

export function createRenderer(
  width: number,
  height: number
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer;
}

export function updateRendererSize(
  renderer: THREE.WebGLRenderer,
  width: number,
  height: number
): void {
  renderer.setSize(width, height);
}
