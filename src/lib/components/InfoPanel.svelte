<!-- InfoPanel.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, blur } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { getCelestialObjectInfo } from '$lib/utils/nasaApi';
  import type { CelestialObjectInfo } from '$lib/types/celestialObject';

  export let selectedObject: any | null = null;
  export let close: () => void;

  let objectInfo: CelestialObjectInfo | null = null;
  let loading = false;
  let error: string | null = null;
  let currentImageIndex = 0;

  $: if (selectedObject) {
    fetchObjectInfo(selectedObject.name);
  }

  async function fetchObjectInfo(name: string) {
    loading = true;
    error = null;
    try {
      objectInfo = await getCelestialObjectInfo(name);
      currentImageIndex = 0;
    } catch (err) {
      console.error('Error fetching object info:', err);
      error = `Failed to load information for ${name}. Please try again.`;
    } finally {
      loading = false;
    }
  }

  function handleClose() {
    objectInfo = null;
    close();
  }

  function changeImage(direction: number) {
    if (objectInfo && objectInfo.images.length > 0) {
      currentImageIndex = (currentImageIndex + direction + objectInfo.images.length) % objectInfo.images.length;
    }
  }
</script>

{#if selectedObject}
  <div
    class="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50"
    on:click|self={handleClose}
    transition:fade={{ duration: 300 }}
  >
    <div
      class="bg-black bg-opacity-30 text-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-white border-opacity-20"
      transition:fly={{ y: 50, duration: 500, easing: cubicOut }}
      on:click|stopPropagation 
    >
      <button
        class="absolute top-4 right-4 text-white text-xl bg-transparent hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
        on:click={handleClose}
      >
        ×
      </button>

      {#if loading}
        <div class="flex justify-center items-center h-64">
          <div class="animate-pulse text-4xl font-light">Loading...</div>
        </div>
      {:else if error}
        <p class="text-red-400 text-center text-xl">{error}</p>
      {:else if objectInfo}
        <div class="space-y-8">
          <h2 class="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{objectInfo.englishName}</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              {#if objectInfo.images && objectInfo.images.length > 0}
                <div class="relative overflow-hidden rounded-2xl shadow-xl aspect-w-16 aspect-h-9">
                  {#key currentImageIndex}
                    <img 
                      src={objectInfo.images[currentImageIndex]} 
                      alt={objectInfo.name} 
                      class="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-110"
                      transition:fade={{ duration: 400 }}
                    >
                  {/key}
                  {#if objectInfo.images.length > 1}
                    <button class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 transition-opacity duration-200 hover:bg-opacity-75" on:click={() => changeImage(-1)}>←</button>
                    <button class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 transition-opacity duration-200 hover:bg-opacity-75" on:click={() => changeImage(1)}>→</button>
                  {/if}
                </div>
              {:else}
                <div class="w-full aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center">
                  <span class="text-2xl font-light">No image available</span>
                </div>
              {/if}
              <p class="text-lg leading-relaxed font-light">{objectInfo.description}</p>
            </div>
            
            <div class="space-y-8">
              <div>
                <h3 class="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Quick Facts</h3>
                <ul class="space-y-3 text-lg font-light">
                  <li><span class="font-normal">Type:</span> {objectInfo.isPlanet ? 'Planet' : (objectInfo.name === 'Sun' ? 'Star' : 'Galaxy')}</li>
                  {#if objectInfo.isPlanet || objectInfo.name === 'Sun'}
                    <li><span class="font-normal">Gravity:</span> {objectInfo.gravity.toFixed(2)} m/s²</li>
                    <li><span class="font-normal">Mean Radius:</span> {objectInfo.meanRadius.toLocaleString()} km</li>
                    {#if objectInfo.isPlanet}
                      <li><span class="font-normal">Orbital Period:</span> {objectInfo.sideralOrbit.toLocaleString()} Earth days</li>
                    {/if}
                    <li><span class="font-normal">Rotation Period:</span> {Math.abs(objectInfo.sideralRotation).toFixed(2)} hours</li>
                    <li><span class="font-normal">Number of Moons:</span> {objectInfo.moons}</li>
                  {/if}
                </ul>
              </div>

              
            </div>
          </div>
        </div>
      {:else}
        <p class="text-center text-xl font-light">No information available.</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  :global(body) {
    overflow-y: hidden;
  }
</style>