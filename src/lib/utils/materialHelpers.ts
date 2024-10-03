import * as THREE from "three";

export async function createPlanetMaterial(texturePath: string) {
  return new Promise<THREE.MeshPhongMaterial>((resolve, reject) => {
    new THREE.TextureLoader().load(
      texturePath,
      (texture) => {
        const material = new THREE.MeshPhongMaterial({ map: texture });
        resolve(material);
      },
      undefined,
      (error) => {
        console.error(`Error loading texture: ${texturePath}`, error);
        reject(error);
      }
    );
  });
}

export function createSunMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 1,
  });
}
