<script lang="ts">
    import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { fetchPlanetInfo, planetInfo } from '$lib/utils/nasaApi';
    import type { PlanetData } from '$lib/types/planet';
  
    export let planetData: PlanetData | null = null;
    export let onClose: () => void;
  
    let nasaInfo: any = null;
  
    $: if (planetData) {
      fetchPlanetInfo(planetData.name).then(info => {
        nasaInfo = info;
      });
    }
  </script>
  
  {#if planetData}
    <div class="planet-info-overlay" transition:fly={{ y: 200, duration: 300 }}>
      <div class="planet-info-content">
        <button class="close-button" on:click={onClose}>&times;</button>
        <h2>{planetData.name}</h2>
        {#if nasaInfo}
          <img src={nasaInfo.url} alt={planetData.name} class="planet-image" />
          <p class="nasa-description">{nasaInfo.explanation}</p>
        {:else}
          <img src="/textures/{planetData.texture}" alt={planetData.name} class="planet-image" />
        {/if}
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Size:</span>
            <span class="info-value">{planetData.size.toLocaleString()} km</span>
          </div>
          <div class="info-item">
            <span class="info-label">Distance from Sun:</span>
            <span class="info-value">{planetData.distance.toLocaleString()} million km</span>
          </div>
          <div class="info-item">
            <span class="info-label">Orbit Period:</span>
            <span class="info-value">{planetData.orbitPeriod} Earth years</span>
          </div>
          <div class="info-item">
            <span class="info-label">Rotation Period:</span>
            <span class="info-value">{planetData.rotationPeriod} Earth days</span>
          </div>
        </div>
        {#if nasaInfo}
          <p class="nasa-copyright">Image Credit & Copyright: {nasaInfo.copyright || 'NASA'}</p>
        {/if}
      </div>
    </div>
  {/if}
  
  <style lang="postcss">
    /* ... (previous styles remain the same) ... */
  
    .nasa-description {
      font-size: 14px;
      line-height: 1.6;
      text-align: justify;
      margin-top: 20px;
      margin-bottom: 20px;
    }
  
    .nasa-copyright {
      font-size: 12px;
      color: #aaa;
      text-align: right;
      margin-top: 10px;
    }
  </style>