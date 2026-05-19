import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import EnvironmentLighting from '../EnvironmentLighting.vue';

vi.mock('@tresjs/core', () => ({
  useTresContext: () => ({
    renderer: { value: null },
    scene: { value: null },
    camera: { value: null },
    sizes: { width: { value: 800 }, height: { value: 600 } },
  }),
  useLoop: () => ({
    onBeforeRender: vi.fn(),
    render: vi.fn(),
  }),
}));

describe('EnvironmentLighting.vue', () => {
  it('renders and initializes without crashing', () => {
    const wrapper = mount(EnvironmentLighting, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          TresMesh: true,
          TresPlaneGeometry: true,
          TresShaderMaterial: true,
          TresPoints: true,
          TresBufferGeometry: true,
          TresPointsMaterial: true,
        },
      },
      props: {
        particleCount: 10,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm).toBeDefined();
  });
});
