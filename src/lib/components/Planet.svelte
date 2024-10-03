<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  export let name: string;
  export let texture: string;
  export let size: number;
  export let distance: number;
  export let rotationSpeed: number;
  export let orbitSpeed: number;

  let mesh: THREE.Mesh;

  onMount(() => {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial({
      map: textureLoader.load(`/textures/${texture}`),
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(distance, 0, 0);
  });

  function update(time: number) {
    if (mesh) {
      mesh.rotation.y += rotationSpeed;
      mesh.position.x = Math.cos(time * orbitSpeed) * distance;
      mesh.position.z = Math.sin(time * orbitSpeed) * distance;
    }
  }
</script>