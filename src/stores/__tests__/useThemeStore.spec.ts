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
