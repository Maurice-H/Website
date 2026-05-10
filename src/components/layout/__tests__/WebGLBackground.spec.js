import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
vi.mock('three-stdlib', () => ({
    GLTFLoader: vi.fn().mockImplementation(() => ({
        load: vi.fn(),
    })),
}));
import WebGLBackground from '../WebGLBackground.vue';
describe('WebGLBackground.vue', () => {
    it('mounts successfully', () => {
        const wrapper = shallowMount(WebGLBackground, {
            global: {
                plugins: [createTestingPinia()],
                stubs: { TresCanvas: true, WebGLScene: true, CSSBackground: true },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});
