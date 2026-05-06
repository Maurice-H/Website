<template>
  <div class="stacked-card-wrapper perspective-1000">
    <div 
      ref="containerEl"
      class="stacked-card-container relative w-full h-64 transition-transform duration-500 transform-style-3d hover:rotate-y-12"
      @pointermove="handlePointerMove"
      @mouseleave="resetRotation"
    >
      <!-- Background layers for stack effect -->
      <div 
        v-for="i in 3" 
        :key="i"
        class="absolute inset-0 rounded-2xl border border-finished-text/10 bg-finished-text/5 backdrop-blur-md transition-transform transition-opacity duration-300 pointer-events-none"
        :style="getStackLayerStyle(i)"
      ></div>
      
      <!-- Main Content Card -->
      <BentoCard 
        id="stacked-main" 
        class="absolute inset-0 z-10 !bg-finished-text/10 !backdrop-blur-xl border border-finished-text/20 shadow-2xl"
      >
        <slot></slot>
      </BentoCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import BentoCard from './BentoCard.vue';

const containerEl = ref<HTMLElement | null>(null);
let rafId: number | null = null;

// Use plain variables outside the closure so RAF reads the latest values
let currentClientX = 0;
let currentClientY = 0;

const handlePointerMove = (e: PointerEvent) => {
  // ⚡ Bolt: Cache coordinates and bypass Vue reactivity for high-frequency updates
  currentClientX = e.clientX;
  currentClientY = e.clientY;
  const target = e.currentTarget as HTMLElement;

  if (rafId === null) {
    rafId = requestAnimationFrame(() => {
      if (containerEl.value) {
        const rect = target.getBoundingClientRect();
        const x = (currentClientX - rect.left) / rect.width - 0.5;
        const y = (currentClientY - rect.top) / rect.height - 0.5;
        containerEl.value.style.transform = `rotateX(${-y * 20}deg) rotateY(${x * 20}deg)`;
      }
      rafId = null;
    });
  }
};

const resetRotation = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (containerEl.value) {
    containerEl.value.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }
};

onBeforeUnmount(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
});

const getStackLayerStyle = (index: number) => {
  return {
    transform: `translateZ(${-index * 20}px) translateY(${index * 10}px) scale(${1 - index * 0.05})`,
    opacity: 1 - index * 0.2,
    zIndex: -index,
  };
};
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}
</style>
