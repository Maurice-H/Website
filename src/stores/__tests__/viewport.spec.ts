import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useViewportStore } from '../viewport';

let mockObserverInstance: MockIntersectionObserver | null = null;

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.callback = callback;
    this.options = options;
    mockObserverInstance = this;
  }
}

describe('useViewportStore', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let requestAnimationFrameSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setActivePinia(createPinia());
    mockObserverInstance = null;

    // Mock IntersectionObserver
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    // Spy on event listeners
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    // Mock requestAnimationFrame to execute synchronously
    requestAnimationFrameSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((_cb: FrameRequestCallback) => {
        _cb(performance.now());
        return 1;
      });

    // Mock getBoundingClientRect
    window.HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 100,
      top: 10,
      left: 20,
      bottom: 110,
      right: 120,
      x: 20,
      y: 10,
      toJSON: () => {},
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it('should initialize with default state', () => {
    const store = useViewportStore();
    expect(store.mousePosition).toEqual({ x: 0, y: 0 });
    expect(store.rawMouse).toEqual({ x: 0, y: 0 });
    expect(store.registeredComponents.size).toBe(0);
  });

  it('init() should attach event listeners and create IntersectionObserver', () => {
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

    // Test that double init doesn't double-register
    store.init();
    expect(addEventListenerSpy).toHaveBeenCalledTimes(3);
  });

  it('register() should add component and return unregister/update methods', () => {
    const store = useViewportStore();
    store.init();

    const el = document.createElement('div');
    const { update, unregister } = store.register('test-id', el);

    expect(store.registeredComponents.size).toBe(1);
    expect(store.registeredComponents.get('test-id')).toMatchObject({
      el,
      offsets: { left: 20, top: 10 },
      isVisible: true,
    });

    expect(mockObserverInstance?.observe).toHaveBeenCalledWith(el);

    // Update
    window.HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 100,
      top: 50,
      left: 100,
      bottom: 150,
      right: 200,
      x: 100,
      y: 50,
      toJSON: () => {},
    }));

    update();
    expect(store.registeredComponents.get('test-id')?.offsets).toEqual({ left: 100, top: 50 });

    // Unregister
    unregister();
    expect(mockObserverInstance?.unobserve).toHaveBeenCalledWith(el);
    expect(store.registeredComponents.size).toBe(0);
  });

  it('getOffsets() should return registered offsets or default', () => {
    const store = useViewportStore();

    // Should return default
    expect(store.getOffsets('non-existent')).toEqual({ left: 0, top: 0 });

    // Should return registered
    const el = document.createElement('div');
    store.register('test-id', el);
    expect(store.getOffsets('test-id')).toEqual({ left: 20, top: 10 });
  });

  it('handlePointerMove should update rawMouse and reactive mousePosition correctly', () => {
    const store = useViewportStore();
    store.init();

    // Find the pointermove handler
    const pointerMoveCall = addEventListenerSpy.mock.calls.find(
      (call: unknown[]) => call[0] === 'pointermove'
    );
    expect(pointerMoveCall).toBeDefined();

    const handler = pointerMoveCall[1];

    // Simulate pointer move
    handler({ clientX: 150, clientY: 250 } as PointerEvent);

    expect(store.rawMouse).toEqual({ x: 150, y: 250 });
    expect(store.mousePosition).toEqual({ x: 150, y: 250 });
  });

  it('destroy() should clean up listeners and observer', () => {
    const store = useViewportStore();
    store.init();

    store.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
      capture: true,
    });
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));

    expect(mockObserverInstance?.disconnect).toHaveBeenCalled();
  });

  it('IntersectionObserver callback should update isVisible and trigger updateAll', async () => {
    const store = useViewportStore();
    store.init();

    const el = document.createElement('div');
    el.style.setProperty = vi.fn();

    // Need to spy on getBoundingClientRect specifically for this el
    el.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 100,
      top: 10,
      left: 20,
      bottom: 110,
      right: 120,
      x: 20,
      y: 10,
      toJSON: () => {},
    }));

    store.register('test-id', el);

    // Simulate IntersectionObserver callback
    const callback = mockObserverInstance?.callback;
    expect(callback).toBeDefined();

    // The observer expects target to be exactly the same element that's registered in WeakMap
    // Since elementMap has the original Proxy wrapping HTMLElement? No, WeakMap stores objects as keys.
    // el is the exact same reference.

    // Trigger intersection false
    callback?.(
      [{ target: el, isIntersecting: false }] as unknown as IntersectionObserverEntry[],
      mockObserverInstance as unknown as IntersectionObserver
    );

    // Assert that the component is now marked as not visible
    expect(store.registeredComponents.get('test-id')?.isVisible).toBe(false);

    // Clear mock
    (el.style.setProperty as ReturnType<typeof vi.fn>).mockClear();

    // Trigger visible
    callback?.(
      [{ target: el, isIntersecting: true }] as unknown as IntersectionObserverEntry[],
      mockObserverInstance as unknown as IntersectionObserver
    );

    expect(store.registeredComponents.get('test-id')?.isVisible).toBe(true);
  });

  it('handlePointerMove should throttle multiple calls via requestAnimationFrame', () => {
    const store = useViewportStore();
    store.init();

    const pointerMoveCall = addEventListenerSpy.mock.calls.find(
      (call: unknown[]) => call[0] === 'pointermove'
    );
    const handler = pointerMoveCall[1];

    // Change mock to not execute synchronously
    requestAnimationFrameSpy.mockImplementation((_cb: FrameRequestCallback) => {
      // Don't call it immediately
      return 1; // return dummy raf ID
    });

    // Fire two quick pointer events
    handler({ clientX: 100, clientY: 100 } as PointerEvent);
    handler({ clientX: 200, clientY: 200 } as PointerEvent);

    // rawMouse should be updated immediately on both
    expect(store.rawMouse).toEqual({ x: 200, y: 200 });

    // requestAnimationFrame should only have been called ONCE due to throttling gate
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);

    // Simulate rAF flush manually
    const rafCallback = requestAnimationFrameSpy.mock.calls[0][0];
    rafCallback(performance.now());

    // Reactive mousePosition should only be updated with the LATEST value when rAF flushed
    expect(store.mousePosition).toEqual({ x: 200, y: 200 });
  });

  it('updateAll (resize/scroll) should update component offsets', () => {
    const store = useViewportStore();
    store.init();

    const scrollCall = addEventListenerSpy.mock.calls.find(
      (call: unknown[]) => call[0] === 'scroll'
    );
    const handler = scrollCall[1];

    const el = document.createElement('div');
    el.style.setProperty = vi.fn();

    el.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 100,
      top: 300,
      left: 400,
      bottom: 400,
      right: 500,
      x: 400,
      y: 300,
      toJSON: () => {},
    }));

    store.register('test-id', el);

    handler(); // Simulate scroll, executing updateAll (synchronously due to original rAF mock)

    expect(store.registeredComponents.get('test-id')?.offsets).toEqual({ left: 400, top: 300 });
    expect(el.style.setProperty).toHaveBeenCalledWith('--card-left', '400px');
    expect(el.style.setProperty).toHaveBeenCalledWith('--card-top', '300px');
  });
});
