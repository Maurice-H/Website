import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { Group, Mesh } from 'three';
import { describe, expect, it, vi } from 'vitest';
import DroneEntity from '../DroneEntity.vue';

// Mock GLTFLoader
vi.mock('three-stdlib', () => {
  class GLTFLoader {
    load(
      url: string,
      onLoad: (gltf: unknown) => void,
      _onProgress: (xhr: unknown) => void,
      onError: (error: unknown) => void
    ) {
      if (url.includes('error')) {
        onError(new Error('Load error'));
        return;
      }

      const scene = new Group();
      const mesh = new Mesh();
      mesh.name = 'TestPlane';
      scene.add(mesh);

      onLoad({ scene });
    }
  }
  return { GLTFLoader };
});

describe('DroneEntity.vue', () => {
  const stubs = {
    TresGroup: true,
    TresMesh: true,
    TresSpotLight: true,
    TresObject3D: true,
    TresShaderMaterial: true,
    TresConeGeometry: true,
    TresPlaneGeometry: true,
    TresSphereGeometry: true,
    TresTorusGeometry: true,
    TresMeshStandardMaterial: true,
    TresMeshBasicMaterial: true,
  };

  it('renders, loads model, and reacts to props', async () => {
    const wrapper = mount(DroneEntity, {
      global: {
        plugins: [createTestingPinia()],
        stubs,
      },
      props: {
        accentColor: '#ff0000',
        lightingEnabled: true,
      },
    });

    expect(wrapper.exists()).toBe(true);

    // Call startLoading to trigger GLTFLoader
    wrapper.vm.startLoading();

    // Call again to hit the early return branch
    wrapper.vm.startLoading();

    // Trigger watcher
    await wrapper.setProps({ accentColor: '#00ff00' });

    // Wait for internal updates
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.droneScene).not.toBeNull();

    // Unmount to cover onUnmounted
    wrapper.unmount();
  });
});
