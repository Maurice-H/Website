import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.vue';
import { useLightingStore } from '../stores/lighting';
import { usePerformanceStore } from '../stores/usePerformanceStore';
import { useThemeStore } from '../stores/useThemeStore';
import { LightingPhase } from '../types';
vi.mock('../composables/useViewportStore', () => ({
    initGlobalViewportService: vi.fn(),
}));
describe('App.vue', () => {
    let pinia;
    beforeEach(() => {
        vi.clearAllMocks();
        pinia = createTestingPinia({
            createSpy: vi.fn,
            initialState: {
                lighting: {
                    phase: LightingPhase.NAV,
                    pendingScrollTarget: null,
                    isFlashActive: false,
                },
                theme: {
                    lightingEnabled: true,
                    isBlueprintMode: false,
                },
                performance: {
                    isReady: true,
                    isWebGLSupported: true,
                    isCiMode: false,
                    gpuTier: 3,
                },
            },
        });
    });
    const createWrapper = () => {
        return shallowMount(App, {
            global: {
                plugins: [pinia],
                stubs: {
                    ResilienceLayer: true,
                    // Since defineAsyncComponent is used, stub it based on the name resolving logic
                    WebGLBackground: true,
                    NavConveyor: true,
                    LightingToggle: true,
                    ThemeToggle: true,
                    HeroSection: true,
                    BentoLayout: true,
                    SkillsAbout: true,
                    ProjectsSection: true,
                    ContactForm: true,
                    BackToTop: true,
                    Transition: {
                        template: '<div><slot></slot></div>',
                    },
                },
            },
        });
    };
    it('mounts successfully', () => {
        const wrapper = createWrapper();
        expect(wrapper.exists()).toBe(true);
    });
    it('invokes performance check on mount', () => {
        createWrapper();
        const performanceStore = usePerformanceStore();
        expect(performanceStore.checkPerformance).toHaveBeenCalled();
    });
    it('renders NAV phase by default', () => {
        const wrapper = createWrapper();
        expect(wrapper.find('nav-conveyor-stub').exists()).toBe(true);
        expect(wrapper.find('bento-layout-stub').exists()).toBe(false);
    });
    it('renders CONTENT phase when lighting phase changes', async () => {
        const wrapper = createWrapper();
        const lightingStore = useLightingStore();
        lightingStore.phase = LightingPhase.CONTENT;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('bento-layout-stub').exists()).toBe(true);
        expect(wrapper.find('nav-conveyor-stub').exists()).toBe(false);
    });
    it('toggles custom cursor class conditionally', async () => {
        const wrapper = createWrapper();
        const lightingStore = useLightingStore();
        const themeStore = useThemeStore();
        // Default: NAV phase -> false
        expect(wrapper.classes()).not.toContain('hide-system-cursor');
        // Change to CONTENT phase and lighting enabled -> true
        lightingStore.phase = LightingPhase.CONTENT;
        themeStore.lightingEnabled = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.classes()).toContain('hide-system-cursor');
        // Disable lighting -> false
        themeStore.lightingEnabled = false;
        await wrapper.vm.$nextTick();
        expect(wrapper.classes()).not.toContain('hide-system-cursor');
    });
    it('toggles CI mode class', async () => {
        // This requires envConfig manipulation which might affect other tests, let's stick to mocking performance store.
        // Instead of mocking the store proxy getter, let's just spy on the store definition or just set it via $patch, wait $patch won't work on computed.
        // Vitest can mock computed properties on the store!
        const wrapper = createWrapper();
        const performanceStore = usePerformanceStore();
        expect(wrapper.classes()).not.toContain('is-ci-mode');
        // Use vi.spyOn on the getter of the store proxy
        vi.spyOn(performanceStore, 'isCiMode', 'get').mockReturnValue(true);
        // Force a re-render by updating a reactive property
        performanceStore.isReady = false;
        await wrapper.vm.$nextTick();
        performanceStore.isReady = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.classes()).toContain('is-ci-mode');
    });
    it('handles ESC keypress in CONTENT phase', async () => {
        const wrapper = createWrapper();
        const lightingStore = useLightingStore();
        lightingStore.phase = LightingPhase.CONTENT;
        await wrapper.vm.$nextTick();
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(lightingStore.setPhase).toHaveBeenCalledWith(LightingPhase.NAV);
    });
    it('ignores ESC keypress in NAV phase', async () => {
        createWrapper();
        const lightingStore = useLightingStore();
        // Reset spy as it might have been called in setup
        lightingStore.setPhase.mockClear();
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(lightingStore.setPhase).not.toHaveBeenCalled();
    });
    it('renders WebGLBackground always (handles fallback internally)', async () => {
        const wrapper = createWrapper();
        const performanceStore = usePerformanceStore();
        expect(wrapper.find('web-g-l-background-stub').exists()).toBe(true);
        // Even with WebGL unsupported, WebGLBackground stays mounted
        // (it renders CSSBackground internally as fallback)
        performanceStore.isWebGLSupported = false;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('web-g-l-background-stub').exists()).toBe(true);
    });
    it('tests handleAfterEnter scrolling logic with element found', async () => {
        vi.useFakeTimers();
        const wrapper = createWrapper();
        const lightingStore = useLightingStore();
        // Mock getElementById and scrollIntoView
        const scrollIntoViewMock = vi.fn();
        const elementMock = { scrollIntoView: scrollIntoViewMock };
        vi.spyOn(document, 'getElementById').mockReturnValue(elementMock);
        // Setup state for transition
        lightingStore.pendingScrollTarget = 'test-target';
        // Trigger after-enter event manually since we stubbed transition
        // Need to cast to unknown to access the bound method to respect biome rules
        const handleAfterEnter = wrapper.vm
            .handleAfterEnter;
        handleAfterEnter();
        // Verify pendingScrollTarget is reset
        expect(lightingStore.pendingScrollTarget).toBeNull();
        // Fast forward setTimeout
        vi.runAllTimers();
        expect(document.getElementById).toHaveBeenCalledWith('test-target');
        expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
        vi.useRealTimers();
    });
    it('tests handleAfterEnter logic with element not found or no target', async () => {
        vi.useFakeTimers();
        const wrapper = createWrapper();
        const lightingStore = useLightingStore();
        // Mock getElementById returning null
        vi.spyOn(document, 'getElementById').mockReturnValue(null);
        // Test with no target
        lightingStore.pendingScrollTarget = null;
        let handleAfterEnter = wrapper.vm
            .handleAfterEnter;
        handleAfterEnter();
        // setTimeout shouldn't even be called, but we run timers to be sure
        vi.runAllTimers();
        expect(document.getElementById).not.toHaveBeenCalled();
        // Test with target but element not found
        lightingStore.pendingScrollTarget = 'test-target-not-found';
        handleAfterEnter = wrapper.vm.handleAfterEnter;
        handleAfterEnter();
        expect(lightingStore.pendingScrollTarget).toBeNull();
        vi.runAllTimers();
        expect(document.getElementById).toHaveBeenCalledWith('test-target-not-found');
        vi.useRealTimers();
    });
    it('tests handleBackToNav button click', async () => {
        const wrapper = createWrapper();
        const lightingStore = useLightingStore();
        lightingStore.phase = LightingPhase.CONTENT;
        await wrapper.vm.$nextTick();
        const backButton = wrapper.find('button');
        await backButton.trigger('click');
        expect(lightingStore.setPhase).toHaveBeenCalledWith(LightingPhase.NAV);
    });
    it('renders css mask correctly', async () => {
        // Explicitly mock window.innerWidth for testing the mobile path
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
        const wrapper = createWrapper();
        const themeStore = useThemeStore();
        const lightingStore = useLightingStore();
        // Content Stage with styling
        const contentStage = wrapper.find('.content-stage');
        // NAV -> expect CSS var --reveal-mask to be present
        expect(contentStage.element.style.getPropertyValue('--reveal-mask')).toContain('radial-gradient');
        // CONTENT -> empty mask
        lightingStore.phase = LightingPhase.CONTENT;
        await wrapper.vm.$nextTick();
        expect(contentStage.element.style.getPropertyValue('--reveal-mask')).toBe('');
        // Lighting off -> empty style
        themeStore.lightingEnabled = false;
        await wrapper.vm.$nextTick();
        expect(contentStage.element.style.length).toBe(0);
    });
    it('unmounts correctly and removes event listeners', () => {
        const wrapper = createWrapper();
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
        wrapper.unmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
    it('cleans up correctly on unmount', () => {
        const wrapper = createWrapper();
        wrapper.unmount();
        expect(wrapper.exists()).toBe(false);
    });
});
