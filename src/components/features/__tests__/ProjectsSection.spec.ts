import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProjectsSection from '../ProjectsSection.vue';

describe('ProjectsSection.vue', () => {
  it('mounts successfully', () => {
    const wrapper = shallowMount(ProjectsSection, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BentoCard: true, SkeletonLoader: true },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
