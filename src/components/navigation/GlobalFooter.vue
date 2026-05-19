<template>
  <!-- Keyboard Shortcut Display -->
  <div class="shortcut-bar">
    <div class="shortcut-items">
      <div
        v-for="action in shortcutActions"
        :key="action"
        role="button"
        tabindex="0"
        class="shortcut-item focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        :class="{
          'shortcut-item--rebinding': shortcutStore.rebindingAction === action,
        }"
        @click.stop="handleShortcutClick(action)"
        @keydown.enter.stop="handleShortcutClick(action)"
        @keydown.space.prevent.stop="handleShortcutClick(action)"
      >
        <kbd>{{
          shortcutStore.rebindingAction === action
            ? "..."
            : shortcutStore.getDisplay(action)
        }}</kbd>
        <span>{{ shortcutStore.getLabel(action) }}</span>
      </div>
    </div>
    <button
      v-if="!isMobile"
      type="button"
      class="shortcut-edit-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      :title="shortcutStore.rebindingAction ? 'Cancel rebind' : 'Edit shortcuts'"
      :aria-label="shortcutStore.rebindingAction ? 'Cancel rebind' : 'Edit shortcuts'"
      :aria-pressed="!!shortcutStore.rebindingAction"
      :class="{ 'shortcut-edit-btn--active': shortcutStore.rebindingAction }"
      @click.stop="
        shortcutStore.rebindingAction
          ? shortcutStore.cancelRebind()
          : shortcutStore.startRebind('lighting')
      "
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
    <button
      v-if="!isMobile"
      type="button"
      class="shortcut-reset-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      title="Reset all shortcuts"
      aria-label="Reset all shortcuts"
      @click.stop="shortcutStore.resetAll()"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    </button>
    <LocaleSwitcher />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LocaleSwitcher from '@/components/shared/LocaleSwitcher.vue';
import { useAudio } from '@/composables/useAudio';
import { useResponsive } from '@/composables/useResponsive';
import { type ShortcutAction, useShortcutStore } from '@/stores/useShortcutStore';
import { useThemeStore } from '@/stores/useThemeStore';

const shortcutStore = useShortcutStore();
const themeStore = useThemeStore();
const { playClick, playGlitch } = useAudio();
const { isMobile } = useResponsive();

const shortcutActions = computed<ShortcutAction[]>(() =>
  isMobile.value ? ['lighting', 'theme'] : ['lighting', 'theme', 'back']
);

const handleShortcutClick = (action: ShortcutAction) => {
  if (isMobile.value) {
    if (action === 'lighting') {
      themeStore.toggleLighting();
      playClick();
    } else if (action === 'theme') {
      themeStore.toggleTheme();
      playGlitch();
    }
  } else {
    shortcutStore.startRebind(action);
  }
};
</script>

<style scoped>
/* ---- Shortcut Bar ---- */
.shortcut-bar {
  position: absolute;
  bottom: max(48px, calc(env(safe-area-inset-bottom, 0px) + 32px));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 70;
  padding: 6px 10px;
  border: 1px solid color-mix(in srgb, var(--finished-accent) 20%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--finished-accent) 4%, transparent);
  backdrop-filter: blur(8px);
}

.shortcut-items {
  display: flex;
  gap: 12px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  opacity: 0.55;
}

.shortcut-item:hover {
  opacity: 0.7;
}

.shortcut-item--rebinding {
  opacity: 1;
}

.shortcut-item--rebinding kbd {
  border-color: var(--finished-accent);
  color: var(--finished-accent);
  animation: rebind-pulse 0.8s ease-in-out infinite;
}

.shortcut-item kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--finished-accent);
  background: color-mix(in srgb, var(--finished-accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--finished-accent) 25%, transparent);
  border-radius: 3px;
  box-shadow: 0 0 8px color-mix(in srgb, var(--finished-accent) 8%, transparent);
  transition: all 0.2s ease;
}

.shortcut-item span {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.45);
}

.shortcut-edit-btn,
.shortcut-reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: color-mix(in srgb, var(--finished-accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--finished-accent) 20%, transparent);
  border-radius: 3px;
  color: var(--finished-accent);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.shortcut-edit-btn:hover,
.shortcut-reset-btn:hover {
  opacity: 1;
  color: var(--finished-accent);
  border-color: color-mix(in srgb, var(--finished-accent) 40%, transparent);
  background: color-mix(in srgb, var(--finished-accent) 15%, transparent);
}

.shortcut-edit-btn--active {
  opacity: 1;
  color: var(--finished-accent);
  border-color: var(--finished-accent);
}

@keyframes rebind-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@media (min-width: 769px) {
  .shortcut-bar {
    bottom: 40px;
  }

  .shortcut-items {
    gap: 16px;
  }

  .shortcut-item kbd {
    font-size: 0.75rem;
    min-width: 22px;
    height: 22px;
  }

  .shortcut-item span {
    font-size: 0.75rem;
  }
}
</style>
