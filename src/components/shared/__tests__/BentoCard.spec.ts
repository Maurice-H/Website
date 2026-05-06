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
    let wrapper = mount(BentoCard, { props: { colSpan: 2, rowSpan: 2 } });
    expect(wrapper.classes()).toContain('md:col-span-2');
    expect(wrapper.classes()).toContain('row-span-2');

    wrapper = mount(BentoCard, { props: { colSpan: 3, rowSpan: 3 } });
    expect(wrapper.classes()).toContain('lg:col-span-3');
    expect(wrapper.classes()).toContain('row-span-3');

    wrapper = mount(BentoCard, { props: { colSpan: 4, rowSpan: 4 } });
    expect(wrapper.classes()).toContain('lg:col-span-4');
    expect(wrapper.classes()).toContain('row-span-4');

    wrapper = mount(BentoCard, { props: { colSpan: 1, rowSpan: 1 } });
    expect(wrapper.classes()).toContain('col-span-1');
    expect(wrapper.classes()).toContain('row-span-1');
  });

  it('registers itself with the viewport store and unregisters on unmount', () => {
    const viewportStore = useViewportStore();
    const unregisterMock = vi.fn();
    const registerSpy = vi.spyOn(viewportStore, 'register').mockReturnValue({
      unregister: unregisterMock,
      update: vi.fn(),
    });

    const wrapper = mount(BentoCard, {
      props: {
        id: 'test-card',
      },
    });

    expect(registerSpy).toHaveBeenCalledWith('test-card', expect.any(HTMLElement));

    wrapper.unmount();
    expect(unregisterMock).toHaveBeenCalled();
  });
});
