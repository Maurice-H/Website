import { ref } from 'vue';

export interface UseResponsiveReturn {
  /** `true` when `window.innerWidth < 768` */
  isMobile: ReturnType<typeof ref<boolean>>;
}

const MOBILE_BREAKPOINT = 768;

// Module-level singleton: shared across all consumers
const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false);

let listenerRegistered = false;

function initListener(): void {
  if (listenerRegistered || typeof window === 'undefined') return;
  listenerRegistered = true;

  window.addEventListener(
    'resize',
    () => {
      isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
    },
    { passive: true }
  );
}

/**
 * Shared reactive breakpoint state.
 * Uses a single resize listener shared across all consumers.
 */
export function useResponsive(): UseResponsiveReturn {
  initListener();
  return { isMobile };
}
