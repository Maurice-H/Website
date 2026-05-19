<template>
  <div class="turnstile-wrapper mb-2">
    <div
      ref="turnstileContainer"
      class="cf-turnstile"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useResponsive } from '@/composables/useResponsive';
import type { TurnstileWindow } from '@/types/contact';
import { envConfig } from '@/utils/env';

const emit = defineEmits<{
  (e: 'verify', token: string): void;
  (e: 'error'): void;
  (e: 'timeout'): void;
}>();

const turnstileSiteKey = envConfig.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
const { isMobile } = useResponsive();

const turnstileContainer = ref<HTMLElement | null>(null);
const widgetId = ref<string | null>(null);

let turnstileRetryCount = 0;
let isRendering = false;
const MAX_TURNSTILE_RETRIES = 10;

const renderTurnstile = () => {
  if (isRendering) return;

  const win = window as TurnstileWindow;
  if (!win.turnstile) {
    if (turnstileRetryCount < MAX_TURNSTILE_RETRIES) {
      turnstileRetryCount++;
      setTimeout(renderTurnstile, 500);
    }
    return;
  }
  turnstileRetryCount = 0;
  isRendering = true;

  nextTick(() => {
    const container = turnstileContainer.value;
    if (!container) {
      isRendering = false;
      return;
    }

    if (widgetId.value && win.turnstile) {
      try {
        win.turnstile.remove(widgetId.value);
      } catch {
        // Safe to ignore
      }
      widgetId.value = null;
    }

    container.innerHTML = '';

    widgetId.value =
      win.turnstile?.render(container, {
        sitekey: turnstileSiteKey,
        theme: 'dark',
        size: isMobile.value ? 'compact' : 'normal',
        callback: (token: string) => {
          emit('verify', token);
        },
        'error-callback': () => {
          emit('error');
          isRendering = false;
          setTimeout(renderTurnstile, 1000);
        },
        'timeout-callback': () => {
          emit('timeout');
          isRendering = false;
          renderTurnstile();
        },
      }) || null;

    isRendering = false;
  });
};

onMounted(() => {
  renderTurnstile();
});

onUnmounted(() => {
  const win = window as TurnstileWindow;
  if (widgetId.value && win.turnstile) {
    try {
      win.turnstile.remove(widgetId.value);
    } catch {
      // Ignore
    }
  }
});

watch(isMobile, () => {
  renderTurnstile();
});
</script>

<style scoped>
.turnstile-wrapper {
  min-height: v-bind('isMobile ? "120px" : "65px"');
}
</style>
