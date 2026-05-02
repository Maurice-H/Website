import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import NavWindow from '../NavWindow.vue';

describe('NavWindow.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
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

    expect(baseLabel.text()).toBe('ABOUT ME');
    expect(activeLabel.text()).toBe('ABOUT ME');

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
});
