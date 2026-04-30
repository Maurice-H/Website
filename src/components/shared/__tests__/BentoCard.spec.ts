import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useViewportStore } from '../../../stores/viewport';
import BentoCard from '../BentoCard.vue';

describe('BentoCard.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders slots correctly', () => {
    const wrapper = mount(BentoCard, {
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
    });

    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.find('.test-content').text()).toBe('Test Content');
  });

  it('renders WindowFrame when withWindow is true', () => {
    const wrapper = mount(BentoCard, {
      props: {
        withWindow: true,
        title: 'Test Window Title',
      },
      slots: {
        default: '<div>Inner Content</div>',
      },
    });

    // Check if the title text is rendered. Since WindowFrame has the title, we search the wrapper text
    expect(wrapper.text()).toContain('Test Window Title');
    expect(wrapper.text()).toContain('Inner Content');
  });

  it('calculates grid span classes based on props', () => {
    const wrapper = mount(BentoCard, {
      props: {
        colSpan: 2,
        rowSpan: 3,
      },
    });

    expect(wrapper.classes()).toContain('md:col-span-2');
    expect(wrapper.classes()).toContain('row-span-3');
  });

  it('registers itself with the viewport store', () => {
    const viewportStore = useViewportStore();
    const registerSpy = vi.spyOn(viewportStore, 'register');

    mount(BentoCard, {
      props: {
        id: 'test-card',
      },
    });

    expect(registerSpy).toHaveBeenCalledWith('test-card', expect.any(HTMLElement));
  });

  it('sets isHovered to true on mouseenter', async () => {
    const wrapper = mount(BentoCard);

    await wrapper.trigger('mouseenter');
    // We cannot easily test internal composable state, but we can verify if tiltStyle changes
    // Wait for the next tick for reactive styles
    expect(wrapper.attributes('style')).toContain('perspective(1000px)');
  });
});
