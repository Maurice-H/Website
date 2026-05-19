import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TurnstileWidget from '../TurnstileWidget.vue';

// Mock env variables
vi.mock('@/utils/env', () => ({
  envConfig: {
    VITE_TURNSTILE_SITE_KEY: 'test-site-key',
  },
}));

vi.mock('@/utils/env', () => ({
  envConfig: {
    VITE_TURNSTILE_SITE_KEY: 'test-site-key',
  },
}));

let wrapper: ReturnType<typeof mount> | null = null;

describe('TurnstileWidget.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    vi.runAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('renders correctly and initializes Turnstile on mount', async () => {
    const renderSpy = vi.fn().mockReturnValue('widget-id-1');
    vi.stubGlobal('turnstile', { render: renderSpy, remove: vi.fn(), reset: vi.fn() });

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.turnstile-wrapper').exists()).toBe(true);
    expect(renderSpy).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        sitekey: 'test-site-key',
        theme: 'dark',
      })
    );
  });

  it('retries rendering if turnstile is not available initially', async () => {
    // Initially turnstile is not available
    vi.stubGlobal('turnstile', undefined);

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    // Advance timers so it retries
    await vi.advanceTimersByTimeAsync(500);

    const renderSpy = vi.fn().mockReturnValue('widget-id-2');
    vi.stubGlobal('turnstile', { render: renderSpy, remove: vi.fn(), reset: vi.fn() });

    // Advance again to let retry succeed
    await vi.advanceTimersByTimeAsync(500);
    await wrapper.vm.$nextTick();

    expect(renderSpy).toHaveBeenCalled();
  });

  it('stops retrying after max retries', async () => {
    vi.stubGlobal('turnstile', undefined);
    wrapper = mount(TurnstileWidget);

    // Advance enough time to exceed 10 retries (10 * 500 = 5000)
    await vi.advanceTimersByTimeAsync(6000);

    // Now make it available
    const renderSpy = vi.fn();
    vi.stubGlobal('turnstile', { render: renderSpy, remove: vi.fn(), reset: vi.fn() });

    await vi.advanceTimersByTimeAsync(1000);
    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('cleans up existing widget before re-rendering', async () => {
    const removeSpy = vi.fn();
    const renderSpy = vi.fn().mockReturnValue('widget-id-3');
    vi.stubGlobal('turnstile', { render: renderSpy, remove: removeSpy, reset: vi.fn() });

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    // Trigger a resize to force re-render via useResponsive (simulating mobile change)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event('resize'));
    await vi.advanceTimersByTimeAsync(10);

    renderSpy.mockClear();
    removeSpy.mockClear();

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    window.dispatchEvent(new Event('resize'));
    await vi.advanceTimersByTimeAsync(10);

    expect(removeSpy).toHaveBeenCalledWith('widget-id-3');
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('ignores errors during cleanup', async () => {
    const removeSpy = vi.fn().mockImplementation(() => {
      throw new Error('Cleanup error');
    });
    const renderSpy = vi.fn().mockReturnValue('widget-id-4');
    vi.stubGlobal('turnstile', { render: renderSpy, remove: removeSpy, reset: vi.fn() });

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    // Resize to trigger re-render and cleanup
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event('resize'));
    await vi.advanceTimersByTimeAsync(10);

    renderSpy.mockClear();
    removeSpy.mockClear();

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    window.dispatchEvent(new Event('resize'));
    await vi.advanceTimersByTimeAsync(10);

    expect(removeSpy).toHaveBeenCalled();
    // Render should still be called despite cleanup error
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('removes widget on component unmount', async () => {
    const removeSpy = vi.fn();
    const renderSpy = vi.fn().mockReturnValue('widget-id-5');
    vi.stubGlobal('turnstile', { render: renderSpy, remove: removeSpy, reset: vi.fn() });

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    wrapper.unmount();
    expect(removeSpy).toHaveBeenCalledWith('widget-id-5');
  });

  it('ignores errors during unmount cleanup', async () => {
    const removeSpy = vi.fn().mockImplementation(() => {
      throw new Error('Unmount error');
    });
    const renderSpy = vi.fn().mockReturnValue('widget-id-6');
    vi.stubGlobal('turnstile', { render: renderSpy, remove: removeSpy, reset: vi.fn() });

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    wrapper.unmount();
    expect(removeSpy).toHaveBeenCalled(); // Didn't crash
  });

  it('handles error-callback by retrying after delay', async () => {
    let errorCb: (() => void) | undefined;
    const renderSpy = vi.fn().mockImplementation((_el, options) => {
      errorCb = options['error-callback'];
      return 'widget-id-7';
    });
    vi.stubGlobal('turnstile', { render: renderSpy, remove: vi.fn(), reset: vi.fn() });

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    // Trigger error callback
    if (errorCb) errorCb();

    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Wait for the 1000ms delay in error-callback
    await vi.advanceTimersByTimeAsync(1000);
    await wrapper.vm.$nextTick();

    // Should render again
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('handles timeout-callback by retrying immediately', async () => {
    let timeoutCb: (() => void) | undefined;
    const renderSpy = vi.fn().mockImplementation((_el, options) => {
      timeoutCb = options['timeout-callback'];
      return 'widget-id-8';
    });
    vi.stubGlobal('turnstile', { render: renderSpy, remove: vi.fn(), reset: vi.fn() });

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    renderSpy.mockClear();
    // Trigger timeout callback
    if (timeoutCb) timeoutCb();
    await wrapper.vm.$nextTick();

    // Should render again immediately (next tick)
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('emits verify event when successful verification callback is executed', async () => {
    let successCb: ((token: string) => void) | undefined;
    const renderSpy = vi.fn().mockImplementation((_el, options) => {
      successCb = options.callback;
      return 'widget-id-9';
    });
    vi.stubGlobal('turnstile', { render: renderSpy, remove: vi.fn(), reset: vi.fn() });

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    if (successCb) successCb('test-verified-token');

    expect(wrapper.emitted().verify).toBeTruthy();
    expect(wrapper.emitted().verify[0]).toEqual(['test-verified-token']);
  });

  it('emits error event when error callback is executed', async () => {
    let errorCb: (() => void) | undefined;
    const renderSpy = vi.fn().mockImplementation((_el, options) => {
      errorCb = options['error-callback'];
      return 'widget-id-10';
    });
    vi.stubGlobal('turnstile', { render: renderSpy, remove: vi.fn(), reset: vi.fn() });

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    if (errorCb) errorCb();

    expect(wrapper.emitted().error).toBeTruthy();
  });

  it('emits timeout event when timeout callback is executed', async () => {
    let timeoutCb: (() => void) | undefined;
    const renderSpy = vi.fn().mockImplementation((_el, options) => {
      timeoutCb = options['timeout-callback'];
      return 'widget-id-11';
    });
    vi.stubGlobal('turnstile', { render: renderSpy, remove: vi.fn(), reset: vi.fn() });

    wrapper = mount(TurnstileWidget);
    await wrapper.vm.$nextTick();

    if (timeoutCb) timeoutCb();

    expect(wrapper.emitted().timeout).toBeTruthy();
  });
});
