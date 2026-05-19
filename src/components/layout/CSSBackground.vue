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
        <div v-if="isLightingEnabled" class="ufo-glow" />
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
      <div class="drone-x">
        <div class="drone-y">
          <div class="drone-scale">
            <div class="drone-rotate">
              <div class="drone-body">
                <div v-if="isLightingEnabled" class="drone-pulse" />
                <div class="drone-base" />
                <div class="drone-core" />
                <div class="drone-ring" />
                <template v-if="isLightingEnabled">
                  <div
                  v-for="n in 8"
                  
                  :key="n"
                  class="drone-light"
                  :style="{ '--dot-angle': n * 45 + 'deg', animationDelay: n * 0.2 + 's' }"
                />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ambient particles -->
    <div class="css-particles">
      <span
        v-for="i in 12"
        :key="i"
        class="particle"
        :style="particleStyle(i)"
      />
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
const isLightingEnabled = computed(() => themeStore.lightingEnabled);
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
  top: 16%;
  left: 50%;
  transform: translateX(-50%) translateY(-300px) scale(0.6);
  opacity: 0;
  /* EXIT transition: fast beam-up into orbit */
  transition:
    opacity 0.3s ease-in,
    transform 0.5s cubic-bezier(0.55, 0, 1, 0.45);
  perspective: 600px;
  will-change: transform, opacity;
}

.css-ufo.ufo-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1.25);
  /* ENTRY transition: slow graceful descent */
  transition:
    opacity 1.2s ease-out,
    transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.ufo-body {
  position: relative;
  width: 120px;
  height: 70px;
  transform-style: preserve-3d;
  animation: ufo-hover 3s ease-in-out infinite;
  will-change: transform;
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
  will-change: transform, opacity;
}

.ufo-glow {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 650px;
  height: 700px;
  background: radial-gradient(
    ellipse at top,
    var(--ufo-accent-glow, rgba(16, 185, 129, 0.4)) 0%,
    transparent 80%
  );
  clip-path: polygon(
    calc(50% - 25px) 0%,
    calc(50% + 25px) 0%,
    100% 100%,
    0% 100%
  );
  animation: ufo-beam 3s ease-in-out infinite;
  will-change: opacity;
}

.css-ufo {
  --ufo-accent: #10b981;
  --ufo-accent-glow: rgba(16, 185, 129, 0.6);
}

/* Blueprint mode overrides */
.css-ufo.ufo-blueprint {
  --ufo-accent: #38bdf8;
  --ufo-accent-glow: rgba(56, 189, 248, 0.6);
}

@keyframes ufo-hover {
  0%,
  100% {
    transform: translateY(0) rotateX(2deg);
  }
  50% {
    transform: translateY(-12px) rotateX(-2deg);
  }
}

@keyframes ufo-ring-pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: translateX(-50%) scaleX(1);
  }
  50% {
    opacity: 0.8;
    transform: translateX(-50%) scaleX(1.05);
  }
}

@keyframes ufo-beam {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}

/* ─── DRONE ──────────────────────────────────────── */

.css-drone {
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  transition: opacity 0.8s ease;
  will-change: opacity;
}

.css-drone.drone-visible {
  opacity: 1;
}

.drone-x {
  animation: drone-move-x 29s ease-in-out infinite;
  will-change: transform;
}

.drone-y {
  animation: drone-move-y 37s ease-in-out infinite;
  will-change: transform;
}

.drone-scale {
  animation: drone-scale-anim 19s ease-in-out infinite;
  will-change: transform;
}

.drone-rotate {
  /* Using a much slower rotation so it feels like it's drifting/scanning */
  animation: drone-spin 43s ease-in-out infinite;
  will-change: transform;
}

.drone-body {
  position: relative;
  width: 40px;
  height: 40px;
  animation: drone-hover 5s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes drone-move-x {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(35vw);
  }
  40% {
    transform: translateX(-25vw);
  }
  60% {
    transform: translateX(15vw);
  }
  80% {
    transform: translateX(-30vw);
  }
}

@keyframes drone-move-y {
  0%,
  100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-30vh);
  }
  50% {
    transform: translateY(25vh);
  }
  75% {
    transform: translateY(-20vh);
  }
}

@keyframes drone-scale-anim {
  0%,
  100% {
    transform: scale(1);
  }
  33% {
    transform: scale(1.15);
  }
  66% {
    transform: scale(0.85);
  }
}

@keyframes drone-spin {
  0%,
  100% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(120deg);
  }
  35% {
    transform: rotate(-45deg);
  }
  55% {
    transform: rotate(210deg);
  }
  75% {
    transform: rotate(-135deg);
  }
  85% {
    transform: rotate(45deg);
  }
}

@keyframes drone-hover {
  0% {
    transform: translate(0, -6px);
  }
  50% {
    transform: translate(3px, 0);
  }
  100% {
    transform: translate(-2px, 6px);
  }
}

.drone-base {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(30, 30, 30, 0.95) 0%,
    rgba(10, 10, 10, 0.98) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.drone-core {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(200, 230, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  box-shadow:
    0 0 6px rgba(0, 0, 0, 0.2),
    inset 0 3px 6px rgba(255, 255, 255, 0.6),
    inset 0 -1px 3px rgba(255, 255, 255, 0.15);
}

.drone-core::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow: 0 0 18px var(--drone-accent-glow, rgba(16, 185, 129, 0.3));
  animation: drone-core-glow 4s ease-in-out infinite alternate;
  will-change: opacity;
}

@keyframes drone-core-glow {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

.drone-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--drone-accent, #10b981);
  opacity: 0.6;
  animation: drone-ring-spin 4s linear infinite;
  will-change: transform;
}

.drone-light {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  margin: -2px 0 0 -2px;
  transform: rotate(var(--dot-angle, 0deg)) translateX(18px);
  background: radial-gradient(
    circle at 30% 30%,
    #fff 0%,
    var(--drone-accent, #10b981) 50%,
    rgba(10, 50, 30, 0.8) 100%
  );
  box-shadow:
    0 0 6px var(--drone-accent, #10b981),
    inset 0 1px 1px rgba(255, 255, 255, 0.8);
  animation: drone-status-blink 1.5s ease-in-out infinite alternate;
  z-index: 5;
  will-change: opacity;
}

@keyframes drone-status-blink {
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.drone-pulse {
  position: absolute;
  inset: -60px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--drone-accent-glow, rgba(16, 185, 129, 0.3)) 0%,
    rgba(16, 185, 129, 0.08) 40%,
    transparent 70%
  );
  animation: drone-pulse-anim 3s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: -1;
  will-change: transform, opacity;
}

.css-drone {
  --drone-accent: #10b981;
  --drone-accent-glow: rgba(16, 185, 129, 0.6);
}

/* Blueprint mode overrides */
.css-drone.drone-blueprint {
  --drone-accent: #38bdf8;
  --drone-accent-glow: rgba(56, 189, 248, 0.6);
}

@keyframes drone-ring-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes drone-pulse-anim {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.15);
  }
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
  animation: particle-float var(--p-duration) var(--p-delay) ease-in-out
    infinite;
  will-change: transform, opacity;
}

@keyframes particle-float {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.15;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.35;
  }
}
</style>
