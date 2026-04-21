<template>
  <div 
    ref="cardRef"
    class="bento-card relative rounded-2xl p-6 transition-all duration-700 overflow-hidden flex flex-col min-w-0 w-full h-full"
    :class="[colSpanClass, rowSpanClass]"
  >
    <!-- Blueprint Border (Dashed) -->
    <div class="absolute inset-0 border border-dashed border-white/5 rounded-2xl pointer-events-none z-0"></div>
    
    <!-- Finished Border (Fused Overlay) -->
    <div 
      class="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 rounded-[inherit] opacity-80"
      :style="borderOverlayStyle"
    ></div>
    
    <!-- Content Slot Wrapper -->
    <div class="relative z-20 flex-1 flex flex-col w-full h-full">
       <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useViewportStore } from '../../composables/useViewportStore';

const props = defineProps<{
  id: string; // Required for centralized tracking
  colSpan?: number;
  rowSpan?: number;
}>();

const cardRef = ref<HTMLElement | null>(null);
const { register, getOffsets } = useViewportStore();
let unregisterFn: (() => void) | null = null;

const offsets = computed(() => getOffsets(props.id));

// biome-ignore lint/correctness/noUnusedVariables: template-use
const borderOverlayStyle = computed(() => {
  const { left, top } = offsets.value;
  return {
    maskImage: 'var(--reveal-mask)',
    WebkitMaskImage: 'var(--reveal-mask)',
    maskSize: '100vw 100vh',
    WebkitMaskSize: '100vw 100vh',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: `calc(var(--mask-x) - ${left}px - 50vw) calc(var(--mask-y) - ${top}px - 50vh)`,
    WebkitMaskPosition: `calc(var(--mask-x) - ${left}px - 50vw) calc(var(--mask-y) - ${top}px - 50vh)`,
    border: '1px solid var(--finished-border)',
    boxShadow: 'inset 0 0 20px var(--finished-glow)',
  };
});

// Grid classes
// biome-ignore lint/correctness/noUnusedVariables: template-use
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

// biome-ignore lint/correctness/noUnusedVariables: template-use
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
    const { unregister } = register(props.id, cardRef.value);
    unregisterFn = unregister;
  }
});

onUnmounted(() => {
  unregisterFn?.();
});
</script>

<style scoped>
.bento-card {
  background: rgba(255, 255, 255, 0.01);
}
</style>
