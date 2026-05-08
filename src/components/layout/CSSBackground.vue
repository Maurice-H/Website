<template>
  <div class="css-background" :class="{ 'phase-content': isContentPhase }">
    <!-- CSS UFO (NAV phase) -->
    <div
      class="css-ufo"
      :class="{
        'ufo-visible': isNavPhase,
        'ufo-blueprint': isBlueprintMode,
      }"
    >
      <div class="ufo-body">
        <div class="ufo-dome" />
        <div class="ufo-hull" />
        <div class="ufo-ring" />
        <div class="ufo-glow" />
      </div>
    </div>

    <!-- CSS Drone (CONTENT phase) -->
    <div
      class="css-drone"
      :class="{
        'drone-visible': isContentPhase,
        'drone-blueprint': isBlueprintMode,
      }"
    >
      <div class="drone-body">
        <div class="drone-core" />
        <div class="drone-ring" />
        <div class="drone-pulse" />
      </div>
    </div>

    <!-- Ambient particles -->
    <div class="css-particles">
      <span v-for="i in 12" :key="i" class="particle" :style="particleStyle(i)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type CSSProperties, computed } from 'vue';
import { useLightingStore } from '@/stores/lighting';
import { useThemeStore } from '@/stores/useThemeStore';
import { LightingPhase } from '@/types';

const lightingStore = useLightingStore();
const themeStore = useThemeStore();

const isNavPhase = computed(() => lightingStore.phase === LightingPhase.NAV);
const isContentPhase = computed(() => lightingStore.phase === LightingPhase.CONTENT);
const isBlueprintMode = computed(() => themeStore.isBlueprintMode);

/**
 * Generate deterministic-but-varied inline styles for ambient particles.
 * Avoids randomness so the DOM is stable across re-renders.
 */
const particleStyle = (index: number): CSSProperties => {
  const delay = (index * 1.3) % 6;
  const duration = 4 + (index % 4);
  const left = (index * 8.3) % 100;
  const top = (index * 7.1) % 100;
  const size = 2 + (index % 3);

  return {
    '--p-delay': `${delay}s`,
    '--p-duration': `${duration}s`,
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
  } as CSSProperties;
};
</script>

<style scoped>
.css-background {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 50;
}

/* ─── UFO ────────────────────────────────────────── */

.css-ufo {
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.8s ease;
  perspective: 600px;
}

.css-ufo.ufo-visible {
  opacity: 1;
}

.ufo-body {
  position: relative;
  width: 120px;
  height: 70px;
  transform-style: preserve-3d;
  animation: ufo-hover 3s ease-in-out infinite;
}

.ufo-dome {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 28px;
  border-radius: 48px 48px 0 0;
  background: linear-gradient(
    180deg,
    rgba(200, 200, 200, 0.3) 0%,
    rgba(100, 100, 100, 0.5) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ufo-hull {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    rgba(80, 80, 80, 0.8) 0%,
    rgba(40, 40, 40, 0.9) 100%
  );
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.4),
    inset 0 -2px 6px rgba(0, 0, 0, 0.3);
}

.ufo-ring {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 8px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid var(--ufo-accent, #10b981);
  opacity: 0.7;
  animation: ufo-ring-pulse 2s ease-in-out infinite;
}

.ufo-glow {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 120px;
  background: radial-gradient(
    ellipse at top,
    var(--ufo-accent-glow, rgba(16, 185, 129, 0.15)) 0%,
    transparent 70%
  );
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
  animation: ufo-beam 3s ease-in-out infinite;
}

/* Blueprint mode overrides */
.css-ufo.ufo-blueprint {
  --ufo-accent: #38bdf8;
  --ufo-accent-glow: rgba(56, 189, 248, 0.12);
}

.css-ufo.ufo-blueprint .ufo-hull {
  background: transparent;
  border: 1px dashed rgba(56, 189, 248, 0.4);
  box-shadow: none;
}

.css-ufo.ufo-blueprint .ufo-dome {
  background: transparent;
  border: 1px dashed rgba(56, 189, 248, 0.3);
}

@keyframes ufo-hover {
  0%, 100% { transform: translateY(0) rotateX(2deg); }
  50% { transform: translateY(-12px) rotateX(-2deg); }
}

@keyframes ufo-ring-pulse {
  0%, 100% { opacity: 0.4; transform: translateX(-50%) scaleX(1); }
  50% { opacity: 0.8; transform: translateX(-50%) scaleX(1.05); }
}

@keyframes ufo-beam {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* ─── DRONE ──────────────────────────────────────── */

.css-drone {
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.css-drone.drone-visible {
  opacity: 1;
}

.drone-body {
  position: relative;
  width: 40px;
  height: 40px;
  animation: drone-orbit 12s linear infinite;
}

.drone-core {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(80, 80, 80, 0.9) 0%,
    rgba(50, 50, 50, 0.95) 100%
  );
  box-shadow:
    0 0 10px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
}

.drone-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--drone-accent, #10b981);
  opacity: 0.6;
  animation: drone-ring-spin 4s linear infinite;
}

.drone-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--drone-accent-glow, rgba(16, 185, 129, 0.2)) 0%,
    transparent 70%
  );
  animation: drone-pulse-anim 2s ease-in-out infinite;
}

/* Blueprint mode overrides */
.css-drone.drone-blueprint {
  --drone-accent: #38bdf8;
  --drone-accent-glow: rgba(56, 189, 248, 0.15);
}

.css-drone.drone-blueprint .drone-core {
  background: transparent;
  border: 1px dashed rgba(56, 189, 248, 0.4);
  box-shadow: none;
}

@keyframes drone-orbit {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) translateX(180px) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) translateX(180px) rotate(-360deg);
  }
}

@keyframes drone-ring-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes drone-pulse-anim {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.15); }
}

/* ─── AMBIENT PARTICLES ──────────────────────────── */

.css-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(248, 250, 252, 0.15);
  animation: particle-float var(--p-duration) var(--p-delay) ease-in-out infinite;
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.15;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.35;
  }
}
</style>
