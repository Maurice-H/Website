import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HeroSection from '../HeroSection.vue';

describe('HeroSection.vue', () => {
  it('mounts successfully', () => {
    const wrapper = shallowMount(HeroSection);
    expect(wrapper.exists()).toBe(true);
  });
});
