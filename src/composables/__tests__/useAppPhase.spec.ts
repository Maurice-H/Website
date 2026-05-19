import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLightingStore } from '@/stores/lighting';
import { useThemeStore } from '@/stores/useThemeStore';
import { useAppPhase } from '../useAppPhase';

// Mock matchMedia for useResponsive
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('useAppPhase', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('initializes with default phase', () => {
    const { currentPhase, isNav, isContent } = useAppPhase();
    expect(currentPhase.value).toBe('NAV');
    expect(isNav.value).toBe(true);
    expect(isContent.value).toBe(false);
  });

  it('switches phase correctly', () => {
    const { currentPhase, isNav, isContent } = useAppPhase();
    const lighting = useLightingStore();

    lighting.setPhase('CONTENT');
    vi.runAllTimers();

    expect(currentPhase.value).toBe('CONTENT');
    expect(isNav.value).toBe(false);
    expect(isContent.value).toBe(true);
  });

  it('handleBackToNav sets phase to NAV', () => {
    const { handleBackToNav, currentPhase } = useAppPhase();
    const lighting = useLightingStore();

    lighting.setPhase('CONTENT');
    vi.runAllTimers();
    handleBackToNav();
    vi.runAllTimers();

    expect(currentPhase.value).toBe('NAV');
  });

  it('handleGlobalKeydown sets phase back to NAV on Escape if in CONTENT phase', () => {
    const { handleGlobalKeydown, currentPhase } = useAppPhase();
    const lighting = useLightingStore();

    lighting.setPhase('CONTENT');
    vi.runAllTimers();
    handleGlobalKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    vi.runAllTimers();
    expect(currentPhase.value).toBe('NAV');
  });

  it('computes rootCssVars correctly based on phase', () => {
    const { rootCssVars } = useAppPhase();
    const lighting = useLightingStore();
    const themeStore = useThemeStore();

    themeStore.lightingEnabled = true;
    lighting.setPhase('NAV');
    vi.runAllTimers();

    expect(rootCssVars.value['--reveal-mask']).toContain('radial-gradient');

    lighting.setPhase('CONTENT');
    vi.runAllTimers();
    expect(rootCssVars.value['--reveal-mask']).toBe('');
  });
});
