import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { useThemeStore } from '@/stores/useThemeStore';
import { useThemeDomSync } from '../useThemeDomSync';

describe('useThemeDomSync', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Clear DOM state
    document.documentElement.removeAttribute('data-theme');
    document.head.innerHTML = `
      <meta name="theme-color" content="#ffffff">
      <meta name="msapplication-navbutton-color" content="#ffffff">
    `;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should sync blueprint mode to the root element', async () => {
    const store = useThemeStore();
    useThemeDomSync();

    // Default state (not blueprint)
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();

    // Enable blueprint
    store.isBlueprintMode = true;
    await nextTick();
    expect(document.documentElement.getAttribute('data-theme')).toBe('blueprint');

    // Disable blueprint
    store.isBlueprintMode = false;
    await nextTick();
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('should update meta tags for theme color', async () => {
    const store = useThemeStore();
    useThemeDomSync();

    // Wait for the immediate watcher and timeouts to execute
    vi.runAllTimers();

    const getMetaContent = () => {
      const meta = document.querySelector('meta[name="theme-color"]');
      return meta ? meta.getAttribute('content') : null;
    };

    // Default state (not blueprint)
    expect(getMetaContent()).toBe('#020205');

    // Enable blueprint
    store.isBlueprintMode = true;
    await nextTick();
    vi.runAllTimers();
    expect(getMetaContent()).toBe('#0a1628');
  });

  it('works even when no meta tags exist', async () => {
    // Remove all meta tags
    document.head.innerHTML = '';

    const store = useThemeStore();
    useThemeDomSync();
    vi.runAllTimers();

    // Should not crash when no meta tags to update
    store.isBlueprintMode = true;
    await nextTick();
    vi.runAllTimers();

    // data-theme should still be set correctly
    expect(document.documentElement.getAttribute('data-theme')).toBe('blueprint');
  });
});
