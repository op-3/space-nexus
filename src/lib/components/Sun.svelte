<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
  
    export let size: number = 5;
  
    let mesh: THREE.Mesh;
  
    onMount(() => {
      const geometry = new THREE.SphereGeometry(size, 64, 64);
      const textureLoader = new THREE.TextureLoader();
      const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load('/textures/sun.jpg'),
        emissive: 0xffff00,
        emissiveIntensity: 0.5,
      });
      mesh = new THREE.Mesh(geometry, material);
    });
  
    function update() {
      if (mesh) {
        mesh.rotation.y += 0.001;
      }
    }
  </script>