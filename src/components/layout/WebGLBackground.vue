<template>
  <div
    class="fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none"
  >
    <TresCanvas v-bind="gl">
      <WebGLScene />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from "three";
import WebGLScene from "./WebGLScene.vue";

// in src/components/layout/WebGLBackground.vue (Zeile 10)
const gl = {
  clearColor: "#000000",
  shadows: false,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};
</script>
