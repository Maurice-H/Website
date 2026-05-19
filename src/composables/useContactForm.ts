import { reactive, ref } from 'vue';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import type { ContactFormData, ContactFormState, DNSResponse } from '@/types/contact';
import { envConfig } from '@/utils/env';

export const useContactForm = () => {
  const performance = usePerformanceStore();

  const formState = ref<ContactFormState>('idle');
  const errorMessage = ref('');
  const emailError = ref('');
  const honeypot = ref('');
  const lastSubmitTime = ref<number>(0);

  const formData = reactive<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const turnstileToken = ref('');

  const setTurnstileToken = (token: string) => {
    turnstileToken.value = token;
  };

  const validateEmail = (email: string): boolean => {
    if (!EMAIL_REGEX.test(email)) {
      emailError.value = 'contact.form.errors.emailFormat';
      return false;
    }
    emailError.value = '';
    return true;
  };

  const checkEmailExistence = async (email: string): Promise<boolean> => {
    const domain = email.split('@')[1];
    if (!domain) return false;

    try {
      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
        headers: {
          Accept: 'application/dns-json',
        },
      });

      if (!response.ok) return true;

      const data = (await response.json()) as DNSResponse;

      if (data.Status === 3) {
        return false;
      }

      if (data.Answer && data.Answer.length > 0) {
        const hasValidMX = data.Answer.some((record) => {
          const mxData = record.data.toLowerCase();
          return mxData !== '0 .' && mxData !== '0';
        });

        if (hasValidMX) return true;
        return false;
      }

      return false;
    } catch (err) {
      console.error('DNS verification failed:', err);
      return true;
    }
  };

  const validateMessage = (msg: string): boolean => {
    const trimmed = msg.trim();

    if (trimmed.length < 15) {
      errorMessage.value = 'contact.form.errors.tooShort';
      formState.value = 'error';
      return false;
    }

    const words = trimmed.split(/\s+/);
    if (words.length < 3) {
      errorMessage.value = 'contact.form.errors.incomplete';
      formState.value = 'error';
      return false;
    }

    const hasAbsurdlyLongWord = words.some((w) => w.length > 40 && !w.startsWith('http'));
    if (hasAbsurdlyLongWord) {
      errorMessage.value = 'contact.form.errors.invalidLength';
      formState.value = 'error';
      return false;
    }

    if (/[А-Яа-яЁё]/.test(trimmed)) {
      errorMessage.value = 'contact.form.errors.unsupportedSet';
      formState.value = 'error';
      return false;
    }

    const urlCount = (trimmed.match(/https?:\/\//g) || []).length;
    if (urlCount > 1) {
      errorMessage.value = 'contact.form.errors.tooManyLinks';
      formState.value = 'error';
      return false;
    }

    if (/(.)\1{5,}/.test(trimmed)) {
      errorMessage.value = 'contact.form.errors.spamPattern';
      formState.value = 'error';
      return false;
    }

    const noSpaces = trimmed.replace(/\s+/g, '');
    if (/(.{2,5})\1{3,}/.test(noSpaces)) {
      errorMessage.value = 'contact.form.errors.repeatingSequence';
      formState.value = 'error';
      return false;
    }

    const uniqueChars = new Set(noSpaces.split('')).size;
    if (noSpaces.length >= 15 && uniqueChars < 6) {
      errorMessage.value = 'contact.form.errors.lowVariance';
      formState.value = 'error';
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (formState.value === 'submitting') return;
    if (honeypot.value) return;

    const now = Date.now();
    if (now - lastSubmitTime.value < 15000) {
      errorMessage.value = 'contact.form.errors.cooldown';
      formState.value = 'error';
      return;
    }

    if (!validateEmail(formData.email)) return;
    if (!validateMessage(formData.message)) return;

    formState.value = 'submitting';
    errorMessage.value = '';

    if (!performance.isCiMode) {
      const isDomainValid = await checkEmailExistence(formData.email);
      if (!isDomainValid) {
        errorMessage.value = 'contact.form.errors.domainInvalid';
        formState.value = 'error';
        return;
      }
    }

    try {
      const turnstileResponse =
        turnstileToken.value ||
        (document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement)?.value;

      if (!turnstileResponse) {
        throw new Error('contact.form.errors.securityCheck');
      }

      const formspreeId = envConfig.VITE_FORMSPREE_ID || (performance.isCiMode ? 'ci-test-id' : '');
      if (!formspreeId) {
        throw new Error('contact.form.errors.configMissing');
      }

      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          'cf-turnstile-response': turnstileResponse,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg =
          data?.errors?.map((e: { message: string }) => e.message).join(', ') ||
          data?.error ||
          `Status: ${response.status}`;
        throw new Error(msg);
      }

      formState.value = 'success';
      lastSubmitTime.value = Date.now();
      formData.name = '';
      formData.email = '';
      formData.message = '';
      turnstileToken.value = '';

      setTimeout(() => {
        formState.value = 'idle';
      }, 4000);
    } catch (err) {
      formState.value = 'error';
      errorMessage.value = err instanceof Error ? err.message : 'Network error — please try again.';
    }
  };

  return {
    formState,
    errorMessage,
    emailError,
    honeypot,
    formData,
    turnstileToken,
    setTurnstileToken,
    submit,
    validateEmail,
    validateMessage,
    checkEmailExistence,
  };
};
