import { reactive } from 'vue';
import type { LightingState } from '../types';
import { LightingPhase } from '../types';

const state = reactive<LightingState>({
  phase: LightingPhase.NAV,
  isFlashActive: false,
});

// Attach listeners once on module load
if (typeof window !== 'undefined') {
  const updateMask = (e: MouseEvent) => {
    document.documentElement.style.setProperty('--mask-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mask-y', `${e.clientY}px`);
  };

  window.addEventListener('mousemove', updateMask);

  // Mobile fallback
  if (window.matchMedia('(hover: none)').matches) {
    document.documentElement.style.setProperty('--mask-x', '50%');
    document.documentElement.style.setProperty('--mask-y', '50%');
  }
}

export function useLightingEngine() {
  const setPhase = (newPhase: LightingPhase) => {
    state.isFlashActive = true;

    // Simulate flash duration
    setTimeout(() => {
      state.phase = newPhase;
      state.isFlashActive = false;

      if (newPhase === LightingPhase.NAV) {
        // Reset to center beam for Nav
        document.documentElement.style.setProperty('--mask-x', '50%');
        document.documentElement.style.setProperty('--mask-y', '50%');
      }
    }, 300);
  };

  return {
    state,
    setPhase,
  };
}

/**
 * Helper for Viewport-Synchronized Masking (Fusing Architecture)
 * Gradient center is at 50% 50% of a 100vw×100vh mask.
 * We offset by -50vw/-50vh so the center aligns with the mouse cursor.
 */
export const getFusedMaskStyle = (left: number | string, top: number | string) => {
  const l = typeof left === 'number' ? `${left}px` : left;
  const t = typeof top === 'number' ? `${top}px` : top;
  return {
    maskImage: 'var(--reveal-mask)',
    WebkitMaskImage: 'var(--reveal-mask)',
    maskSize: '100vw 100vh',
    WebkitMaskSize: '100vw 100vh',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: `calc(var(--mask-x) - ${l} - 50vw) calc(var(--mask-y) - ${t} - 50vh)`,
    WebkitMaskPosition: `calc(var(--mask-x) - ${l} - 50vw) calc(var(--mask-y) - ${t} - 50vh)`,
  };
};
