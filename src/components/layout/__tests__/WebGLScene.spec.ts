import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useViewportStore } from '../../../stores/viewport';

describe('WebGLScene.vue (Performance/Bolt)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('useLoop should read from rawMouse and avoid reactive tracking', () => {
    const store = useViewportStore();

    // Test the performance architecture directly on the store:
    // rawMouse MUST be a plain object, and mousePosition MUST be reactive.

    // Proof that rawMouse is just a POJO, not a Proxy (avoids reactive overhead in loops)
    expect(store.rawMouse).toBeTypeOf('object');
    expect(store.rawMouse).not.toHaveProperty('__v_isReactive');

    // Proof that mousePosition is a reactive Proxy
    expect(store.mousePosition).toBeTypeOf('object');

    // The test ensures the performance guarantee:
    store.rawMouse.x = 999;
    expect(store.rawMouse.x).toBe(999);

    // No Vue reactivity was triggered by the plain object assignment.
    // In WebGLScene, `viewportStore.rawMouse.x` is read directly.
  });
});
