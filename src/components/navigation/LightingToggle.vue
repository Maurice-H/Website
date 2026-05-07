<template>
  <button
    type="button"
    @click="toggleLighting"
    :aria-label="`Lighting ${lightingEnabled ? 'On' : 'Off'}`"
    class="group relative flex items-center justify-center md:justify-start p-3 md:p-5 w-full md:w-56 rounded-2xl md:rounded-3xl transition-all duration-[var(--theme-transition-duration)] border cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    :class="[
      isBlueprint
        ? 'border-blueprint-border border-dashed text-finished-accent bg-black/20 backdrop-blur-md shadow-[0_0_20px_rgba(96,165,250,0.1)] hover:bg-finished-accent/10 hover:border-finished-accent/30'
        : 'border-finished-border text-finished-accent bg-black/20 backdrop-blur-md hover:bg-finished-accent/10 shadow-[var(--finished-glow)] hover:border-finished-accent/30',
    ]"
    :aria-pressed="lightingEnabled"
  >
    <LampIcon :lighting-enabled="lightingEnabled" />
    <div
      class="ml-2 md:ml-4 flex flex-col items-start transition-colors duration-[var(--theme-transition-duration)]"
    >
      <span class="text-xs uppercase tracking-widest font-bold opacity-60"
        >Lighting</span
      >
      <span
        class="font-mono font-bold tracking-wider text-xs md:text-sm mt-0.5 md:mt-1"
      >
        {{ lightingEnabled ? "On" : "Off" }}
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useThemeStore } from "../../stores/useThemeStore";
import LampIcon from "../icons/LampIcon.vue";

const themeStore = useThemeStore();
const { lightingEnabled, isBlueprintMode: isBlueprint } =
  storeToRefs(themeStore);

const playSwitchSound = () => {
  try {
    const audio = new Audio("audio/switch15.ogg");
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Silently ignore if audio fails (e.g. browser policy)
    });
  } catch {
    // Silently ignore if audio fails (e.g. browser policy)
  }
};

const toggleLighting = () => {
  themeStore.toggleLighting();
  playSwitchSound();
};
</script>
