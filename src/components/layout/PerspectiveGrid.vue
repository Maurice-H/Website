<template>
  <div v-if="themeStore.lightingEnabled" class="perspective-grid-container fixed inset-0 pointer-events-none z-[-1]" :style="containerStyle">
    <div 
      class="perspective-grid w-[200vw] h-[200vh] -left-[50vw] -top-[50vh]"
      :style="gridStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLightingStore } from '../../stores/lighting';
import { useThemeStore } from '../../stores/useThemeStore';

const lighting = useLightingStore();
const themeStore = useThemeStore();

const containerStyle = computed(() => {
  const isNav = lighting.phase === 'NAV';
  const maskSize = isNav ? '70% 90%' : '60% 60%';

  const flashlightMask = isNav
    ? 'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)'
    : `radial-gradient(ellipse ${maskSize} at 50% 50%, rgba(0,0,0,1) 0%, transparent 80%)`;

  const horizonMask = `linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)`;

  // The container is 100vw x 100vh (inset-0). The mask is at 50% 50% (50vw, 50vh).
  // We offset the mask position to follow the mouse:
  const maskPos = isNav
    ? '0px -20vh, 0px 0px'
    : 'calc(var(--mouse-x) - 50vw) calc(var(--mouse-y) - 50vh), 0px 0px';

  return {
    maskImage: `${flashlightMask}, ${horizonMask}`,
    WebkitMaskImage: `${flashlightMask}, ${horizonMask}`,
    maskPosition: maskPos,
    WebkitMaskPosition: maskPos,
    maskRepeat: 'no-repeat, no-repeat',
    WebkitMaskRepeat: 'no-repeat, no-repeat',
    maskComposite: 'source-in',
    WebkitMaskComposite: 'source-in',
    transition: 'opacity 1s ease-in-out',
  };
});

const gridStyle = computed(() => {
  const isNav = lighting.phase === 'NAV';

  return {
    background: `
      linear-gradient(rgba(16, 185, 129, 0.25) 0.5px, transparent 0.5px),
      linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0.5px, transparent 0.5px)
    `,
    backgroundSize: '50px 50px',
    transform: 'perspective(1200px) rotateX(70deg) translateY(-100px)',
    opacity: isNav ? 0.6 : 0.7,
    transition: 'opacity 1s ease-in-out',
  };
});
</script>

<style scoped>
.perspective-grid-container {
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, var(--finished-bg) 0%, #000 100%);
  /* Ensures masks stay sharp */
  will-change: mask-position, -webkit-mask-position;
}

.perspective-grid {
  position: absolute;
}
</style>
