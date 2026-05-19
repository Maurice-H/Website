<template>
  <BentoCard
    id="contact-form"
    class="md:col-span-4 md:row-span-1 flex flex-col"
    with-window
    :title="$t('contact.title')"
    :is-low-end="performance.isLowEnd"
    @hover-change="(pos) => { if (lightingStore) lightingStore.focusedElementPos = pos }"
  >
    <div class="p-4 md:p-10 flex flex-col h-full">
      <p
        class="text-finished-text/50 text-xs md:text-sm mb-4 md:mb-6 font-mono tracking-wide transition-colors duration-[var(--theme-transition-duration)]"
      >
        {{ $t('contact.subtitle') }}
      </p>

      <!-- Channel Tab Switcher -->
      <div
        class="flex flex-col md:flex-row gap-1 mb-6"
        role="tablist"
        aria-label="Contact channels"
      >
        <button
          v-for="channel in channels"
          :key="channel.id"
          type="button"
          role="tab"
          :id="`tab-${channel.id}`"
          :aria-controls="`panel-${channel.id}`"
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
      <div
        v-if="activeChannel === 'email'"
        id="panel-email"
        role="tabpanel"
        aria-labelledby="tab-email"
        class="flex flex-col flex-1"
      >
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

          <!-- Cloudflare Turnstile Widget -->
          <TurnstileWidget
            @verify="setTurnstileToken"
            @error="setTurnstileToken('')"
            @timeout="setTurnstileToken('')"
          />

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
        id="panel-discord"
        role="tabpanel"
        aria-labelledby="tab-discord"
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
        id="panel-xing"
        role="tabpanel"
        aria-labelledby="tab-xing"
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
        id="panel-linkedin"
        role="tabpanel"
        aria-labelledby="tab-linkedin"
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import TurnstileWidget from '@/components/features/TurnstileWidget.vue';
import DiscordIcon from '@/components/icons/DiscordIcon.vue';
import EmailIcon from '@/components/icons/EmailIcon.vue';
import LinkedinIcon from '@/components/icons/LinkedinIcon.vue';
import XingIcon from '@/components/icons/XingIcon.vue';
import BentoCard from '@/components/shared/BentoCard.vue';
import { useContactForm } from '@/composables/useContactForm';
import { useToast } from '@/composables/useToast';
import { SOCIAL_LINKS } from '@/data/portfolio';
import { useLightingStore } from '@/stores/lighting';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import type { ContactChannelId } from '@/types/contact';

// --- State ---
const lightingStore = useLightingStore();
const performance = usePerformanceStore();
const { show: showToast } = useToast();
const { t } = useI18n();

const activeChannel = ref<ContactChannelId>('email');
const copyState = ref<'idle' | 'copied' | 'error'>('idle');

const { formState, errorMessage, emailError, honeypot, formData, setTurnstileToken, submit } =
  useContactForm();

const channels: {
  id: ContactChannelId;
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

const handleSubmit = async () => {
  await submit();
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
