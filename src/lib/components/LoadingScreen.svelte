<!-- src/lib/components/LoadingScreen.svelte -->
<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
  
    export let progress: number = 0;
  
    const tweenedProgress = tweened(0, {
      duration: 400,
      easing: cubicOut
    });
  
    $: tweenedProgress.set(progress);
  </script>
  
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black">
    <div class="text-center">
      <div class="w-40 h-40 mb-8 mx-auto relative">
        <div class="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
        <svg class="animate-spin" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h2 class="text-3xl font-bold text-white mb-4">Exploring the Cosmos</h2>
      <div class="w-64 h-3 bg-gray-700 rounded-full mx-auto overflow-hidden">
        <div class="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out" style="width: {$tweenedProgress}%"></div>
      </div>
      <p class="mt-4 text-xl text-white">{$tweenedProgress.toFixed(0)}%</p>
      <p class="mt-2 text-sm text-gray-400">Initializing stellar objects...</p>
    </div>
  </div>
  
  <style>
    svg {
      @apply w-full h-full text-blue-500;
    }
  
    .animate-spin {
      animation: spin 1.5s linear infinite;
    }
  
    .animate-ping {
      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  
    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  </style>