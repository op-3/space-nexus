<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import SolarSystem from './SolarSystem.svelte';
    import Controls from './Controls.svelte';
  
    let container: HTMLElement;
    let width: number;
    let height: number;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationId: number;
  
    onMount(() => {
      init();
      animate();
    });
  
    onDestroy(() => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    });
  
    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 30, 100);
  
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
  
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
  
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(0, 0, 0);
      scene.add(pointLight);
  
      window.addEventListener('resize', onWindowResize);
    }
  
    function animate() {
      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
  
    function onWindowResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  </script>
  
  <div bind:this={container} bind:clientWidth={width} bind:clientHeight={height}>
    <SolarSystem {scene} />
    <Controls {camera} {renderer} />
  </div>
  
  <style>
    div {
      width: 100%;
      height: 100vh;
    }
  </style>