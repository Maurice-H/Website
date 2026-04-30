<template>
  <div class="spotlight-root" :style="rootCssVars">
    <!-- Atmospheric Layers (Base layer) -->
    <PerspectiveGrid />
    <VolumetricBeam />

    <!-- Scrolling Content Layer -->
    <div class="content-stage">
      <slot></slot>
    </div>

    <!-- 
      LIGHT OVERLAY — Two separate layers for performance:
      1. Radial falloff (static, never re-rasterized)
      2. Conic cone (rasterized once, rotated via CSS custom property + GPU transform)
    -->

    <!-- Layer 1: Radial distance falloff — static, no repaints -->
    <div 
      class="light-overlay-radial"
      :style="radialOverlayStyle"
    ></div>

    <!-- Layer 2: Conic cone — rotated via CSS var (zero Vue reactivity) -->
    <div 
      v-if="showConicOverlay"
      class="light-overlay-conic"
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
import type { CSSProperties } from 'vue';
import { computed } from 'vue';
import { useLightingStore } from '../../stores/lighting';
import { useThemeStore } from '../../stores/useThemeStore';
import FlashlightSource from './FlashlightSource.vue';
import PerspectiveGrid from './PerspectiveGrid.vue';
import VolumetricBeam from './VolumetricBeam.vue';

const lighting = useLightingStore();
const themeStore = useThemeStore();

/**
 * CSS custom properties set on root element for child access.
 * --reveal-mask is consumed by FusedReveal and App.vue slotted content.
 * Only changes on phase transition (NAV ↔ CONTENT), not on every mouse move.
 */
const rootCssVars = computed<CSSProperties>(() => {
  if (!themeStore.lightingEnabled) return {};

  const isNav = lighting.phase === 'NAV';

  return {
    '--reveal-mask': isNav
      ? `radial-gradient(ellipse 40% 160% at 50% -10%, black 0%, rgba(0,0,0,0) 100%)`
      : '',
  } as CSSProperties;
});

/**
 * Whether to show the conic overlay element.
 * Only depends on phase and lightingEnabled — NOT on rotation.
 */
const showConicOverlay = computed(() => {
  return themeStore.lightingEnabled && lighting.phase === 'CONTENT';
});

/**
 * Layer 1: Radial distance falloff.
 * This gradient is STATIC — it never changes when the mouse moves.
 * It only changes between NAV ↔ CONTENT phase transitions.
 */
const radialOverlayStyle = computed<CSSProperties>(() => {
  if (!themeStore.lightingEnabled) {
    return { display: 'none' };
  }

  const isNav = lighting.phase === 'NAV';

  if (isNav) {
    // NAV Phase: Spotlight follows the mouse
    return {
      background: `radial-gradient(
        ellipse 30% 50% at 50% 50%, 
        transparent 0%, 
        rgba(0,0,0,0.15) 30%, 
        rgba(0,0,0,0.6) 60%, 
        rgba(0,0,0,0.95) 100%
      )`,
      transform: `translate3d(var(--mouse-x), var(--mouse-y), 0)`,
    };
  }

  // CONTENT phase: dynamic radial distance falloff centered around the mouse cursor
  // The oversized element is 300vw x 300vh, top/left -150vw/vh, so 0,0 translate means
  // its center is at the top left of the screen. We translate it to the mouse coordinates.
  return {
    background: `radial-gradient(
      circle calc(var(--beam-height) * 0.9) at 50% 50%,
      rgba(0,0,0,0.7) 0%,
      rgba(0,0,0,0.4) 15%,
      transparent 30%,
      rgba(0,0,0,0.15) 55%,
      rgba(0,0,0,0.6) 75%,
      rgba(0,0,0,0.95) 100%
    )`,
    transform: `translate3d(var(--mouse-x), var(--mouse-y), 0)`,
  };
});

/*
 * Layer 2: Conic cone shape — ALL handled in CSS.
 * The gradient is static. Rotation uses var(--flashlight-rotation)
 * which is set directly on documentElement by the lighting store.
 * Vue NEVER recomputes anything for this layer during mouse movement.
 * See .light-overlay-conic styles below.
 */
</script>

<style scoped>
.spotlight-root {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: black;
  transition: background-color var(--theme-transition-duration) ease-in-out;
}

.light-overlay-radial {
  position: absolute;
  /* Oversized element to ensure it covers the screen even when translated */
  width: 300vw;
  height: 300vh;
  top: -150vh;
  left: -150vw;
  /* Centered perfectly so (0,0) translation puts its center at the top-left corner of the viewport */
  margin-left: 0;
  margin-top: 0;
  pointer-events: none;
  z-index: 50;
  will-change: transform;
}

/*
 * PERFORMANCE-CRITICAL: Conic cone overlay.
 *
 * The gradient is rendered ONCE (static CSS). Rotation is driven entirely
 * by the --flashlight-rotation CSS custom property, which is set by
 * lighting.updateFlashlightRotation() via document.documentElement.style.
 *
 * This means:
 *   - ZERO Vue reactivity on mouse move (no computed re-evaluations)
 *   - ZERO DOM attribute mutations per frame
 *   - Browser handles the CSS var → transform pipeline natively
 *   - GPU compositing only — no rasterization per frame
 *
 * Offset: +90 (coordinate system) -20 (halfSpread) = +70
 */
.light-overlay-conic {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;
  background: conic-gradient(
    from 0deg at calc(100% - 100px) calc(100% - 130px),
    rgba(0,0,0,0.95) 0deg,
    transparent 3deg,
    transparent 37deg,
    rgba(0,0,0,0.95) 40deg,
    rgba(0,0,0,0.95) 360deg
  );
  transform: rotate(calc((var(--flashlight-rotation, 0) + 70) * 1deg));
  transform-origin: calc(100% - 100px) calc(100% - 130px);
  will-change: transform;
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
