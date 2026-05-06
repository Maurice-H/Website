import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import WindowFrame from '../WindowFrame.vue';

describe('WindowFrame.vue', () => {
  it('renders without title correctly', () => {
    const wrapper = mount(WindowFrame, {
      slots: {
        default: '<div class="test">content</div>',
      },
    });

    expect(wrapper.find('.test').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('[');
  });

  it('renders normal title correctly', () => {
    const wrapper = mount(WindowFrame, {
      props: { title: 'Normal Title' },
    });

    const titleEl = wrapper.find('.window-title');
    expect(titleEl.text()).toBe('Normal Title');
    expect(titleEl.classes()).toContain('text-[var(--finished-accent)]');
  });

  it('formats bracketed title correctly', () => {
    const wrapper = mount(WindowFrame, {
      props: { title: '[ STACK ]' },
    });

    const titleEl = wrapper.find('.window-title');
    expect(titleEl.text()).toBe('[ STACK ]');
    expect(titleEl.classes()).toContain('font-mono');
  });

  it('formats "stack" correctly even without brackets', () => {
    const wrapper = mount(WindowFrame, {
      props: { title: 'stack' },
    });

    const titleEl = wrapper.find('.window-title');
    expect(titleEl.text()).toBe('[ stack ]');
    expect(titleEl.classes()).toContain('font-mono');
  });
});
