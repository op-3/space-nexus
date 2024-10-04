<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { PLANET_DATA, NEARBY_GALAXIES } from '$lib/utils/constants';
  import { fade, fly } from 'svelte/transition';

  export let simulationSpeed: number = 1;
  export let showOrbits: boolean = true;
  export let showGalaxies: boolean = true;
  export let useDeviceControls: boolean = false;
  export let useDeviceMotion: boolean = false;
  export let selectedObject: string | null = null;
  export let isMobile: boolean = false;

  const dispatch = createEventDispatcher();

  const allObjects = [{ name: 'Sun' }, ...PLANET_DATA, ...NEARBY_GALAXIES];

  let isExpanded = false;

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

  function toggleDeviceControls() {
    useDeviceControls = !useDeviceControls;
    dispatch('update', { useDeviceControls });
  }

  function toggleDeviceMotion() {
    useDeviceMotion = !useDeviceMotion;
    dispatch('update', { useDeviceMotion });
  }

  function selectObject(event: Event) {
    selectedObject = (event.target as HTMLSelectElement).value;
    dispatch('update', { selectedObject });
    dispatch('showInfo', { objectName: selectedObject });
  }

  function resetCamera() {
    dispatch('resetCamera');
  }

  function toggleExpand() {
    isExpanded = !isExpanded;
  }
</script>

<div 
  class="absolute top-4 left-4 z-50"
  transition:fly={{ y: -50, duration: 300 }}
>
  <button
    on:click={toggleExpand}
    class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 flex items-center space-x-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
    </svg>
    <span>{isExpanded ? 'Hide' : 'Show'} Controls</span>
  </button>

  {#if isExpanded}
    <div 
      class="mt-4 bg-gray-900 bg-opacity-90 text-white p-6 rounded-2xl shadow-2xl backdrop-blur-lg w-80"
      transition:fade={{ duration: 300 }}
    >
      <h2 class="text-2xl font-bold mb-6 text-indigo-300">Simulation Controls</h2>
      
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2 text-indigo-200" for="speed">
            Simulation Speed: {simulationSpeed.toFixed(2)}x
          </label>
          <input 
            type="range" 
            id="speed"
            min="0.1" 
            max="10" 
            step="0.1" 
            bind:value={simulationSpeed} 
            on:input={updateSimulationSpeed}
            class="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
          >
        </div>
        
        <div class="flex items-center">
          <label for="orbits" class="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="orbits"
              bind:checked={showOrbits}
              on:change={toggleOrbits}
              class="w-5 h-5 text-indigo-600 bg-gray-700 rounded border-gray-600 focus:ring-indigo-500 cursor-pointer"
            >
            <span class="ml-3 text-sm font-medium">Show Orbits</span>
          </label>
        </div>
        
        <div class="flex items-center">
          <label for="galaxies" class="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="galaxies"
              bind:checked={showGalaxies}
              on:change={toggleGalaxies}
              class="w-5 h-5 text-indigo-600 bg-gray-700 rounded border-gray-600 focus:ring-indigo-500 cursor-pointer"
            >
            <span class="ml-3 text-sm font-medium">Show Nearby Galaxies</span>
          </label>
        </div>

        {#if isMobile}
          <div class="flex items-center">
            <label for="deviceControls" class="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="deviceControls"
                bind:checked={useDeviceControls}
                on:change={toggleDeviceControls}
                class="w-5 h-5 text-indigo-600 bg-gray-700 rounded border-gray-600 focus:ring-indigo-500 cursor-pointer"
              >
              <span class="ml-3 text-sm font-medium">Use Device Controls</span>
            </label>
          </div>
          
          <div class="flex items-center">
            <label for="deviceMotion" class="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="deviceMotion"
                bind:checked={useDeviceMotion}
                on:change={toggleDeviceMotion}
                class="w-5 h-5 text-indigo-600 bg-gray-700 rounded border-gray-600 focus:ring-indigo-500 cursor-pointer"
              >
              <span class="ml-3 text-sm font-medium">Use Device Motion</span>
            </label>
          </div>
        {/if}
        
        <div>
          <label for="focus" class="block text-sm font-medium mb-2 text-indigo-200">Focus on:</label>
          <select 
            id="focus"
            on:change={selectObject} 
            bind:value={selectedObject}
            class="bg-gray-800 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          >
            <option value={null}>None</option>
            {#each allObjects as object}
              <option value={object.name}>{object.name}</option>
            {/each}
          </select>
        </div>
        
        <button 
          on:click={resetCamera}
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          <span>Reset Camera</span>
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #818cf8;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #ffffff;
  }

  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #818cf8;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #ffffff;
  }
</style>