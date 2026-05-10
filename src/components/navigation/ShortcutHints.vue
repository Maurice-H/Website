<template>
  <Transition name="hint-fade">
    <div v-if="visible" class="shortcut-hints">
      <div class="hint-row">
        <kbd>L</kbd>
        <span>Lighting</span>
      </div>
      <div class="hint-row">
        <kbd>T</kbd>
        <span>Theme</span>
      </div>
      <div class="hint-row">
        <kbd>ESC</kbd>
        <span>Back</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const DISMISS_KEY = 'shortcut-hints-seen';
const SHOW_DELAY_MS = 2000;
const VISIBLE_DURATION_MS = 6000;

const visible = ref(false);
let showTimeout: ReturnType<typeof setTimeout>;
let hideTimeout: ReturnType<typeof setTimeout>;

const dismiss = () => {
  visible.value = false;
  try {
    sessionStorage.setItem(DISMISS_KEY, '1');
  } catch {
    /* storage unavailable */
  }
};

onMounted(() => {
  // Only show once per session
  try {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
  } catch {
    /* storage unavailable */
  }

  showTimeout = setTimeout(() => {
    visible.value = true;
    hideTimeout = setTimeout(dismiss, VISIBLE_DURATION_MS);
  }, SHOW_DELAY_MS);
});

onUnmounted(() => {
  clearTimeout(showTimeout);
  clearTimeout(hideTimeout);
});
</script>

<style scoped>
.shortcut-hints {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  gap: 16px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  pointer-events: none;
}

.hint-row {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.hint-row kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--finished-accent, #10b981);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.hint-row span {
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.35);
}

/* Transition */
.hint-fade-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.hint-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.hint-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
.hint-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}
</style>
