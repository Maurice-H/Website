import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ResilienceLayer from '../ResilienceLayer.vue';
describe('ResilienceLayer.vue', () => {
    it('mounts successfully ', async () => {
        const pinia = createTestingPinia({ initialState: { performance: { isLowEnd: true } } });
        const wrapper = mount(ResilienceLayer, {
            global: { plugins: [pinia] },
        });
        expect(wrapper.exists()).toBe(true);
    });
});
