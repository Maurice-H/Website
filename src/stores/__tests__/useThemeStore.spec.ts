import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { useThemeStore } from '../useThemeStore';

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Mock document
    vi.stubGlobal('document', {
      documentElement: {
        setAttribute: vi.fn(),
        removeAttribute: vi.fn(),
      },
      querySelectorAll: vi.fn(() => []),
      querySelector: vi.fn(() => null),
      createElement: vi.fn(() => ({
        setAttribute: vi.fn(),
      })),
      head: {
        appendChild: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('initializes with isBlueprintMode as false', () => {
    const store = useThemeStore();
    expect(store.isBlueprintMode).toBe(false);
  });

  it('toggles isBlueprintMode when toggleTheme is called', () => {
    const store = useThemeStore();
    store.toggleTheme();
    expect(store.isBlueprintMode).toBe(true);
    store.toggleTheme();
    expect(store.isBlueprintMode).toBe(false);
  });

  it('updates document dataset when isBlueprintMode changes', async () => {
    const store = useThemeStore();

    store.toggleTheme();
    await nextTick();
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'blueprint');

    store.toggleTheme();
    await nextTick();
    expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme');
  });
});

describe('useThemeStore extensions', () => {
  describe('toggleLighting', () => {
    it('toggles lightingEnabled state', () => {
      const store = useThemeStore();

      const initial = store.lightingEnabled;
      store.toggleLighting();
      expect(store.lightingEnabled).toBe(!initial);

      store.toggleLighting();
      expect(store.lightingEnabled).toBe(initial);
    });
  });

  describe('localStorage persistence', () => {
    let mockLocalStorage: { [key: string]: string };

    beforeEach(() => {
      mockLocalStorage = {};

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn((key) => mockLocalStorage[key] || null),
          setItem: vi.fn((key, value) => {
            mockLocalStorage[key] = value.toString();
          }),
        },
        writable: true,
      });
    });

    it('initializes lightingEnabled from localStorage if "true"', async () => {
      mockLocalStorage['portfolio-lighting-enabled'] = 'true';

      // Re-create pinia to force re-evaluation of the store factory
      setActivePinia(createPinia());
      const store = useThemeStore();

      expect(store.lightingEnabled).toBe(true);
    });

    it('initializes lightingEnabled from localStorage if "false"', async () => {
      mockLocalStorage['portfolio-lighting-enabled'] = 'false';

      setActivePinia(createPinia());
      const store = useThemeStore();

      expect(store.lightingEnabled).toBe(false);
    });

    it('persists lightingEnabled to localStorage when it changes', async () => {
      setActivePinia(createPinia());
      const store = useThemeStore();

      store.lightingEnabled = false;
      await nextTick();

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'portfolio-lighting-enabled',
        'false'
      );

      store.lightingEnabled = true;
      await nextTick();

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'portfolio-lighting-enabled',
        'true'
      );
    });

    it('handles initialization when window is undefined safely', async () => {
      const originalWindow = globalThis.window;

      delete (globalThis as unknown as Record<string, unknown>).window;

      setActivePinia(createPinia());
      const store = useThemeStore();

      // Default fallback
      expect(store.lightingEnabled).toBe(true);

      // Watcher shouldn't crash when changing value
      store.lightingEnabled = false;
      await nextTick();

      // Restore
      globalThis.window = originalWindow;
    });
  });

  describe('SSR compatibility', () => {
    it('handles isBlueprintMode watcher safely when document is undefined', async () => {
      const originalDocument = globalThis.document;

      delete (globalThis as unknown as Record<string, unknown>).document;

      setActivePinia(createPinia());
      const store = useThemeStore();

      // Should not throw
      store.toggleTheme();
      await nextTick();

      globalThis.document = originalDocument;
    });
  });
});
