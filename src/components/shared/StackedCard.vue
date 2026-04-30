<template>
  <div class="stacked-card-wrapper perspective-1000">
    <div 
      class="stacked-card-container relative w-full h-64 transition-transform duration-500 transform-style-3d hover:rotate-y-12"
      @mousemove="handleMouseMove"
      @mouseleave="resetRotation"
      :style="containerStyle"
    >
      <!-- Background layers for stack effect -->
      <div 
        v-for="i in 3" 
        :key="i"
        class="absolute inset-0 rounded-2xl border border-finished-text/10 bg-finished-text/5 backdrop-blur-md transition-all duration-300 pointer-events-none"
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
import { computed, ref } from 'vue';
import BentoCard from './BentoCard.vue';

const rotation = ref({ x: 0, y: 0 });

const handleMouseMove = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  rotation.value = { x: -y * 20, y: x * 20 };
};

const resetRotation = () => {
  rotation.value = { x: 0, y: 0 };
};

const containerStyle = computed(() => ({
  transform: `rotateX(${rotation.value.x}deg) rotateY(${rotation.value.y}deg)`,
}));

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
