import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useShortcutStore } from '../useShortcutStore';

describe('useShortcutStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('initializes with default bindings', () => {
    const store = useShortcutStore();
    expect(store.bindings.theme.key).toBe('t');
    expect(store.bindings.lighting.key).toBe('l');
    expect(store.bindings.back.key).toBe('escape');
  });

  it('formats keys correctly', () => {
    const store = useShortcutStore();
    expect(store.formatKey('escape')).toBe('ESC');
    expect(store.formatKey(' ')).toBe('SPACE');
    expect(store.formatKey('arrowleft')).toBe('←');
    expect(store.formatKey('k')).toBe('K');
  });

  it('gets display labels, keys and labels', () => {
    const store = useShortcutStore();
    expect(store.getDisplay('theme')).toBe('T');
    expect(store.getDisplay('back')).toBe('ESC');
    expect(store.getKey('lighting')).toBe('l');
    expect(store.getLabel('lighting')).toBe('Lighting');
  });

  it('manages rebinding state', () => {
    const store = useShortcutStore();
    expect(store.rebindingAction).toBeNull();

    store.startRebind('theme');
    expect(store.rebindingAction).toBe('theme');

    store.cancelRebind();
    expect(store.rebindingAction).toBeNull();
  });

  it('assignedKeys computed property works', () => {
    const store = useShortcutStore();
    expect(store.assignedKeys.has('t')).toBe(true);
    expect(store.assignedKeys.has('l')).toBe(true);
    expect(store.assignedKeys.has('escape')).toBe(true);
    expect(store.assignedKeys.size).toBe(3);
  });

  it('findAction finds correct actions', () => {
    const store = useShortcutStore();
    expect(store.findAction('t')).toBe('theme');
    expect(store.findAction('L')).toBe('lighting'); // handles case
    expect(store.findAction('z')).toBeNull();
  });

  it('tries rebind correctly', () => {
    const store = useShortcutStore();

    // No-op if not rebinding
    expect(store.tryRebind('k')).toBe(false);

    store.startRebind('theme');

    // Successful rebind
    const result = store.tryRebind('k');
    expect(result).toBe(true);
    expect(store.getKey('theme')).toBe('k');
    expect(store.rebindingAction).toBeNull();
  });

  it('allows re-assigning the same key', () => {
    const store = useShortcutStore();
    store.startRebind('theme');
    const result = store.tryRebind('t');
    expect(result).toBe(true);
    expect(store.rebindingAction).toBeNull();
  });

  it('rejects rebind to already taken key', () => {
    const store = useShortcutStore();
    store.startRebind('theme');

    // 'l' is already used by lighting
    const result = store.tryRebind('l');
    expect(result).toBe(false);
    expect(store.getKey('theme')).toBe('t'); // should remain default
    expect(store.rebindingAction).toBe('theme'); // should stay in rebinding mode
  });

  it('resets to defaults', () => {
    const store = useShortcutStore();
    store.startRebind('theme');
    store.tryRebind('k');

    store.resetDefaults();
    expect(store.getKey('theme')).toBe('t');
  });

  it('persists to localStorage', async () => {
    const store = useShortcutStore();

    store.startRebind('theme');
    const success = store.tryRebind('x');
    expect(success).toBe(true);
    expect(store.getKey('theme')).toBe('x');

    // Wait for the Vue watcher to trigger asynchronously
    await new Promise((resolve) => setTimeout(resolve, 50));

    const stored = JSON.parse(localStorage.getItem('portfolio-shortcuts') || '{}');
    expect(stored.theme.key).toBe('x');
  });

  it('loads from localStorage and merges with defaults', () => {
    localStorage.setItem(
      'portfolio-shortcuts',
      JSON.stringify({
        theme: { key: 'm', label: 'Theme' },
      })
    );

    const store = useShortcutStore();
    expect(store.getKey('theme')).toBe('m');
    // lighting should still be default
    expect(store.getKey('lighting')).toBe('l');
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('portfolio-shortcuts', 'invalid-json');
    const store = useShortcutStore();
    expect(store.getKey('theme')).toBe('t');
  });

  it('handles localStorage read exceptions gracefully', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('mock error');
    });
    const store = useShortcutStore();
    expect(store.getKey('theme')).toBe('t');
    expect(store.getKey('lighting')).toBe('l');
    expect(store.getKey('back')).toBe('escape');
    spy.mockRestore();
  });
});
