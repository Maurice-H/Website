import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useToast } from '../../../composables/useToast';
import ToastNotification from '../ToastNotification.vue';

describe('ToastNotification.vue', () => {
  let teleportTarget: HTMLDivElement;

  beforeEach(() => {
    setActivePinia(createPinia());
    // Clear any leftover toasts
    const { toasts } = useToast();
    toasts.value = [];

    // Create a teleport target
    teleportTarget = document.createElement('div');
    teleportTarget.id = 'teleport-target';
    document.body.appendChild(teleportTarget);
  });

  afterEach(() => {
    teleportTarget.remove();
  });

  function mountToast() {
    return mount(ToastNotification, {
      attachTo: document.body,
    });
  }

  it('renders no toast items when toasts is empty', () => {
    mountToast();
    const items = document.body.querySelectorAll('.toast-item');
    expect(items).toHaveLength(0);
  });

  it('renders a success toast with correct icon', () => {
    const { show } = useToast();
    show('contact.success', 'success');

    mountToast();

    const items = document.body.querySelectorAll('.toast-item');
    expect(items).toHaveLength(1);
    expect(items[0].classList.contains('toast-item--success')).toBe(true);
    expect(items[0].querySelector('.toast-icon')?.textContent).toBe('✓');
  });

  it('renders an error toast with correct icon', () => {
    const { show } = useToast();
    show('contact.error', 'error');

    mountToast();

    const items = document.body.querySelectorAll('.toast-item');
    expect(items).toHaveLength(1);
    expect(items[0].classList.contains('toast-item--error')).toBe(true);
    expect(items[0].querySelector('.toast-icon')?.textContent).toBe('✕');
  });

  it('renders an info toast with correct icon', () => {
    const { show } = useToast();
    show('contact.copied', 'info');

    mountToast();

    const items = document.body.querySelectorAll('.toast-item');
    expect(items).toHaveLength(1);
    expect(items[0].classList.contains('toast-item--info')).toBe(true);
    expect(items[0].querySelector('.toast-icon')?.textContent).toBe('ℹ');
  });

  it('has role="alert" on each toast item', () => {
    const { show } = useToast();
    show('contact.success', 'success');

    mountToast();

    const item = document.body.querySelector('.toast-item');
    expect(item?.getAttribute('role')).toBe('alert');
  });
});
