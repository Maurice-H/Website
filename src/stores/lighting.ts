import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LightingPhase } from '../types';

export const useLightingStore = defineStore('lighting', () => {
  const phase = ref<LightingPhase>(LightingPhase.NAV);
  const isFlashActive = ref(false);
  const pendingScrollTarget = ref<string | null>(null);

  const setPhase = (newPhase: LightingPhase) => {
    // Strict state enforcement: reject invalid enums
    if (!Object.values(LightingPhase).includes(newPhase)) {
      console.warn(`[LightingStore] Invalid phase rejected: ${newPhase}`);
      return;
    }

    isFlashActive.value = true;

    const applyPhase = () => {
      phase.value = newPhase;
      isFlashActive.value = false;
    };

    // Progressive enhancement: use View Transitions API if available
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof document.startViewTransition === 'function'
    ) {
      setTimeout(() => {
        document.startViewTransition(() => {
          applyPhase();
        });
      }, 300);
    } else {
      setTimeout(applyPhase, 300);
    }
  };

  return {
    phase,
    isFlashActive,
    pendingScrollTarget,
    setPhase,
  };
});
