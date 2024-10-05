<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
  import { PLANET_DATA, SUN_SIZE, MOON_DATA, SATURN_RING_DATA, NEARBY_GALAXIES } from '$lib/utils/constants';
  import type { PlanetData } from '$lib/types/planet';
  import ControlPanel from '$lib/components/ControlPanel.svelte';
  import InfoPanel from '$lib/components/InfoPanel.svelte';
  import Astronaut from '$lib/components/Astronaut.svelte';
  import ChatPanel from '$lib/components/ChatPanel.svelte';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  import { getCelestialObjectInfo } from '$lib/utils/nasaApi';
  import { deviceOrientation, deviceMotion, initDeviceOrientation } from '$lib/utils/deviceOrientation';
  import { calculatePlanetPositions } from '$lib/utils/planetPositions';

  let isPlanetsMoving = true;
  let containerElement: HTMLElement | null = null;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let labelRenderer: CSS2DRenderer;
  let controls: OrbitControls;
  let animationId: number;

  

  let showChat = false;
  

  let chatPanelComponent: ChatPanel;

  let selectedDate: string = new Date().toISOString().split('T')[0];

  let useDeviceControls = false;
  let useDeviceMotion = false;
  let isMobile = false;
  let lastTouchDistance = 0;

  const textureLoader = new THREE.TextureLoader();
  const planets: THREE.Mesh[] = [];
  const orbits: THREE.Line[] = [];
  let moonMesh: THREE.Mesh;
  let earthMesh: THREE.Mesh;
  let galaxiesGroup: THREE.Group;

  let simulationSpeed = 1;
  let showOrbits = true;
  let showGalaxies = true;
  let selectedObject: PlanetData | null = null;

  let isLoading = true;
  let loadingProgress = 0;
  let isSceneInitialized = false;

  onMount(() => {
    console.log('Component mounted');
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      initDeviceOrientation();
    }
  });

  $: if (containerElement && !isSceneInitialized) {
    console.log('Container element available, initializing scene');
    isSceneInitialized = true;
    initScene();
  }

  onDestroy(() => {
    console.log('Destroying component...');
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onWindowResize);
    if (renderer) {
      renderer.dispose();
    }
    if (controls) {
      controls.dispose();
    }
  });

  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      lastTouchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
    }
  }

  function handleTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const zoomDelta = currentDistance - lastTouchDistance;
      
      if (camera && controls) {
        const zoomSpeed = 0.1;
        camera.position.z -= zoomDelta * zoomSpeed;
        controls.update();
      }

      lastTouchDistance = currentDistance;
    }
  }

  async function initScene() {
    try {
      isLoading = true;
      await init();
      animate();
      window.addEventListener('resize', onWindowResize);
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      setTimeout(() => {
        isLoading = false;
      }, 1000);
    }
  }

  async function init() {
    if (!containerElement) {
      throw new Error('Container element not found');
    }

    console.log('Initializing scene...');
    updateLoadingProgress(10);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 50, 150);

    console.log('Setting up renderer...');
    updateLoadingProgress(20);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerElement.appendChild(renderer.domElement);

    console.log('Setting up label renderer...');
    updateLoadingProgress(30);
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    containerElement.appendChild(labelRenderer.domElement);

    console.log('Setting up controls...');
    updateLoadingProgress(40);
    controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 1000;

    console.log('Setting up lighting...');
    updateLoadingProgress(50);
    const ambientLight = new THREE.AmbientLight(0x404040, 7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    console.log('Creating solar system...');
    updateLoadingProgress(60);
    await createSolarSystem();
    console.log('Creating galaxies...');
    updateLoadingProgress(80);
    await createGalaxies();
    console.log('Creating background...');
    updateLoadingProgress(90);
    createBackground();

    console.log('Initialization complete.');
    updateLoadingProgress(100);
  }

  function updateLoadingProgress(progress: number) {
    loadingProgress = progress;
  }

  async function createSolarSystem() {
    console.log('Creating Sun...');
    const sunGeometry = new THREE.SphereGeometry(SUN_SIZE, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: await textureLoader.loadAsync('/textures/sun.jpg'),
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.name = 'Sun';
    scene.add(sunMesh);

    console.log('Creating planets...');
    for (const planetData of PLANET_DATA) {
      await createPlanet(planetData);
    }
  }

  function toggleChat() {
    showChat = !showChat;
  }

  async function handleChatResponse(event: CustomEvent<CelestialObjectInfo>) {
    const objectInfo = event.detail;
    if (objectInfo) {
      updateSceneWithNewInfo(objectInfo);
      if (selectedObject && selectedObject.name === objectInfo.name) {
        selectedObject = { ...selectedObject, ...objectInfo };
      }
    }
  }

  function updateSceneWithNewInfo(objectInfo: CelestialObjectInfo) {
    const object = scene.getObjectByName(objectInfo.name);
    if (object) {
      if (object instanceof THREE.Mesh && objectInfo.meanRadius) {
        const scale = objectInfo.meanRadius / SUN_SIZE;
        object.scale.set(scale, scale, scale);
      }
      
      const label = object.getObjectByName(`${objectInfo.name}-label`);
      if (label && label instanceof CSS2DObject) {
        label.element.textContent = objectInfo.name;
      }
    }
  }

  async function createPlanet(planetData: PlanetData) {
    const { name, texture, size, distance } = planetData;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: await textureLoader.loadAsync(`/textures/${texture}`),
      metalness: 0.1,
      roughness: 0.7,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = distance;
    mesh.name = name;
    planets.push(mesh);
    scene.add(mesh);

    addLabel(mesh, name);

    if (name === 'Earth') {
      earthMesh = mesh;
      await createMoon();
    }

    if (name === 'Saturn') {
      await createSaturnRings(mesh);
    }

    createOrbit(distance);
  }

  function addLabel(object: THREE.Object3D, name: string) {
    const div = document.createElement('div');
    div.className = 'absolute px-2 py-1 text-xs text-white bg-black bg-opacity-50 rounded pointer-events-none transform -translate-y-full';
    div.textContent = name;
    const label = new CSS2DObject(div);
    label.position.set(0, object.scale.y, 0);
    object.add(label);
  }

  async function createMoon() {
    const { size, texture, distance } = MOON_DATA;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: await textureLoader.loadAsync(`/textures/${texture}`),
      metalness: 0.1,
      roughness: 0.7,
    });
    moonMesh = new THREE.Mesh(geometry, material);
    moonMesh.position.x = distance;
    earthMesh.add(moonMesh);
    addLabel(moonMesh, 'Moon');
  }

  async function createSaturnRings(saturnMesh: THREE.Mesh) {
    const { innerRadius, outerRadius, texture } = SATURN_RING_DATA;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: await textureLoader.loadAsync(`/textures/${texture}`),
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

  async function createGalaxies() {
    console.log('Creating galaxies...');
    galaxiesGroup = new THREE.Group();
    for (const galaxyData of NEARBY_GALAXIES) {
      const galaxy = await createGalaxy(galaxyData);
      galaxiesGroup.add(galaxy);
    }
    scene.add(galaxiesGroup);
  }

  async function createGalaxy(galaxyData) {
    console.log(`Creating galaxy: ${galaxyData.name}`);
    const particles = galaxyData.particleCount || 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);

    const colorInside = new THREE.Color(galaxyData.colorInside || 0xffffff);
    const colorOutside = new THREE.Color(galaxyData.colorOutside || 0x0000ff);

    for (let i = 0; i < particles; i++) {
      const i3 = i * 3;
      const radius = Math.random() * galaxyData.radius;
      const spinAngle = radius * (galaxyData.spin || 1);
      const branchAngle = ((i % (galaxyData.branches || 2)) / (galaxyData.branches || 2)) * Math.PI * 2;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * (galaxyData.height || 2);
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / galaxyData.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: galaxyData.particleSize || 0.1,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    const points = new THREE.Points(geometry, material);
    points.name = galaxyData.name;
    
    points.position.set(
      galaxyData.position?.x || 0,
      galaxyData.position?.y || 0,
      galaxyData.position?.z || 0
    );

    addLabel(points, galaxyData.name);

    console.log(`Galaxy ${galaxyData.name} created.`);
    return points;
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

  console.log("animate - isPlanetsMoving:", isPlanetsMoving, "selectedDate:", selectedDate, "time:", time.toFixed(2));

  if (isPlanetsMoving && !selectedDate) {
    console.log("Updating planets");
    updatePlanets(time);
  } else {
    console.log("Not updating planets");
  }

  updateMoon(time);
  updateGalaxies(time);

  updateOrbitsVisibility();
  updateGalaxiesVisibility();
  
  if (isMobile && camera && controls) {
    if (useDeviceControls && $deviceOrientation) {
      const { beta, gamma } = $deviceOrientation;
      const sensitivity = 0.1;

      camera.rotation.x += (beta - 90) * Math.PI / 180 * sensitivity;
      camera.rotation.y += -gamma * Math.PI / 180 * sensitivity;
    }

    if (useDeviceMotion && $deviceMotion) {
      const sensitivity = 0.1;
      camera.position.x -= $deviceMotion.x * sensitivity;
      camera.position.y += $deviceMotion.y * sensitivity;
    }

    if (useDeviceControls || useDeviceMotion) {
      camera.updateProjectionMatrix();
      controls.update();
    }
  } else {
    controls.update();
  }

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

function updatePlanets(time: number) {
  console.log("updatePlanets called with time:", time.toFixed(2));
  planets.forEach((planet, index) => {
    const { name, distance, rotationSpeed, orbitSpeed } = PLANET_DATA[index];
    planet.rotation.y += rotationSpeed * simulationSpeed;
    
    planet.userData.orbitAngle = (planet.userData.orbitAngle || 0) + orbitSpeed * simulationSpeed;
    planet.position.x = Math.cos(planet.userData.orbitAngle) * distance;
    planet.position.z = Math.sin(planet.userData.orbitAngle) * distance;
    
    console.log(`Updated ${name} - position:`, planet.position.x.toFixed(2), planet.position.z.toFixed(2));
  });
}

  function updateMoon(time: number) {
    const { distance, orbitSpeed } = MOON_DATA;
    const angle = time * orbitSpeed;
    moonMesh.position.x = Math.cos(angle) * distance;
    moonMesh.position.z = Math.sin(angle) * distance;
  }

  function updateGalaxies(time: number) {
    if (galaxiesGroup) {
      galaxiesGroup.children.forEach((galaxy: THREE.Points) => {
        galaxy.rotation.y = time * 0.05;
      });
    }
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

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  function handleControlUpdate(event: CustomEvent) {
  console.log("handleControlUpdate called with:", event.detail);
  
  const { 
    simulationSpeed: newSpeed, 
    showOrbits: newShowOrbits, 
    showGalaxies: newShowGalaxies, 
    useDeviceControls: newUseDeviceControls,
    useDeviceMotion: newUseDeviceMotion,
    selectedObject: newSelectedObject,
    selectedDate: newSelectedDate,
    isPlanetsMoving: newIsPlanetsMoving
  } = event.detail;
  
  if (newIsPlanetsMoving !== undefined) {
    isPlanetsMoving = newIsPlanetsMoving;
    console.log("Main component - isPlanetsMoving updated to:", isPlanetsMoving);
  }
    
    if (newSpeed !== undefined) simulationSpeed = newSpeed;
    if (newShowOrbits !== undefined) showOrbits = newShowOrbits;
    if (newShowGalaxies !== undefined) showGalaxies = newShowGalaxies;
    if (newUseDeviceControls !== undefined) {
      useDeviceControls = newUseDeviceControls;
      if (!useDeviceControls && !useDeviceMotion) {
        resetDeviceControls();
      }
    }
    if (newUseDeviceMotion !== undefined) {
      useDeviceMotion = newUseDeviceMotion;
      if (!useDeviceControls && !useDeviceMotion) {
        resetDeviceControls();
      }
    }
    if (newSelectedObject !== undefined) {
      selectedObject = newSelectedObject;
      if (selectedObject) {
        focusOnObject(selectedObject);
      }
    }
    if (newSelectedDate !== undefined) {
      selectedDate = newSelectedDate;
    console.log("New selected date:", selectedDate);
    updatePlanetPositionsForDate(new Date(selectedDate));
    
    // Stop continuous planet movement
    planets.forEach(planet => {
      planet.userData.orbitAngle = 0;
    });
    if (event.detail.selectedDate === null) {
    selectedDate = null;
    planets.forEach(planet => {
      planet.userData.orbitAngle = 0;
    });
  }
}
  }

  function updatePlanetPositionsForDate(date: Date) {
  console.log("Updating planet positions for date:", date);
  console.log("isPlanetsMoving before update:", isPlanetsMoving);
  
  const positions = calculatePlanetPositions(date);
  positions.forEach(pos => {
    const planet = scene.getObjectByName(pos.name);
    if (planet && planet instanceof THREE.Object3D) {
      console.log(`Updating position for ${pos.name}:`, pos.x, pos.z);
      planet.position.set(pos.x, 0, pos.z);
    }
  });
  
  //isPlanetsMoving = false;
  console.log("isPlanetsMoving after update:", isPlanetsMoving);

  // Force a single render to update the scene
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

function resetPlanetMovement() {
  selectedDate = null;
  isPlanetsMoving = true;
  console.log("Reset planet movement - isPlanetsMoving:", isPlanetsMoving, "selectedDate:", selectedDate);
}
  function handleShowInfo(event: CustomEvent) {
    const { objectName } = event.detail;
    if (objectName) {
      const object = PLANET_DATA.find(p => p.name === objectName) || 
                     NEARBY_GALAXIES.find(g => g.name === objectName) ||
                     (objectName === 'Sun' ? { name: 'Sun', texture: 'sun.jpg' } : null);
      if (object) {
        selectedObject = object;
      }
      
    }
    
    
  }

  function resetDeviceControls() {
    if (camera && controls) {
      camera.rotation.set(0, 0, 0);
      camera.position.set(0, 50, 150);
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }

  function focusOnObject(objectName: string) {
    const object = scene.getObjectByName(objectName);
    if (object) {
      const distance = object instanceof THREE.Mesh && object.geometry.boundingSphere
        ? object.geometry.boundingSphere.radius * 5
        : 50;
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

  function resetCamera() {
    camera.position.set(0, 50, 150);
    controls.target.set(0, 0, 0);
    selectedObject = null;
  }

  async function handleObjectClick(event: MouseEvent) {
    console.log("Click event triggered");
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log("Intersects:", intersects);

    if (intersects.length > 0) {
      let object = intersects[0].object;
      console.log("Clicked object:", object);

      while (object && !object.name) {
        object = object.parent;
      }

      if (object) {
        console.log("Found named object:", object.name);
        const planetData = PLANET_DATA.find(p => p.name === object.name);
        const objectInfo = await getCelestialObjectInfo(object.name);
        selectedObject = objectInfo;
        await focusOnObject(object.name);

        if (planetData) {
          console.log("Planet data found:", planetData);
          selectedObject = planetData;
          await focusOnObject(object.name);
        } else {
          const galaxyData = NEARBY_GALAXIES.find(g => g.name === object.name);
          if (galaxyData) {
            console.log("Galaxy data found:", galaxyData);
            selectedObject = { ...galaxyData, texture: 'galaxy.jpg' };
            await focusOnObject(object.name);
          }
        }
      }
    }

    console.log("Selected object:", selectedObject);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleObjectClick(event as unknown as MouseEvent);
    }
  }

  function closeInfoPanel() {
    selectedObject = null;
  }
</script>

<svelte:head>
  <title>AstroNexus</title>
</svelte:head>

<div 
  bind:this={containerElement} 
  class="w-full h-screen overflow-hidden relative" 
  on:click={handleObjectClick}
  on:keydown={handleKeyDown}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  role="application"
  tabindex="0"
>
  {#if isLoading}
    <LoadingScreen progress={loadingProgress} />
  {:else}
  <ControlPanel 
  {simulationSpeed}
  {showOrbits}
  {showGalaxies}
  {useDeviceControls}
  {useDeviceMotion}
  selectedObject={selectedObject?.name}
  {isMobile}
  {selectedDate}
  {isPlanetsMoving}
  on:update={handleControlUpdate}
  on:showInfo={handleShowInfo}
  on:resetCamera={resetCamera}
  on:resetPlanetMovement={resetPlanetMovement}
/>
    
    <InfoPanel {selectedObject} close={closeInfoPanel} />

    <Astronaut toggleChat={toggleChat} />

    {#if showChat}
      <ChatPanel on:chatResponse={handleChatResponse} />
    {/if}

    
  {/if}
</div>


<style lang="postcss">
  :global(body) {
    @apply m-0 p-0 overflow-hidden;
  }
</style>