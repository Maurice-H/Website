<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        data-testid="toast-item"
        :class="[`toast-item--${toast.type}`]"
        role="alert"
      >
        <span class="toast-icon">{{ iconMap[toast.type] }}</span>
        <span class="toast-message">{{ $t(toast.message) }}</span>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts } = useToast();

const iconMap: Record<string, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.03em;
  pointer-events: auto;
  backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--finished-accent) 25%, transparent);
  background: color-mix(in srgb, var(--finished-bg, #020205) 85%, transparent);
  color: var(--finished-text, #fff);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.toast-item--success {
  border-color: color-mix(in srgb, var(--finished-accent) 40%, transparent);
}

.toast-item--error {
  border-color: rgba(255, 80, 80, 0.4);
}

.toast-item--info {
  border-color: rgba(100, 180, 255, 0.3);
}

.toast-icon {
  font-size: 0.85rem;
  color: var(--finished-accent);
}

.toast-item--error .toast-icon {
  color: rgb(255, 80, 80);
}

.toast-item--info .toast-icon {
  color: rgb(100, 180, 255);
}

.toast-message {
  opacity: 0.85;
}

/* Transitions */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
