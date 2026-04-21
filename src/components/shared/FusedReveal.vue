<template>
  <div ref="containerRef" class="fused-reveal-container relative w-full h-full">
    <!-- Layer 1: Blueprint (Base) -->
    <div class="fused-layer-blueprint contents">
      <slot name="blueprint"></slot>
      <slot v-if="!$slots.blueprint"></slot>
    </div>

    <!-- Layer 2: Finished (Revealed) -->
    <div 
      class="fused-layer-finished absolute inset-0 pointer-events-none select-none overflow-hidden"
      :style="finalMaskStyle"
    >
      <div class="contents">
        <slot name="finished"></slot>
        <slot v-if="!$slots.finished"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useViewportStore } from "../../composables/useViewportStore";

const props = defineProps<{
	id: string;
}>();

const containerRef = ref<HTMLElement | null>(null);
const { register, getOffsets } = useViewportStore();
let unregisterFn: (() => void) | null = null;

const offsets = computed(() => getOffsets(props.id));

// Viewport-synchronized mask: gradient center is at 50% 50% of a 100vw×100vh mask.
// We offset by -50vw/-50vh so the gradient center aligns with the mouse cursor,
// then subtract the component's viewport position to map coordinates correctly.
const finalMaskStyle = computed(() => {
	const { left, top } = offsets.value;
	return {
		maskImage: "var(--reveal-mask)",
		WebkitMaskImage: "var(--reveal-mask)",
		maskSize: "100vw 100vh",
		WebkitMaskSize: "100vw 100vh",
		maskRepeat: "no-repeat",
		WebkitMaskRepeat: "no-repeat",
		maskPosition: `calc(var(--mask-x) - ${left}px - 50vw) calc(var(--mask-y) - ${top}px - 50vh)`,
		WebkitMaskPosition: `calc(var(--mask-x) - ${left}px - 50vw) calc(var(--mask-y) - ${top}px - 50vh)`,
	};
});

onMounted(() => {
	if (containerRef.value) {
		const { unregister } = register(props.id, containerRef.value);
		unregisterFn = unregister;
	}
});

onUnmounted(() => {
	unregisterFn?.();
});
</script>

<style scoped>
.fused-reveal-container {
  /* Ensure children can be positioned relative to this */
}

/* We use 'contents' to ensure that if the user passes a grid item, 
   it doesn't break the layout by adding an extra wrapper div. */
.contents {
  display: contents;
}
</style>
