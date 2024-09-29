<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let simulationSpeed: number = 1;
    export let showOrbits: boolean = true;
    export let selectedPlanet: string | null = null;
  
    const dispatch = createEventDispatcher();
  
    const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  
    function updateSimulationSpeed(event: Event) {
      simulationSpeed = parseFloat((event.target as HTMLInputElement).value);
      dispatch('update', { simulationSpeed });
    }
  
    function toggleOrbits() {
      showOrbits = !showOrbits;
      dispatch('update', { showOrbits });
    }
  
    function selectPlanet(event: Event) {
      selectedPlanet = (event.target as HTMLSelectElement).value;
      dispatch('update', { selectedPlanet });
    }
  
    function resetCamera() {
      dispatch('resetCamera');
    }
  </script>
  
  <div class="control-panel">
    <div class="control-group">
      <label for="simulation-speed">Simulation Speed: {simulationSpeed.toFixed(2)}x</label>
      <input 
        type="range" 
        id="simulation-speed" 
        min="0.1" 
        max="10" 
        step="0.1" 
        bind:value={simulationSpeed} 
        on:input={updateSimulationSpeed}
      />
    </div>
  
    <div class="control-group">
      <label>
        <input type="checkbox" bind:checked={showOrbits} on:change={toggleOrbits} />
        Show Orbits
      </label>
    </div>
  
    <div class="control-group">
      <label for="planet-select">Focus on Planet:</label>
      <select id="planet-select" on:change={selectPlanet} bind:value={selectedPlanet}>
        <option value={null}>None</option>
        {#each planets as planet}
          <option value={planet}>{planet}</option>
        {/each}
      </select>
    </div>
  
    <button on:click={resetCamera}>Reset Camera</button>
  </div>
  
  <style lang="postcss">
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
  
    .control-group {
      margin-bottom: 10px;
    }
  
    label {
      display: block;
      margin-bottom: 5px;
    }
  
    input[type="range"] {
      width: 100%;
    }
  
    select, button {
      width: 100%;
      padding: 5px;
      margin-top: 5px;
    }
  
    button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 5px;
    }
  </style>