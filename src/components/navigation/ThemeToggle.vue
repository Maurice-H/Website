<template>
  <button
    type="button"
    @click="toggleTheme"
    :aria-label="`System Mode ${isBlueprint ? 'Blueprint' : 'Finished'}`"
    class="group relative flex items-center justify-center p-6 w-full rounded-3xl transition-all duration-[var(--theme-transition-duration)] border cursor-pointer active:scale-95"
    :class="[
      isBlueprint
        ? 'border-blueprint-border border-dashed text-finished-accent bg-finished-accent/5 shadow-[0_0_20px_rgba(96,165,250,0.1)]'
        : 'border-finished-border text-finished-accent bg-finished-bg/5 hover:bg-finished-accent/10 shadow-[var(--finished-glow)] hover:border-finished-accent/30',
    ]"
    :aria-pressed="isBlueprint"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-10 h-10 transition-all duration-[var(--theme-transition-duration)] drop-shadow-[0_0_15px_currentColor]"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path v-if="!isBlueprint" d="M12 2v1" />
      <path
        d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.25.5 2.4 1.5 3.5.76.76 1.23 1.52 1.41 2.5"
      />
    </svg>
    <div
      class="ml-4 flex flex-col items-start transition-colors duration-[var(--theme-transition-duration)]"
    >
      <span class="text-xs uppercase tracking-widest font-bold opacity-60"
        >System Mode</span
      >
      <span class="font-mono font-bold tracking-wider text-sm mt-1">
        {{ isBlueprint ? "Blueprint" : "Finished" }}
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useThemeStore } from '../../stores/useThemeStore';

const themeStore = useThemeStore();
const { isBlueprintMode: isBlueprint } = storeToRefs(themeStore);

const playSwitchSound = () => {
  try {
    const audio = new Audio('audio/switch2.ogg');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Silently ignore if audio fails (e.g. browser policy)
    });
  } catch (e) {
    // Silently ignore if audio fails (e.g. browser policy)
  }
};

const toggleTheme = () => {
  themeStore.toggleTheme();
  playSwitchSound();
};
</script>
