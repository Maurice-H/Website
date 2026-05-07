<template>
  <BentoCard
    id="contact-form"
    class="md:col-span-4 md:row-span-1 flex flex-col"
    with-window
    title="Get In Touch"
    :is-low-end="performance.isLowEnd"
  >
    <div class="p-4 md:p-10 flex flex-col h-full">
      <p
        class="text-slate-400 text-xs md:text-sm mb-4 md:mb-6 font-mono tracking-wide"
      >
        Establish direct channel for collaboration.
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
          :aria-selected="activeChannel === channel.id"
          :class="[
            'channel-tab flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black',
            { 'channel-tab--active': activeChannel === channel.id },
          ]"
          @click="activeChannel = channel.id"
        >
          <span
            class="w-4 h-4 flex items-center justify-center"
            v-html="channel.icon"
          ></span>
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
              class="text-xs text-slate-400 uppercase tracking-widest font-bold ml-1"
            >
              Name
              <span class="text-finished-accent" aria-hidden="true">*</span>
            </label>
            <div class="input-wrapper">
              <input
                id="contact-name"
                type="text"
                required
                v-model="formData.name"
                placeholder="Enter your designation"
                class="contact-input w-full px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              for="contact-email"
              class="text-xs text-slate-400 uppercase tracking-widest font-bold ml-1"
            >
              Email
              <span class="text-finished-accent" aria-hidden="true">*</span>
            </label>
            <div class="input-wrapper">
              <input
                id="contact-email"
                type="email"
                required
                v-model="formData.email"
                placeholder="Enter comm-link"
                :aria-invalid="!!emailError"
                :aria-describedby="emailError ? 'email-error' : undefined"
                class="contact-input w-full px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors"
              />
            </div>
            <p v-if="emailError" id="email-error" aria-live="polite" class="text-red-400 text-xs mt-1 ml-1">
              {{ emailError }}
            </p>
          </div>

          <div class="flex flex-col gap-1.5 flex-1">
            <label
              for="contact-message"
              class="text-xs text-slate-400 uppercase tracking-widest font-bold ml-1"
            >
              Message
              <span class="text-finished-accent" aria-hidden="true">*</span>
            </label>
            <div class="input-wrapper h-full">
              <textarea
                id="contact-message"
                required
                v-model="formData.message"
                placeholder="Transmit payload..."
                :aria-invalid="formState === 'error'"
                :aria-describedby="formState === 'error' ? 'message-error' : undefined"
                class="contact-input w-full h-full min-h-[100px] px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          <p v-if="formState === 'error'" id="message-error" aria-live="polite" class="text-red-400 text-xs ml-1">
            {{ errorMessage }}
          </p>

          <!-- Cloudflare Turnstile Widget -->
          <div
            class="cf-turnstile mb-2"
            :data-sitekey="turnstileSiteKey"
            data-theme="dark"
          ></div>

          <button
            type="submit"
            :disabled="formState === 'submitting'"
            aria-live="polite"
            class="relative w-full py-3 md:py-4 px-6 overflow-hidden rounded border border-finished-accent/40 bg-black/40 text-white font-bold text-xs uppercase tracking-[0.3em] hover:bg-finished-accent/15 hover:text-[var(--finished-accent)] hover:border-finished-accent/70 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span
              class="relative z-10 group-hover:drop-shadow-[0_0_8px_currentColor]"
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
        <div class="text-finished-accent w-12 h-12" v-html="discordIcon"></div>
        <p class="text-finished-text/50 text-sm text-center">
          Connect with me on Discord
        </p>
        <div
          class="flex items-center gap-3 px-4 py-3 rounded border border-finished-border bg-finished-text/[0.03]"
        >
          <span class="text-finished-accent font-mono text-sm">{{
            discordUser
          }}</span>
          <button
            type="button"
            class="px-3 py-1 text-xs uppercase tracking-widest border border-finished-accent/40 rounded bg-black/40 text-finished-accent hover:bg-finished-accent/15 hover:border-finished-accent/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-200 active:scale-95"
            @click="copyToClipboard(discordUser)"
          >
            {{ copyState === "copied" ? "✓ Copied" : "Copy" }}
          </button>
        </div>
      </div>

      <!-- Xing Tab -->
      <div
        v-else-if="activeChannel === 'xing'"
        class="flex flex-col items-center justify-center flex-1 gap-4 py-8"
      >
        <div class="text-finished-accent w-12 h-12" v-html="xingIcon"></div>
        <p class="text-finished-text/50 text-sm text-center">
          View my professional profile on Xing
        </p>
        <a
          :href="xingUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Open Xing Profile →
        </a>
      </div>

      <!-- LinkedIn Tab -->
      <div
        v-else-if="activeChannel === 'linkedin'"
        class="flex flex-col items-center justify-center flex-1 gap-4 py-8"
      >
        <div class="text-finished-accent w-12 h-12" v-html="linkedinIcon"></div>
        <p class="text-finished-text/50 text-sm text-center">
          Connect with me on LinkedIn
        </p>
        <a
          :href="linkedinUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Open LinkedIn Profile →
        </a>
      </div>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { SOCIAL_LINKS } from '../../data/portfolio';
import { usePerformanceStore } from '../../stores/usePerformanceStore';
import { envConfig } from '../../utils/env';
import BentoCard from '../shared/BentoCard.vue';

// --- Icons ---
const emailIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
const discordIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;
const xingIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.45 13.224-7.702 13.657.015.024 4.919 9.023 4.919 9.023.17.308.436.66.967.66h3.454c.211 0 .375-.078.463-.22.089-.151.089-.346-.009-.536l-4.879-8.916c-.007-.012 0-.023.007-.034L22.139.756c.095-.191.097-.387.006-.535C22.056.078 21.894 0 21.686 0h-3.498zM5.647 3.424c-.516 0-.743.326-.927.659L0 12.06l3.99 7.214c.17.31.438.66.968.66h3.455c.211 0 .375-.078.463-.22.089-.151.088-.346-.01-.536L4.887 12.18c-.007-.012 0-.024.007-.034L8.61 4.179c.095-.191.097-.387.006-.535-.087-.142-.25-.22-.459-.22H5.647z"/></svg>`;
const linkedinIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

// --- Types ---
type ChannelId = 'email' | 'discord' | 'xing' | 'linkedin';
type FormState = 'idle' | 'submitting' | 'success' | 'error';

// --- State ---
const performance = usePerformanceStore();
const turnstileSiteKey = envConfig.VITE_TURNSTILE_SITE_KEY || '';

const activeChannel = ref<ChannelId>('email');
const formState = ref<FormState>('idle');
const errorMessage = ref('');
const emailError = ref('');
const copyState = ref<'idle' | 'copied'>('idle');
const honeypot = ref('');
const lastSubmitTime = ref<number>(0);

const formData = reactive({
  name: '',
  email: '',
  message: '',
});

const channels: { id: ChannelId; label: string; icon: string }[] = [
  { id: 'email', label: 'Email', icon: emailIcon },
  { id: 'discord', label: 'Discord', icon: discordIcon },
  { id: 'xing', label: 'Xing', icon: xingIcon },
  { id: 'linkedin', label: 'LinkedIn', icon: linkedinIcon },
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
      return 'Transmitting...';
    case 'success':
      return 'Transmission Sent ✓';
    case 'error':
      return 'Retry Transmission';
    default:
      return 'Send Transmission';
  }
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Methods ---
interface TurnstileWindow extends Window {
  turnstile?: {
    render: (selector: string, options: { sitekey: string; theme: string }) => void;
  };
}

const renderTurnstile = () => {
  const win = window as unknown as TurnstileWindow;
  if (win.turnstile) {
    nextTick(() => {
      const container = document.querySelector('.cf-turnstile');
      if (container && !container.querySelector('iframe')) {
        win.turnstile?.render('.cf-turnstile', {
          sitekey: turnstileSiteKey,
          theme: 'dark',
        });
      }
    });
  }
};

const validateEmail = (email: string): boolean => {
  if (!EMAIL_REGEX.test(email)) {
    emailError.value = 'Invalid email format';
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
    errorMessage.value = 'Transmission too short. Minimum 15 characters required.';
    formState.value = 'error';
    return false;
  }

  // A real message usually consists of sentences.
  // We require at least 3 words (2 spaces) to prevent single-string gibberish like "earvwscarevcaevcrw".
  const words = trimmed.split(/\s+/);
  if (words.length < 3) {
    errorMessage.value = 'Transmission rejected. Please use complete sentences.';
    formState.value = 'error';
    return false;
  }

  // Check if any single word is unrealistically long (> 40 chars) and isn't a URL.
  // This catches things like "asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd".
  const hasAbsurdlyLongWord = words.some((w) => w.length > 40 && !w.startsWith('http'));
  if (hasAbsurdlyLongWord) {
    errorMessage.value = 'Transmission rejected. Invalid word length detected.';
    formState.value = 'error';
    return false;
  }

  // Check for Cyrillic characters (common in spam bots, irrelevant for this portfolio)
  if (/[А-Яа-яЁё]/.test(trimmed)) {
    errorMessage.value = 'Transmission rejected. Unsupported character set detected.';
    formState.value = 'error';
    return false;
  }

  // Check for SEO spam (multiple URLs)
  const urlCount = (trimmed.match(/https?:\/\//g) || []).length;
  if (urlCount > 1) {
    errorMessage.value = 'Transmission rejected. Too many links detected.';
    formState.value = 'error';
    return false;
  }

  // Basic keyboard mashing (e.g., "aaaaaa")
  if (/(.)\1{5,}/.test(trimmed)) {
    errorMessage.value = 'Transmission rejected. Anomalous pattern detected.';
    formState.value = 'error';
    return false;
  }

  // Repeating sequences (e.g., "asdasdasd", "qwqwqwqw")
  // We check if ANY sequence of 2 to 5 characters repeats 4 or more times in a row anywhere in the string.
  const noSpaces = trimmed.replace(/\s+/g, '');
  if (/(.{2,5})\1{3,}/.test(noSpaces)) {
    errorMessage.value = 'Transmission rejected. Repeating sequence detected.';
    formState.value = 'error';
    return false;
  }

  // Also check for high ratio of repeating characters (catch "asdsafasdfgdsfg" type mashing)
  // If the string is mostly composed of 4-5 unique characters, it's probably spam.
  const uniqueChars = new Set(noSpaces.split('')).size;
  if (noSpaces.length >= 15 && uniqueChars < 6) {
    errorMessage.value = 'Transmission rejected. Low character variance detected.';
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
    errorMessage.value = 'Please wait 15 seconds before sending another transmission.';
    formState.value = 'error';
    return;
  }

  if (!validateEmail(formData.email)) return;
  if (!validateMessage(formData.message)) return;

  formState.value = 'submitting';
  errorMessage.value = '';

  // Advanced verification: Check if domain actually exists/receives mail
  const isDomainValid = await checkEmailExistence(formData.email);
  if (!isDomainValid) {
    errorMessage.value =
      'The email address is not publicly available. Please use a non-internal email that is publicly available or contact via the other platforms.';
    formState.value = 'error';
    return;
  }

  try {
    const turnstileResponse = (
      document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement
    )?.value;

    if (!turnstileResponse) {
      throw new Error('Please complete the security check.');
    }

    const formspreeId = envConfig.VITE_FORMSPREE_ID;
    if (!formspreeId) {
      throw new Error('Form configuration missing. Please check VITE_FORMSPREE_ID.');
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
    setTimeout(() => {
      copyState.value = 'idle';
    }, 2000);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    copyState.value = 'copied';
    setTimeout(() => {
      copyState.value = 'idle';
    }, 2000);
  }
};

// --- Lifecycle & Watchers ---
onMounted(() => {
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
</style>
