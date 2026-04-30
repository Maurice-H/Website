<template>
  <div
    v-if="lighting.phase === 'CONTENT' && themeStore.lightingEnabled"
    class="volumetric-beam fixed pointer-events-none z-[90]"
    :style="beamContainerStyle"
  >
    <!-- Primary light cone -->
    <div class="beam-cone" :style="beamInnerStyle"></div>

    <!-- Dust particles layer -->
    <div class="beam-particles"></div>

    <!-- Secondary atmospheric haze near source -->
    <div class="beam-haze"></div>

    <!-- Source point glow -->
    <div class="beam-source-glow"></div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed } from 'vue';

import { useLightingStore } from '../../stores/lighting';
import { useThemeStore } from '../../stores/useThemeStore';

const lighting = useLightingStore();
const themeStore = useThemeStore();

const beamContainerStyle = computed<CSSProperties>(() => {
  return {
    right: '100px',
    bottom: '110px',
    /* 
      Flashlight is +90. We use -90 to rotate an extra 180 degrees 
      so the downward-drawn beam points exactly in the same upward direction!
    */
    transform: `rotate(${lighting.flashlightRotation - 90}deg)`,
    transformOrigin: '0px 20px', // Anchor to the exact same rotation point as the flashlight
    transition: 'transform 0.1s linear',
  };
});

const beamInnerStyle = computed<CSSProperties>(() => {
  return {
    background: `linear-gradient(to bottom, 
      var(--finished-accent) 0%, 
      rgba(16, 185, 129, 0.4) 40%,
      transparent 100%)`,
    clipPath: 'polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)',
    width: 'var(--beam-width)',
    height: 'var(--beam-height)',
    /* Shift top by 36px so when rotated 180deg, the tip is exactly 16px above the origin (at the lens) */
    top: '36px',
    /* Center the top of the polygon (50% mark) exactly at the origin (0px) */
    marginLeft: 'calc(var(--beam-width) / -2)',
    filter: 'blur(50px)',
    opacity: '0.85',
    position: 'absolute',
  };
});
</script>

<style scoped>
.volumetric-beam {
  mix-blend-mode: screen; /* Changed from color-dodge for better visibility on black */
}

.beam-haze {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: min(400px, 80vw);
  height: var(--beam-height);
  border-radius: 50%;
  background: conic-gradient(
    from 45deg at bottom,
    var(--accent-bright) 0%,
    var(--finished-accent) 35%,
    transparent 100%
  );
  filter: blur(250px);
  opacity: 1;
}

.beam-source-glow {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(
    circle,
    var(--accent-bright) 0%,
    var(--finished-accent) 30%,
    transparent 70%
  );
  filter: blur(15px);
  opacity: 0.8;
}

.beam-particles {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: min(800px, 100vw);
  height: var(--beam-height);
  background-image:
    radial-gradient(
      1.5px 1.5px at 20px 30px,
      rgba(255, 255, 255, 0.9),
      transparent
    ),
    radial-gradient(
      1.2px 1.2px at 150px 150px,
      var(--finished-accent),
      transparent
    ),
    radial-gradient(
      1.8px 1.8px at 280px 340px,
      rgba(255, 255, 255, 0.7),
      transparent
    ),
    radial-gradient(
      1.2px 1.2px at 450px 520px,
      rgba(255, 255, 255, 0.5),
      transparent
    ),
    radial-gradient(
      1.5px 1.5px at 80px 740px,
      var(--finished-accent),
      transparent
    ),
    radial-gradient(
      1.2px 1.2px at 320px 850px,
      rgba(255, 255, 255, 0.6),
      transparent
    );
  background-size: 600px 800px;
  opacity: 0.35;
  animation: particles-float 25s linear infinite;
  mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  filter: blur(1px);
}

@keyframes particles-float {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 60px 800px;
  }
}
</style>
