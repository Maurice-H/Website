import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useThemeStore } from '../../../stores/useThemeStore';
import ThemeToggle from '../ThemeToggle.vue';

describe('ThemeToggle.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should have proper ARIA attributes and focus styles (Palette/a11y)', async () => {
    const wrapper = mount(ThemeToggle);
    const store = useThemeStore();
    const button = wrapper.find('button');

    // Assert button exists and has correct base aria roles
    expect(button.exists()).toBe(true);

    // Test Initial State (dark mode by default)
    expect(button.attributes('aria-label')).toBe('System Mode Finished');
    expect(button.attributes('aria-pressed')).toBe('false');

    // Toggle state to blueprint mode
    await button.trigger('click');
    expect(store.isBlueprintMode).toBe(true);

    // Test that the aria-pressed attribute updates dynamically
    expect(button.attributes('aria-pressed')).toBe('true');
    expect(button.attributes('aria-label')).toBe('System Mode Blueprint');

    // Validate custom theme focus management
    expect(button.classes()).toContain('active:scale-95');
  });
});
