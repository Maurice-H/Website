import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useLightingStore } from '../../../stores/lighting';
import { useThemeStore } from '../../../stores/useThemeStore';
import { LightingPhase } from '../../../types';
import CSSBackground from '../CSSBackground.vue';
describe('CSSBackground.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    it('renders correctly in NAV phase', () => {
        const lightingStore = useLightingStore();
        lightingStore.phase = LightingPhase.NAV;
        const wrapper = mount(CSSBackground);
        const ufo = wrapper.find('.css-ufo');
        expect(ufo.classes()).toContain('ufo-visible');
        const drone = wrapper.find('.css-drone');
        expect(drone.classes()).not.toContain('drone-visible');
    });
    it('renders correctly in CONTENT phase', () => {
        const lightingStore = useLightingStore();
        lightingStore.phase = LightingPhase.CONTENT;
        const wrapper = mount(CSSBackground);
        const drone = wrapper.find('.css-drone');
        expect(drone.classes()).toContain('drone-visible');
        const ufo = wrapper.find('.css-ufo');
        expect(ufo.classes()).not.toContain('ufo-visible');
    });
    it('toggles blueprint mode', () => {
        const themeStore = useThemeStore();
        themeStore.isBlueprintMode = true;
        const wrapper = mount(CSSBackground);
        expect(wrapper.find('.css-ufo').classes()).toContain('ufo-blueprint');
        expect(wrapper.find('.css-drone').classes()).toContain('drone-blueprint');
    });
    it('toggles lighting visibility', () => {
        const themeStore = useThemeStore();
        themeStore.lightingEnabled = false;
        const wrapper = mount(CSSBackground);
        expect(wrapper.find('.ufo-glow').exists()).toBe(false);
        expect(wrapper.find('.drone-scanner').exists()).toBe(false);
        themeStore.lightingEnabled = true;
        const wrapper2 = mount(CSSBackground);
        expect(wrapper2.find('.ufo-glow').exists()).toBe(true);
        expect(wrapper2.find('.drone-scanner').exists()).toBe(true);
    });
    it('generates deterministic particle styles', () => {
        const wrapper = mount(CSSBackground);
        const particles = wrapper.findAll('.particle');
        expect(particles.length).toBe(12);
        const style1 = particles[0].attributes('style');
        expect(style1).toContain('--p-delay');
        expect(style1).toContain('left:');
    });
});
