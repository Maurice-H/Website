<template>
  <div class="floating-actions-wrapper">
    <!-- Mobile Toggles -->
    <div v-if="isMobile" class="mobile-toggles">
      <button class="mobile-toggle-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black" aria-label="Toggle Theme" @click="handleTheme">
        <kbd>T</kbd>
      </button>
      <button class="mobile-toggle-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black" aria-label="Toggle Lighting" @click="handleLighting">
        <kbd>L</kbd>
      </button>
    </div>
  <Transition name="back-to-top">
    <button
      v-if="isVisible"
      type="button"
      class="back-to-top-btn"
      data-testid="back-to-top"
      aria-label="Scroll to top"
      @click="scrollToTop"
    >
      <ChevronUpIcon />
    </button>
  </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import ChevronUpIcon from '@/components/icons/ChevronUpIcon.vue';
import { useAudio } from '@/composables/useAudio';
import { useResponsive } from '@/composables/useResponsive';
import { useThemeStore } from '@/stores/useThemeStore';

const themeStore = useThemeStore();
const { playClick, playGlitch } = useAudio();

const SCROLL_THRESHOLD = 300;
const isVisible = ref(false);
let rafId: number | null = null;
const { isMobile } = useResponsive();

const handleTheme = () => {
  themeStore.toggleTheme();
  playGlitch();
};

const handleLighting = () => {
  themeStore.toggleLighting();
  playClick();
};

const handleScroll = () => {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    const scrollContainer = document.querySelector('.content-stage');
    isVisible.value = (scrollContainer?.scrollTop ?? 0) > SCROLL_THRESHOLD;
    rafId = null;
  });
};

const scrollToTop = () => {
  const scrollContainer = document.querySelector('.content-stage');
  scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  const scrollContainer = document.querySelector('.content-stage');
  scrollContainer?.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  const scrollContainer = document.querySelector('.content-stage');
  scrollContainer?.removeEventListener('scroll', handleScroll);
  if (rafId !== null) cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.floating-actions-wrapper {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: none; /* Let clicks pass through empty space */
}

.floating-actions-wrapper > * {
  pointer-events: auto; /* Re-enable clicks on children */
}

@media (max-width: 768px) {
  .floating-actions-wrapper {
    bottom: max(1.25rem, calc(env(safe-area-inset-bottom) + 0.5rem));
    right: 1.25rem;
    gap: 8px;
  }
}

.mobile-toggles {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--finished-accent) 20%, transparent);
  background: color-mix(in srgb, var(--finished-accent) 5%, rgba(0,0,0,0.6));
  backdrop-filter: blur(12px);
  color: var(--finished-accent);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-toggle-btn kbd {
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.8rem;
  font-weight: 700;
}

.mobile-toggle-btn:active {
  transform: scale(0.95);
  background: color-mix(in srgb, var(--finished-accent) 15%, rgba(0,0,0,0.6));
}

.back-to-top-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--finished-accent, rgba(16, 185, 129, 0.4));
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  color: var(--finished-accent, #10b981);
  cursor: pointer;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.2s ease;
}

.back-to-top-btn:hover {
  background: rgba(16, 185, 129, 0.15);
  border-color: var(--finished-accent, #10b981);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}

.back-to-top-btn:active {
  transform: scale(0.95);
}

.back-to-top-btn:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--finished-accent, #10b981),
    0 0 0 4px rgba(0, 0, 0, 1);
}

/* Transition classes */
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

@media (max-width: 768px) {
  .back-to-top-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
