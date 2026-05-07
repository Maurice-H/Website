import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HeroSection from '../HeroSection.vue';

describe('HeroSection', () => {
  it('mounts successfully and has correct root id', () => {
    const wrapper = mount(HeroSection);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes('id')).toBe('hero-section');
  });

  it('renders key text content', () => {
    const wrapper = mount(HeroSection);

    const text = wrapper.text();
    expect(text).toContain('[ IDENTITY_PROTOCOL_LOADED ]');
    expect(text).toContain('Maurice');
    expect(text).toContain('A Junior Software Developer');
    expect(text).toContain('DEVELOPER');
    expect(text).toContain('ARCHITECT');
    expect(text).toContain('CREATOR');
  });

  it('handles window resize events without errors', () => {
    const wrapper = mount(HeroSection);

    // Dispatch a resize event
    expect(() => {
      window.dispatchEvent(new Event('resize'));
    }).not.toThrow();

    // Verify component is still mounted and structure intact
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('#hero-section').exists()).toBe(true);
  });
});
