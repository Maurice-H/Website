<template>
  <TresPerspectiveCamera :position="[0, 0, 5]" :look-at="[0, 0, 0]" />

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

  <!-- UFO -->
  <TresMesh ref="ufoRef" :position="[0, 1.6, 0]" :scale="[0.3, 0.3, 0.3]">
    <TresCylinderGeometry :args="[1.2, 1.5, 0.4, 64]" />
    <TresMeshStandardMaterial
      color="#333333"
      :metalness="0.8"
      :roughness="0.2"
    />
    <TresMesh :position="[0, -0.2, 0]" :rotation="[Math.PI / 2, 0, 0]">
      <TresTorusGeometry :args="[1.4, 0.05, 16, 64]" />
      <TresMeshBasicMaterial :color="accentColorStr" />
    </TresMesh>
  </TresMesh>

  <!-- Companion Drone (Content Phase) -->
  <TresMesh ref="droneRef" :position="[0, 0, 2]" :scale="[0.15, 0.15, 0.15]">
    <TresSphereGeometry :args="[1, 32, 32]" />
    <TresMeshStandardMaterial
      color="#333333"
      :metalness="0.8"
      :roughness="0.2"
    />
    <TresMesh :rotation="[Math.PI / 2, 0, 0]">
      <TresTorusGeometry :args="[1.5, 0.1, 16, 64]" />
      <TresMeshBasicMaterial :color="accentColorStr" />
    </TresMesh>
  </TresMesh>
  <TresDirectionalLight :position="[5, 10, 5]" :intensity="2" />
  <TresAmbientLight :intensity="0.5" />
</template>

<script setup lang="ts">
import { useLoop, useTresContext } from '@tresjs/core';
import { Color, Vector2, type WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { computed, shallowRef, watch, watchEffect } from 'vue';
import fragmentShader from '../../shaders/main.frag.glsl?raw';
import vertexShader from '../../shaders/main.vert.glsl?raw';
import { useLightingStore } from '../../stores/lighting';
import { useThemeStore } from '../../stores/useThemeStore';
import { useViewportStore } from '../../stores/viewport';
import { projectToScreenSpace } from '../../utils/webgl';

const shaderMaterialRef = shallowRef();
const dustRef = shallowRef();
const ufoRef = shallowRef();
const droneRef = shallowRef();
const viewportStore = useViewportStore();
const themeStore = useThemeStore();
const lightingStore = useLightingStore();

const accentColorStr = computed(() => (themeStore.isBlueprintMode ? '#38bdf8' : '#10b981'));

// Post-Processing State
const { renderer, scene, camera, sizes } = useTresContext();
let composer: EffectComposer | null = null;
let rgbShiftPass: ShaderPass | null = null;
let glitchPass: GlitchPass | null = null;

watchEffect(() => {
  const activeRenderer = renderer.instance;
  const activeCamera = camera.activeCamera.value;

  if (activeRenderer && scene.value && activeCamera && !composer) {
    composer = new EffectComposer(activeRenderer as unknown as WebGLRenderer);

    // 1. Base Scene Pass
    const renderPass = new RenderPass(scene.value, activeCamera);
    composer.addPass(renderPass);

    // 2. Cinematic Bloom Pass
    // A subtle glow focused on the flashlight core and dust motes.
    const bloomPass = new UnrealBloomPass(
      new Vector2(sizes.width.value, sizes.height.value),
      0.15, // strength
      0.5, // radius
      0.9 // threshold (only bright things bloom)
    );
    composer.addPass(bloomPass);

    // 3. Velocity-based Chromatic Aberration
    rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms.amount.value = 0.0;
    composer.addPass(rgbShiftPass);

    // 4. Theme Toggle Glitch Pass
    glitchPass = new GlitchPass();
    glitchPass.enabled = false;
    glitchPass.goWild = false;
    composer.addPass(glitchPass);
  }
});

// Resize Handler for Composer
watch([() => sizes.width.value, () => sizes.height.value], ([w, h]) => {
  if (composer) composer.setSize(w, h);
});

// Theme Glitch Trigger
let glitchTimeout: ReturnType<typeof setTimeout>;
watch(
  () => themeStore.isBlueprintMode,
  () => {
    if (glitchPass) {
      glitchPass.enabled = true;
      clearTimeout(glitchTimeout);
      glitchTimeout = setTimeout(() => {
        if (glitchPass) glitchPass.enabled = false;
      }, 350); // 350ms cinematic glitch transition
    }
  }
);

// Generate Indoor Room Dust Particles (fewer, subtle)
const particleCount = 400;
const dustPositions = new Float32Array(particleCount * 3);
// We also want some varying speeds or offsets for a more organic float,
// but we'll keep it simple: just position them around the camera.
for (let i = 0; i < particleCount * 3; i++) {
  // Spread from -3 to 3 to keep them closer and more visible
  dustPositions[i] = (Math.random() - 0.5) * 6;
}

const uniforms = {
  uMouse: { value: new Vector2(window.innerWidth / 2, window.innerHeight / 2) },
  uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
  uTime: { value: 0 },
  uThemeState: { value: 0.0 },
  uLightingEnabled: { value: true },
  uPhase: { value: 0.0 }, // 0.0 = NAV, 1.0 = CONTENT
  uAccentColor: { value: [0.063, 0.725, 0.506] },
  uUfoPosition: { value: new Vector2(0.5, 0.85) },
};

/**
 * useLoop MUST be called inside a child of <TresCanvas> (TresJS v4+ requirement).
 * onBeforeRender runs every frame — we push raw mouse coordinates,
 * theme/phase state directly into shader uniforms, bypassing Vue reactivity.
 */
const { onBeforeRender, render } = useLoop();

// Override the default TresJS render loop to use our Post-Processing composer
render(() => {
  if (composer) {
    composer.render();
  }
});

let lastMouse = new Vector2(viewportStore.rawMouse.x, viewportStore.rawMouse.y);

onBeforeRender(({ elapsed, delta }) => {
  if (ufoRef.value && camera.activeCamera.value) {
    ufoRef.value.visible = lightingStore.phase === 'NAV';
    ufoRef.value.position.y = 1.6 + Math.sin(elapsed * 2) * 0.1;

    // PROJECT 3D TO 2D: Track the UFO for the shader's tractor beam
    const screenPos = projectToScreenSpace(ufoRef.value.position, camera.activeCamera.value);

    if (shaderMaterialRef.value) {
      shaderMaterialRef.value.uniforms.uUfoPosition.value.copy(screenPos);
    }
  }

  if (droneRef.value) {
    droneRef.value.visible = lightingStore.phase === 'CONTENT';

    // Autopilot: Die Drohne fliegt eine unendliche, sanfte Acht (Lissajous-Figur) im Hintergrund
    if (droneRef.value.visible) {
      // Fliegt von links nach rechts (und zurück) über die gesamte Breite
      droneRef.value.position.x = Math.sin(elapsed * 0.4) * 5;
      // Schwebt leicht auf und ab
      droneRef.value.position.y = Math.cos(elapsed * 0.3) * 2;
      // Fliegt leicht auf dich zu und wieder weg (Tiefe)
      droneRef.value.position.z = -4 + Math.sin(elapsed * 0.6) * 2;

      // Der kleine Ring um die Drohne dreht sich
      droneRef.value.rotation.x = elapsed * 0.5;
      droneRef.value.rotation.y = elapsed * 0.8;
    }
  }

  if (dustRef.value) {
    // Slow, weightless drift rotation
    dustRef.value.rotation.y += 0.05 * delta;
    dustRef.value.rotation.x += 0.02 * delta;
  }

  // Velocity tracking for RGB Shift Chromatic Aberration
  const currentMouse = new Vector2(viewportStore.rawMouse.x, viewportStore.rawMouse.y);
  const distance = currentMouse.distanceTo(lastMouse);
  lastMouse.copy(currentMouse);

  if (rgbShiftPass) {
    // Calculate target amount based on velocity per frame
    const targetAmount = Math.min(distance * 0.00005, 0.005);
    // Smoothly lerp towards the target
    rgbShiftPass.uniforms.amount.value += (targetAmount - rgbShiftPass.uniforms.amount.value) * 0.1;
  }

  if (!shaderMaterialRef.value) return;

  const u = shaderMaterialRef.value.uniforms;
  u.uTime.value = elapsed;
  u.uMouse.value.set(viewportStore.rawMouse.x, viewportStore.rawMouse.y);
  u.uResolution.value.set(window.innerWidth, window.innerHeight);
  u.uThemeState.value = themeStore.isBlueprintMode ? 1.0 : 0.0;
  u.uLightingEnabled.value = themeStore.lightingEnabled;
  u.uPhase.value = lightingStore.phase === 'CONTENT' ? 1.0 : 0.0;

  // Update accent color
  const accentColor = new Color(accentColorStr.value);
  u.uAccentColor.value = [accentColor.r, accentColor.g, accentColor.b];
});
</script>
