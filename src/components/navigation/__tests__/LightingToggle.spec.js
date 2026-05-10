import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useThemeStore } from '../../../stores/useThemeStore';
import LightingToggle from '../LightingToggle.vue';
describe('LightingToggle.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    it('should have proper ARIA attributes and focus styles (Palette/a11y)', async () => {
        const wrapper = mount(LightingToggle);
        const store = useThemeStore();
        const button = wrapper.find('button');
        // Assert button exists and has correct base aria roles
        expect(button.exists()).toBe(true);
        expect(button.attributes('aria-label')).toBe('Lighting On');
        // Test Initial State (lighting enabled by default)
        expect(button.attributes('aria-pressed')).toBe('true');
        // Toggle lighting
        await button.trigger('click');
        expect(store.lightingEnabled).toBe(false);
        // Test that the aria-pressed attribute updates dynamically
        expect(button.attributes('aria-pressed')).toBe('false');
        expect(button.attributes('aria-label')).toBe('Lighting Off');
        // Validate custom focus styles
        expect(button.classes()).toContain('active:scale-95');
    });
});
