<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { PLANET_DATA, NEARBY_GALAXIES } from '$lib/utils/constants';
  
    export let simulationSpeed: number = 1;
    export let showOrbits: boolean = true;
    export let showGalaxies: boolean = true;
    export let selectedObject: string | null = null;
  
    const dispatch = createEventDispatcher();
  
    const allObjects = [{ name: 'Sun' }, ...PLANET_DATA, ...NEARBY_GALAXIES];
  
    function updateSimulationSpeed(event: Event) {
      simulationSpeed = parseFloat((event.target as HTMLInputElement).value);
      dispatch('update', { simulationSpeed });
    }
  
    function toggleOrbits() {
      showOrbits = !showOrbits;
      dispatch('update', { showOrbits });
    }
  
    function toggleGalaxies() {
      showGalaxies = !showGalaxies;
      dispatch('update', { showGalaxies });
    }
  
    function selectObject(event: Event) {
      selectedObject = (event.target as HTMLSelectElement).value;
      dispatch('update', { selectedObject });
    }
  
    function resetCamera() {
      dispatch('resetCamera');
    }
  </script>
  
  <div class="control-panel">
    <label>
      Simulation Speed: {simulationSpeed.toFixed(2)}x
      <input type="range" min="0.1" max="10" step="0.1" bind:value={simulationSpeed} on:input={updateSimulationSpeed}>
    </label>
    <label>
      <input type="checkbox" bind:checked={showOrbits} on:change={toggleOrbits}>
      Show Orbits
    </label>
    <label>
      <input type="checkbox" bind:checked={showGalaxies} on:change={toggleGalaxies}>
      Show Nearby Galaxies
    </label>
    <label>
      Focus on:
      <select on:change={selectObject} bind:value={selectedObject}>
        <option value={null}>None</option>
        {#each allObjects as object}
          <option value={object.name}>{object.name}</option>
        {/each}
      </select>
    </label>
    <button on:click={resetCamera}>Reset Camera</button>
  </div>
  
  <style>
    .control-panel {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 1000;
    }
    label, button {
      display: block;
      margin-bottom: 10px;
    }
    select, input[type="range"] {
      width: 100%;
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
  </style>