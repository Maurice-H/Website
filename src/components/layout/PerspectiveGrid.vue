<template>
  <div class="perspective-grid-container fixed inset-0 pointer-events-none z-[-1]">
    <div 
      class="perspective-grid w-[200vw] h-[200vh] -left-[50vw] -top-[50vw]"
      :style="gridStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLightingStore } from '../../stores/lighting';

const lighting = useLightingStore();

// biome-ignore lint/correctness/noUnusedVariables: template use
const gridStyle = computed(() => {
  const isNav = lighting.phase === 'NAV';

  // Grid is visible in BOTH phases — NAV centered below lamp, CONTENT following flashlight
  const maskCenter = isNav
    ? '50% 30%' // Centered under the lamp
    : 'var(--mask-x) var(--mask-y)'; // Following flashlight

  const maskSize = isNav ? '70% 90%' : '60% 60%';

  // Combine radial mask (flashlight) with linear mask (horizon fade)
  // Relaxed mask for NAV phase to ensure background visibility
  const flashlightMask = isNav
    ? 'radial-gradient(circle at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)'
    : `radial-gradient(ellipse ${maskSize} at ${maskCenter}, rgba(0,0,0,1) 0%, transparent 80%)`;

  const horizonMask = `linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)`;

  return {
    background: `
      linear-gradient(rgba(16, 185, 129, 0.25) 0.5px, transparent 0.5px),
      linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0.5px, transparent 0.5px)
    `,
    backgroundSize: '50px 50px',
    transform: 'perspective(1200px) rotateX(70deg) translateY(-100px)',
    opacity: isNav ? 0.6 : 0.7,
    maskImage: `${flashlightMask}, ${horizonMask}`,
    WebkitMaskImage: `${flashlightMask}, ${horizonMask}`,
    maskComposite: 'source-in',
    WebkitMaskComposite: 'source-in',
    transition: 'opacity 1s ease-in-out, mask-image 0.3s ease-out',
  };
});
</script>

<style scoped>
.perspective-grid-container {
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, var(--finished-bg) 0%, #000 100%);
}

.perspective-grid {
  position: absolute;
}
</style>
