import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NavWindow from '../NavWindow.vue';

describe('NavWindow.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render correct state classes and structural labels (Palette/a11y)', () => {
    const wrapper = mount(NavWindow, {
      props: {
        theme: 'about',
        label: 'ABOUT ME',
        active: true,
      },
    });

    // Check main container class correctly merges theme and active state
    expect(wrapper.classes()).toContain('theme-about');
    expect(wrapper.classes()).toContain('is-active');

    // The component provides duplicate visible labels for a visual effect
    const baseLabel = wrapper.find('.window-label-base');
    const activeLabel = wrapper.find('.window-label-active');
    // Both labels show hex-encoded text (active cycles HEX→BIN→OCT→DEC)
    expect(baseLabel.text()).toBe('41 42 4F 55 54 20 4D 45');
    expect(activeLabel.text()).toBe('41 42 4F 55 54 20 4D 45');

    // Verify the slot is accessible
    const wrapperWithSlot = mount(NavWindow, {
      props: {
        theme: 'projects',
        label: 'PROJECTS',
      },
      slots: {
        default: '<div class="test-slot">Custom Content</div>',
      },
    });

    expect(wrapperWithSlot.html()).toContain('Custom Content');
  });

  it('encodes label in binary (truncated to 4 bytes)', async () => {
    const wrapper = mount(NavWindow, {
      props: { theme: 'about', label: 'AB', active: true },
    });

    // Start at hex (index 0), advance to binary (index 1)
    // Cycle interval is 3000ms, fade duration is 400ms
    vi.advanceTimersByTime(3000);
    // After 3000ms the fade starts, after 400ms the system switches
    vi.advanceTimersByTime(400);
    await wrapper.vm.$nextTick();

    const activeLabel = wrapper.find('.window-label-active');
    // 'AB' → bytes [65, 66] → binary: '01000001 01000010'
    expect(activeLabel.text()).toBe('01000001 01000010');
  });

  it('encodes label in octal', async () => {
    const wrapper = mount(NavWindow, {
      props: { theme: 'about', label: 'AB', active: true },
    });

    // Advance to octal (index 2): hex → bin → oct
    // 2 cycles: 3000 + 400 each
    vi.advanceTimersByTime(3000);
    vi.advanceTimersByTime(400);
    vi.advanceTimersByTime(3000);
    vi.advanceTimersByTime(400);
    await wrapper.vm.$nextTick();

    const activeLabel = wrapper.find('.window-label-active');
    // 'AB' → bytes [65, 66] → octal: '101 102'
    expect(activeLabel.text()).toBe('101 102');
  });

  it('encodes label in decimal', async () => {
    const wrapper = mount(NavWindow, {
      props: { theme: 'about', label: 'AB', active: true },
    });

    // Advance to decimal (index 3): hex → bin → oct → dec
    for (let i = 0; i < 3; i++) {
      vi.advanceTimersByTime(3000);
      vi.advanceTimersByTime(400);
    }
    await wrapper.vm.$nextTick();

    const activeLabel = wrapper.find('.window-label-active');
    // 'AB' → bytes [65, 66] → decimal: '065 066'
    expect(activeLabel.text()).toBe('065 066');
  });

  it('triggers fading class during cycle transition', async () => {
    const wrapper = mount(NavWindow, {
      props: { theme: 'about', label: 'AB', active: true },
    });

    // After 3000ms, the fade should start
    vi.advanceTimersByTime(3000);
    await wrapper.vm.$nextTick();

    const activeLabel = wrapper.find('.window-label-active');
    expect(activeLabel.classes()).toContain('label-fading');

    // After 400ms the fade completes
    vi.advanceTimersByTime(400);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.window-label-active').classes()).not.toContain('label-fading');
  });

  it('stops cycling when active becomes false', async () => {
    const wrapper = mount(NavWindow, {
      props: { theme: 'about', label: 'AB', active: true },
    });

    // Advance one cycle
    vi.advanceTimersByTime(3000);
    vi.advanceTimersByTime(400);
    await wrapper.vm.$nextTick();

    // Now deactivate
    await wrapper.setProps({ active: false });
    await wrapper.vm.$nextTick();

    // System index should reset to 0 (hex)
    const activeLabel = wrapper.find('.window-label-active');
    // 'AB' hex = '41 42'
    expect(activeLabel.text()).toBe('41 42');
  });

  it('stops cycling on unmount', async () => {
    const wrapper = mount(NavWindow, {
      props: { theme: 'about', label: 'AB', active: true },
    });

    wrapper.unmount();

    // Should not throw when timers fire after unmount
    vi.advanceTimersByTime(5000);
  });

  it('renders without active state', () => {
    const wrapper = mount(NavWindow, {
      props: { theme: 'career', label: 'CAREER' },
    });

    expect(wrapper.classes()).toContain('theme-career');
    expect(wrapper.classes()).not.toContain('is-active');
  });

  it('has correct ARIA attributes', () => {
    const wrapper = mount(NavWindow, {
      props: { theme: 'contact', label: 'CONTACT', active: true },
    });

    expect(wrapper.attributes('role')).toBe('tab');
    expect(wrapper.attributes('aria-selected')).toBe('true');
    expect(wrapper.attributes('tabindex')).toBe('0');
  });
});
