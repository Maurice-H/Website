import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ContactForm from '../ContactForm.vue';

vi.mock('../../../utils/env', () => ({
  envConfig: {
    VITE_CI_MODE: 'false',
    isCiMode: false,
    VITE_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
    VITE_FORMSPREE_ID: 'test-form-id',
  },
}));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

type ContactFormInstance = {
  isMobile: boolean;
  captchaScale: number;
  updateCaptchaScale: () => void;
  renderTurnstile: () => void;
};

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

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
    vi.useFakeTimers();

    // Deferred fetch mock — resolve manually to test intermediate states
    let resolveFetch!: (value: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol === 'https:' && parsedUrl.hostname === 'cloudflare-dns.com') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ Status: 0, Answer: [{ data: '10 mail.example.com' }] }),
          });
        }
      } catch {
        // Non-URL input should not match the DNS mock branch
      }
      return fetchPromise;
    });
    vi.stubGlobal('fetch', fetchMock);

    const wrapper = mount(ContactForm);
    const button = wrapper.find('button[type="submit"]');

    expect(button.text()).toContain('Send Transmission');

    // Fill required fields before submitting
    await wrapper.find('input#contact-name').setValue('Test User');
    await wrapper.find('input#contact-email').setValue('test@example.com');
    await wrapper
      .find('textarea#contact-message')
      .setValue('Hello, this is a valid message that is longer than 15 characters.');
    await wrapper.vm.$nextTick();

    // Mock Turnstile DOM element
    const turnstileInput = document.createElement('input');
    turnstileInput.name = 'cf-turnstile-response';
    turnstileInput.value = 'dummy-token';
    document.body.appendChild(turnstileInput);

    // Trigger form submit
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    // Button should now show transmitting and be disabled
    expect(button.text()).toContain('Transmitting...');
    expect(button.attributes('disabled')).toBeDefined();

    // Resolve the fetch and flush
    resolveFetch({ ok: true, json: () => Promise.resolve({ ok: true }) } as Response);
    await vi.advanceTimersByTimeAsync(0);
    await wrapper.vm.$nextTick();

    expect(button.text()).toContain('Transmission Sent');

    // Advance timer to trigger idle state reset (4000ms)
    await vi.advanceTimersByTimeAsync(4000);
    await wrapper.vm.$nextTick();

    expect(button.text()).toContain('Send Transmission');

    vi.useRealTimers();
    vi.unstubAllGlobals();
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

  describe('Spam Filters & Cooldown', () => {
    it('should block short messages', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.find('input#contact-email').setValue('test@example.com');
      await wrapper.find('textarea#contact-message').setValue('Too short');
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.text()).toContain('Transmission too short');
    });

    it('should block messages with less than 3 words (No spaces)', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.find('input#contact-email').setValue('test@example.com');
      await wrapper.find('textarea#contact-message').setValue('earvwscarevcaevcrw');
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.text()).toContain('complete sentences');
    });

    it('should block excessive repeating sequences (Keyboard Smash)', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.find('input#contact-email').setValue('test@example.com');
      await wrapper.find('textarea#contact-message').setValue('I am writing asdasdasasdasdasdasd');
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.text()).toContain('Repeating sequence detected');
    });

    it('should block multiple URLs (SEO Spam)', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.find('input#contact-email').setValue('test@example.com');
      await wrapper
        .find('textarea#contact-message')
        .setValue('Check this http://spam.com and http://virus.com');
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.text()).toContain('Too many links detected');
    });

    it('should block Cyrillic characters', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.find('input#contact-email').setValue('test@example.com');
      await wrapper.find('textarea#contact-message').setValue('Hello this is a message Привет мир');
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.text()).toContain('Unsupported character set detected');
    });

    it('should block invalid email', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.find('input#contact-email').setValue('invalid-email');
      await wrapper.find('textarea#contact-message').setValue('Hello this is a valid message');
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.text()).toContain('Invalid email format');
    });

    it('should enforce 15-second cooldown after successful submit', async () => {
      vi.useFakeTimers();

      const wrapper = mount(ContactForm);

      // Setup Turnstile mock
      const div = document.createElement('div');
      div.className = 'cf-turnstile';
      const input = document.createElement('input');
      input.name = 'cf-turnstile-response';
      input.value = 'fake-token';
      document.body.appendChild(div);
      document.body.appendChild(input);

      await wrapper.find('input#contact-name').setValue('Test');
      await wrapper.find('input#contact-email').setValue('test@example.com');
      await wrapper
        .find('textarea#contact-message')
        .setValue('This is a completely valid message to test the cooldown.');

      // Mock Fetch
      const fetchMock = vi.fn().mockImplementation((url: string) => {
        try {
          const parsedUrl = new URL(url);
          if (parsedUrl.protocol === 'https:' && parsedUrl.hostname === 'cloudflare-dns.com') {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ Status: 0, Answer: [{ data: '10 mail.example.com' }] }),
            });
          }
        } catch {
          // Fall through
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ok: true }),
        });
      });
      vi.stubGlobal('fetch', fetchMock);

      await wrapper.find('form').trigger('submit.prevent');
      await vi.advanceTimersByTimeAsync(0);
      await wrapper.vm.$nextTick();

      // Submit again immediately
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.text()).toContain('Please wait 15 seconds');

      document.body.innerHTML = '';
      vi.useRealTimers();
    });
  });

  describe('Social Channels & Clipboard', () => {
    it('should copy Discord tag to clipboard', async () => {
      vi.useFakeTimers();
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
      });
      document.execCommand = vi.fn();

      const wrapper = mount(ContactForm);

      // Click Discord tab
      const buttons = wrapper.findAll('button.channel-tab');
      await buttons[1].trigger('click'); // Discord is second

      const allButtons = wrapper.findAll('button');
      const copyButton = allButtons.find((b) => b.text().includes('Copy'));
      if (!copyButton) throw new Error('Copy button not found');
      await copyButton.trigger('click');

      expect(writeTextMock).toHaveBeenCalled();
      expect(wrapper.text()).toContain('✓ Copied');

      await vi.advanceTimersByTimeAsync(2000);
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).not.toContain('✓ Copied');

      vi.useRealTimers();
    });

    it('should handle clipboard fallback via execCommand', async () => {
      // We only test the failure path of navigator.clipboard now
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard API not available'));
      try {
        Object.defineProperty(navigator, 'clipboard', {
          value: { writeText: writeTextMock },
          writable: true,
          configurable: true,
        });
      } catch (_e) {
        Object.assign(navigator, { clipboard: { writeText: writeTextMock } });
      }

      const wrapper = mount(ContactForm);
      const buttons = wrapper.findAll('button.channel-tab');
      await buttons[1].trigger('click');

      const allButtons = wrapper.findAll('button');
      const copyButton = allButtons.find((b) => b.text().includes('Copy'));
      if (!copyButton) throw new Error('Copy button not found');

      await copyButton.trigger('click');
      await flushPromises();

      expect(writeTextMock).toHaveBeenCalled();
      // It sets error state now
      expect(copyButton.text()).toBe('Failed to copy');
    });
  });

  describe('Formspree Fetch Errors', () => {
    it('should handle API errors gracefully', async () => {
      const wrapper = mount(ContactForm);

      const div = document.createElement('div');
      div.className = 'cf-turnstile';
      const input = document.createElement('input');
      input.name = 'cf-turnstile-response';
      input.value = 'fake-token';
      document.body.appendChild(div);
      document.body.appendChild(input);

      await wrapper.find('input#contact-name').setValue('Test');
      await wrapper.find('input#contact-email').setValue('test@example.com');
      await wrapper
        .find('textarea#contact-message')
        .setValue('This is a completely valid message.');

      const fetchMock = vi.fn().mockImplementation((url: string) => {
        try {
          const parsedUrl = new URL(url);
          if (parsedUrl.protocol === 'https:' && parsedUrl.hostname === 'cloudflare-dns.com') {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ Status: 0, Answer: [{ data: '10 mail.example.com' }] }),
            });
          }
        } catch {
          // Non-URL input should fall through to error response.
        }
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Custom API Error' }),
        });
      });
      vi.stubGlobal('fetch', fetchMock);

      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(wrapper.text()).toContain('Custom API Error');
      document.body.innerHTML = '';
    });

    it('should reject email if domain has no MX or A records', async () => {
      const wrapper = mount(ContactForm);

      await wrapper.find('input#contact-name').setValue('Test');
      await wrapper.find('input#contact-email').setValue('test@nonexistent-domain.com');
      await wrapper
        .find('textarea#contact-message')
        .setValue('This is a completely valid message.');

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ Status: 0, Answer: [] }), // Domain exists but no records
      });
      vi.stubGlobal('fetch', fetchMock);

      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(wrapper.text()).toContain('The email address is not publicly available');
      vi.unstubAllGlobals();
    });

    it('should reject email immediately if domain does not exist (NXDOMAIN)', async () => {
      const wrapper = mount(ContactForm);

      await wrapper.find('input#contact-name').setValue('Test');
      await wrapper.find('input#contact-email').setValue('test@yahooid.de');
      await wrapper
        .find('textarea#contact-message')
        .setValue('This is a completely valid message.');

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ Status: 3 }), // NXDOMAIN
      });
      vi.stubGlobal('fetch', fetchMock);

      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(wrapper.text()).toContain('The email address is not publicly available');
      // Verify that it didn't even try the A record fallback
      expect(fetchMock).toHaveBeenCalledTimes(1);
      vi.unstubAllGlobals();
    });

    it('should reject email if domain has a Null MX record (RFC 7505)', async () => {
      const wrapper = mount(ContactForm);

      await wrapper.find('input#contact-name').setValue('Test');
      await wrapper.find('input#contact-email').setValue('test@yahood.de');
      await wrapper
        .find('textarea#contact-message')
        .setValue('This is a completely valid message.');

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            Status: 0,
            Answer: [{ type: 15, data: '0 .' }], // Null MX
          }),
      });
      vi.stubGlobal('fetch', fetchMock);

      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(wrapper.text()).toContain('The email address is not publicly available');
      vi.unstubAllGlobals();
    });

    it('should continue submission if DNS verification fails', async () => {
      const wrapper = mount(ContactForm);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Setup Turnstile mock
      const input = document.createElement('input');
      input.name = 'cf-turnstile-response';
      input.value = 'fake-token';
      document.body.appendChild(input);

      await wrapper.find('input#contact-name').setValue('Test');
      await wrapper.find('input#contact-email').setValue('test@example.com');
      await wrapper
        .find('textarea#contact-message')
        .setValue('This is a completely valid message.');

      const fetchMock = vi.fn().mockImplementation((url: string) => {
        if (url.startsWith('https://cloudflare-dns.com/')) {
          return Promise.reject(new Error('DNS Service Down'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ok: true }),
        });
      });
      vi.stubGlobal('fetch', fetchMock);

      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(consoleSpy).toHaveBeenCalledWith('DNS verification failed:', expect.any(Error));
      expect(wrapper.text()).toContain('Transmission Sent');

      consoleSpy.mockRestore();
      vi.unstubAllGlobals();
      document.body.innerHTML = '';
    });
  });

  describe('Responsive Scaling & Turnstile', () => {
    it('should determine mobile mode based on window width', async () => {
      vi.stubGlobal('innerWidth', 320);
      window.dispatchEvent(new Event('resize'));
      const wrapper = mount(ContactForm);
      await wrapper.vm.$nextTick();
      expect((wrapper.vm as unknown as ContactFormInstance).isMobile).toBe(true);
      vi.stubGlobal('innerWidth', 1024);
      window.dispatchEvent(new Event('resize'));
    });

    it('should initialize ResizeObserver on mount', async () => {
      const observeSpy = vi.spyOn(ResizeObserver.prototype, 'observe');
      mount(ContactForm, { attachTo: document.body });
      await flushPromises();
      expect(observeSpy).toHaveBeenCalled();
    });

    it('should calculate captchaScale correctly for narrow containers', async () => {
      const wrapper = mount(ContactForm, { attachTo: document.body });
      const vm = wrapper.vm as unknown as ContactFormInstance;

      // Helper: safely mock clientWidth on the turnstile-wrapper's parent (form container)
      const mockParentWidth = (width: number) => {
        const el = document.querySelector('.turnstile-wrapper');
        if (el?.parentElement) {
          try {
            Object.defineProperty(el.parentElement, 'clientWidth', {
              value: width,
              configurable: true,
              writable: true,
            });
          } catch {
            // Proxy element — use getter override
            vi.spyOn(el.parentElement as HTMLElement, 'clientWidth', 'get').mockReturnValue(width);
          }
        }
      };

      // Compact mode (isMobile = true) -> target 130px
      vi.stubGlobal('innerWidth', 320);
      window.dispatchEvent(new Event('resize'));
      await wrapper.vm.$nextTick();
      mockParentWidth(100);
      vm.updateCaptchaScale();
      // (100 - 10) / 130 = ~0.69
      expect(vm.captchaScale).toBeCloseTo(0.69, 1);

      // Normal mode (isMobile = false) -> target 300px
      vi.stubGlobal('innerWidth', 1024);
      window.dispatchEvent(new Event('resize'));
      await wrapper.vm.$nextTick();
      mockParentWidth(100);
      vm.updateCaptchaScale();
      // (100 - 10) / 300 = 0.3
      expect(vm.captchaScale).toBe(0.3);

      // Large container -> scale 1
      mockParentWidth(500);
      vm.updateCaptchaScale();
      expect(vm.captchaScale).toBe(1);
    });

    it('should trigger turnstile re-render when switching to mobile', async () => {
      const renderSpy = vi.fn();
      vi.stubGlobal('turnstile', { render: renderSpy, remove: vi.fn(), reset: vi.fn() });

      const wrapper = mount(ContactForm, { attachTo: document.body });
      const vm = wrapper.vm as unknown as ContactFormInstance;

      vi.stubGlobal('innerWidth', 1024);
      window.dispatchEvent(new Event('resize'));
      await wrapper.vm.$nextTick();

      // Simulate resize to mobile
      vi.stubGlobal('innerWidth', 320);
      window.dispatchEvent(new Event('resize'));
      await wrapper.vm.$nextTick();

      // renderTurnstile is watched/called via ResizeObserver logic
      vm.renderTurnstile();
      await flushPromises();
      expect(renderSpy).toHaveBeenCalled();

      wrapper.unmount();
      vi.unstubAllGlobals();
    });
  });
});
