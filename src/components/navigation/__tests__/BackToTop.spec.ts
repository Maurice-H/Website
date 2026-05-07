import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BackToTop from '../BackToTop.vue';

describe('BackToTop.vue', () => {
  it('mounts successfully', () => {
    const wrapper = mount(BackToTop);
    expect(wrapper.exists()).toBe(true);
  });
});
