import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LightingPhase } from '../../types';
import { useLightingStore } from '../lighting';
import { useViewportStore } from '../viewport';

describe('useLightingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    // Mock the document.documentElement.style.setProperty to avoid DOM errors in Node tests
    document.documentElement.style.setProperty = vi.fn();

    // Mock window properties for getSourcePosition
    vi.stubGlobal('window', {
      ...window,
      innerWidth: 1000,
      innerHeight: 800,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should initialize with default state', () => {
    const store = useLightingStore();
    expect(store.phase).toBe(LightingPhase.NAV);
    expect(store.isFlashActive).toBe(false);
    expect(store.flashlightRotation).toBe(0);
  });

  it('getSourcePosition should return correct coordinates based on window size', () => {
    const store = useLightingStore();
    const position = store.getSourcePosition();
    // window.innerWidth - 150 = 1000 - 150 = 850
    // window.innerHeight - 150 = 800 - 150 = 650
    expect(position).toEqual({ x: 850, y: 650 });
  });

  it('updateFlashlightRotation should calculate correct angle', () => {
    const store = useLightingStore();
    const viewportStore = useViewportStore();

    // Source position is at { x: 850, y: 650 }

    // Case 1: Mouse is directly to the left of the source
    viewportStore.mousePosition = { x: 750, y: 650 };
    store.updateFlashlightRotation();
    // dx = -100, dy = 0 => atan2(0, -100) = Math.PI => 180 degrees
    expect(store.flashlightRotation).toBe(180);

    // Case 2: Mouse is directly above the source
    viewportStore.mousePosition = { x: 850, y: 550 };
    store.updateFlashlightRotation();
    // dx = 0, dy = -100 => atan2(-100, 0) = -Math.PI/2 => -90 degrees
    expect(store.flashlightRotation).toBe(-90);

    // Case 3: Mouse is top-left
    viewportStore.mousePosition = { x: 750, y: 550 };
    store.updateFlashlightRotation();
    // dx = -100, dy = -100 => atan2(-100, -100) = -3*Math.PI/4 => -135 degrees
    expect(store.flashlightRotation).toBe(-135);
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
