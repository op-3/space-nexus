import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

export function createGalaxy(galaxyData: any) {
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 10000;

  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  const colorInside = new THREE.Color(galaxyData.colorInside);
  const colorOutside = new THREE.Color(galaxyData.colorOutside);

  for (let i = 0; i < particlesCount; i++) {
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: galaxyData.particleSize,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  particles.name = galaxyData.name;

  return particles;
}
