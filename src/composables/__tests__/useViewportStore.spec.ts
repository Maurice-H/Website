import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
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

  describe('init', () => {
    let setPropertySpy: MockInstance;
    let addEventListenerSpy: MockInstance;

    beforeEach(() => {
      setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty');
      addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should initialize correctly when called for the first time', () => {
      const { init } = useViewportStore();

      init();

      expect(setPropertySpy).toHaveBeenCalledWith('--mask-x', '50vw');
      expect(setPropertySpy).toHaveBeenCalledWith('--mask-y', '50vh');
      expect(setPropertySpy).toHaveBeenCalledWith('--spotlight-x-raw', '50%');
      expect(setPropertySpy).toHaveBeenCalledWith('--spotlight-y-raw', '50%');

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
        passive: true,
        capture: true,
      });
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), {
        passive: true,
      });
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function), {
        passive: true,
      });
    });

    it('should not initialize multiple times if already listening', () => {
      const { init } = useViewportStore();

      init();

      expect(setPropertySpy).toHaveBeenCalledTimes(4);
      expect(addEventListenerSpy).toHaveBeenCalledTimes(3);

      setPropertySpy.mockClear();
      addEventListenerSpy.mockClear();

      init(); // Second call

      expect(setPropertySpy).not.toHaveBeenCalled();
      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });
  });
});
