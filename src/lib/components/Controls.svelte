<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import type { PerspectiveCamera } from 'three';
  import type { WebGLRenderer } from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

  export let camera: PerspectiveCamera;
  export let renderer: WebGLRenderer;

  let controls: OrbitControls;
  const dispatch = createEventDispatcher();

  onMount(() => {
      initControls();
  });

  onDestroy(() => {
      if (controls) {
          controls.dispose();
      }
  });

  function initControls() {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 5;
      controls.maxDistance = 500;
      controls.maxPolarAngle = Math.PI / 2;
  }

  export function updateControls() {
      if (controls) {
          controls.update();
      }
  }

  export function resetCamera() {
      if (controls) {
          camera.position.set(0, 30, 100);
          controls.target.set(0, 0, 0);
          controls.update();
          dispatch('cameraReset');
      }
  }

  export function focusOnObject(position) {
      if (controls) {
          controls.target.copy(position);
          controls.update();
      }
  }
</script>

<div class="controls-container">
  <button on:click={resetCamera}>Reset Camera</button>
</div>

<style>
  .controls-container {
      position: absolute;
      bottom: 10px;
      right: 10px;
      z-index: 1000;
  }

  button {
      background-color: #4CAF50;
      border: none;
      color: white;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 5px;
  }

  button:hover {
      background-color: #45a049;
  }
</style>