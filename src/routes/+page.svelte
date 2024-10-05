<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
  import { goto } from '$app/navigation';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  

  let container: HTMLElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let composer: EffectComposer;
  let stars: THREE.Points;
  let raycaster: THREE.Raycaster;
  let mouse: THREE.Vector2;

  let loaded = false;
  let currentSection = 0;
  const sections = [
    { title: "Explore the Cosmos", subtitle: "Journey through the universe" },
    { title: "Discover New Worlds", subtitle: "Uncover the secrets of distant planets" },
    { title: "Unlock the Mysteries", subtitle: "Delve into the depths of space" },
  ];

  const progress = tweened(0, {
    duration: 1000,
    easing: cubicOut
  });

  onMount(() => {
    initScene();
    animate();
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    setTimeout(() => { loaded = true; }, 1000);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    };
  });

  function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    createStars();
    setupPostProcessing();
  }

  function createStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];

    for (let i = 0; i < 15000; i++) {
      vertices.push(THREE.MathUtils.randFloatSpread(2000));
      vertices.push(THREE.MathUtils.randFloatSpread(2000));
      vertices.push(THREE.MathUtils.randFloatSpread(2000));
      sizes.push(Math.random() * 2);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xFFFFFF) },
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        varying float vSize;
        void main() {
          vSize = size;
          vec3 pos = position;
          pos.y += sin(time + position.x * 0.05) * 2.0;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vSize;
        void main() {
          float strength = distance(gl_PointCoord, vec2(0.5));
          strength = 1.0 - strength;
          strength = pow(strength, 3.0);
          vec3 finalColor = mix(vec3(0.0), color, strength);
          gl_FragColor = vec4(finalColor, strength);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    stars = new THREE.Points(geometry, material);
    scene.add(stars);
  }

  function setupPostProcessing() {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, 0.4, 0.85
    );
    composer.addPass(bloomPass);
  }

  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    stars.material.uniforms.time.value = time;
    stars.rotation.y = time * 0.05;
    composer.render();
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(stars);
    if (intersects.length > 0) {
      stars.rotation.y += 0.001;
    }
  }

  function nextSection() {
    currentSection = (currentSection + 1) % sections.length;
    progress.set(0);
    progress.set(1);
  }

  function navigateToSpace() {
    goto('/space');
  }

  function navigateToNasaGallery() {
    goto('/nasa-gallery');
  }
</script>

<div bind:this={container} class="w-full h-screen bg-black overflow-hidden relative">
  {#if loaded}
    <div class="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 text-white z-10">
      <header class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h1 class="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          AstroNexus
        </h1>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            on:click={navigateToSpace}
            class="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            Begin Journey
          </button>
          <button
            on:click={navigateToNasaGallery}
            class="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            NASA Gallery
          </button>
        </div>
      </header>

      <main class="flex-grow flex items-center justify-center">
        <div class="text-center max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto">
          <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 leading-tight">
            {sections[currentSection].title}
          </h2>
          <p class="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 opacity-80">
            {sections[currentSection].subtitle}
          </p>
          <button
            on:click={nextSection}
            class="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:from-blue-600 hover:to-purple-600 transition duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            Discover More
          </button>
        </div>
      </main>

      <footer class="text-center text-xs sm:text-sm opacity-60">
        © 2024 AstroNexus. Venturing into the unknown.
      </footer>
    </div>
    
    <div class="absolute bottom-0 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500">
      <div class="h-full bg-white" style="width: {$progress * 100}%;"></div>
    </div>
  {/if}
</div>

<style lang="postcss">
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

  :global(body) {
    @apply m-0 p-0 overflow-hidden;
    font-family: 'Orbitron', sans-serif;
  }

  .gradient-bg {
    background-image: linear-gradient(to right, theme('colors.blue.400'), theme('colors.purple.600'));
  }

  button {
    @apply focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50;
  }
</style>