<template>
  <BentoCard
    id="contact-form"
    class="md:col-span-4 md:row-span-1 flex flex-col"
    with-window
    :title="$t('contact.title')"
    :is-low-end="performance.isLowEnd"
  >
    <div class="p-4 md:p-10 flex flex-col h-full">
      <p
        class="text-finished-text/50 text-xs md:text-sm mb-4 md:mb-6 font-mono tracking-wide transition-colors duration-[var(--theme-transition-duration)]"
      >
        {{ $t('contact.subtitle') }}
      </p>

      <!-- Channel Tab Switcher -->
      <div
        class="flex gap-1 mb-6 flex-wrap"
        role="tablist"
        aria-label="Contact channels"
      >
        <button
          v-for="channel in channels"
          :key="channel.id"
          type="button"
          role="tab"
          :data-testid="`channel-tab-${channel.id}`"
          :aria-selected="activeChannel === channel.id"
          :class="[
            'channel-tab flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black',
            { 'channel-tab--active': activeChannel === channel.id },
          ]"
          @click="activeChannel = channel.id"
        >
          <span class="w-4 h-4 flex items-center justify-center">
            <component :is="channel.icon" />
          </span>
          {{ channel.label }}
        </button>
      </div>

      <!-- Email Tab -->
      <div v-if="activeChannel === 'email'" class="flex flex-col flex-1">
        <form
          @submit.prevent="handleSubmit"
          class="flex flex-col gap-3 md:gap-4 flex-1"
        >
          <!-- Honeypot field (anti-spam) -->
          <input
            type="text"
            name="website"
            v-model="honeypot"
            class="hidden"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          />

          <div class="flex flex-col gap-1.5">
            <label
              for="contact-name"
              class="text-xs text-finished-text/50 uppercase tracking-widest font-bold ml-1 transition-colors duration-[var(--theme-transition-duration)]"
            >
              {{ $t('contact.form.name') }}
              <span class="text-finished-accent transition-colors duration-[var(--theme-transition-duration)]" aria-hidden="true">*</span>
            </label>
            <div class="input-wrapper">
              <input
                id="contact-name"
                type="text"
                required
                v-model="formData.name"
                data-testid="contact-name"
                :placeholder="$t('contact.form.namePlaceholder')"
                class="contact-input w-full px-4 py-3 text-sm text-finished-text placeholder-finished-text/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors duration-[var(--theme-transition-duration)]"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              for="contact-email"
              class="text-xs text-finished-text/50 uppercase tracking-widest font-bold ml-1 transition-colors duration-[var(--theme-transition-duration)]"
            >
              {{ $t('contact.form.email') }}
              <span class="text-finished-accent transition-colors duration-[var(--theme-transition-duration)]" aria-hidden="true">*</span>
            </label>
            <div class="input-wrapper">
              <input
                id="contact-email"
                type="email"
                required
                v-model="formData.email"
                data-testid="contact-email"
                :placeholder="$t('contact.form.emailPlaceholder')"
                :aria-invalid="!!emailError"
                :aria-describedby="emailError ? 'email-error' : undefined"
                class="contact-input w-full px-4 py-3 text-sm text-finished-text placeholder-finished-text/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors duration-[var(--theme-transition-duration)]"
              />
            </div>
            <p
              v-if="emailError"
              id="email-error"
              data-testid="contact-email-error"
              :data-error-key="emailError"
              aria-live="polite"
              class="text-red-400 text-xs mt-1 ml-1"
            >
              {{ $t(emailError) }}
            </p>
          </div>

          <div class="flex flex-col gap-1.5 flex-1">
            <label
              for="contact-message"
              class="text-xs text-finished-text/50 uppercase tracking-widest font-bold ml-1 transition-colors duration-[var(--theme-transition-duration)]"
            >
              {{ $t('contact.form.message') }}
              <span class="text-finished-accent transition-colors duration-[var(--theme-transition-duration)]" aria-hidden="true">*</span>
            </label>
            <div class="input-wrapper h-full">
              <textarea
                id="contact-message"
                required
                v-model="formData.message"
                data-testid="contact-message"
                :placeholder="$t('contact.form.messagePlaceholder')"
                :aria-invalid="formState === 'error'"
                :aria-describedby="
                  formState === 'error' ? 'message-error' : undefined
                "
                class="contact-input w-full h-full min-h-[100px] px-4 py-3 text-sm text-finished-text placeholder-finished-text/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors duration-[var(--theme-transition-duration)] resize-none"
              ></textarea>
            </div>
          </div>

          <p
            v-if="formState === 'error'"
            id="message-error"
            data-testid="contact-error-message"
            :data-error-key="errorMessage"
            aria-live="polite"
            class="text-red-400 text-xs ml-1"
          >
            {{ $t(errorMessage) }}
          </p>

          <!-- Cloudflare Turnstile Widget (Dynamic Size & Scale) -->
          <div
            :key="isMobile ? 'mobile' : 'desktop'"
            class="cf-turnstile mb-2"
            :data-sitekey="turnstileSiteKey"
            data-theme="dark"
            :data-size="isMobile ? 'compact' : 'normal'"
            :style="{ 
              transform: `scale(${captchaScale})`,
              display: widgetId ? 'block' : 'none' 
            }"
          ></div>

          <button
            type="submit"
            data-testid="contact-submit"
            :data-success="formState === 'success'"
            :disabled="formState === 'submitting'"
            aria-live="polite"
            class="relative w-full py-3 md:py-4 px-6 overflow-hidden rounded border border-finished-accent/40 bg-black/40 text-finished-text font-bold text-xs uppercase tracking-[0.3em] hover:bg-finished-accent/15 hover:text-finished-accent hover:border-finished-accent/70 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-[var(--theme-transition-duration)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span
              class="relative z-10 group-hover:drop-shadow-[0_0_8px_currentColor] transition-colors duration-[var(--theme-transition-duration)]"
            >
              {{ submitLabel }}
            </span>
            <div
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-finished-accent/60 group-hover:bg-finished-accent group-hover:h-full transition-all duration-300"
            ></div>
          </button>
        </form>
      </div>

      <!-- Discord Tab -->
      <div
        v-else-if="activeChannel === 'discord'"
        class="flex flex-col items-center justify-center flex-1 gap-4 py-8"
      >
        <div class="text-finished-accent w-12 h-12"><DiscordIcon /></div>
        <p class="text-finished-text/50 text-sm text-center">
          {{ $t('contact.discordConnect') }}
        </p>
        <div
          class="flex items-center gap-3 px-4 py-3 rounded border border-finished-border bg-finished-text/[0.03]"
        >
          <span class="text-finished-accent font-mono text-sm">{{
            discordUser
          }}</span>
          <button
            type="button"
            data-testid="copy-discord"
            aria-live="polite"
            class="px-3 py-1 text-xs uppercase tracking-widest border border-finished-accent/40 rounded bg-black/40 text-finished-accent hover:bg-finished-accent/15 hover:border-finished-accent/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-200 active:scale-95"
            @click="copyToClipboard(discordUser)"
          >
            {{
              copyState === "copied"
                ? $t('contact.copySuccess')
                : copyState === "error"
                  ? $t('contact.copyError')
                  : $t('contact.copy')
            }}
          </button>
        </div>
      </div>

      <!-- Xing Tab -->
      <div
        v-else-if="activeChannel === 'xing'"
        class="flex flex-col items-center justify-center flex-1 gap-4 py-8"
      >
        <div class="text-finished-accent w-12 h-12"><XingIcon /></div>
        <p class="text-finished-text/50 text-sm text-center">
          {{ $t('contact.xingProfile') }}
        </p>
        <a
          :href="xingUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {{ $t('contact.openXing') }}
        </a>
      </div>

      <!-- LinkedIn Tab -->
      <div
        v-else-if="activeChannel === 'linkedin'"
        class="flex flex-col items-center justify-center flex-1 gap-4 py-8"
      >
        <div class="text-finished-accent w-12 h-12"><LinkedinIcon /></div>
        <p class="text-finished-text/50 text-sm text-center">
          {{ $t('contact.linkedinConnect') }}
        </p>
        <a
          :href="linkedinUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {{ $t('contact.openLinkedin') }}
        </a>
      </div>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/composables/useToast';
import { SOCIAL_LINKS } from '../../data/portfolio';
import { usePerformanceStore } from '../../stores/usePerformanceStore';
import { envConfig } from '../../utils/env';
import DiscordIcon from '../icons/DiscordIcon.vue';
import EmailIcon from '../icons/EmailIcon.vue';
import LinkedinIcon from '../icons/LinkedinIcon.vue';
import XingIcon from '../icons/XingIcon.vue';
import BentoCard from '../shared/BentoCard.vue';

// --- Types ---
type ChannelId = 'email' | 'discord' | 'xing' | 'linkedin';
type FormState = 'idle' | 'submitting' | 'success' | 'error';

// --- State ---
const performance = usePerformanceStore();
const { show: showToast } = useToast();
const { t } = useI18n();
const turnstileSiteKey = envConfig.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

const activeChannel = ref<ChannelId>('email');
const formState = ref<FormState>('idle');
const errorMessage = ref('');
const emailError = ref('');
const copyState = ref<'idle' | 'copied' | 'error'>('idle');
const honeypot = ref('');
const lastSubmitTime = ref<number>(0);
const isMobile = ref(false);

const formData = reactive({
  name: '',
  email: '',
  message: '',
});

const channels: {
  id: ChannelId;
  label: string;
  icon: import('vue').Component;
}[] = [
  { id: 'email', label: 'Email', icon: EmailIcon },
  { id: 'discord', label: 'Discord', icon: DiscordIcon },
  { id: 'xing', label: 'Xing', icon: XingIcon },
  { id: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon },
];

// Social data from centralized config
const discordLink = SOCIAL_LINKS.find((l) => l.id === 'discord');
const xingLink = SOCIAL_LINKS.find((l) => l.id === 'xing');
const linkedinLink = SOCIAL_LINKS.find((l) => l.id === 'linkedin');
const discordUser = discordLink?.copyValue ?? '';
const xingUrl = xingLink?.url ?? '#';
const linkedinUrl = linkedinLink?.url ?? '#';

// --- Computed ---
const submitLabel = computed(() => {
  switch (formState.value) {
    case 'submitting':
      return t('contact.form.submitting');
    case 'success':
      return t('contact.form.success');
    case 'error':
      return t('contact.form.retry');
    default:
      return t('contact.form.submit');
  }
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Methods ---
interface TurnstileWindow extends Window {
  turnstile?: {
    render: (
      selector: string,
      options: { sitekey: string; theme: string; size?: string }
    ) => string;
    reset: (id?: string) => void;
    remove: (id: string) => void;
  };
}

const widgetId = ref<string | null>(null);
const captchaScale = ref(1);

const renderTurnstile = () => {
  const win = window as TurnstileWindow;
  if (win.turnstile) {
    nextTick(() => {
      const container = document.querySelector('.cf-turnstile');
      // We don't need to manually remove if we use a :key on the element,
      // as Vue replaces the element for us.
      if (container && !container.querySelector('iframe')) {
        widgetId.value =
          win.turnstile?.render('.cf-turnstile', {
            sitekey: turnstileSiteKey,
            theme: 'dark',
            size: isMobile.value ? 'compact' : 'normal',
          }) || null;

        updateCaptchaScale();
      }
    });
  }
};

const updateCaptchaScale = () => {
  const container = document.querySelector('.cf-turnstile');
  if (!container?.parentElement) return;

  const parentWidth = container.parentElement.clientWidth;
  const targetWidth = isMobile.value ? 130 : 300;

  if (parentWidth < targetWidth && parentWidth > 0) {
    // Math.max(0.3, ...) ensures it never scales to 0 and becomes invisible
    captchaScale.value = Math.max(0.3, Math.min(1, (parentWidth - 10) / targetWidth));
  } else {
    captchaScale.value = 1;
  }
};

const validateEmail = (email: string): boolean => {
  if (!EMAIL_REGEX.test(email)) {
    emailError.value = 'contact.form.errors.emailFormat';
    return false;
  }
  emailError.value = '';
  return true;
};

interface DNSAnswer {
  type: number;
  data: string;
}

interface DNSResponse {
  Status: number;
  Answer?: DNSAnswer[];
}

const checkEmailExistence = async (email: string): Promise<boolean> => {
  const domain = email.split('@')[1];
  if (!domain) return false;

  try {
    // We use Cloudflare DNS-over-HTTPS to check for MX records.
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
      headers: {
        Accept: 'application/dns-json',
      },
    });

    if (!response.ok) return true;

    const data = (await response.json()) as DNSResponse;

    // Status 3 means NXDOMAIN (domain does not exist)
    if (data.Status === 3) {
      return false;
    }

    // Check if we have Answer records (MX)
    if (data.Answer && data.Answer.length > 0) {
      // RFC 7505: Check for "Null MX" (0 .) which means "no mail accepted here"
      const hasValidMX = data.Answer.some((record) => {
        const mxData = record.data.toLowerCase();
        return mxData !== '0 .' && mxData !== '0';
      });

      if (hasValidMX) return true;
      // If we only have Null MX records, it's a dead end.
      return false;
    }

    // If no MX records are found, we reject it.
    // While "Implicit MX" (A records) exists in standards, in modern practice,
    // any legitimate mail domain (Gmail, Yahoo, etc.) will have MX records.
    // This catches typo domains like "ahoo.de" which only have A records for parking pages.
    return false;
  } catch (err) {
    console.error('DNS verification failed:', err);
    return true; // Don't block user if verification service is down
  }
};

const validateMessage = (msg: string): boolean => {
  const trimmed = msg.trim();

  if (trimmed.length < 15) {
    errorMessage.value = 'contact.form.errors.tooShort';
    formState.value = 'error';
    return false;
  }

  // A real message usually consists of sentences.
  // We require at least 3 words (2 spaces) to prevent single-string gibberish like "earvwscarevcaevcrw".
  const words = trimmed.split(/\s+/);
  if (words.length < 3) {
    errorMessage.value = 'contact.form.errors.incomplete';
    formState.value = 'error';
    return false;
  }

  // Check if any single word is unrealistically long (> 40 chars) and isn't a URL.
  // This catches things like "asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd".
  const hasAbsurdlyLongWord = words.some((w) => w.length > 40 && !w.startsWith('http'));
  if (hasAbsurdlyLongWord) {
    errorMessage.value = 'contact.form.errors.invalidLength';
    formState.value = 'error';
    return false;
  }

  // Check for Cyrillic characters (common in spam bots, irrelevant for this portfolio)
  if (/[А-Яа-яЁё]/.test(trimmed)) {
    errorMessage.value = 'contact.form.errors.unsupportedSet';
    formState.value = 'error';
    return false;
  }

  // Check for SEO spam (multiple URLs)
  const urlCount = (trimmed.match(/https?:\/\//g) || []).length;
  if (urlCount > 1) {
    errorMessage.value = 'contact.form.errors.tooManyLinks';
    formState.value = 'error';
    return false;
  }

  // Basic keyboard mashing (e.g., "aaaaaa")
  if (/(.)\1{5,}/.test(trimmed)) {
    errorMessage.value = 'contact.form.errors.spamPattern';
    formState.value = 'error';
    return false;
  }

  // Repeating sequences (e.g., "asdasdasd", "qwqwqwqw")
  // We check if ANY sequence of 2 to 5 characters repeats 4 or more times in a row anywhere in the string.
  const noSpaces = trimmed.replace(/\s+/g, '');
  if (/(.{2,5})\1{3,}/.test(noSpaces)) {
    errorMessage.value = 'contact.form.errors.repeatingSequence';
    formState.value = 'error';
    return false;
  }

  // Also check for high ratio of repeating characters (catch "asdsafasdfgdsfg" type mashing)
  // If the string is mostly composed of 4-5 unique characters, it's probably spam.
  const uniqueChars = new Set(noSpaces.split('')).size;
  if (noSpaces.length >= 15 && uniqueChars < 6) {
    errorMessage.value = 'contact.form.errors.lowVariance';
    formState.value = 'error';
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (formState.value === 'submitting') return;
  if (honeypot.value) return;

  // Enforce 15-second cooldown
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

  // Advanced verification: Check if domain actually exists/receives mail
  // Bypass in CI mode to avoid network dependency and flakiness
  if (!envConfig.isCiMode) {
    const isDomainValid = await checkEmailExistence(formData.email);
    if (!isDomainValid) {
      errorMessage.value = 'contact.form.errors.domainInvalid';
      formState.value = 'error';
      return;
    }
  }

  try {
    const turnstileResponse = (
      document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement
    )?.value;

    if (!turnstileResponse) {
      throw new Error('contact.form.errors.securityCheck');
    }

    const formspreeId = envConfig.VITE_FORMSPREE_ID || (envConfig.isCiMode ? 'ci-test-id' : '');
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

    setTimeout(() => {
      formState.value = 'idle';
    }, 4000);
  } catch (err) {
    formState.value = 'error';
    errorMessage.value = err instanceof Error ? err.message : 'Network error — please try again.';
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    copyState.value = 'copied';
    showToast('contact.copied', 'success');
    setTimeout(() => {
      copyState.value = 'idle';
    }, 2000);
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error);
    copyState.value = 'error';
    showToast('contact.copyFailed', 'error');
    setTimeout(() => {
      copyState.value = 'idle';
    }, 2000);
  }
};

// --- Lifecycle & Watchers ---
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  isMobile.value = window.innerWidth < 480;
  renderTurnstile();

  // Dynamic scaling observer
  nextTick(() => {
    const container = document.querySelector('.cf-turnstile');
    if (container?.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        updateCaptchaScale();

        const mobile = window.innerWidth < 480;
        if (mobile !== isMobile.value) {
          isMobile.value = mobile;
          // Re-render handled by watch(isMobile) below
        }
      });
      resizeObserver.observe(container.parentElement);
    }
  });
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(isMobile, () => {
  renderTurnstile();
});

watch(activeChannel, (newChannel) => {
  if (newChannel === 'email') {
    renderTurnstile();
  }
});
</script>

<style scoped>
.input-wrapper {
  position: relative;
  border-top: 1px solid var(--finished-border);
  border-radius: 4px;
  overflow: hidden;
}

.contact-input {
  background: linear-gradient(
    to bottom,
    var(--finished-text-5, rgba(255, 255, 255, 0.05)),
    transparent
  );
  border: 1px solid var(--finished-border);
  border-top: none;
}

.contact-input:focus {
  background: linear-gradient(to bottom, var(--finished-border), transparent);
  border-color: var(--finished-accent);
}

/* Channel Tab Switcher */
.channel-tab {
  padding: 0.5rem 1rem;
  border: 1px solid var(--finished-border);
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.25s ease;
}

.channel-tab:hover {
  border-color: var(--finished-accent, rgba(16, 185, 129, 0.5));
  color: rgba(255, 255, 255, 0.7);
  background: rgba(16, 185, 129, 0.05);
}

.channel-tab--active {
  border-color: var(--finished-accent, #10b981);
  color: var(--finished-accent, #10b981);
  background: rgba(16, 185, 129, 0.1);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.15);
}

/* Social link buttons */
.social-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--finished-accent, rgba(16, 185, 129, 0.4));
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.4);
  color: var(--finished-accent, #10b981);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link-btn:hover {
  background: rgba(16, 185, 129, 0.15);
  border-color: var(--finished-accent, #10b981);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}

.social-link-btn:active {
  transform: scale(0.98);
}

.cf-turnstile {
  transform-origin: left top;
  transition: transform 0.2s ease-out;
  /* Ensure the container doesn't collapse its height when scaled */
  min-height: v-bind('isMobile ? "120px" : "65px"');
}
</style>
