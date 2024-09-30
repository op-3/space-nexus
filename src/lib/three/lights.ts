import * as THREE from "three";

export function createAmbientLight(
  color: THREE.ColorRepresentation = 0x404040,
  intensity = 0.5
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
  const sunLight = createPointLight(0xffffff, 2, 1000, 1);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  return sunLight;
}

export function createDirectionalLight(): THREE.DirectionalLight {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 3, 5);
  return directionalLight;
}
