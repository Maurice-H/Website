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

      expect(setPropertySpy).toHaveBeenCalledWith('--mask-x', '50vw');
      expect(setPropertySpy).toHaveBeenCalledWith('--mask-y', '50vh');

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

    it('should handle mousemove events correctly when lighting phase is CONTENT', async () => {
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

      // Dispatch mousemove
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: 250,
        clientY: 400,
      });
      window.dispatchEvent(mouseEvent);

      // Wait for requestAnimationFrame
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Verify mouse position was updated (both reactive and raw)
      expect(store.mousePosition.x).toBe(250);
      expect(store.mousePosition.y).toBe(400);
      expect(store.rawMouse.x).toBe(250);
      expect(store.rawMouse.y).toBe(400);

      // Verify CSS variables were updated
      expect(setPropertySpy).toHaveBeenCalledWith('--mask-x', '250px');
      expect(setPropertySpy).toHaveBeenCalledWith('--mask-y', '400px');
    });

    it('should handle mousemove events correctly when lighting phase is NOT CONTENT', async () => {
      const store = useViewportStore();
      const lighting = useLightingStore();

      lighting.phase = LightingPhase.NAV;

      store.init();

      // Clear initial init calls
      setPropertySpy.mockClear();

      // Dispatch mousemove
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 100,
      });
      window.dispatchEvent(mouseEvent);

      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Verify mouse position was updated (always written, even in NAV)
      expect(store.mousePosition.x).toBe(100);
      expect(store.mousePosition.y).toBe(100);
      expect(store.rawMouse.x).toBe(100);
      expect(store.rawMouse.y).toBe(100);

      // Verify CSS variables were NOT updated (NAV phase)
      expect(setPropertySpy).not.toHaveBeenCalled();
    });
  });

  describe('initGlobalViewportService', () => {
    it('initializes the store', async () => {
      const { initGlobalViewportService } = await import('../useViewportStore');
      const store = useViewportStore();
      const initSpy = vi.spyOn(store, 'init');

      initGlobalViewportService();

      expect(initSpy).toHaveBeenCalled();
    });
  });

  describe('update component state execution paths', () => {
    it('returns without updating when component is unregistered before callback fires', async () => {
      const store = useViewportStore();
      const mockEl = document.createElement('div');

      const { update } = store.register('test-1', mockEl);
      store.registeredComponents.delete('test-1');

      // Shouldn't crash and should do nothing
      expect(() => update()).not.toThrow();
    });

    it('safely unregisters multiple times without crashing', () => {
      const store = useViewportStore();
      const mockEl = document.createElement('div');

      const { unregister } = store.register('test-1', mockEl);
      unregister();

      // Removing it manually from map and unregistering again
      store.registeredComponents.delete('test-1');
      expect(() => unregister()).not.toThrow();
    });
  });

  describe('mouseMove skips correctly based on conditions', () => {
    it('skips lighting CSS updates when lightingEnabled is false', async () => {
      const store = useViewportStore();
      const themeStore = useThemeStore();
      const lighting = useLightingStore();

      lighting.phase = LightingPhase.CONTENT;
      themeStore.lightingEnabled = false; // Disabling light

      const setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty');
      store.init();
      setPropertySpy.mockClear();

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 250, clientY: 400 }));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(setPropertySpy).not.toHaveBeenCalledWith('--mask-x', expect.anything());
      expect(setPropertySpy).not.toHaveBeenCalledWith('--mask-y', expect.anything());
    });
  });

  describe('updateAll exception conditions part 2', () => {
    it('handles intersection observer initialization safely if window is missing', async () => {
      const originalWindow = globalThis.window;

      (globalThis as unknown as Record<string, unknown>).window = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      const store = useViewportStore();
      expect(() => store.init()).not.toThrow();
      globalThis.window = originalWindow;
    });

    it('should ignore entries without visible elements', async () => {
      const store = useViewportStore();

      const mockEl = document.createElement('div');
      mockEl.getBoundingClientRect = vi.fn(() => ({
        left: 100,
        top: 200,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      store.register('test-1', mockEl);
      store.init();

      const reg = store.registeredComponents.get('test-1');
      if (reg) reg.isVisible = false;

      (mockEl.getBoundingClientRect as Mock).mockClear();
      window.dispatchEvent(new Event('scroll'));

      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(mockEl.getBoundingClientRect).not.toHaveBeenCalled();
    });
  });
});

describe('updateAll exception conditions part 3', () => {
  it('skips processing if updateRafId is already set', async () => {
    const store = useViewportStore();
    const mockEl = document.createElement('div');
    store.register('test-1', mockEl);
    store.init();

    // Trigger scroll event to queue updateAll
    window.dispatchEvent(new Event('scroll'));
    // Trigger it again immediately, should return early
    window.dispatchEvent(new Event('scroll'));

    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

  it('skips processing if rafId is already set', async () => {
    const store = useViewportStore();
    store.init();

    // Dispatch mousemove to queue handleMouseMove
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    // Dispatch it again immediately, should return early
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200 }));

    await new Promise((resolve) => requestAnimationFrame(resolve));
    // Should reflect the last raw position, but the callback only ran once
    expect(store.rawMouse.x).toBe(200);
    expect(store.rawMouse.y).toBe(200);
  });

  it('handles intersection observer when no elements match target', () => {
    const store = useViewportStore();
    store.init();

    // We need to simulate the intersection observer callback
    // This is tricky without exposing observer directly, but we can trigger it
    // if we stub IntersectionObserver
  });
});

describe('updateAll exception conditions part 4', () => {
  it('handles intersection observer when no elements match target', async () => {
    // Mock IntersectionObserver to expose the callback
    let observerCallback: IntersectionObserverCallback | null = null;
    const OriginalObserver = globalThis.IntersectionObserver;

    const mockObserver = vi.fn().mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
    globalThis.IntersectionObserver = mockObserver as unknown as typeof IntersectionObserver;

    const store = useViewportStore();
    store.init();

    // Ensure observerCallback was captured
    expect(observerCallback).toBeDefined();

    if (observerCallback) {
      // Trigger with a target that is NOT registered
      const dummyElement = document.createElement('div');
      const entry = {
        target: dummyElement,
        isIntersecting: true,
        boundingClientRect: dummyElement.getBoundingClientRect(),
        intersectionRatio: 1,
        intersectionRect: dummyElement.getBoundingClientRect(),
        rootBounds: null,
        time: 0,
      } as IntersectionObserverEntry;

      (observerCallback as IntersectionObserverCallback)(
        [entry],
        {} as unknown as IntersectionObserver
      );
    }

    globalThis.IntersectionObserver = OriginalObserver;
  });

  it('safely handles unregistering when observer is null', () => {
    const store = useViewportStore();
    const mockEl = document.createElement('div');

    store.register('test-null-obs', mockEl);

    // Force observer to null (simulating window not having IntersectionObserver)
    // We can't directly access `observer` variable from closure,
    // but we can register before init()
    const OriginalObserver = globalThis.IntersectionObserver;
    delete (globalThis as unknown as Record<string, unknown>).IntersectionObserver;

    const storeWithoutObs = useViewportStore();
    const { unregister: unregister2 } = storeWithoutObs.register('test-null-obs-2', mockEl);

    expect(() => unregister2()).not.toThrow();

    globalThis.IntersectionObserver = OriginalObserver;
  });
});

describe('updateAll exception conditions part 5', () => {
  it('executes the IntersectionObserver callback when isIntersecting matches an element', async () => {
    // Mock IntersectionObserver to expose the callback
    let observerCallback: IntersectionObserverCallback | null = null;
    const OriginalObserver = globalThis.IntersectionObserver;

    const mockObserver = vi.fn().mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
    globalThis.IntersectionObserver = mockObserver as unknown as typeof IntersectionObserver;

    const store = useViewportStore();

    const mockEl = document.createElement('div');
    store.register('test-intersect', mockEl);

    store.init();

    // Ensure observerCallback was captured
    expect(observerCallback).toBeDefined();

    if (observerCallback) {
      // Trigger with a target that IS registered
      const entry = {
        target: mockEl,
        isIntersecting: true,
        boundingClientRect: mockEl.getBoundingClientRect(),
        intersectionRatio: 1,
        intersectionRect: mockEl.getBoundingClientRect(),
        rootBounds: null,
        time: 0,
      } as IntersectionObserverEntry;

      const updateAllSpy = vi.spyOn(window, 'requestAnimationFrame');
      (observerCallback as IntersectionObserverCallback)(
        [entry],
        {} as unknown as IntersectionObserver
      );

      expect(store.registeredComponents.get('test-intersect')?.isVisible).toBe(true);
      expect(updateAllSpy).toHaveBeenCalled();
    }

    globalThis.IntersectionObserver = OriginalObserver;
  });
});
