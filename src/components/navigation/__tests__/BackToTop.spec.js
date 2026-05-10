import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import BackToTop from '../BackToTop.vue';
describe('BackToTop.vue', () => {
    it('mounts successfully', () => {
        const wrapper = mount(BackToTop, {
            global: {
                plugins: [createTestingPinia({ createSpy: vi.fn })],
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});
