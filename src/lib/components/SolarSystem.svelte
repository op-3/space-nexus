<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import Sun from './Sun.svelte';
    import Planet from './Planet.svelte';
  
    let scene: THREE.Scene;
    let planets: any[] = [
      { name: 'Mercury', texture: 'mercury.jpg', size: 0.4, distance: 10, rotationSpeed: 0.005, orbitSpeed: 0.01 },
      { name: 'Venus', texture: 'venus.jpg', size: 0.9, distance: 15, rotationSpeed: 0.003, orbitSpeed: 0.007 },
      { name: 'Earth', texture: 'earth.jpg', size: 1, distance: 20, rotationSpeed: 0.004, orbitSpeed: 0.005 },
      { name: 'Mars', texture: 'mars.jpg', size: 0.5, distance: 25, rotationSpeed: 0.003, orbitSpeed: 0.004 },
      { name: 'Jupiter', texture: 'jupiter.jpg', size: 2, distance: 40, rotationSpeed: 0.002, orbitSpeed: 0.002 },
      { name: 'Saturn', texture: 'saturn.jpg', size: 1.8, distance: 55, rotationSpeed: 0.002, orbitSpeed: 0.0015 },
      { name: 'Uranus', texture: 'uranus.jpg', size: 1.3, distance: 70, rotationSpeed: 0.001, orbitSpeed: 0.001 },
      { name: 'Neptune', texture: 'neptune.jpg', size: 1.2, distance: 85, rotationSpeed: 0.001, orbitSpeed: 0.0008 },
    ];
  
    onMount(() => {
      scene = new THREE.Scene();
      const textureLoader = new THREE.TextureLoader();
      scene.background = textureLoader.load('/textures/milkyway.jpg');
    });
  
    function update(time: number) {
      // Update logic for planets
    }
  </script>
  
  <Sun />
  {#each planets as planet (planet.name)}
    <Planet {...planet} />
  {/each}