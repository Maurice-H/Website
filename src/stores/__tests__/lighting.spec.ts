import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LightingPhase } from '../../types';
import { useLightingStore } from '../lighting';

describe('useLightingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    // Mock the document.documentElement.style.setProperty to avoid DOM errors in Node tests
    document.documentElement.style.setProperty = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should initialize with default state', () => {
    const store = useLightingStore();
    expect(store.phase).toBe(LightingPhase.NAV);
    expect(store.isFlashActive).toBe(false);
  });

  it('setPhase should transition phase after a delay', () => {
    const store = useLightingStore();

    store.setPhase(LightingPhase.CONTENT);

    // Immediately after calling, isFlashActive should be true, phase unchanged
    expect(store.isFlashActive).toBe(true);
    expect(store.phase).toBe(LightingPhase.NAV);

    // Fast-forward time
    vi.advanceTimersByTime(300);

    // After timeout, phase should update and flash should be false
    expect(store.isFlashActive).toBe(false);
    expect(store.phase).toBe(LightingPhase.CONTENT);
  });

  it('setPhase should update CSS variables if switching back to NAV', () => {
    const store = useLightingStore();

    // Start at CONTENT
    store.phase = LightingPhase.CONTENT;

    // Switch to NAV
    store.setPhase(LightingPhase.NAV);
    vi.advanceTimersByTime(300);

    expect(store.phase).toBe(LightingPhase.NAV);
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--mask-x', '50%');
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--mask-y', '50%');
  });
});
