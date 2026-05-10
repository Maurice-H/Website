import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { useLightingStore } from '../../stores/lighting';
import { useShortcutStore } from '../../stores/useShortcutStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { LightingPhase } from '../../types';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

const TestComponent = defineComponent({
  setup() {
    useKeyboardShortcuts();
    return () => null;
  },
});

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Clear DOM of any leftovers
    document.body.innerHTML = '';
  });

  it('triggers theme toggle on bound key', async () => {
    const themeStore = useThemeStore();
    const toggleThemeSpy = vi.spyOn(themeStore, 'toggleTheme');

    mount(TestComponent);

    const event = new KeyboardEvent('keydown', { key: 't' });
    window.dispatchEvent(event);

    expect(toggleThemeSpy).toHaveBeenCalled();
  });

  it('triggers lighting toggle on bound key', async () => {
    const themeStore = useThemeStore();
    const toggleLightingSpy = vi.spyOn(themeStore, 'toggleLighting');

    mount(TestComponent);

    const event = new KeyboardEvent('keydown', { key: 'l' });
    window.dispatchEvent(event);

    expect(toggleLightingSpy).toHaveBeenCalled();
  });

  it('triggers back navigation on bound key', async () => {
    const lightingStore = useLightingStore();
    lightingStore.phase = LightingPhase.CONTENT;
    const setPhaseSpy = vi.spyOn(lightingStore, 'setPhase');

    mount(TestComponent);

    const event = new KeyboardEvent('keydown', { key: 'escape' });
    window.dispatchEvent(event);

    expect(setPhaseSpy).toHaveBeenCalledWith(LightingPhase.NAV);
  });

  it('ignores shortcuts in input fields', async () => {
    const themeStore = useThemeStore();
    const toggleThemeSpy = vi.spyOn(themeStore, 'toggleTheme');

    mount(TestComponent);

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent('keydown', { key: 't' });
    window.dispatchEvent(event);

    expect(toggleThemeSpy).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it('ignores shortcuts when modifiers are pressed', async () => {
    const themeStore = useThemeStore();
    const toggleThemeSpy = vi.spyOn(themeStore, 'toggleTheme');

    mount(TestComponent);

    const event = new KeyboardEvent('keydown', { key: 't', ctrlKey: true });
    window.dispatchEvent(event);

    expect(toggleThemeSpy).not.toHaveBeenCalled();
  });

  it('handles rebinding mode correctly', async () => {
    const shortcutStore = useShortcutStore();
    const tryRebindSpy = vi.spyOn(shortcutStore, 'tryRebind');

    mount(TestComponent);

    shortcutStore.startRebind('theme');

    const event = new KeyboardEvent('keydown', { key: 'k' });
    window.dispatchEvent(event);

    expect(tryRebindSpy).toHaveBeenCalledWith('k');
  });

  it('cancels rebind on escape', async () => {
    const shortcutStore = useShortcutStore();
    const cancelRebindSpy = vi.spyOn(shortcutStore, 'cancelRebind');

    mount(TestComponent);

    shortcutStore.startRebind('theme');

    const event = new KeyboardEvent('keydown', { key: 'escape' });
    window.dispatchEvent(event);

    expect(cancelRebindSpy).toHaveBeenCalled();
  });

  it('ignores modifier keys during rebind', async () => {
    const shortcutStore = useShortcutStore();
    const tryRebindSpy = vi.spyOn(shortcutStore, 'tryRebind');

    mount(TestComponent);

    shortcutStore.startRebind('theme');

    const event = new KeyboardEvent('keydown', { key: 'Shift' });
    window.dispatchEvent(event);

    expect(tryRebindSpy).not.toHaveBeenCalled();
  });
});
