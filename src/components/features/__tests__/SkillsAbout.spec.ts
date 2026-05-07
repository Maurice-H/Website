import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SkillsAbout from '../SkillsAbout.vue';

describe('SkillsAbout.vue', () => {
  it('mounts successfully', () => {
    const wrapper = shallowMount(SkillsAbout, {
      global: { plugins: [createTestingPinia()], stubs: { BentoCard: true } },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
