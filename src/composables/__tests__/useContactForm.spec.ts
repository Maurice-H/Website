import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import { envConfig } from '@/utils/env';
import { useContactForm } from '../useContactForm';

vi.mock('@/utils/env', () => ({
  envConfig: {
    VITE_FORMSPREE_ID: 'test-formspree-id',
  },
}));

describe('useContactForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    globalThis.fetch = vi.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('initializes with default state', () => {
    const { formState, formData, errorMessage, emailError } = useContactForm();
    expect(formState.value).toBe('idle');
    expect(formData.name).toBe('');
    expect(formData.email).toBe('');
    expect(formData.message).toBe('');
    expect(errorMessage.value).toBe('');
    expect(emailError.value).toBe('');
  });

  it('validates email format', () => {
    const { validateEmail, emailError } = useContactForm();

    expect(validateEmail('invalid-email')).toBe(false);
    expect(emailError.value).toBe('contact.form.errors.emailFormat');

    expect(validateEmail('valid@example.com')).toBe(true);
    expect(emailError.value).toBe('');
  });

  it('validates message content', () => {
    const { validateMessage, errorMessage, formState } = useContactForm();

    // Too short
    expect(validateMessage('short')).toBe(false);
    expect(errorMessage.value).toBe('contact.form.errors.tooShort');
    expect(formState.value).toBe('error');

    // Not enough words
    expect(validateMessage('thisismorethan15charactersbutitsoneword')).toBe(false);
    expect(errorMessage.value).toBe('contact.form.errors.incomplete');

    // Absurdly long word
    expect(
      validateMessage('This word is waytooooooooooooooooooooooooooooooooooooooooooolong')
    ).toBe(false);
    expect(errorMessage.value).toBe('contact.form.errors.invalidLength');

    // Spam pattern (repeating identical character)
    expect(validateMessage('Hello this is a message mmmmmm')).toBe(false);
    expect(errorMessage.value).toBe('contact.form.errors.spamPattern');

    // Low variance (long string, very few unique characters)
    expect(validateMessage('a b c d e a c e b d a d b e c')).toBe(false);
    expect(errorMessage.value).toBe('contact.form.errors.lowVariance');
  });

  it('submits form successfully', async () => {
    const { formData, submit, formState, setTurnstileToken } = useContactForm();

    const performance = usePerformanceStore();
    vi.spyOn(performance, 'isCiMode', 'get').mockReturnValue(true);

    setTurnstileToken('mock-token');

    formData.name = 'Test User';
    formData.email = 'test@example.com';
    formData.message = 'This is a valid test message with enough words.';

    // Mock fetch response
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await submit();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://formspree.io/f/test-formspree-id',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a valid test message with enough words.',
          'cf-turnstile-response': 'mock-token',
        }),
      })
    );
    expect(formState.value).toBe('success');
    expect(formData.name).toBe('');
  });

  it('throws an error if turnstile response is missing', async () => {
    const { formData, submit, formState, errorMessage } = useContactForm();
    formData.name = 'Test User';
    formData.email = 'test@example.com';
    formData.message = 'This is a completely valid message.';

    // Do NOT mock turnstile response input to trigger error
    await submit();

    expect(formState.value).toBe('error');
    expect(errorMessage.value).toBe('contact.form.errors.securityCheck');
  });

  it('throws an error if Formspree config is missing', async () => {
    const { formData, submit, formState, errorMessage, setTurnstileToken } = useContactForm();
    const performance = usePerformanceStore();
    vi.spyOn(performance, 'isCiMode', 'get').mockReturnValue(false);

    // Temporarily clear config
    const originalId = envConfig.VITE_FORMSPREE_ID;
    (envConfig as { VITE_FORMSPREE_ID?: string }).VITE_FORMSPREE_ID = '';

    setTurnstileToken('mock-token');

    formData.name = 'Test User';
    formData.email = 'test@example.com';
    formData.message = 'This is a completely valid message.';

    // Mock checkEmailExistence to just pass to reach config check
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ Status: 0, Answer: [{ data: '10 mail.example.com' }] }),
    });
    globalThis.fetch = fetchMock as typeof fetch;

    await submit();

    expect(formState.value).toBe('error');
    expect(errorMessage.value).toBe('contact.form.errors.configMissing');

    (envConfig as { VITE_FORMSPREE_ID?: string }).VITE_FORMSPREE_ID = originalId;
  });
});
