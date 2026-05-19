import { getGPUTier } from 'detect-gpu';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { envConfig } from '@/utils/env';

export const usePerformanceStore = defineStore('performance', () => {
  const gpuTier = ref<number | null>(null);
  const isWebGLSupported = ref(true);
  const isReady = ref(false);
  const isLowEnd = computed(() => gpuTier.value !== null && gpuTier.value < 2);

  const isCiMode = computed(() => {
    // Check for explicit environment variable or URL parameter
    const params = new URLSearchParams(window.location.search);
    return envConfig.isCiMode || params.get('ciMode') === 'true' || params.get('ci') === '1';
  });

  /**
   * Initializes the performance tier from URL overrides or environment variables.
   * This is synchronous and can be called before the first render to prevent FOUC/Payload.
   */
  const initTierFromOverrides = () => {
    if (isReady.value) return true;

    const params = new URLSearchParams(window.location.search);
    const forcedTier = params.get('forceTier');

    if (forcedTier) {
      const tier = Number.parseInt(forcedTier, 10);
      if (!Number.isNaN(tier) && tier >= 1 && tier <= 3) {
        gpuTier.value = tier;
        isWebGLSupported.value = tier >= 2;
        isReady.value = true;
        return true;
      }
    }
    return false;
  };

  /**
   * Runs the GPU benchmark and determines the performance tier.
   * This should be called early (e.g., during the NAV phase) to prevent FOUC.
   */
  const checkPerformance = async () => {
    // 1. Check for manual override first (Synchronous)
    if (initTierFromOverrides()) return;

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
    initTierFromOverrides,
    checkPerformance,
  };
});
