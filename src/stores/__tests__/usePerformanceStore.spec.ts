import * as detectGpu from 'detect-gpu';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePerformanceStore } from '../usePerformanceStore';

vi.mock('detect-gpu', () => ({
  getGPUTier: vi.fn(),
}));

describe('usePerformanceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset global state
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true,
    });
    import.meta.env.VITE_CI_MODE = 'false';
    vi.stubEnv('VITE_CI_MODE', 'false');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('should initialize with default state', () => {
    const store = usePerformanceStore();
    expect(store.gpuTier).toBeNull();
    expect(store.isWebGLSupported).toBe(true);
    expect(store.isReady).toBe(false);
    expect(store.isLowEnd).toBe(false); // isLowEnd requires gpuTier !== null
  });

  describe('isCiMode', () => {
    let originalEnvConfig: typeof import('../../utils/env').envConfig;
    beforeEach(async () => {
      originalEnvConfig = (await import('../../utils/env')).envConfig;
    });
    afterEach(async () => {
      const module = await import('../../utils/env');
      Object.defineProperty(module.envConfig, 'isCiMode', {
        value: originalEnvConfig.isCiMode,
        writable: true,
      });
    });
    it('returns true if VITE_CI_MODE env var is true', async () => {
      import.meta.env.VITE_CI_MODE = 'true';
      const module = await import('../../utils/env');
      Object.defineProperty(module.envConfig, 'isCiMode', { value: true, writable: true });
      const store = usePerformanceStore();
      expect(store.isCiMode).toBe(true);
    });

    it('returns true if ciMode URL param is true', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?ciMode=true' },
        writable: true,
      });
      const store = usePerformanceStore();
      expect(store.isCiMode).toBe(true);
    });

    it('returns false otherwise', async () => {
      const module = await import('../../utils/env');
      Object.defineProperty(module.envConfig, 'isCiMode', { value: false, writable: true });
      const store = usePerformanceStore();
      expect(store.isCiMode).toBe(false);
    });
  });

  describe('initTierFromOverrides', () => {
    it('returns true and does nothing if already ready', () => {
      const store = usePerformanceStore();
      store.isReady = true;
      expect(store.initTierFromOverrides()).toBe(true);
    });

    it('returns false if no forceTier in URL', () => {
      const store = usePerformanceStore();
      expect(store.initTierFromOverrides()).toBe(false);
    });

    it('ignores invalid forceTier param', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?forceTier=invalid' },
        writable: true,
      });
      const store = usePerformanceStore();
      expect(store.initTierFromOverrides()).toBe(false);
      expect(store.isReady).toBe(false);
    });

    it('ignores out of bounds forceTier param (< 1)', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?forceTier=0' },
        writable: true,
      });
      const store = usePerformanceStore();
      expect(store.initTierFromOverrides()).toBe(false);
      expect(store.isReady).toBe(false);
    });

    it('ignores out of bounds forceTier param (> 3)', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?forceTier=4' },
        writable: true,
      });
      const store = usePerformanceStore();
      expect(store.initTierFromOverrides()).toBe(false);
      expect(store.isReady).toBe(false);
    });

    it('sets state based on valid forceTier (1) and returns true', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?forceTier=1' },
        writable: true,
      });
      const store = usePerformanceStore();
      expect(store.initTierFromOverrides()).toBe(true);
      expect(store.gpuTier).toBe(1);
      expect(store.isWebGLSupported).toBe(false); // Tier 1 disables webgl
      expect(store.isReady).toBe(true);
      expect(store.isLowEnd).toBe(true);
    });

    it('sets state based on valid forceTier (2) and returns true', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?forceTier=2' },
        writable: true,
      });
      const store = usePerformanceStore();
      expect(store.initTierFromOverrides()).toBe(true);
      expect(store.gpuTier).toBe(2);
      expect(store.isWebGLSupported).toBe(true);
      expect(store.isReady).toBe(true);
      expect(store.isLowEnd).toBe(false);
    });
  });

  describe('checkPerformance', () => {
    it('returns early if initTierFromOverrides returns true', async () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?forceTier=3' },
        writable: true,
      });
      const store = usePerformanceStore();
      await store.checkPerformance();
      expect(detectGpu.getGPUTier).not.toHaveBeenCalled();
      expect(store.gpuTier).toBe(3);
      expect(store.isWebGLSupported).toBe(true);
    });

    it('handles successful detectGpu (Tier 3)', async () => {
      vi.mocked(detectGpu.getGPUTier).mockResolvedValue({
        tier: 3,
      } as unknown as detectGpu.TierResult);
      const store = usePerformanceStore();
      await store.checkPerformance();
      expect(detectGpu.getGPUTier).toHaveBeenCalled();
      expect(store.gpuTier).toBe(3);
      expect(store.isWebGLSupported).toBe(true);
      expect(store.isReady).toBe(true);
    });

    it('handles successful detectGpu (Tier 1)', async () => {
      vi.mocked(detectGpu.getGPUTier).mockResolvedValue({
        tier: 1,
      } as unknown as detectGpu.TierResult);
      const store = usePerformanceStore();
      await store.checkPerformance();
      expect(detectGpu.getGPUTier).toHaveBeenCalled();
      expect(store.gpuTier).toBe(1);
      expect(store.isWebGLSupported).toBe(false);
      expect(store.isReady).toBe(true);
    });

    it('handles detectGpu error by falling back to Tier 2', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.mocked(detectGpu.getGPUTier).mockRejectedValue(new Error('WebGL disabled'));
      const store = usePerformanceStore();
      await store.checkPerformance();

      expect(detectGpu.getGPUTier).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(store.gpuTier).toBe(2);
      expect(store.isWebGLSupported).toBe(true);
      expect(store.isReady).toBe(true);
    });
  });
});
