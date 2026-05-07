<template>
  <Transition name="back-to-top">
    <button
      v-if="isVisible"
      type="button"
      class="back-to-top-btn"
      aria-label="Scroll to top"
      @click="scrollToTop"
    >
      <ChevronUpIcon />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import ChevronUpIcon from '../icons/ChevronUpIcon.vue';

const SCROLL_THRESHOLD = 300;
const isVisible = ref(false);
let rafId: number | null = null;

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
.back-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
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
    bottom: 1.25rem;
    right: 1.25rem;
    width: 40px;
    height: 40px;
  }
}
</style>
