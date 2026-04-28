import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { useTheme } from '../useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    // Reset DOM state before each test
    document.documentElement.removeAttribute('data-theme');

    // We need to reset the ref value since it's defined outside the composable function
    const { isBlueprint } = useTheme();
    isBlueprint.value = false;
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('should initialize isBlueprint to true if data-theme is blueprint', async () => {
    document.documentElement.setAttribute('data-theme', 'blueprint');

    // Because the initialization logic runs globally on module import,
    // we use `vi.resetModules` to force re-evaluation of the module state.
    vi.resetModules();

    const { useTheme } = await import('../useTheme');
    const { isBlueprint } = useTheme();

    expect(isBlueprint.value).toBe(true);
  });

  it('should initialize isBlueprint to false if data-theme is not blueprint', async () => {
    document.documentElement.removeAttribute('data-theme');

    vi.resetModules();
    const { useTheme } = await import('../useTheme');
    const { isBlueprint } = useTheme();

    expect(isBlueprint.value).toBe(false);
  });

  it('should toggle theme and update DOM correctly', () => {
    // Mock console.log to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { isBlueprint, toggleTheme } = useTheme();

    // Force initial state to false for this test
    isBlueprint.value = false;
    document.documentElement.removeAttribute('data-theme');

    toggleTheme();

    expect(isBlueprint.value).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('blueprint');
    expect(consoleSpy).toHaveBeenCalledWith('[Theme] Toggle Triggered. New state:', true);

    toggleTheme();

    expect(isBlueprint.value).toBe(false);
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('[Theme] Toggle Triggered. New state:', false);

    consoleSpy.mockRestore();
  });
});
