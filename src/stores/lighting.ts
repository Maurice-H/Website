import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LightingPhase } from '../types';
import { useViewportStore } from './viewport';

export const useLightingStore = defineStore('lighting', () => {
  const viewport = useViewportStore();

  const phase = ref<LightingPhase>(LightingPhase.NAV);
  const isFlashActive = ref(false);
  const flashlightRotation = ref(0);

  // Flashlight source position relative to viewport
  const getSourcePosition = () => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    return {
      x: window.innerWidth - 150, // 150px from right
      y: window.innerHeight - 150, // 150px from bottom
    };
  };

  const updateFlashlightRotation = () => {
    const source = getSourcePosition();
    const dx = viewport.mousePosition.x - source.x;
    const dy = viewport.mousePosition.y - source.y;
    // Calculate angle in radians, then convert to degrees
    flashlightRotation.value = Math.atan2(dy, dx) * (180 / Math.PI);
  };

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
    flashlightRotation,
    getSourcePosition,
    setPhase,
    updateFlashlightRotation,
  };
});
