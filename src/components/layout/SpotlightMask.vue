<template>
  <div class="spotlight-root">
    <!-- Fused Content Stage -->
    <div 
      class="content-stage"
      :style="maskStyle"
    >
      <slot></slot>
    </div>

    <!-- Flash Overlay for Transitions -->
    <div 
      class="flash-overlay" 
      :class="{ 'flash-active': state.isFlashActive }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLightingEngine } from '../../composables/useLightingEngine';
import { LightingPhase } from '../../types/index';

const { state } = useLightingEngine();

// biome-ignore lint/correctness/noUnusedVariables: template-use
const maskStyle = computed(() => {
  if (state.phase === LightingPhase.NAV) {
    // Smoother cone starting from inside the lamp fixture (slightly offset upward)
    const navMask = `radial-gradient(ellipse 35% 150% at 50% -10%, black 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.4) 50%, transparent 100%)`;
    return {
      '--reveal-mask': navMask,
    };
  }

  // Phase 2: radial spotlight following the mouse
  // Gradient center at 50% 50% — consumers offset maskPosition by -50vw/-50vh
  // to compensate, so the circle center aligns with the mouse cursor.
  const size = 'var(--spotlight-size)';

  return {
    '--reveal-mask': `radial-gradient(circle ${size} at 50% 50%, black 0%, rgba(0,0,0,0.4) 50%, transparent 100%)`,
  };
});
</script>

<style scoped>
.spotlight-root {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.content-stage {
  position: absolute;
  inset: 0;
  overflow-y: scroll;
  scrollbar-gutter: stable;
}
</style>
