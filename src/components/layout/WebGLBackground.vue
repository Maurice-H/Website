<template>
  <div
    v-if="performance.isReady && performance.isWebGLSupported"
    class="fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none"
  >
    <TresCanvas v-bind="glConfig">
      <WebGLScene />
    </TresCanvas>
  </div>
  <CSSBackground v-else-if="performance.isReady" />
</template>

<script setup lang="ts">
import { usePerformanceStore } from '@stores/usePerformanceStore';
import { TresCanvas } from '@tresjs/core';
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three';
import { computed } from 'vue';
import CSSBackground from './CSSBackground.vue';
import WebGLScene from './WebGLScene.vue';

const performance = usePerformanceStore();

/**
 * Dynamic WebGL Configuration based on GPU Tiering.
 * Tier 2 (Optimized): Lower pixel ratio, no antialiasing, default power.
 * Tier 3 (High-End): Full pixel ratio, antialiasing, high-performance power.
 */
const glConfig = computed(() => {
  const tier = performance.gpuTier || 2;

  return {
    clearColor: '#000000',
    shadows: false,
    alpha: false,
    shadowMapType: BasicShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: NoToneMapping,
    // Antialiasing is expensive; only enable for high-end hardware.
    antialias: tier >= 3,
    // Limit resolution on mid-range devices to maintain frame stability.
    pixelRatio:
      tier < 3 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2),
    // Signal the browser to prefer the discrete GPU on Tier 3.
    powerPreference: (tier >= 3 ? 'high-performance' : 'default') as
      | 'high-performance'
      | 'low-power'
      | 'default',
  };
});
</script>
