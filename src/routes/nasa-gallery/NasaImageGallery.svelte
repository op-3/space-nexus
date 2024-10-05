<script lang="ts">
    import { onMount } from 'svelte';
    import { getCelestialObjectInfo } from '../../lib/utils/nasaApi';
    import { browser } from '$app/environment';
    import { fade } from 'svelte/transition';
  
    const solarSystemObjects = [
      "All", "Sun", "Mercury", "Venus", "Earth", "Mars", 
      "Jupiter", "Saturn", "Uranus", "Neptune"
    ];
  
    let selectedObject = "All";
    let images: { url: string, object: string }[] = [];
    let loading = true;
    const pageSize = 40; // زيادة عدد الصور المحملة في كل مرة
  
    async function loadImagesForObject(objectName: string) {
      loading = true;
      try {
        if (objectName === "All") {
          images = [];
          await Promise.all(solarSystemObjects.slice(1).map(async (object) => {
            const info = await getCelestialObjectInfo(object, 1, pageSize / solarSystemObjects.length);
            images = [...images, ...info.images.map(url => ({ url, object }))];
          }));
        } else {
          const info = await getCelestialObjectInfo(objectName, 1, pageSize);
          images = info.images.map(url => ({ url, object: objectName }));
        }
        images.sort(() => Math.random() - 0.5); // ترتيب الصور عشوائياً
      } catch (error) {
        console.error(`Error loading images for ${objectName}:`, error);
        images = [];
      } finally {
        loading = false;
      }
    }
  
    $: {
      if (browser) {
        loadImagesForObject(selectedObject);
      }
    }
  
    onMount(() => {
      loadImagesForObject(selectedObject);
    });
</script>
  
<main class="bg-gray-900 min-h-screen overflow-y-auto">
    <header class="bg-black bg-opacity-70 fixed top-0 left-0 right-0 z-10 backdrop-blur-md">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-5xl font-bold text-white text-center mb-4">Solar System Gallery</h1>
        <p class="text-xl text-blue-300 text-center mb-6">Explore Our Cosmic Neighborhood</p>
        <div class="flex justify-center">
          <select 
            bind:value={selectedObject}
            class="w-full max-w-md px-4 py-2 rounded-lg focus:outline-none bg-white text-gray-800 text-lg transition-all duration-300 hover:shadow-lg"
          >
            {#each solarSystemObjects as object}
              <option value={object}>{object}</option>
            {/each}
          </select>
        </div>
      </div>
    </header>
    
    <div class="container mx-auto px-4 pt-56 pb-32">
      <h2 class="text-4xl font-bold text-white mb-8 text-center">
        {selectedObject === "All" ? "All Celestial Objects" : selectedObject}
      </h2>
      {#if loading}
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      {:else if images.length > 0}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {#each images as { url, object }, index}
            <div 
              class="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              transition:fade={{ duration: 300 }}
            >
              <img src={url} alt={`${object} image`} class="w-full h-64 object-cover" loading="lazy" />
              <div class="p-4">
                <p class="text-white text-center font-semibold">{object}</p>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-white text-center text-xl">No images found</p>
      {/if}
    </div>
  </main>
  
  <style>
    :global(body) {
      margin: 0;
      padding: 0;
      background-color: #1a202c;
      overflow-y: auto;
    }
  
    main {
      min-height: 100vh;
      padding-bottom: 4rem;
    }
  </style>