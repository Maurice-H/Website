import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useViewportStore } from '../useViewportStore';

describe('useViewportStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should register a component and calculate initial offsets', () => {
    const { register, getOffsets } = useViewportStore();
    const mockEl = {
      getBoundingClientRect: vi.fn(() => ({ left: 100, top: 200 })),
    } as unknown as HTMLElement;

    register('test-card', mockEl);

    const offsets = getOffsets('test-card');
    expect(offsets.left).toBe(100);
    expect(offsets.top).toBe(200);
  });

  it('should update offsets when requested', () => {
    const { register, getOffsets } = useViewportStore();
    const mockEl = {
      getBoundingClientRect: vi.fn(() => ({ left: 0, top: 0 })),
    } as unknown as HTMLElement;

    const { update } = register('test-card', mockEl);

    // First call
    (mockEl.getBoundingClientRect as Mock).mockReturnValue({
      left: 10,
      top: 20,
    });
    update();
    expect(getOffsets('test-card').left).toBe(10);

    // Second call
    (mockEl.getBoundingClientRect as Mock).mockReturnValue({
      left: 50,
      top: 60,
    });

    update();
    expect(getOffsets('test-card').left).toBe(50);
  });

  it('should unregister a component', () => {
    const { register } = useViewportStore();
    const mockEl = {
      getBoundingClientRect: vi.fn(() => ({ left: 0, top: 0 })),
    } as unknown as HTMLElement;

    const { unregister } = register('temp-card', mockEl);
    const store = useViewportStore();
    expect(store.registeredComponents.has('temp-card')).toBe(true);

    unregister();
    expect(store.registeredComponents.has('temp-card')).toBe(false);
  });

  it('should return zeros for non-existent-ids', () => {
    const { getOffsets } = useViewportStore();
    const offsets = getOffsets('ghost');
    expect(offsets).toEqual({ left: 0, top: 0 });
  });
});
