import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLightingStore } from '@/stores/lighting';
import { LightingPhase } from '@/types';
import { envConfig } from '@/utils/env';
import { useLightingDomSync } from '../useLightingDomSync';

vi.mock('@/utils/env', () => ({
  envConfig: {
    isCiMode: false,
  },
}));

type MockDocument = Omit<Document, 'startViewTransition'> & {
  startViewTransition?: ReturnType<typeof vi.fn>;
};

describe('useLightingDomSync', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('uses startViewTransition when available and not in CI mode', () => {
    const doc = document as unknown as MockDocument;
    doc.startViewTransition = vi.fn((cb) => cb());

    useLightingDomSync();

    const lightingStore = useLightingStore();
    envConfig.isCiMode = false;

    lightingStore.setPhase(LightingPhase.CONTENT);
    vi.advanceTimersByTime(300);

    expect(doc.startViewTransition).toHaveBeenCalled();
    expect(lightingStore.phase).toBe(LightingPhase.CONTENT);
    delete doc.startViewTransition;
  });

  it('falls back to direct callback if startViewTransition is missing', () => {
    const doc = document as unknown as MockDocument;
    delete doc.startViewTransition;

    useLightingDomSync();

    const lightingStore = useLightingStore();
    envConfig.isCiMode = false;

    lightingStore.setPhase(LightingPhase.CONTENT);
    vi.advanceTimersByTime(300);

    expect(lightingStore.phase).toBe(LightingPhase.CONTENT);
  });

  it('falls back to direct callback if in CI mode', () => {
    const doc = document as unknown as MockDocument;
    doc.startViewTransition = vi.fn((cb) => cb());

    useLightingDomSync();

    const lightingStore = useLightingStore();
    envConfig.isCiMode = true;

    lightingStore.setPhase(LightingPhase.CONTENT);
    vi.advanceTimersByTime(300);

    expect(doc.startViewTransition).not.toHaveBeenCalled();
    expect(lightingStore.phase).toBe(LightingPhase.CONTENT);

    delete doc.startViewTransition;
    envConfig.isCiMode = false;
  });
});
