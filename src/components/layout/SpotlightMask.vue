<template>
  <div class="spotlight-root">
    <!-- Atmospheric Layers (Base layer) -->
    <PerspectiveGrid />
    <VolumetricBeam />

    <!-- Scrolling Content Layer -->
    <div class="content-stage">
      <slot></slot>
    </div>

    <!-- 
      UNIFIED LIGHT OVERLAY:
      Uses a conic gradient to simulate a true flashlight beam originating
      from the bottom right source.
    -->
    <div 
      class="light-overlay"
      :style="overlayStyle"
    ></div>

    <!-- Light Source (Always on top) -->
    <FlashlightSource />

    <!-- Flash Overlay for Transitions -->
    <div 
      class="flash-overlay" 
      :class="{ 'flash-active': lighting.isFlashActive }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLightingStore } from '../../stores/lighting';
// biome-ignore lint/correctness/noUnusedImports: template use
import FlashlightSource from './FlashlightSource.vue';
// biome-ignore lint/correctness/noUnusedImports: template use
import PerspectiveGrid from './PerspectiveGrid.vue';
// biome-ignore lint/correctness/noUnusedImports: template use
import VolumetricBeam from './VolumetricBeam.vue';

const lighting = useLightingStore();

// biome-ignore lint/correctness/noUnusedVariables: template use
const overlayStyle = computed(() => {
  const isNav = lighting.phase === 'NAV';

  // NAV phase: Static overhead lamp — softer, wider illumination
  const navGradient = `radial-gradient(
    ellipse 50% 180% at 50% -10%, 
    transparent 0%, 
    rgba(0,0,0,0.15) 35%, 
    rgba(0,0,0,0.6) 65%, 
    rgba(0,0,0,0.9) 100%
  )`;

  // CONTENT phase: Conic cone + radial falloff
  // The cone angle and origin must match the flashlight source position
  const originX = 'calc(100% - 100px)';
  const originY = 'calc(100% - 130px)';
  const halfSpread = 20; // degrees from center of beam
  const fromAngle = lighting.flashlightRotation + 90 - halfSpread;

  // Layer 1 (TOP): Radial distance falloff — bell-curve shape
  // Dark near source → bright sweet spot at mid-range → dark at far edges
  const radialFalloff = `radial-gradient(
    circle 1400px at ${originX} ${originY},
    rgba(0,0,0,0.7) 0%,
    rgba(0,0,0,0.4) 15%,
    transparent 30%,
    rgba(0,0,0,0.15) 55%,
    rgba(0,0,0,0.6) 75%,
    rgba(0,0,0,0.95) 100%
  )`;

  // Layer 2 (BOTTOM): Conic cone shape — dark outside, transparent inside
  const conicCone = `conic-gradient(
    from ${fromAngle}deg at ${originX} ${originY},
    rgba(0,0,0,0.95) 0deg,
    transparent 3deg,
    transparent ${halfSpread * 2 - 3}deg,
    rgba(0,0,0,0.95) ${halfSpread * 2}deg,
    rgba(0,0,0,0.95) 360deg
  )`;

  // Multiple backgrounds: radial on top for falloff, conic below for cone shape
  const contentGradient = `${radialFalloff}, ${conicCone}`;

  return {
    '--reveal-mask': isNav
      ? `radial-gradient(ellipse 40% 160% at 50% -10%, black 0%, rgba(0,0,0,0) 100%)`
      : '',
    background: isNav ? navGradient : contentGradient,
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
  background: var(--finished-bg);
  transition: background-color var(--theme-transition-duration) ease-in-out;
}

.light-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50; /* Above content to darken it */
}

.content-stage {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
}

.flash-overlay {
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  pointer-events: none;
  z-index: 999;
  transition: opacity 0.3s ease-out;
}
.flash-active {
  opacity: 0.1;
  transition: opacity 0.05s ease-in;
}
</style>
