<template>
  <button 
    @click="toggleTheme" 
    class="group relative flex items-center justify-center p-6 w-full rounded-3xl transition-all duration-[var(--theme-transition-duration)] border"
    :class="[
      isBlueprint 
        ? 'border-blue-500 border-dashed text-blue-600 hover:bg-blue-50' 
        : 'border-white/10 text-green-400 bg-white/5 hover:bg-white/10 shadow-[var(--shadow-neon)] hover:border-green-400/30'
    ]"
    aria-label="Toggle Theme"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      class="w-10 h-10 transition-all duration-[var(--theme-transition-duration)]"
      :class="[isBlueprint ? 'opacity-70 scale-95' : 'opacity-100 scale-100 drop-shadow-[0_0_15px_rgba(74,222,128,0.9)]']"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path v-if="!isBlueprint" d="M12 2v1" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.25.5 2.4 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
    </svg>
    <div class="ml-4 flex flex-col items-start transition-colors duration-[var(--theme-transition-duration)]">
      <span class="text-xs uppercase tracking-widest font-bold opacity-60">System Mode</span>
      <span class="font-mono font-bold tracking-wider text-sm mt-1">
        {{ isBlueprint ? 'Blueprint' : 'Finished' }}
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '../../composables/useTheme';

// biome-ignore lint/correctness/noUnusedVariables: template-use
const { isBlueprint, toggleTheme } = useTheme();
</script>
