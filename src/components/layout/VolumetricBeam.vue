<template>
  <div
    v-if="lighting.phase === 'CONTENT' && themeStore.lightingEnabled"
    class="volumetric-beam fixed pointer-events-none z-[90]"
  >
    <!-- Primary light cone — uses clip-path polygon for triangle shape -->
    <div class="beam-cone"></div>

    <!-- Source point glow — small element, negligible cost -->
    <div class="beam-source-glow"></div>
  </div>
</template>

<script setup lang="ts">
import { useLightingStore } from '../../stores/lighting';
import { useThemeStore } from '../../stores/useThemeStore';

const lighting = useLightingStore();
const themeStore = useThemeStore();

/*
 * PERFORMANCE: All rotation is handled via CSS var(--flashlight-rotation).
 * No Vue computed depends on flashlightRotation — zero recomputes per frame.
 *
 * The beam container rotates via:
 *   transform: rotate(calc((var(--flashlight-rotation) - 90) * 1deg))
 * Set in the scoped <style> block below.
 */
</script>

<style scoped>
/*
 * PERFORMANCE-CRITICAL: Rotation driven by CSS custom property.
 * --flashlight-rotation is set on documentElement by the lighting store.
 * Offset: -90 (beam points upward from source).
 */
.volumetric-beam {
  right: 100px;
  bottom: 110px;
  transform: rotate(calc((var(--flashlight-rotation, 0) - 90) * 1deg));
  transform-origin: 0px 20px;
  transition: transform 0.1s linear;
  mix-blend-mode: screen;
  will-change: transform;
}

.beam-cone {
  /* Vertical color fade: bright at source → transparent at far end */
  background: linear-gradient(to bottom, 
    var(--finished-accent) 0%, 
    rgba(16, 185, 129, 0.35) 40%,
    rgba(16, 185, 129, 0.08) 70%,
    transparent 100%);
  
  /* Use a composite mask for a soft, realistic beam shape */
  mask-image: 
    /* Soft-edged cone shape */
    conic-gradient(from 150deg at 50% 0%, transparent 0deg, black 10deg, black 50deg, transparent 60deg),
    /* Smooth distance falloff with a rounded end */
    radial-gradient(ellipse 80% 100% at 50% 0%, black 0%, black 40%, transparent 100%);
  -webkit-mask-image: 
    conic-gradient(from 150deg at 50% 0%, transparent 0deg, black 10deg, black 50deg, transparent 60deg),
    radial-gradient(ellipse 80% 100% at 50% 0%, black 0%, black 40%, transparent 100%);
  mask-composite: intersect;
  -webkit-mask-composite: source-in;

  width: var(--beam-width);
  height: var(--beam-height);
  /* Shift top by 36px so when rotated 180deg, the tip is exactly 16px above the origin (at the lens) */
  top: 36px;
  /* Center the top exactly at the origin (0px) */
  margin-left: calc(var(--beam-width) / -2);
  opacity: 0.85;
  position: absolute;
}

.beam-source-glow {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--accent-bright) 0%,
    var(--finished-accent) 25%,
    transparent 65%
  );
  opacity: 0.9;
}
</style>
