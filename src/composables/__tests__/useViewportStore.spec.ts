import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useLightingStore } from '../../stores/lighting';
import { useThemeStore } from '../../stores/useThemeStore';
import { LightingPhase } from '../../types';
import { useViewportStore } from '../useViewportStore';

describe('useViewportStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    // Mock IntersectionObserver
    class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    let setPropertySpy: Mock;
    let addEventListenerSpy: Mock;
    let listeners: Array<{
      event: string;
      handler: EventListenerOrEventListenerObject;
      options: boolean | AddEventListenerOptions | undefined;
    }> = [];

    beforeEach(() => {
      listeners = [];
      setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty');

      const originalAddEventListener = window.addEventListener;
      addEventListenerSpy = vi
        .spyOn(window, 'addEventListener')
        .mockImplementation((event, handler, options) => {
          listeners.push({ event, handler, options });
          originalAddEventListener.call(window, event, handler, options);
        });

      setActivePinia(createPinia());
    });

    afterEach(() => {
      listeners.forEach(({ event, handler, options }) => {
        window.removeEventListener(event, handler, options);
      });
      vi.restoreAllMocks();
    });

    it('should set initial mask positions and register event listeners', () => {
      const store = useViewportStore();
      store.init();

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
        passive: true,
        capture: true,
      });
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), {
        passive: true,
      });
      expect(addEventListenerSpy).toHaveBeenCalledWith('pointermove', expect.any(Function), {
        passive: true,
      });
    });

    it('should be idempotent and not add listeners multiple times', () => {
      const store = useViewportStore();
      store.init();

      const callCount = addEventListenerSpy.mock.calls.length;
      expect(callCount).toBeGreaterThan(0);

      store.init();

      // The number of calls should not increase after the second init
      expect(addEventListenerSpy.mock.calls.length).toBe(callCount);
    });

    it('should update offsets on resize/scroll events', async () => {
      const store = useViewportStore();

      const mockEl = {
        getBoundingClientRect: vi.fn(() => ({ left: 100, top: 200 })),
        style: {
          setProperty: vi.fn(),
        },
      } as unknown as HTMLElement;
      store.register('test-element', mockEl);

      store.init();

      // Ensure mock returns a new value for the event
      (mockEl.getBoundingClientRect as Mock).mockReturnValue({ left: 300, top: 400 });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));

      // wait for raf
      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(store.getOffsets('test-element').left).toBe(300);
      expect(store.getOffsets('test-element').top).toBe(400);

      (mockEl.getBoundingClientRect as Mock).mockReturnValue({ left: 500, top: 600 });
      window.dispatchEvent(new Event('scroll'));

      // wait for raf
      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(store.getOffsets('test-element').left).toBe(500);
      expect(store.getOffsets('test-element').top).toBe(600);
    });

    it('should handle pointermove events correctly when lighting phase is CONTENT', async () => {
      const store = useViewportStore();
      const lighting = useLightingStore();
      const themeStore = useThemeStore();

      lighting.phase = LightingPhase.CONTENT;
      themeStore.lightingEnabled = true;

      // Mock window inner dimensions
      Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

      store.init();
      setPropertySpy.mockClear();

      // Dispatch pointermove
      const pointerEvent = new PointerEvent('pointermove', {
        clientX: 250,
        clientY: 400,
      });
      window.dispatchEvent(pointerEvent);

      // Wait for requestAnimationFrame
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Verify pointer position was updated (both reactive and raw)
      expect(store.mousePosition.x).toBe(250);
      expect(store.mousePosition.y).toBe(400);
      expect(store.rawMouse.x).toBe(250);
      expect(store.rawMouse.y).toBe(400);
    });

    it('should handle pointermove events correctly when lighting phase is NOT CONTENT', async () => {
      const store = useViewportStore();
      const lighting = useLightingStore();

      lighting.phase = LightingPhase.NAV;

      store.init();

      // Clear initial init calls
      setPropertySpy.mockClear();

      // Dispatch pointermove
      const pointerEvent = new PointerEvent('pointermove', {
        clientX: 100,
        clientY: 100,
      });
      window.dispatchEvent(pointerEvent);

      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Verify pointer position was updated (always written, even in NAV)
      expect(store.mousePosition.x).toBe(100);
      expect(store.mousePosition.y).toBe(100);
      expect(store.rawMouse.x).toBe(100);
      expect(store.rawMouse.y).toBe(100);

      // Verify CSS variables were NOT updated (NAV phase)
      expect(setPropertySpy).not.toHaveBeenCalled();
    });
  });
});
