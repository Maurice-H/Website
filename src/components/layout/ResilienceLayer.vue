<template>
  <div
    v-if="isVisible"
    class="resilience-layer"
    :class="`phase-${lighting.phase.toLowerCase()}`"
  >
    <!-- NAV Beam: Static gradient, no repaint on mouse move -->
    <div 
      v-if="lighting.phase === LightingPhase.NAV" 
      class="beam-layer" 
      :style="navStyle"
    ></div>

    <!-- CONTENT Custom Cursor: Small div moved via transform (compositor-optimized) -->
    <div 
      v-else-if="!isMobile" 
      ref="cursorEl"
      class="cursor-glow" 
      :style="baseCursorStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useLightingStore } from '@/stores/lighting';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useViewportStore } from '@/stores/viewport';
import { LightingPhase } from '@/types';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

const lighting = useLightingStore();
const performance = usePerformanceStore();
const themeStore = useThemeStore();
const viewportStore = useViewportStore();

const cursorEl = ref<HTMLElement | null>(null);

// Plain JS variables to avoid Vue reactivity overhead on high-frequency events
let rawMouseX = viewportStore.rawMouse.x;
let rawMouseY = viewportStore.rawMouse.y;
let rafId: number | null = null;

const updatePosition = () => {
  if (rafId === null) {
    rafId = requestAnimationFrame(() => {
      if (cursorEl.value) {
        cursorEl.value.style.transform = `translate(${rawMouseX - 50}px, ${rawMouseY - 50}px)`;
      }
      rafId = null;
    });
  }
};

const onPointerMove = (e: PointerEvent) => {
  rawMouseX = e.clientX;
  rawMouseY = e.clientY;
  updatePosition();
};

onMounted(() => {
  // Sync with current mouse position if available
  rawMouseX = viewportStore.rawMouse.x;
  rawMouseY = viewportStore.rawMouse.y;
  updatePosition();
  window.addEventListener('pointermove', onPointerMove, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove);
});

const isVisible = computed(() => {
  return !performance.isWebGLSupported && themeStore.lightingEnabled;
});

// Watch for visibility changes to sync position when the layer becomes active
// (e.g., when the user toggles lighting while the mouse is stationary)
watch(isVisible, (visible) => {
  if (visible) {
    rawMouseX = viewportStore.rawMouse.x;
    rawMouseY = viewportStore.rawMouse.y;
    // Wait for next tick to ensure cursorEl is in the DOM
    nextTick(() => {
      updatePosition();
    });
  }
});

// Watch for phase transitions to sync cursor when switching to CONTENT
watch(
  () => lighting.phase,
  (newPhase) => {
    if (newPhase === LightingPhase.CONTENT && isVisible.value) {
      rawMouseX = viewportStore.rawMouse.x;
      rawMouseY = viewportStore.rawMouse.y;
      nextTick(() => {
        updatePosition();
      });
    }
  }
);

const getAccentColor = (opacity: number) => {
  return themeStore.isBlueprintMode
    ? `rgba(56, 189, 248, ${opacity})`
    : `rgba(16, 185, 129, ${opacity})`;
};

const navStyle = computed(() => {
  const color = getAccentColor(0.3);
  const transparent = getAccentColor(0);
  return {
    background: `radial-gradient(ellipse 60% 120% at 50% -10%, ${color} 0%, ${transparent} 85%)`,
  };
});

const baseCursorStyle = computed(() => {
  const color = getAccentColor(0.8);
  const transparent = getAccentColor(0);
  return {
    background: `radial-gradient(circle 40px at center, ${color} 0%, ${transparent} 100%)`,
  };
});
</script>

<style scoped>
.resilience-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  /* Reduced use of mix-blend-mode on the root to save software rendering resources */
  transition: opacity 0.5s ease-in-out;
}

.beam-layer {
  position: absolute;
  inset: 0;
  mix-blend-mode: screen;
}

.cursor-glow {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 0;
  left: 0;
  border-radius: 50%;
  mix-blend-mode: screen;
  /* will-change signals the browser to promote this to a separate layer */
  will-change: transform;
}

/* Subtle pulse for the fallback cursor to make it feel alive */
.phase-content .cursor-glow {
  animation: cursor-pulse 2s infinite ease-in-out;
}

@keyframes cursor-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
</style>
