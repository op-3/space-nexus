import * as THREE from "three";
import { NEARBY_GALAXIES } from "./constants";

export function createGalaxy(
  textureLoader: THREE.TextureLoader,
  name: string,
  size: number,
  distance: number,
  texture: string
): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`/textures/galaxies/${texture}`),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  const mesh = new THREE.Mesh(geometry, material);

  const phi = Math.random() * Math.PI * 2;
  const theta = Math.random() * Math.PI;
  mesh.position.setFromSphericalCoords(distance, phi, theta);

  mesh.lookAt(new THREE.Vector3(0, 0, 0));
  mesh.name = name;
  mesh.userData = { size, distance };
  return mesh;
}

export function createNearbyGalaxies(
  textureLoader: THREE.TextureLoader
): THREE.Group {
  const galaxiesGroup = new THREE.Group();
  NEARBY_GALAXIES.forEach((galaxy) => {
    const galaxyMesh = createGalaxy(
      textureLoader,
      galaxy.name,
      galaxy.size,
      galaxy.distance,
      galaxy.texture
    );
    galaxiesGroup.add(galaxyMesh);
  });
  return galaxiesGroup;
}
