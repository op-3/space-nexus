import * as THREE from "three";

export function createAmbientLight(
  color: THREE.ColorRepresentation = 0x404040,
  intensity = 1
): THREE.AmbientLight {
  return new THREE.AmbientLight(color, intensity);
}

export function createPointLight(
  color: THREE.ColorRepresentation = 0xffffff,
  intensity = 1,
  distance = 0,
  decay = 2
): THREE.PointLight {
  const light = new THREE.PointLight(color, intensity, distance, decay);
  light.position.set(0, 0, 0);
  return light;
}

export function createSunLight(): THREE.PointLight {
  const sunLight = createPointLight(0xffffff, 1.5);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  return sunLight;
}
