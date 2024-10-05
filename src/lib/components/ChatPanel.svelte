<!-- ChatPanel.svelte -->
<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { getCelestialObjectInfo } from '$lib/utils/nasaApi';
  import type { CelestialObjectInfo } from '$lib/types/celestialObject';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let question = '';
  let chatHistory = [];
  let isLoading = false;

  const celestialObjects = [
    'Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune',
    'Moon', 'Andromeda Galaxy', 'Triangulum Galaxy'
  ];

  function extractCelestialObject(query: string): string | null {
    query = query.toLowerCase();
    for (const object of celestialObjects) {
      if (query.includes(object.toLowerCase())) {
        return object;
      }
    }
    return null;
  }

  async function handleSubmit() {
    if (question.trim()) {
      chatHistory = [...chatHistory, { type: 'user', text: question }];
      isLoading = true;
      try {
        const celestialObject = extractCelestialObject(question);
        if (celestialObject) {
          const objectInfo: CelestialObjectInfo = await getCelestialObjectInfo(celestialObject);
          const response = formatResponse(objectInfo);
          chatHistory = [...chatHistory, { type: 'bot', text: response }];
          dispatch('chatResponse', objectInfo);
        } else {
          chatHistory = [...chatHistory, { type: 'bot', text: "I'm sorry, but I couldn't identify a specific celestial object in your question. Could you please ask about a specific planet, the Sun, Moon, or a nearby galaxy?" }];
        }
      } catch (error) {
        chatHistory = [...chatHistory, { type: 'bot', text: "I'm sorry, but I couldn't find information about that celestial object. Could you try asking about a different planet, the Sun, Moon, or a nearby galaxy?" }];
      } finally {
        isLoading = false;
        question = '';
      }
    }
  }

  function formatResponse(info: CelestialObjectInfo): string {
    let response = `Here's some information about ${info.englishName}:\n\n`;
    response += info.description + '\n\n';

    if (info.isPlanet || info.name === 'Sun' || info.name === 'Moon') {
      response += `Gravity: ${info.gravity.toFixed(2)} m/s²\n`;
      response += `Mean Radius: ${info.meanRadius.toLocaleString()} km\n`;
      if (info.name !== 'Sun') {
        response += `Orbital Period: ${info.sideralOrbit.toLocaleString()} Earth days\n`;
      }
      response += `Rotation Period: ${Math.abs(info.sideralRotation).toFixed(2)} hours\n`;
      if (info.name !== 'Sun' && info.name !== 'Moon') {
        response += `Number of Moons: ${info.moons}\n`;
      }
    }

    if (info.images && info.images.length > 0) {
      response += `\nI've also found an image of ${info.englishName}. You can view it in the solar system simulation!`;
    }

    return response;
  }
</script>

<div
  class="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
  transition:fly={{ y: 50, duration: 300 }}
>
  <div class="bg-blue-500 text-white p-4">
    <h3 class="text-lg font-semibold">Space Explorer Chat</h3>
  </div>
  <div class="h-96 overflow-y-auto p-4 space-y-4">
    {#each chatHistory as message}
      <div
        class={`${
          message.type === 'user' ? 'text-right' : 'text-left'
        }`}
        transition:fade
      >
        <span
          class={`inline-block p-2 rounded-lg ${
            message.type === 'user'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {message.text}
        </span>
      </div>
    {/each}
    {#if isLoading}
      <div class="text-center">
        <span class="inline-block p-2 rounded-lg bg-gray-100 text-gray-600">
          Searching the cosmos...
        </span>
      </div>
    {/if}
  </div>
  <form on:submit|preventDefault={handleSubmit} class="p-4 border-t">
    <div class="flex space-x-2">
      <input
        type="text"
        bind:value={question}
        placeholder="Ask about a planet, the Sun, or a nearby galaxy..."
        class="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        Send
      </button>
    </div>
  </form>
</div>