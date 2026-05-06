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

  it('setPhase should reject invalid phase enums (Sentinel strict state enforcement)', () => {
    const store = useLightingStore();
    const initialPhase = store.phase;

    // We expect it either to handle it safely or to reject it by not updating the state
    store.setPhase('INVALID_PHASE' as unknown as LightingPhase);

    vi.advanceTimersByTime(300);

    // Should remain on the initial phase or correctly reject the state change
    expect(store.phase).toBe(initialPhase);
    expect(store.isFlashActive).toBe(false); // Make sure flash doesn't get stuck
  });

  it('setPhase should use startViewTransition if available', () => {
    const store = useLightingStore();
    const startViewTransitionMock = vi.fn().mockImplementation((cb) => cb());
    document.startViewTransition = startViewTransitionMock;

    store.setPhase(LightingPhase.CONTENT);
    vi.advanceTimersByTime(300);

    expect(startViewTransitionMock).toHaveBeenCalled();
    expect(store.phase).toBe(LightingPhase.CONTENT);

    // Cleanup
    Reflect.deleteProperty(document, 'startViewTransition');
  });
});
