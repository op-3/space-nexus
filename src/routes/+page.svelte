<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
  import { PLANET_DATA, SUN_SIZE, MOON_DATA, SATURN_RING_DATA, NEARBY_GALAXIES } from '$lib/utils/constants';
  import type { PlanetData } from '$lib/types/planet';
  import ControlPanel from '$lib/components/ControlPanel.svelte';

  let container: HTMLElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let labelRenderer: CSS2DRenderer;
  let controls: OrbitControls;
  let animationId: number;

  const textureLoader = new THREE.TextureLoader();
  const planets: THREE.Mesh[] = [];
  const orbits: THREE.Line[] = [];
  let moonMesh: THREE.Mesh;
  let earthMesh: THREE.Mesh;
  let galaxiesGroup: THREE.Group;

  let simulationSpeed = 1;
  let showOrbits = true;
  let showGalaxies = true;
  let selectedObject: string | null = null;

  onMount(() => {
    init();
    animate();
    window.addEventListener('resize', onWindowResize);
  });

  onDestroy(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onWindowResize);
    if (renderer) {
      renderer.dispose();
    }
    if (controls) {
      controls.dispose();
    }
  });

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 150);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    container.appendChild(labelRenderer.domElement);

    controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 500;

    const ambientLight = new THREE.AmbientLight(0x404040, 7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 1000);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    createSolarSystem();
    createGalaxies();
    createBackground();
  }

  function createSolarSystem() {
    // Sun
    const sunGeometry = new THREE.SphereGeometry(SUN_SIZE, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load('/textures/sun.jpg'),
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.name = 'Sun';
    scene.add(sunMesh);

    // Planets
    PLANET_DATA.forEach((planetData: PlanetData) => {
      const { name, texture, size, distance } = planetData;
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load(`/textures/${texture}`),
        specular: 0x333333,
        shininess: 5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = distance;
      mesh.name = name;
      planets.push(mesh);
      scene.add(mesh);

      addLabel(mesh, name);

      if (name === 'Earth') {
        earthMesh = mesh;
        createMoon();
      }

      if (name === 'Saturn') {
        createSaturnRings(mesh);
      }

      createOrbit(distance);
    });
  }

  function addLabel(object: THREE.Object3D, name: string) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = name;
    div.style.marginTop = '-1em';
    const label = new CSS2DObject(div);
    label.position.set(0, object.geometry.parameters.radius + 0.5, 0);
    object.add(label);
  }

  function createMoon() {
    const { size, texture, distance } = MOON_DATA;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      map: textureLoader.load(`/textures/${texture}`),
      specular: 0x333333,
      shininess: 5,
    });
    moonMesh = new THREE.Mesh(geometry, material);
    moonMesh.position.x = distance;
    earthMesh.add(moonMesh);
    addLabel(moonMesh, 'Moon');
  }

  function createSaturnRings(saturnMesh: THREE.Mesh) {
    const { innerRadius, outerRadius, texture } = SATURN_RING_DATA;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const ringMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load(`/textures/${texture}`),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    saturnMesh.add(ringMesh);
  }

  function createOrbit(distance: number) {
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
      new THREE.Path().absarc(0, 0, distance, 0, Math.PI * 2, true).getPoints(90)
    );
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    orbits.push(orbit);
    scene.add(orbit);
  }

  function createGalaxies() {
    galaxiesGroup = new THREE.Group();
    NEARBY_GALAXIES.forEach(galaxy => {
      const geometry = new THREE.PlaneGeometry(galaxy.size, galaxy.size);
      const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`/textures/galaxies/${galaxy.texture}`),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.setFromSphericalCoords(
        galaxy.distance,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      mesh.name = galaxy.name;
      galaxiesGroup.add(mesh);
    });
    scene.add(galaxiesGroup);
  }

  function createBackground() {
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const material = new THREE.MeshBasicMaterial({
      map: textureLoader.load('/textures/milkyway.jpg'),
      side: THREE.BackSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  function animate() {
    animationId = requestAnimationFrame(animate);

    const time = performance.now() * 0.001 * simulationSpeed;
    updatePlanets(time);
    updateMoon(time);

    updateOrbitsVisibility();
    updateGalaxiesVisibility();
    
    controls.update();

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }

  function updatePlanets(time: number) {
    planets.forEach((planet, index) => {
      const { distance, rotationSpeed, orbitSpeed } = PLANET_DATA[index];
      planet.rotation.y += rotationSpeed * simulationSpeed;
      planet.position.x = Math.cos(time * orbitSpeed) * distance;
      planet.position.z = Math.sin(time * orbitSpeed) * distance;
    });
  }

  function updateMoon(time: number) {
    const { distance, orbitSpeed } = MOON_DATA;
    const angle = time * orbitSpeed;
    moonMesh.position.x = Math.cos(angle) * distance;
    moonMesh.position.z = Math.sin(angle) * distance;
  }

  function updateOrbitsVisibility() {
    orbits.forEach(orbit => {
      orbit.visible = showOrbits;
    });
  }

  function updateGalaxiesVisibility() {
    if (galaxiesGroup) {
      galaxiesGroup.visible = showGalaxies;
    }
  }

  function focusOnObject(objectName: string) {
    const object = scene.getObjectByName(objectName) || galaxiesGroup.getObjectByName(objectName);
    if (object) {
      const distance = object.geometry.boundingSphere?.radius ? object.geometry.boundingSphere.radius * 5 : 50;
      const position = new THREE.Vector3();
      object.getWorldPosition(position);
      
      controls.target.copy(position);
      camera.position.set(
        position.x + distance,
        position.y + distance / 2,
        position.z + distance
      );
      camera.lookAt(position);
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  function handleControlUpdate(event: CustomEvent) {
    const { simulationSpeed: newSpeed, showOrbits: newShowOrbits, selectedObject: newSelectedObject, showGalaxies: newShowGalaxies } = event.detail;
    if (newSpeed !== undefined) simulationSpeed = newSpeed;
    if (newShowOrbits !== undefined) showOrbits = newShowOrbits;
    if (newSelectedObject !== undefined) {
      selectedObject = newSelectedObject;
      if (selectedObject) {
        focusOnObject(selectedObject);
      }
    }
    if (newShowGalaxies !== undefined) showGalaxies = newShowGalaxies;
  }

  function resetCamera() {
    camera.position.set(0, 50, 150);
    controls.target.set(0, 0, 0);
    selectedObject = null;
  }
</script>

<div bind:this={container} class="solar-system-container">
  <ControlPanel 
    {simulationSpeed}
    {showOrbits}
    {showGalaxies}
    {selectedObject}
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

  :global(.label) {
    color: #ffffff;
    font-family: Arial, sans-serif;
    font-size: 12px;
    padding: 2px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 3px;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>