import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../../../i18n';
import LocaleSwitcher from '../LocaleSwitcher.vue';

function mountSwitcher() {
  return mount(LocaleSwitcher, {
    global: {
      plugins: [i18n],
    },
  });
}

describe('LocaleSwitcher.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset locale to 'en' before each test
    i18n.global.locale.value = 'en';
  });

  it('renders DE and EN options', () => {
    const wrapper = mountSwitcher();

    const options = wrapper.findAll('.locale-option');
    expect(options).toHaveLength(2);
    expect(options[0].text()).toBe('DE');
    expect(options[1].text()).toBe('EN');
  });

  it('highlights the active locale', () => {
    i18n.global.locale.value = 'en';
    const wrapper = mountSwitcher();

    const options = wrapper.findAll('.locale-option');
    expect(options[1].classes()).toContain('locale-option--active');
    expect(options[0].classes()).not.toContain('locale-option--active');
  });

  it('toggles locale on click from en to de', async () => {
    i18n.global.locale.value = 'en';
    const wrapper = mountSwitcher();

    await wrapper.find('.locale-switcher').trigger('click');

    expect(i18n.global.locale.value).toBe('de');
  });

  it('toggles locale on click from de to en', async () => {
    i18n.global.locale.value = 'de';
    const wrapper = mountSwitcher();

    await wrapper.find('.locale-switcher').trigger('click');

    expect(i18n.global.locale.value).toBe('en');
  });

  it('updates document.documentElement.lang via watcher', () => {
    i18n.global.locale.value = 'en';
    mountSwitcher();

    expect(document.documentElement.lang).toBe('en');
  });

  it('updates document.title via watcher', () => {
    i18n.global.locale.value = 'en';
    mountSwitcher();

    // The watch fires immediately, so document.title should be set
    expect(document.title).toBeTruthy();
  });

  it('updates meta description if element exists', () => {
    // Create a meta description element
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }

    i18n.global.locale.value = 'en';
    mountSwitcher();

    expect(metaDesc.getAttribute('content')).toBeTruthy();
  });

  it('has correct aria-label for English locale', () => {
    i18n.global.locale.value = 'en';
    const wrapper = mountSwitcher();

    expect(wrapper.find('.locale-switcher').attributes('aria-label')).toBe('Auf Deutsch wechseln');
  });

  it('has correct aria-label for German locale', () => {
    i18n.global.locale.value = 'de';
    const wrapper = mountSwitcher();

    expect(wrapper.find('.locale-switcher').attributes('aria-label')).toBe('Switch to English');
  });
});
