import { useLightingStore } from '../stores/lighting';

export function useLightingEngine() {
  const store = useLightingStore();
  return {
    state: store,
    setPhase: store.setPhase,
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
