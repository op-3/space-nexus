import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import type { PerspectiveCamera, WebGLRenderer } from "three";
import { ORBITAL_CAMERA_LIMITS } from "../utils/constants";

export function createOrbitControls(
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
): OrbitControls {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = ORBITAL_CAMERA_LIMITS.minDistance;
  controls.maxDistance = ORBITAL_CAMERA_LIMITS.maxDistance;
  controls.maxPolarAngle = ORBITAL_CAMERA_LIMITS.maxPolarAngle;
  return controls;
}

export function updateControls(controls: OrbitControls): void {
  controls.update();
}
