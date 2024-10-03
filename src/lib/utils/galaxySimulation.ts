import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer";

export function initializeGalaxy(galaxyData, renderer) {
  // ضع هنا الكود الخاص بإنشاء المجرة
  // هذا مجرد مثال بسيط، قد تحتاج إلى تعديله وفقًا لاحتياجاتك
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });

  // إنشاء نقاط عشوائية للمجرة
  const positions = new Float32Array(10000 * 3);
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 100;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  return {
    geometry,
    material,
    computeRenderer: new GPUComputationRenderer(64, 64, renderer),
  };
}

export function updateGalaxy(galaxy, computeRenderer, time) {
  galaxy.rotation.y = time * 0.05;
}
