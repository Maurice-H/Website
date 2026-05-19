<template>
  <TresPerspectiveCamera :position="[0, 0, 5]" :look-at="[0, 0, 0]" />

  <EnvironmentLighting ref="envRef" :particle-count="particleCount" />

  <UfoEntity
    ref="ufoEntity"
    :accent-color="accentColorStr"
    :visible="lightingStore.phase === 'NAV'"
    @loaded="onUfoLoaded"
  />

  <DroneEntity
    ref="droneEntity"
    :accent-color="accentColorStr"
    :lighting-enabled="themeStore.lightingEnabled"
  />
</template>

<script setup lang="ts">
import { useLoop, useTresContext } from '@tresjs/core';
import { Color, MathUtils, Vector2, type WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { computed, shallowRef, watch, watchEffect } from 'vue';

import DroneEntity from '@/components/webgl/DroneEntity.vue';
import EnvironmentLighting from '@/components/webgl/EnvironmentLighting.vue';
import UfoEntity from '@/components/webgl/UfoEntity.vue';
import { useDroneFlight } from '@/composables/useDroneFlight';
import { RGB_SHIFT_SHADER } from '@/shaders/rgb-shift';
import { useLightingStore } from '@/stores/lighting';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useViewportStore } from '@/stores/viewport';
import { recolorAccentMeshes } from '@/utils/glb-helpers';
import { projectToScreenSpace } from '@/utils/webgl';

defineOptions({
  components: {
    DroneEntity,
    EnvironmentLighting,
    UfoEntity,
  },
});

// ── Stores & Reactive State ──
const themeStore = useThemeStore();
const lightingStore = useLightingStore();
const performanceStore = usePerformanceStore();
const viewportStore = useViewportStore();

const accentColorStr = computed(() => (themeStore.isBlueprintMode ? '#38bdf8' : '#10b981'));
const isHighEnd = computed(() => performanceStore.gpuTier && performanceStore.gpuTier >= 3);

// ── Component Refs ──
const envRef = shallowRef<InstanceType<typeof EnvironmentLighting> | null>(null);
const ufoEntity = shallowRef<InstanceType<typeof UfoEntity> | null>(null);
const droneEntity = shallowRef<InstanceType<typeof DroneEntity> | null>(null);

// ── Drone Flight Composable ──
const droneFlight = useDroneFlight();

// ── Particles ──
const particleCount = performanceStore.isCiMode ? 10 : isHighEnd.value ? 200 : 50;

// ── UFO Transition Tracking ──
watch(
  () => lightingStore.phase,
  (newPhase, oldPhase) => {
    if (oldPhase === 'NAV' && newPhase === 'CONTENT') {
      ufoEntity.value?.setTransitioning(true);
    }
  }
);

// ── Post-Processing Composer ──
const { renderer, scene, camera, sizes } = useTresContext();
let composer: EffectComposer | null = null;
let rgbShiftPass: ShaderPass | null = null;
let glitchPass: GlitchPass | null = null;

watchEffect(() => {
  const activeRenderer = renderer.instance;
  const activeCamera = camera.activeCamera.value;

  if (activeRenderer && scene.value && activeCamera && !composer) {
    composer = new EffectComposer(activeRenderer as WebGLRenderer);

    const renderPass = new RenderPass(scene.value, activeCamera);
    composer.addPass(renderPass);

    rgbShiftPass = new ShaderPass(RGB_SHIFT_SHADER);
    rgbShiftPass.uniforms.amount.value = 0.0;
    composer.addPass(rgbShiftPass);

    const addDeferredPasses = () => {
      if (!composer) return;

      if (isHighEnd.value && !performanceStore.isCiMode) {
        const bloomPass = new UnrealBloomPass(
          new Vector2(sizes.width.value, sizes.height.value),
          0.15,
          0.5,
          0.9
        );
        composer.insertPass(bloomPass, 1);
      }

      if (isHighEnd.value) {
        glitchPass = new GlitchPass();
        glitchPass.enabled = false;
        glitchPass.goWild = false;
        composer.addPass(glitchPass);
      }
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(addDeferredPasses, { timeout: 2000 });
    } else {
      setTimeout(addDeferredPasses, 500);
    }
  }
});

watch([() => sizes.width.value, () => sizes.height.value], ([w, h]) => {
  if (composer) composer.setSize(w, h);
  const env = envRef.value;
  if (env?.shaderMaterialRef) {
    env.shaderMaterialRef.uniforms.uResolution.value.set(w, h);
  }
});

// ── Glitch on Theme Toggle ──
let glitchTimeout: ReturnType<typeof setTimeout>;
watch(
  () => themeStore.isBlueprintMode,
  () => {
    if (glitchPass) {
      glitchPass.enabled = true;
      clearTimeout(glitchTimeout);
      glitchTimeout = setTimeout(() => {
        if (glitchPass) glitchPass.enabled = false;
      }, 350);
    }
  }
);

// ── Accent Color Sync ──
const accentColor = new Color();
watchEffect(() => {
  accentColor.set(accentColorStr.value);
  const env = envRef.value;
  if (env?.shaderMaterialRef) {
    env.shaderMaterialRef.uniforms.uAccentColor.value = [
      accentColor.r,
      accentColor.g,
      accentColor.b,
    ];
  }
});

// ── Render Cache ──
const renderState = {
  isNavPhase: true,
  isContentPhase: false,
  isBlueprintMode: 0.0,
  lightingEnabled: true,
};

watchEffect(() => {
  renderState.isNavPhase = lightingStore.phase === 'NAV';
  renderState.isContentPhase = lightingStore.phase === 'CONTENT';
  renderState.isBlueprintMode = themeStore.isBlueprintMode ? 1.0 : 0.0;
  renderState.lightingEnabled = themeStore.lightingEnabled;
});

// ── Deferred Drone Loading ──
function onUfoLoaded() {
  setTimeout(() => {
    droneEntity.value?.startLoading();
  }, 500);
}

// ── Render Loop ──
const { onBeforeRender, render } = useLoop();
let lastMouse = new Vector2(viewportStore.rawMouse.x, viewportStore.rawMouse.y);
let abductionOpacity = 0.0;

render(() => {
  if (composer) {
    composer.render();
  }
});

onBeforeRender(({ elapsed, delta }) => {
  const ufoRef = ufoEntity.value?.ufoRef;
  const droneRef = droneEntity.value?.droneRef;
  const env = envRef.value;

  // ── UFO Animation ──
  if (ufoRef && camera.activeCamera.value) {
    const ufoTargetY = renderState.isNavPhase ? 1.6 + Math.sin(elapsed * 2) * 0.1 : 15.0;
    const ufoSmoothing = 1.0 - Math.exp((renderState.isNavPhase ? -2.0 : -3.0) * delta);
    ufoRef.position.y += (ufoTargetY - ufoRef.position.y) * ufoSmoothing;

    const isVisible = ufoRef.position.y < 10.0;
    ufoRef.visible = isVisible;

    if (!isVisible && !renderState.isNavPhase) {
      ufoEntity.value?.setTransitioning(false);
    }

    if (isVisible && env?.shaderMaterialRef) {
      projectToScreenSpace(
        ufoRef.position,
        camera.activeCamera.value,
        env.shaderMaterialRef.uniforms.uUfoPosition.value
      );
    }
  }

  // ── Drone Animation (via composable) ──
  if (droneRef) {
    const droneVisible = renderState.isContentPhase;
    if (droneRef.visible !== droneVisible) {
      droneRef.visible = droneVisible;

      if (!droneVisible) {
        droneFlight.resetScan();
        const scanRing = droneEntity.value?.scanRingRef;
        const scanUniforms = droneEntity.value?.scanUniforms;
        if (scanRing) {
          scanRing.visible = false;
          if (scanUniforms) {
            scanUniforms.uProgress.value = 0;
            scanUniforms.uOpacity.value = 0;
          }
        }
      }
    }

    if (droneVisible) {
      const mouseNorm = {
        x: viewportStore.rawMouse.x / sizes.width.value - 0.5,
        y: viewportStore.rawMouse.y / sizes.height.value - 0.5,
      };
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

      const flightResult = droneFlight.update({
        elapsed,
        delta,
        focusedElementPos: lightingStore.focusedElementPos,
        mouseNormalized: mouseNorm,
        screenWidth,
      });

      // Apply position
      droneRef.position.copy(flightResult.position);

      // Apply rotation with smooth interpolation
      const rotSmoothing = 1.0 - Math.exp(-3.5 * delta);
      droneRef.quaternion.slerp(flightResult.quaternion, rotSmoothing);

      // ── Maneuver Reset (recolor) ──
      if (droneFlight.currentManeuver.value === 'IDLE' && droneEntity.value?.droneScene) {
        recolorAccentMeshes(droneEntity.value.droneScene, accentColorStr.value);
      }

      // ── Gimmick: Face Scan (Glitch + Red Flash) ──
      if (flightResult.isVeryClose && camera.activeCamera.value) {
        const distToCam = droneRef.position.distanceTo(camera.activeCamera.value.position);
        if (distToCam < 1.8 && glitchPass && !glitchPass.enabled && Math.random() > 0.95) {
          glitchPass.enabled = true;
          if (droneEntity.value?.droneScene) {
            recolorAccentMeshes(droneEntity.value.droneScene, '#ef4444');
          }
          setTimeout(() => {
            if (glitchPass) glitchPass.enabled = false;
            if (droneEntity.value?.droneScene) {
              recolorAccentMeshes(droneEntity.value.droneScene, accentColorStr.value);
            }
          }, 400);
        }
      }

      // ── Spotlight dynamics ──
      const droneSpotlight = droneEntity.value?.droneSpotlightRef;
      const droneSpotTarget = droneEntity.value?.droneSpotTargetRef;
      if (droneSpotlight && droneSpotTarget) {
        droneSpotlight.target = droneSpotTarget;

        const speed = flightResult.position.distanceTo(droneRef.position) / delta;
        const speedBoost = Math.min(speed * 0.1, 4.0);
        const proximityBoost = flightResult.isVeryClose ? 5.0 : 0.0;

        droneSpotlight.intensity =
          3 +
          speedBoost +
          proximityBoost +
          Math.sin(elapsed * 8) * 0.5 +
          Math.sin(elapsed * 13) * 0.3;

        const intensity = 1.0 + speedBoost * 0.2 + proximityBoost * 0.5;
        droneEntity.value?.beamUniforms.uColor.value
          .set(accentColorStr.value)
          .multiplyScalar(intensity);
      }

      // ── Scan Ring ──
      if (flightResult.shouldStartScan) {
        if (glitchPass) {
          glitchPass.enabled = true;
          setTimeout(() => {
            if (glitchPass) glitchPass.enabled = false;
          }, 300);
        }
      }

      const scanRing = droneEntity.value?.scanRingRef;
      const scanUniforms = droneEntity.value?.scanUniforms;
      if (flightResult.scanProgress !== null && scanRing && scanUniforms) {
        scanRing.visible = true;
        scanRing.position.copy(droneRef.position);
        scanRing.position.y -= 0.5;

        scanUniforms.uProgress.value = flightResult.scanProgress;
        scanUniforms.uOpacity.value = 1.0 - flightResult.scanProgress * flightResult.scanProgress;
      }

      if (flightResult.scanJustCompleted && scanRing && scanUniforms) {
        scanRing.visible = false;
        scanUniforms.uProgress.value = 0;
        scanUniforms.uOpacity.value = 0;
      }
    }
  }

  // ── Abduction Particles ──
  const abductionParticles = ufoEntity.value?.abductionParticlesRef;
  const abductionUniforms = ufoEntity.value?.abductionUniforms;
  if (abductionParticles && abductionUniforms) {
    const posAttr = abductionParticles.geometry?.attributes?.position;

    if (posAttr) {
      const ufoRef = ufoEntity.value?.ufoRef;
      const isAbducting = renderState.isContentPhase && ufoRef && ufoRef.position.y < 8.0;

      if (isAbducting && !abductionParticles.visible) {
        abductionUniforms.uActivationTime.value = elapsed;
      }

      if (isAbducting) {
        abductionOpacity = MathUtils.lerp(abductionOpacity, 1.0, delta * 10);
        abductionParticles.visible = true;
      } else {
        abductionOpacity = MathUtils.lerp(abductionOpacity, 0.0, delta * 5);
        if (abductionOpacity < 0.01) {
          abductionParticles.visible = false;
        }
      }

      if (abductionParticles.visible) {
        abductionUniforms.uOpacity.value = abductionOpacity * 0.8;
      }
    }
  }

  if (abductionUniforms) {
    abductionUniforms.uTime.value = elapsed;
  }

  // ── Dust Rotation ──
  if (env?.dustRef) {
    env.dustRef.rotation.y += 0.05 * delta;
    env.dustRef.rotation.x += 0.02 * delta;
  }

  // ── RGB Shift (mouse velocity) ──
  if (rgbShiftPass) {
    const currentMouseX = viewportStore.rawMouse.x;
    const currentMouseY = viewportStore.rawMouse.y;

    const dx = currentMouseX - lastMouse.x;
    const dy = currentMouseY - lastMouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    lastMouse.set(currentMouseX, currentMouseY);

    const targetAmount = Math.min(distance * 0.00005, 0.005);
    rgbShiftPass.uniforms.amount.value += (targetAmount - rgbShiftPass.uniforms.amount.value) * 0.1;
  }

  // ── Environment Shader Uniforms ──
  if (!env?.shaderMaterialRef) return;

  const u = env.shaderMaterialRef.uniforms;
  u.uTime.value = elapsed;
  u.uMouse.value.set(viewportStore.rawMouse.x, viewportStore.rawMouse.y);

  if (u.uThemeState.value !== renderState.isBlueprintMode) {
    u.uThemeState.value = renderState.isBlueprintMode;
  }

  if (u.uLightingEnabled.value !== renderState.lightingEnabled) {
    u.uLightingEnabled.value = renderState.lightingEnabled;
  }

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const isMobile = screenWidth < 768;
  u.uIsMobile.value = isMobile;

  const targetPhase = renderState.isContentPhase ? 1.0 : 0.0;
  const phaseSmoothing = 1.0 - Math.exp(-4.0 * delta);
  u.uPhase.value += (targetPhase - u.uPhase.value) * phaseSmoothing;
});
</script>
