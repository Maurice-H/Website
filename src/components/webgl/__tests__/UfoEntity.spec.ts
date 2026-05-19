import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { Group, type Material, Mesh } from 'three';
import { describe, expect, it, vi } from 'vitest';
import UfoEntity from '../UfoEntity.vue';

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
      mesh.name = 'UFO_Mesh';
      mesh.material = { userData: {} } as unknown as Material;
      scene.add(mesh);

      onLoad({ scene });
    }
  }
  return { GLTFLoader };
});

describe('UfoEntity.vue', () => {
  it('renders, loads model, and reacts to props', async () => {
    const wrapper = mount(UfoEntity, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          TresGroup: true,
          TresMesh: true,
          TresPoints: true,
          TresBufferGeometry: true,
          TresShaderMaterial: true,
          TresCylinderGeometry: true,
          TresTorusGeometry: true,
          TresMeshStandardMaterial: true,
          TresMeshBasicMaterial: true,
        },
      },
      props: {
        accentColor: '#00ff00',
        visible: true,
      },
    });

    expect(wrapper.exists()).toBe(true);

    // Model loads on mount, check if scene is set
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.ufoScene).not.toBeNull();

    // Expose functions
    wrapper.vm.setTransitioning(true);
    expect(wrapper.vm.isTransitioning).toBe(true);

    // Watcher
    await wrapper.setProps({ accentColor: '#ff0000' });
    await wrapper.vm.$nextTick();

    // Unmount
    wrapper.unmount();
  });

  it('handles model loading error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Override envConfig BASE_URL to trigger error path in loader mock
    const { envConfig } = await import('@/utils/env');
    const originalBaseUrl = envConfig.BASE_URL;
    envConfig.BASE_URL = 'error-trigger/';

    const wrapper = mount(UfoEntity, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          TresGroup: true,
          TresMesh: true,
          TresPoints: true,
          TresBufferGeometry: true,
          TresShaderMaterial: true,
          TresCylinderGeometry: true,
          TresTorusGeometry: true,
          TresMeshStandardMaterial: true,
          TresMeshBasicMaterial: true,
        },
      },
      props: {
        accentColor: '#00ff00',
        visible: true,
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.ufoScene).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[UfoEntity] ufo.glb not found — using primitive fallback.',
      expect.any(Error)
    );

    // Restore Original BASE_URL
    envConfig.BASE_URL = originalBaseUrl;
    consoleErrorSpy.mockRestore();
  });
});
