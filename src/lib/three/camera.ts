import * as THREE from "three";
import { CAMERA_INITIAL_POSITION } from "../utils/constants";

export function createCamera(aspect: number): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(...CAMERA_INITIAL_POSITION);
  return camera;
}

export function updateCameraAspect(
  camera: THREE.PerspectiveCamera,
  aspect: number
): void {
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}
