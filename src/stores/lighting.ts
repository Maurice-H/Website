import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LightingPhase } from '../types';

export const useLightingStore = defineStore('lighting', () => {
  const phase = ref<LightingPhase>(LightingPhase.NAV);
  const isFlashActive = ref(false);

  const setPhase = (newPhase: LightingPhase) => {
    isFlashActive.value = true;

    setTimeout(() => {
      phase.value = newPhase;
      isFlashActive.value = false;

      if (newPhase === LightingPhase.NAV) {
        document.documentElement.style.setProperty('--mask-x', '50%');
        document.documentElement.style.setProperty('--mask-y', '50%');
      }
    }, 300);
  };

  return {
    phase,
    isFlashActive,
    setPhase,
  };
});
