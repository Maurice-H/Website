import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LightingPhase } from '@/types';

export const useLightingStore = defineStore('lighting', () => {
  const phase = ref<LightingPhase>(LightingPhase.NAV);
  const isFlashActive = ref(false);
  const pendingScrollTarget = ref<string | null>(null);

  // ── Interaction Points ──
  // Normalized screen coordinates (-1 to 1) of the currently hovered/focused UI element
  const focusedElementPos = ref<{ x: number; y: number } | null>(null);

  const setPhase = (newPhase: LightingPhase) => {
    if (!Object.values(LightingPhase).includes(newPhase)) {
      console.warn(`[LightingStore] Invalid phase rejected: ${newPhase}`);
      return;
    }

    if (newPhase !== phase.value) {
      import('../composables/useAudio').then(({ useAudio }) => {
        const { playSwoosh } = useAudio();
        playSwoosh();
      });
    }

    isFlashActive.value = true;

    const applyPhase = () => {
      const isCiMode = typeof document !== 'undefined' && document.querySelector('.is-ci-mode');

      if (typeof document !== 'undefined' && document.startViewTransition && !isCiMode) {
        document.startViewTransition(() => {
          phase.value = newPhase;
        });
      } else {
        phase.value = newPhase;
      }
      isFlashActive.value = false;
    };

    setTimeout(applyPhase, 300);
  };

  return {
    phase,
    isFlashActive,
    pendingScrollTarget,
    focusedElementPos,
    setPhase,
  };
});
