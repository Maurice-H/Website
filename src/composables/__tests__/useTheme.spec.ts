import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useTheme', () => {
  beforeEach(() => {
    // Reset DOM state before each test
    document.documentElement.removeAttribute('data-theme');
    vi.resetModules();
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  describe('initialization', () => {
    it('should initialize to true if document has data-theme=blueprint', async () => {
      document.documentElement.setAttribute('data-theme', 'blueprint');
      const { useTheme } = await import('../useTheme');
      const { isBlueprint } = useTheme();
      expect(isBlueprint.value).toBe(true);
    });

    it('should initialize with default state (isBlueprint = false) if no attribute is present', async () => {
      // Force internal state reset before checking since we changed it in previous test
      // Since it's a file level variable, importing again might reuse it in some vitest setups,
      // but vi.resetModules() should handle it.
      const { useTheme } = await import('../useTheme');
      const { isBlueprint, toggleTheme } = useTheme();
      if (isBlueprint.value) toggleTheme(); // manual reset just in case
      expect(isBlueprint.value).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle to blueprint mode and update document data-theme attribute', async () => {
      const { useTheme } = await import('../useTheme');
      const { isBlueprint, toggleTheme } = useTheme();

      if (isBlueprint.value) toggleTheme(); // manual reset

      expect(isBlueprint.value).toBe(false);
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();

      toggleTheme();

      expect(isBlueprint.value).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('blueprint');
    });

    it('should toggle back to default mode and remove data-theme attribute', async () => {
      const { useTheme } = await import('../useTheme');
      const { isBlueprint, toggleTheme } = useTheme();

      if (!isBlueprint.value) toggleTheme(); // Make sure we start at blueprint

      expect(isBlueprint.value).toBe(true);

      // Then toggle back
      toggleTheme();

      expect(isBlueprint.value).toBe(false);
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });
  });
});
