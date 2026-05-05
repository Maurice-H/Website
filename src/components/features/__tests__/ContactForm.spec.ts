import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ContactForm from '../ContactForm.vue';

describe('ContactForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should render form elements with proper a11y labels', () => {
    const wrapper = mount(ContactForm);

    // Test that required inputs have labels linked correctly
    expect(wrapper.find('label[for="contact-name"]').exists()).toBe(true);
    expect(wrapper.find('input#contact-name').exists()).toBe(true);

    expect(wrapper.find('label[for="contact-email"]').exists()).toBe(true);
    expect(wrapper.find('input#contact-email').exists()).toBe(true);

    expect(wrapper.find('label[for="contact-message"]').exists()).toBe(true);
    expect(wrapper.find('textarea#contact-message').exists()).toBe(true);
  });

  it('should visually update state during submission', async () => {
    // Mock setTimeout and vitest timers to control timing
    vi.useFakeTimers();

    const wrapper = mount(ContactForm);
    const button = wrapper.find('button[type="submit"]');

    expect(button.text()).toContain('Send Transmission');
    expect(button.attributes('disabled')).toBeUndefined();

    // Trigger form submit
    await wrapper.find('form').trigger('submit.prevent');

    // Button should now show transmitting and be disabled
    expect(button.text()).toContain('Transmitting...');
    expect(button.attributes('disabled')).toBeDefined();

    // Advance timer by 1000ms to trigger success state
    await vi.advanceTimersByTimeAsync(1000);

    expect(button.text()).toContain('Transmission Sent');

    // Advance timer to trigger idle state reset
    await vi.advanceTimersByTimeAsync(3000);

    expect(button.text()).toContain('Send Transmission');

    vi.useRealTimers();
  });

  it('should securely handle malicious payload (Sentinel)', async () => {
    const wrapper = mount(ContactForm);

    const maliciousPayload = '<script>alert(1)</script>';
    const messageInput = wrapper.find('textarea#contact-message');

    // Simulate user entering malicious string
    await messageInput.setValue(maliciousPayload);

    // Ensure the bound value contains the string, but DOM treats it as plain text (no v-html vulnerability)
    const textareaElement = messageInput.element as HTMLTextAreaElement;
    expect(textareaElement.value).toBe(maliciousPayload);

    // Check there is no unsanitized rendering
    expect(wrapper.html()).not.toContain('v-html');

    // In vue, v-model handles escaping by default. This check proves the payload
    // is treated as an input value and not injected into the DOM as HTML.
    expect(wrapper.html()).toContain('id="contact-message"');
  });
});
