import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SkeletonLoader from '../SkeletonLoader.vue';

describe('SkeletonLoader.vue', () => {
  it('renders with text shape by default class', () => {
    const wrapper = mount(SkeletonLoader, {
      props: { shape: 'text' },
    });

    expect(wrapper.find('.skeleton-loader').exists()).toBe(true);
    expect(wrapper.classes()).toContain('skeleton-loader--text');
  });

  it('renders with card shape', () => {
    const wrapper = mount(SkeletonLoader, {
      props: { shape: 'card' },
    });

    expect(wrapper.classes()).toContain('skeleton-loader--card');
  });

  it('renders with circle shape', () => {
    const wrapper = mount(SkeletonLoader, {
      props: { shape: 'circle' },
    });

    expect(wrapper.classes()).toContain('skeleton-loader--circle');
  });

  it('has role="status" and aria-label for accessibility', () => {
    const wrapper = mount(SkeletonLoader, {
      props: { shape: 'text' },
    });

    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.attributes('aria-label')).toBe('Loading...');
  });

  it('applies custom width and height styles', () => {
    const wrapper = mount(SkeletonLoader, {
      props: { shape: 'card', width: '300px', height: '150px' },
    });

    const style = wrapper.attributes('style');
    expect(style).toContain('width: 300px');
    expect(style).toContain('height: 150px');
  });

  it('does not apply width/height styles when not provided', () => {
    const wrapper = mount(SkeletonLoader, {
      props: { shape: 'text' },
    });

    const style = wrapper.attributes('style') || '';
    expect(style).not.toContain('width');
    expect(style).not.toContain('height');
  });
});
