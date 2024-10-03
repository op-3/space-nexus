<!-- Astronaut.svelte -->
<script lang="ts">
    import { fly } from 'svelte/transition';
    
    export let toggleChat: () => void;
  </script>
  
  <button
    on:click={toggleChat}
    class="fixed bottom-4 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110"
    transition:fly={{ y: 50, duration: 500 }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
    </svg>
  </button>