<script lang="ts">
    import { onMount } from 'svelte';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  
    export let camera: THREE.PerspectiveCamera;
    export let renderer: THREE.WebGLRenderer;
  
    let controls: OrbitControls;
  
    onMount(() => {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 10;
      controls.maxDistance = 500;
      controls.maxPolarAngle = Math.PI / 2;
    });
  
    function update() {
      if (controls) {
        controls.update();
      }
    }
  </script>