import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LightingPhase } from '../types';

export const useLightingStore = defineStore('lighting', () => {
  const phase = ref<LightingPhase>(LightingPhase.NAV);
  const isFlashActive = ref(false);

  const setPhase = (newPhase: LightingPhase) => {
    // Strict state enforcement: reject invalid enums
    if (!Object.values(LightingPhase).includes(newPhase)) {
      console.warn(`[LightingStore] Invalid phase rejected: ${newPhase}`);
      return;
    }

    isFlashActive.value = true;

    setTimeout(() => {
      phase.value = newPhase;
      isFlashActive.value = false;
    }, 300);
  };

  return {
    phase,
    isFlashActive,
    setPhase,
  };
});
