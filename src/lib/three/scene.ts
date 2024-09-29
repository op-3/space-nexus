import * as THREE from "three";

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  return scene;
}

export function setSceneBackground(
  scene: THREE.Scene,
  texturePath: string
): void {
  const textureLoader = new THREE.TextureLoader();
  scene.background = textureLoader.load(texturePath);
}

export function addToScene(
  scene: THREE.Scene,
  ...objects: THREE.Object3D[]
): void {
  objects.forEach((object) => scene.add(object));
}
