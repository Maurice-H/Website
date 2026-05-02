<template>
  <div 
    ref="cardRef"
    class="bento-card relative rounded-2xl p-6 overflow-hidden flex flex-col min-w-0 w-full h-full group"
    :class="[colSpanClass, rowSpanClass]"
  >
    <!-- Background Layer (Base) -->
    <div class="absolute inset-0 bg-finished-bg/40 z-[-1]"></div>
    
    <!-- Blueprint Layer (Dashed) -->
    <div class="absolute inset-0 border border-dashed border-blueprint-border rounded-2xl pointer-events-none z-0"></div>
    
    <!-- Glass/Finished Layer (Revealed via Mask) -->
    <div 
      class="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 rounded-[inherit] glass-reveal"
      :style="revealStyle"
    >
      <div class="noise-overlay"></div>
      <div class="absolute inset-0 bg-[var(--glass-reflection)] z-0 opacity-40"></div>
      
      <!-- 4-Layer Technical Stack for 3D Illusion -->
      <div class="bento-card-stack-layer layer-1"></div>
      <div class="bento-card-stack-layer layer-2"></div>
      <div class="bento-card-stack-layer layer-3"></div>
    </div>
    
    <!-- Content Slot Wrapper -->
    <div class="relative z-20 flex-1 flex flex-col w-full h-full">
       <WindowFrame v-if="withWindow" :title="title">
         <slot></slot>
       </WindowFrame>
       <slot v-else></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useViewportStore } from '../../stores/viewport';
import WindowFrame from './WindowFrame.vue';

interface Props {
  id?: string;
  colSpan?: number;
  rowSpan?: number;
  withWindow?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  colSpan: 1,
  rowSpan: 1,
  withWindow: false,
  title: '',
});

const cardRef = ref<HTMLElement | null>(null);
const viewport = useViewportStore();
let unregisterFn: (() => void) | null = null;

const revealStyle = computed(() => {
  return {
    opacity: 1, // Full opacity for the content, global mask will handle the reveal
  };
});

// Grid classes
const colSpanClass = computed(() => {
  switch (props.colSpan) {
    case 2:
      return 'md:col-span-2';
    case 3:
      return 'md:col-span-2 lg:col-span-3';
    case 4:
      return 'md:col-span-2 lg:col-span-4';
    default:
      return 'col-span-1';
  }
});

const rowSpanClass = computed(() => {
  switch (props.rowSpan) {
    case 2:
      return 'row-span-2';
    case 3:
      return 'row-span-3';
    case 4:
      return 'row-span-4';
    default:
      return 'row-span-1';
  }
});

onMounted(() => {
  if (cardRef.value) {
    const reg = viewport.register(props.id, cardRef.value);
    unregisterFn = reg.unregister;
  }
});

onUnmounted(() => {
  unregisterFn?.();
});
</script>

<style scoped>
.bento-card {
  background: black;
  border: 1px solid var(--finished-border);
  backdrop-filter: blur(10px);
  box-shadow: var(--finished-glow);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  will-change: transform;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.glass-reveal {
  background: black;
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
}

/* Layered Wireframe Stack Effect (High-Fidelity Mockup) */
.bento-card-stack-layer {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid var(--finished-border);
  border-radius: inherit;
  pointer-events: none;
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: -1;
  background: transparent;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}

/* 
  Mockup shows multiple outlines below and left:
  translate(-X, +Y) means Left and Down 
*/
.layer-1 {
  transform: translate(-8px, 8px);
  opacity: 0.8;
}

.layer-2 {
  transform: translate(-16px, 16px);
  opacity: 0.5;
}

.layer-3 {
  transform: translate(-24px, 24px);
  opacity: 0.25;
}

.bento-card:hover .layer-1 {
  transform: translate(-10px, 10px);
  border-color: var(--finished-accent);
}

.bento-card:hover .layer-2 {
  transform: translate(-20px, 20px);
  border-color: var(--finished-accent);
}

.bento-card:hover .layer-3 {
  transform: translate(-30px, 30px);
  border-color: var(--finished-accent);
}

.bento-card:hover {
  border-color: var(--finished-accent);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    var(--finished-glow);
}
</style>
