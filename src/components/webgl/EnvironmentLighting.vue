<template>
  <!-- Background Plane Shader -->
  <TresMesh :render-order="-1">
    <TresPlaneGeometry :args="[2, 2]" />
    <TresShaderMaterial
      ref="shaderMaterialRef"
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
      :uniforms="uniforms"
      :depth-write="false"
      :depth-test="false"
    />
  </TresMesh>

  <!-- Indoor Dust Motes -->
  <TresPoints ref="dustRef">
    <TresBufferGeometry :position="[dustPositions, 3]" />
    <TresPointsMaterial
      color="#f8fafc"
      :size="0.02"
      :transparent="true"
      :opacity="0.25"
      :size-attenuation="true"
      :depth-write="false"
    />
  </TresPoints>

  <TresDirectionalLight :position="[5, 10, 5]" :intensity="2" />
  <TresAmbientLight :intensity="0.5" />
</template>

<script setup lang="ts">
import { Vector2 } from 'three';
import { shallowRef } from 'vue';
import fragmentShader from '@/shaders/main.frag.glsl?raw';
import vertexShader from '@/shaders/main.vert.glsl?raw';

const props = defineProps<{
  particleCount: number;
}>();

const shaderMaterialRef = shallowRef();
const dustRef = shallowRef();

const uniforms = {
  uMouse: {
    value: new Vector2(
      typeof window !== 'undefined' ? window.innerWidth / 2 : 600,
      typeof window !== 'undefined' ? window.innerHeight / 2 : 400
    ),
  },
  uResolution: {
    value: new Vector2(
      typeof window !== 'undefined' ? window.innerWidth : 1200,
      typeof window !== 'undefined' ? window.innerHeight : 800
    ),
  },
  uTime: { value: 0 },
  uThemeState: { value: 0.0 },
  uLightingEnabled: { value: true },
  uPhase: { value: 0.0 },
  uIsMobile: { value: false },
  uAccentColor: { value: [0.063, 0.725, 0.506] },
  uUfoPosition: { value: new Vector2(0.5, 0.85) },
};

// ── Dust Particles ──
const dustPositions = new Float32Array(props.particleCount * 3);
for (let i = 0; i < props.particleCount * 3; i++) {
  dustPositions[i] = (Math.random() - 0.5) * 6;
}

defineExpose({
  shaderMaterialRef,
  dustRef,
  uniforms,
});
</script>
