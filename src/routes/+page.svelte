<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { browser } from '$lib/utils/browser';
    import { createScene, setSceneBackground, addToScene } from '$lib/three/scene';
    import { createCamera, updateCameraAspect } from '$lib/three/camera';
    import { createRenderer, updateRendererSize } from '$lib/three/renderer';
    import { createAmbientLight, createSunLight } from '$lib/three/lights';
    import { createOrbitControls, updateControls } from '$lib/three/controls';
    import { PLANET_DATA, SUN_SIZE } from '$lib/utils/constants';
    import { createTextureLoader, createSphereGeometry, calculateOrbitPosition } from '$lib/utils/helpers';
    import type { PlanetData } from '$lib/types/planet';
    import ControlPanel from '$lib/components/ControlPanel.svelte';
  
    let container: HTMLElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: any;
    let animationId: number;
  
    const textureLoader = browser ? createTextureLoader() : null;
    const planets: THREE.Mesh[] = [];
    const orbits: THREE.Line[] = [];
  
    let simulationSpeed = 1;
    let showOrbits = true;
    let selectedPlanet: string | null = null;
  
    onMount(() => {
      if (browser) {
        init();
        animate();
        window.addEventListener('resize', onWindowResize);
      }
    });
  
    onDestroy(() => {
      if (browser) {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', onWindowResize);
        if (renderer) {
          renderer.dispose();
        }
      }
    });
  
    function init() {
      scene = createScene();
      setSceneBackground(scene, '/textures/milkyway.jpg');
  
      const aspect = window.innerWidth / window.innerHeight;
      camera = createCamera(aspect);
  
      renderer = createRenderer(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
  
      controls = createOrbitControls(camera, renderer);
  
      const ambientLight = createAmbientLight();
      const sunLight = createSunLight();
      addToScene(scene, ambientLight, sunLight);
  
      createSun();
      createPlanets();
      createOrbits();
    }
  
    function createSun() {
      const sunGeometry = createSphereGeometry(SUN_SIZE, 64, 64);
      const sunMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load('/textures/sun.jpg'),
        emissive: 0xffff00,
        emissiveIntensity: 0.5,
      });
      const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
      addToScene(scene, sunMesh);
    }
  
    function createPlanets() {
      PLANET_DATA.forEach((planetData: PlanetData) => {
        const { name, texture, size, distance } = planetData;
        const geometry = createSphereGeometry(size);
        const material = new THREE.MeshStandardMaterial({
          map: textureLoader.load(`/textures/${texture}`),
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = distance;
        mesh.name = name;
        planets.push(mesh);
        addToScene(scene, mesh);
      });
    }
  
    function createOrbits() {
      PLANET_DATA.forEach((planetData: PlanetData) => {
        const { distance } = planetData;
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
          new THREE.Path().absarc(0, 0, distance, 0, Math.PI * 2, true).getPoints(90)
        );
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        orbits.push(orbit);
        addToScene(scene, orbit);
      });
    }
  
    function animate() {
      animationId = requestAnimationFrame(animate);
      updateControls(controls);
  
      const time = performance.now() * 0.001 * simulationSpeed;
      updatePlanets(time);
  
      updateOrbitsVisibility();
      updateCameraFocus();
  
      renderer.render(scene, camera);
    }
  
    function updatePlanets(time: number) {
      planets.forEach((planet, index) => {
        const { distance, rotationSpeed, orbitSpeed } = PLANET_DATA[index];
        planet.rotation.y += rotationSpeed * simulationSpeed;
        const orbitPosition = calculateOrbitPosition(distance, time * orbitSpeed);
        planet.position.copy(orbitPosition);
      });
    }
  
    function updateOrbitsVisibility() {
      orbits.forEach(orbit => {
        orbit.visible = showOrbits;
      });
    }
  
    function updateCameraFocus() {
      if (selectedPlanet) {
        const planet = scene.getObjectByName(selectedPlanet);
        if (planet) {
          const planetPosition = new THREE.Vector3();
          planet.getWorldPosition(planetPosition);
          camera.position.lerp(planetPosition.add(new THREE.Vector3(0, 5, 20)), 0.05);
          camera.lookAt(planet.position);
        }
      }
    }
  
    function onWindowResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      updateCameraAspect(camera, width / height);
      updateRendererSize(renderer, width, height);
    }
  
    function handleControlUpdate(event: CustomEvent) {
      const { simulationSpeed: newSpeed, showOrbits: newShowOrbits, selectedPlanet: newSelectedPlanet } = event.detail;
      if (newSpeed !== undefined) simulationSpeed = newSpeed;
      if (newShowOrbits !== undefined) showOrbits = newShowOrbits;
      if (newSelectedPlanet !== undefined) selectedPlanet = newSelectedPlanet;
    }
  
    function resetCamera() {
      camera.position.set(0, 30, 100);
      camera.lookAt(0, 0, 0);
      controls.reset();
      selectedPlanet = null;
    }
  </script>
  
  <div bind:this={container} class="solar-system-container">
    <ControlPanel 
      {simulationSpeed}
      {showOrbits}
      {selectedPlanet}
      on:update={handleControlUpdate}
      on:resetCamera={resetCamera}
    />
  </div>
  
  <style lang="postcss">
    .solar-system-container {
      width: 100%;
      height: 100vh;
      overflow: hidden;
      position: relative;
    }
  
    :global(body) {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  </style>