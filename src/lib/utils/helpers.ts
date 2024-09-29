import * as THREE from "three";

export function createTextureLoader(): THREE.TextureLoader {
  return new THREE.TextureLoader();
}

export function loadTexture(
  loader: THREE.TextureLoader,
  path: string
): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    loader.load(path, resolve, undefined, reject);
  });
}

export function createSphereGeometry(
  radius: number,
  widthSegments = 32,
  heightSegments = 32
): THREE.SphereGeometry {
  return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
}

export function calculateOrbitPosition(
  distance: number,
  angle: number
): THREE.Vector3 {
  return new THREE.Vector3(
    Math.cos(angle) * distance,
    0,
    Math.sin(angle) * distance
  );
}
