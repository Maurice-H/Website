import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BentoLayout from '../BentoLayout.vue';
describe('BentoLayout.vue', () => {
    it('mounts successfully', () => {
        const wrapper = shallowMount(BentoLayout);
        expect(wrapper.exists()).toBe(true);
    });
});
