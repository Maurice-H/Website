import { useLightingStore } from '@/stores/lighting';
import { usePerformanceStore } from '@/stores/usePerformanceStore';

export function useLightingDomSync() {
  const lightingStore = useLightingStore();
  const performanceStore = usePerformanceStore();

  lightingStore.registerTransitionHandler((callback: () => void) => {
    const isCiMode = performanceStore.isCiMode;

    if (typeof document !== 'undefined' && document.startViewTransition && !isCiMode) {
      document.startViewTransition(callback);
    } else {
      callback();
    }
  });
}
