import { getGPUTier } from 'detect-gpu';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePerformanceStore = defineStore('performance', () => {
  const gpuTier = ref<number | null>(null);
  const isWebGLSupported = ref(true);
  const isReady = ref(false);
  const isLowEnd = computed(() => gpuTier.value !== null && gpuTier.value < 2);

  const isCiMode = computed(() => {
    // Check for explicit environment variable or URL parameter
    const params = new URLSearchParams(window.location.search);
    return import.meta.env.VITE_CI_MODE === 'true' || params.get('ciMode') === 'true';
  });

  /**
   * Runs the GPU benchmark and determines the performance tier.
   * This should be called early (e.g., during the NAV phase) to prevent FOUC.
   */
  const checkPerformance = async () => {
    // Avoid redundant benchmarks if already completed
    if (isReady.value) return;

    // 1. Check for manual override via URL parameter (Testability Hook)
    const params = new URLSearchParams(window.location.search);
    const forcedTier = params.get('forceTier');

    if (forcedTier) {
      const tier = Number.parseInt(forcedTier, 10);
      if (!Number.isNaN(tier) && tier >= 1 && tier <= 3) {
        gpuTier.value = tier;
        isWebGLSupported.value = tier >= 2;
        isReady.value = true;
        return;
      }
    }

    try {
      const tierResult = await getGPUTier();
      gpuTier.value = tierResult.tier;

      // Tier 1 (Low-end/Software): Disable WebGL entirely.
      // Tier 2 (Mid-range/Mobile): Keep WebGL but allow for optimization.
      // Tier 3 (High-end): Full experience.
      if (tierResult.tier < 2) {
        isWebGLSupported.value = false;
      }
    } catch (e) {
      console.warn('GPU detection failed, falling back to Tier 2 (Optimized):', e);
      // Fallback: Assume mid-range device rather than disabling everything.
      // This ensures the experience is still functional even if the benchmark is blocked.
      gpuTier.value = 2;
      isWebGLSupported.value = true;
    } finally {
      isReady.value = true;
    }
  };

  return {
    gpuTier,
    isWebGLSupported,
    isReady,
    isLowEnd,
    isCiMode,
    checkPerformance,
  };
});
