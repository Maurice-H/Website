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

  <!-- UFO (GLB model with primitive fallback) -->
  <TresGroup
    v-if="lightingStore.phase === 'NAV' || ufoIsTransitioning"
    ref="ufoRef"
    :position="[0, 15, 0]"
  >
    <primitive v-if="ufoScene" :object="ufoScene" />
    <TresMesh v-else :scale="[0.3, 0.3, 0.3]">
      <TresCylinderGeometry :args="[1.2, 1.5, 0.4, 32]" />
      <TresMeshStandardMaterial
        :color="'#333333'"
        :metalness="0.8"
        :roughness="0.2"
      />
      <TresMesh :position="[0, -0.2, 0]" :rotation="[Math.PI / 2, 0, 0]">
        <TresTorusGeometry :args="[1.4, 0.05, 12, 32]" />
        <TresMeshBasicMaterial :color="accentColorStr" />
      </TresMesh>
    </TresMesh>
  </TresGroup>

  <!-- Companion Drone (GLB model with primitive fallback) -->
  <TresGroup ref="droneRef" :position="[0, 0, 2]">
    <primitive
      v-if="droneScene"
      :object="droneScene"
      :rotation="[0, Math.PI, 0]"
    />
    <TresMesh v-else :scale="[0.15, 0.15, 0.15]">
      <TresSphereGeometry :args="[1, 32, 32]" />
      <TresMeshStandardMaterial
        :color="'#333333'"
        :metalness="0.8"
        :roughness="0.2"
      />
      <TresMesh :rotation="[Math.PI / 2, 0, 0]">
        <TresTorusGeometry :args="[1.5, 0.1, 12, 32]" />
        <TresMeshBasicMaterial :color="accentColorStr" />
      </TresMesh>
    </TresMesh>

    <!-- Beam System (rigidly attached to drone lens) -->
    <TresGroup :position="[0.27, 0.26, -0.1]">
      <!-- Drone Spotlight -->
      <TresSpotLight
        ref="droneSpotlightRef"
        :color="accentColorStr"
        :intensity="3"
        :angle="Math.PI / 12"
        :penumbra="0.4"
        :distance="15"
        :decay="2"
        :position="[0, 0, 0]"
      />
      <TresObject3D ref="droneSpotTargetRef" :position="[0, 0, 0]" />

      <!-- Visible Light Cone -->
      <TresMesh :position="[-0.78, -0.67, 1.2]" :rotation="[5, 0, 0]">
        <TresConeGeometry
          v-if="themeStore.lightingEnabled"
          :args="[0.4, 3, 16, 1, true]"
        />
        <TresShaderMaterial
          :vertex-shader="beamVertShader"
          :fragment-shader="beamFragShader"
          :uniforms="beamUniforms"
          :transparent="true"
          :blending="2"
          :depth-write="false"
          :side="2"
        />
      </TresMesh>
    </TresGroup>
  </TresGroup>

  <!-- Abduction Particles -->
  <TresPoints ref="abductionParticlesRef" :visible="false">
    <TresBufferGeometry
      :position="[abductionPositions, 3]"
      :a-velocity="[abductionVelocities, 1]"
    />
    <TresShaderMaterial
      :vertex-shader="abductionVertShader"
      :fragment-shader="abductionFragShader"
      :uniforms="abductionUniforms"
      :transparent="true"
      :blending="2"
      :depth-write="false"
    />
  </TresPoints>

  <!-- Drone Area Scan (grid sweep shader) -->
  <TresMesh ref="scanRingRef" :visible="false" :rotation="[0, 0, 0]">
    <TresPlaneGeometry :args="[20, 20]" />
    <TresShaderMaterial
      :vertex-shader="scanVertShader"
      :fragment-shader="scanFragShader"
      :uniforms="scanUniforms"
      :transparent="true"
      :depth-write="false"
      :side="2"
    />
  </TresMesh>

  <TresDirectionalLight :position="[5, 10, 5]" :intensity="2" />
  <TresAmbientLight :intensity="0.5" />
</template>

<script setup lang="ts">
import { useLoop, useTresContext } from '@tresjs/core';
import {
  Box3,
  BufferAttribute,
  CanvasTexture,
  Color,
  type Group,
  type Material,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  type SpotLight,
  type Texture,
  Vector2,
  Vector3,
  type WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GLTFLoader } from 'three-stdlib';
import { onMounted, shallowRef, watch } from 'vue';

// --- TRESJS CRASH PREVENTION PATCH ---
// TresJS memory profiler crashes if it encounters a Mesh without a position attribute
// (e.g. HighlightMesh from DevTools). We intercept all traverses to guarantee stability.
const originalTraverse = Object3D.prototype.traverse;
Object3D.prototype.traverse = function (callback: (object: Object3D) => unknown) {
  if ((this as unknown as { isMesh: boolean }).isMesh) {
    const mesh = this as unknown as Mesh;
    if (mesh.geometry && !mesh.geometry.attributes.position) {
      mesh.geometry.setAttribute('position', new BufferAttribute(new Float32Array([0, 0, 0]), 3));
    }
  }
  return originalTraverse.call(this, callback);
};

// -------------------------------------

import { computed, ref, watchEffect } from 'vue';
import fragmentShader from '@/shaders/main.frag.glsl?raw';
import vertexShader from '@/shaders/main.vert.glsl?raw';
import { useLightingStore } from '@/stores/lighting';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useViewportStore } from '@/stores/viewport';
import { envConfig } from '@/utils/env';
import { projectToScreenSpace } from '@/utils/webgl';

function grayscaleTexture(tex: Texture | null): Texture | null {
  if (!tex?.image) return tex;
  const img = tex.image as HTMLImageElement | ImageBitmap;

  const canvas = document.createElement('canvas');
  canvas.width = img.width || 1024;
  canvas.height = img.height || 1024;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return tex;

  try {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const sum = r + g + b || 1;
      const gRatio = g / sum;

      if (gRatio > 0.35 && g > 15) {
        const l = Math.min(255, (0.299 * r + 0.587 * g + 0.114 * b) * 2.0);
        data[i] = l;
        data[i + 1] = l;
        data[i + 2] = l;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const newTex = new CanvasTexture(canvas);
    newTex.flipY = tex.flipY;
    newTex.colorSpace = tex.colorSpace;
    newTex.wrapS = tex.wrapS;
    newTex.wrapT = tex.wrapT;
    newTex.magFilter = tex.magFilter;
    newTex.minFilter = tex.minFilter;
    newTex.needsUpdate = true;
    return newTex;
  } catch (e) {
    console.error('Grayscale texture failed:', e);
    return tex;
  }
}

/**
 * Normalizes a loaded GLB scene to fit within a target size.
 * Computes the bounding box ONLY using visible meshes, scales uniformly, and centers the model.
 */
function normalizeModel(scene: Group, targetSize: number): void {
  const computeVisibleBox = (obj: Group) => {
    const box = new Box3();
    box.makeEmpty();
    obj.updateWorldMatrix(true, true);
    obj.traverse((child) => {
      if (child instanceof Mesh) {
        if (child.visible && child.geometry) {
          const geometry = child.geometry;
          if (!geometry.boundingBox) geometry.computeBoundingBox();
          if (geometry.boundingBox) {
            const childBox = geometry.boundingBox.clone();
            childBox.applyMatrix4(child.matrixWorld);
            box.union(childBox);
          }
        }
      }
    });
    return box;
  };

  const box = computeVisibleBox(scene);
  if (box.isEmpty()) return;

  const size = new Vector3();
  box.getSize(size);

  const maxDimension = Math.max(size.x, size.y, size.z);
  if (maxDimension === 0) return;

  const scaleFactor = targetSize / maxDimension;
  scene.scale.setScalar(scaleFactor);

  // Re-center after scaling using the scaled visible box
  const centerBox = computeVisibleBox(scene);
  const center = new Vector3();
  centerBox.getCenter(center);
  scene.position.sub(center);
}

/**
 * Makes GLB model materials visible through mix-blend-screen compositing.
 */
function prepareForScreenBlend(scene: Group): void {
  scene.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;

    const mat = mesh.material as Material;

    const meshName = (mesh.name || '').toLowerCase();
    const matName = (mat.name || '').toLowerCase();
    if (
      meshName.includes('shadow') ||
      matName.includes('shadow') ||
      meshName.includes('collision') ||
      meshName.includes('proxy')
    ) {
      mesh.visible = false;
      return;
    }

    if (mat.transparent && mat.opacity < 0.05) return;

    if (mat instanceof MeshStandardMaterial) {
      if (!mesh.userData.__originalEmissive) {
        mesh.userData.__originalEmissive = mat.emissive.clone();
        mesh.userData.__hadEmissiveMap = !!mat.emissiveMap;
        mesh.userData.__originalColor = mat.color.clone();
      }

      // Any transparent mesh (glass, glow planes, particle emitters) should be excluded
      // from the solid-emissive override below, otherwise they turn into solid gray boxes.
      const isGlass = mat.transparent;

      if (!isGlass) {
        const hsl = { h: 0, s: 0, l: 0 };
        mat.color.getHSL(hsl);

        // Models with no diffuse map and pure-white base colors (l ≈ 1.0) render
        // as blinding white rectangles through mix-blend-screen. Darken them to a
        // visible-but-subtle level. This handles the 1K drone.glb which ships with
        // KHR_materials_pbrSpecularGlossiness and all-white base colors.
        if (!mat.map && hsl.l > 0.85) {
          // For pure white meshes, adding saturation turns them red (Hue 0).
          // Keep the original saturation (0) to get a clean neutral gray.
          mat.color.setHSL(hsl.h, hsl.s, 0.35);
        } else if (hsl.l < 0.15) {
          mat.color.setHSL(hsl.h, Math.max(hsl.s, 0.2), 0.35);
        }

        mat.emissive.copy(mat.color);
        mat.emissiveIntensity = 0.8;

        // The UFO has green lights painted directly into its texture maps.
        // By replacing the green with grayscale on the canvas, it allows `mat.emissive.set()`
        // in recolorAccentMeshes to work perfectly without complex shader hacks.
        if (mat.userData.isUfoMaterial) {
          if (mat.emissiveMap && !mat.userData.__grayscaledEmissive) {
            mat.emissiveMap = grayscaleTexture(mat.emissiveMap);
            mat.userData.__grayscaledEmissive = true;
          }
          mat.needsUpdate = true;
        }
      }

      mat.metalness = isGlass ? mat.metalness : Math.min(mat.metalness, 0.3);
      mat.roughness = isGlass ? mat.roughness : Math.max(mat.roughness, 0.4);
      mat.needsUpdate = true;
      return;
    }

    if (mat instanceof MeshBasicMaterial) {
      const hsl = { h: 0, s: 0, l: 0 };
      mat.color.getHSL(hsl);
      mat.color.setHSL(hsl.h, hsl.s, Math.min(hsl.l * 1.5, 1.0));
      mat.needsUpdate = true;
    }
  });
}

/**
 * Identifies meshes with green-hue emissive colors (HSL h ≈ 100-180°)
 * and shifts them to the target accent color, preserving lightness/saturation.
 */
function recolorAccentMeshes(scene: Group, newColorHex: string): void {
  const targetColor = new Color(newColorHex);
  const targetHSL = { h: 0, s: 0, l: 0 };
  targetColor.getHSL(targetHSL);

  scene.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;

    const mat = mesh.material as MeshStandardMaterial;
    if (!(mat instanceof MeshStandardMaterial)) return;

    const original = mesh.userData.__originalEmissive as Color | undefined;
    if (!original) return;

    if (mat.userData.isUfoMaterial) {
      mat.emissive.set(newColorHex);
      mat.emissiveIntensity = 0.9;
      mat.needsUpdate = true;
      return;
    }

    if (mesh.userData.__hadEmissiveMap && mat.emissiveMap) {
      mat.emissive.set(newColorHex);
      mat.emissiveIntensity = 0.9;
      mat.needsUpdate = true;
      return;
    }

    const matName = (mat.name || '').toLowerCase();
    const meshName = (mesh.name || '').toLowerCase();
    const isLens =
      matName.includes('lens') ||
      matName.includes('glass') ||
      matName.includes('eye') ||
      meshName.includes('lens') ||
      meshName.includes('glass') ||
      meshName.includes('eye');

    const isAccent =
      matName.includes('glow') ||
      matName.includes('accent') ||
      matName.includes('light') ||
      matName.includes('neon') ||
      matName.includes('ring') ||
      matName.includes('emitter') ||
      meshName.includes('glow') ||
      meshName.includes('accent') ||
      meshName.includes('light') ||
      meshName.includes('neon') ||
      meshName.includes('ring') ||
      meshName.includes('emitter');

    if (isLens || isAccent) {
      mat.emissive.set(newColorHex);
      if (isAccent) mat.color.set(newColorHex);
      mat.emissiveIntensity = 1.0;
      mat.needsUpdate = true;
      return;
    }

    const hsl = { h: 0, s: 0, l: 0 };
    original.getHSL(hsl);
    let isGreenHue = hsl.h >= 0.278 && hsl.h <= 0.5 && hsl.s > 0.1;

    // Fallback: check original albedo color if emissive was black
    if (!isGreenHue && mesh.userData.__originalColor) {
      const origColor = mesh.userData.__originalColor as Color;
      origColor.getHSL(hsl);
      isGreenHue = hsl.h >= 0.278 && hsl.h <= 0.5 && hsl.s > 0.1;
    }

    if (isGreenHue) {
      mat.color.set(newColorHex);
      mat.emissive.set(newColorHex);
      mat.emissiveIntensity = 0.9;
      mat.needsUpdate = true;
      return;
    }
  });
}

// ── Stores & Reactive State ──
const themeStore = useThemeStore();
const lightingStore = useLightingStore();
const accentColorStr = computed(() => (themeStore.isBlueprintMode ? '#38bdf8' : '#10b981'));

const ufoIsTransitioning = ref(false);
watch(
  () => lightingStore.phase,
  (newPhase, oldPhase) => {
    if (oldPhase === 'NAV' && newPhase === 'CONTENT') {
      ufoIsTransitioning.value = true;
    }
  }
);

// ── 3D Model Loading ──
const ufoScene = shallowRef<Group | null>(null);
const droneScene = shallowRef<Group | null>(null);

import { onUnmounted } from 'vue';

onUnmounted(() => {
  ufoScene.value = null;
  droneScene.value = null;
});

const UFO_TARGET_SIZE = 0.8;
const DRONE_TARGET_SIZE = 0.3;

const gltfLoader = new GLTFLoader();
let droneLoadStarted = false;

/** Load the drone model on demand (deferred to CONTENT phase to avoid blocking initial load) */
function loadDroneModel() {
  if (droneLoadStarted || droneScene.value) return;
  droneLoadStarted = true;

  gltfLoader.load(
    `${envConfig.BASE_URL}models/drone.glb`,
    (gltf) => {
      // Hide rogue artifact meshes included in the downloaded GLB
      // The model includes a glass display box and a platform made entirely of 'Plane' meshes.
      // We hide all of them to ensure only the actual drone (Spheres, Cylinders, Toruses) is visible.
      gltf.scene.traverse((child) => {
        const mesh = child as Mesh;
        if (mesh.isMesh && mesh.name.toLowerCase().includes('plane')) {
          mesh.visible = false;
        }
      });

      prepareForScreenBlend(gltf.scene);
      normalizeModel(gltf.scene, DRONE_TARGET_SIZE);
      recolorAccentMeshes(gltf.scene, accentColorStr.value);
      droneScene.value = gltf.scene;
    },
    undefined,
    (error) => {
      console.error('[WebGLScene] drone.glb not found — using primitive fallback.', error);
      droneLoadStarted = false;
    }
  );
}

onMounted(() => {
  gltfLoader.load(
    `${envConfig.BASE_URL}models/ufo.glb`,
    (gltf) => {
      // Tag UFO materials definitively so they can be identified in prepareForScreenBlend
      gltf.scene.traverse((child) => {
        const mesh = child as Mesh;
        if (mesh.isMesh && mesh.material) {
          (mesh.material as Material).userData.isUfoMaterial = true;
        }
      });

      prepareForScreenBlend(gltf.scene);
      normalizeModel(gltf.scene, UFO_TARGET_SIZE);
      recolorAccentMeshes(gltf.scene, accentColorStr.value);
      ufoScene.value = gltf.scene;

      // Defer drone loading slightly to avoid blocking the main thread during initial render,
      // but start it immediately so it's ready before the user transitions to the CONTENT phase.
      setTimeout(() => {
        loadDroneModel();
      }, 500);
    },
    undefined,
    (error) => {
      console.error('[WebGLScene] ufo.glb not found — using primitive fallback.', error);
      // Still attempt to load drone if UFO fails
      setTimeout(() => {
        loadDroneModel();
      }, 500);
    }
  );
});

watch(accentColorStr, (newColor) => {
  if (ufoScene.value) recolorAccentMeshes(ufoScene.value, newColor);

  // Sync the hex color to the WebGL color uniforms
  const c = new Color(newColor);
  scanUniforms.uColor.value = [c.r, c.g, c.b];
  beamUniforms.uColor.value.set(c);
});

const performanceStore = usePerformanceStore();
const isHighEnd = computed(() => performanceStore.gpuTier && performanceStore.gpuTier >= 3);

const shaderMaterialRef = shallowRef();
const dustRef = shallowRef();
const ufoRef = shallowRef();
const droneRef = shallowRef<Group | null>(null);
const droneSpotlightRef = shallowRef<SpotLight | null>(null);
const droneSpotTargetRef = shallowRef<Object3D | null>(null);
const scanRingRef = shallowRef();
const viewportStore = useViewportStore();

// ── Drone Maneuver System ──
type Maneuver =
  | 'IDLE'
  | 'CLOSE_VISIT'
  | 'DISTANT_PROBE'
  | 'LOOPING'
  | 'FOLLOW_MOUSE'
  | 'INSPECT_ELEMENT';
const currentManeuver = ref<Maneuver>('IDLE');
const maneuverStartTime = ref(0);
const maneuverDuration = ref(0);
let nextManeuverCheck = 10;

// ── Physical Inertia State ──
const droneVelocity = new Vector3();
const droneSpringStrength = 15.0; // Responsive force
const droneDamping = 0.82; // Air resistance / friction

function triggerManeuver(time: number) {
  // If user is interacting with UI or mouse, prioritize those states elsewhere
  if (lightingStore.focusedElementPos) return;

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const isMobile = screenWidth < 768;

  const r = Math.random();
  if (r < 0.3) {
    currentManeuver.value = 'CLOSE_VISIT';
    maneuverDuration.value = 6;
  } else if (r < 0.5) {
    currentManeuver.value = 'DISTANT_PROBE';
    maneuverDuration.value = 8;
  } else if (r < 0.75) {
    currentManeuver.value = 'LOOPING';
    maneuverDuration.value = 5;
  } else {
    // Avoid mouse-following on mobile as there's no persistent cursor
    currentManeuver.value = isMobile ? 'CLOSE_VISIT' : 'FOLLOW_MOUSE';
    maneuverDuration.value = 10;
  }
  maneuverStartTime.value = time;
  nextManeuverCheck = time + maneuverDuration.value + 12 + Math.random() * 8;
}

// ── Interaction Timing Logic ──
let focusWeight = 0;
let focusStartTime = 0;
const MAX_FOCUS_DURATION = 3.2; // 3.2s of focused inspection
let lastFocusedElement: { x: number; y: number } | null = null;

// ── Organic Drone Flight System (§7) ──
function getOrganicFlightPosition(time: number, target: Vector3): void {
  // Scale X movement based on screen width to keep drone visible on mobile
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const xLimitScale = Math.max(0.35, Math.min(1.0, screenWidth / 1200));

  // ── Base Figure-8 Organic Motion ──
  let x = (Math.sin(time * 0.2) * 4 + Math.sin(time * 0.5) * 2) * xLimitScale;
  let y = Math.cos(time * 0.3) * 1.0 + Math.sin(time * 0.8) * 0.5;
  let z = Math.sin(time * 0.25) * 2 - 3;

  // ── UI / Bento Card Interaction ──
  const isMobile = screenWidth < 768;
  if (!isMobile && lightingStore.focusedElementPos && focusWeight > 0.01) {
    // Interpolate towards the hovered card using the reactive focusWeight
    const targetX = lightingStore.focusedElementPos.x * 5 * xLimitScale;
    const targetY = lightingStore.focusedElementPos.y * 3;
    x = MathUtils.lerp(x, targetX, 0.85 * focusWeight);
    y = MathUtils.lerp(y, targetY, 0.85 * focusWeight);
    z = MathUtils.lerp(z, -1.2, 0.85 * focusWeight);
  }

  // ── Maneuver Overrides ──
  const timeInManeuver = time - maneuverStartTime.value;
  if (timeInManeuver > 0 && timeInManeuver < maneuverDuration.value) {
    const progress = timeInManeuver / maneuverDuration.value;
    // Smoother envelope using a cubic easing for entry/exit
    const easeProgress =
      progress < 0.5 ? 4 * progress * progress * progress : 1 - (-2 * progress + 2) ** 3 / 2;
    const envelope = Math.sin(easeProgress * Math.PI);

    if (currentManeuver.value === 'CLOSE_VISIT') {
      z = MathUtils.lerp(z, 3.8, envelope);
      x = MathUtils.lerp(x, Math.sin(time * 0.5) * 1.5 * xLimitScale, envelope);
      y = MathUtils.lerp(y, Math.cos(time * 0.4) * 0.5, envelope);
    } else if (currentManeuver.value === 'DISTANT_PROBE') {
      z = MathUtils.lerp(z, -18, envelope);
      x = MathUtils.lerp(x, x * 1.5, envelope);
    } else if (
      !isMobile &&
      currentManeuver.value === 'FOLLOW_MOUSE' &&
      !lightingStore.focusedElementPos
    ) {
      // Actively orbit/follow the mouse cursor
      const mouseX = (viewportStore.rawMouse.x / sizes.width.value - 0.5) * 8 * xLimitScale;
      const mouseY = -(viewportStore.rawMouse.y / sizes.height.value - 0.5) * 5;
      x = MathUtils.lerp(x, mouseX + Math.sin(time * 2) * 0.5, envelope);
      y = MathUtils.lerp(y, mouseY + Math.cos(time * 2) * 0.5, envelope);
      z = MathUtils.lerp(z, -1.5, envelope);
    } else if (currentManeuver.value === 'LOOPING') {
      const radius = 2.5 * envelope;
      const angle = progress * Math.PI * 2;
      y += Math.sin(angle) * radius;
      z += (Math.cos(angle) - 1.0) * radius;
    }
  }

  target.set(x, y, z);
}

const droneCurrentPos = new Vector3(0, 0, -2);
const droneDummyObj = new Object3D();
// Hoisted out of the render loop to avoid per-frame allocations / GC pressure
const _droneTargetPos = new Vector3();
const _droneLookAtPos = new Vector3();

// ── Scan Grid State & Shader (§9) ──
const SCAN_INTERVAL = 20;
let lastScanTime = 0;
let scanActive = false;
let scanElapsed = 0;
const SCAN_DURATION = 3;

// ── Abduction Particle Shader ──
const abductionVertShader = `
  uniform float uTime;
  uniform float uActivationTime;
  uniform float uPixelRatio;
  attribute float aVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;

    // Relative time since activation
    float localTime = max(0.0, uTime - uActivationTime);

    // Apply velocity over time and wrap around (simulate modulus operator logic for floats)
    float currentY = pos.y + aVelocity * localTime;

    // wrap logic: starting from -2.0, going up to 4.0, length of 6.0
    float wrappedY = mod(currentY + 2.0, 6.0) - 2.0;
    pos.y = wrappedY;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Proper size attenuation logic replicating TresPointsMaterial :size="0.04"
    gl_PointSize = 0.04 * uPixelRatio * (1000.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const abductionFragShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    // Circle shape for points
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;

    // Soft edge
    float alpha = (0.5 - r) * 2.0;

    gl_FragColor = vec4(uColor, alpha * uOpacity);
  }
`;

const scanVertShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const scanFragShader = `
  #define PI 3.14159265359
  uniform float uProgress;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float dist = length(p);
    if (dist > 1.0) discard;

    // ── Expanding Wave ──
    // Leading edge: sharp cut off ahead of the wave
    float leadingEdge = smoothstep(uProgress + 0.01, uProgress, dist);

    // Trailing fade: long soft tail behind the wave
    float tailLength = 0.6; // How far the tail stretches backwards
    float trailingFade = smoothstep(uProgress - tailLength, uProgress, dist);
    // Exponential fade makes it look more explosive/natural
    trailingFade = pow(trailingFade, 1.5);

    float wave = leadingEdge * trailingFade;

    // ── Holographic Matrix Grid ──
    float gridScale = 120.0;
    vec2 gridId = floor(p * gridScale);
    vec2 gridUv = fract(p * gridScale);

    // Distance from center of current cell
    float dotDist = length(gridUv - vec2(0.5));

    // Noise to make dots flicker/vary organically
    float noise = random(gridId);

    // Glowing dots
    float dots = smoothstep(0.4, 0.1, dotDist) * (0.3 + 0.7 * noise);

    // Concentric radar rings
    float rings = smoothstep(0.01, 0.0, abs(fract(dist * 12.0) - 0.5));

    // Combine patterns
    float techPattern = max(dots, rings * 0.4);

    // Apply the wave to the pattern
    float alpha = techPattern * wave;

    // Add a solid glowing core ring at the exact leading edge
    float coreRing = smoothstep(uProgress - 0.015, uProgress, dist) * smoothstep(uProgress + 0.015, uProgress, dist);
    alpha += coreRing * 0.8;

    alpha *= smoothstep(1.0, 0.8, dist);
    alpha *= uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }`;

const scanUniforms = {
  uProgress: { value: 0.0 },
  uColor: { value: [0.063, 0.725, 0.506] },
  uOpacity: { value: 0.0 },
};

// ── Volumetric Light Beam Shader (§8) ──
const beamVertShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }`;

const beamFragShader = `
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Fresnel-like effect: brightest when looking directly through the center
    float viewDot = abs(dot(normal, viewDir));

    // Soft core and subtle aura
    float core = smoothstep(0.7, 1.0, viewDot) * 0.8;
    float aura = smoothstep(0.0, 0.8, viewDot) * 0.2;
    float intensity = core + aura;

    // Vertical fade: vUv.y is 1.0 at the narrow tip (lens), 0.0 at the wide base.
    // By squaring vUv.y, it creates a smooth exponential fade that completely
    // dissipates to 0.0 at the end of the beam!
    float verticalFade = pow(vUv.y, 1.5);

    float alpha = intensity * verticalFade * 0.6;

    gl_FragColor = vec4(uColor, alpha);
  }`;

const beamUniforms = {
  uColor: { value: new Color(accentColorStr.value) },
};

const { renderer, scene, camera, sizes } = useTresContext();
let composer: EffectComposer | null = null;
let rgbShiftPass: ShaderPass | null = null;
let glitchPass: GlitchPass | null = null;
const RGB_SHIFT_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.005 },
    angle: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float angle;
    varying vec2 vUv;
    void main() {
      vec2 offset = vec2(cos(angle), sin(angle)) * amount;
      vec4 cr = texture2D(tDiffuse, vUv + offset);
      vec4 cga = texture2D(tDiffuse, vUv);
      vec4 cb = texture2D(tDiffuse, vUv - offset);
      gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
    }`,
};

watchEffect(() => {
  const activeRenderer = renderer.instance;
  const activeCamera = camera.activeCamera.value;

  if (activeRenderer && scene.value && activeCamera && !composer) {
    composer = new EffectComposer(activeRenderer as WebGLRenderer);

    const renderPass = new RenderPass(scene.value, activeCamera);
    composer.addPass(renderPass);

    // RGBShift is lightweight — add immediately
    rgbShiftPass = new ShaderPass(RGB_SHIFT_SHADER);
    rgbShiftPass.uniforms.amount.value = 0.0;
    composer.addPass(rgbShiftPass);

    // Defer heavy passes (BloomPass compiles shaders + allocates framebuffers)
    // to avoid blocking the first rendered frames
    const addDeferredPasses = () => {
      if (!composer) return;

      if (isHighEnd.value && !performanceStore.isCiMode) {
        const bloomPass = new UnrealBloomPass(
          new Vector2(sizes.width.value, sizes.height.value),
          0.15,
          0.5,
          0.9
        );
        // Insert bloom before RGB shift (index 1, after RenderPass)
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
  if (shaderMaterialRef.value) {
    shaderMaterialRef.value.uniforms.uResolution.value.set(w, h);
  }
});

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

const particleCount = performanceStore.isCiMode ? 10 : isHighEnd.value ? 200 : 50;
const dustPositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  dustPositions[i] = (Math.random() - 0.5) * 6;
}

const ABDUCTION_PARTICLE_COUNT = 150;
const abductionPositions = new Float32Array(ABDUCTION_PARTICLE_COUNT * 3);
const abductionVelocities = new Float32Array(ABDUCTION_PARTICLE_COUNT);
for (let i = 0; i < ABDUCTION_PARTICLE_COUNT; i++) {
  const radius = 0.2 + Math.random() * 0.8;
  const theta = Math.random() * Math.PI * 2;
  abductionPositions[i * 3] = Math.cos(theta) * radius;
  abductionPositions[i * 3 + 1] = -2 + Math.random() * 4;
  abductionPositions[i * 3 + 2] = Math.sin(theta) * radius;
  abductionVelocities[i] = 2.0 + Math.random() * 4.0;
}
const abductionParticlesRef = shallowRef();
let abductionOpacity = 0.0;

const abductionUniforms = {
  uTime: { value: 0 },
  uActivationTime: { value: 0 },
  uPixelRatio: { value: window.devicePixelRatio || 1.0 },
  uColor: { value: new Color(accentColorStr.value) },
  uOpacity: { value: 0.0 },
};

const uniforms = {
  uMouse: { value: new Vector2(window.innerWidth / 2, window.innerHeight / 2) },
  uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
  uTime: { value: 0 },
  uThemeState: { value: 0.0 },
  uLightingEnabled: { value: true },
  uPhase: { value: 0.0 },
  uIsMobile: { value: false },
  uAccentColor: { value: [0.063, 0.725, 0.506] },
  uUfoPosition: { value: new Vector2(0.5, 0.85) },
};

const { onBeforeRender, render } = useLoop();

render(() => {
  if (composer) {
    composer.render();
  }
});

let lastMouse = new Vector2(viewportStore.rawMouse.x, viewportStore.rawMouse.y);

const renderState = {
  isNavPhase: true,
  isContentPhase: false,
  isBlueprintMode: 0.0,
  lightingEnabled: true,
};

const accentColor = new Color();
watchEffect(() => {
  accentColor.set(accentColorStr.value);
  if (shaderMaterialRef.value) {
    shaderMaterialRef.value.uniforms.uAccentColor.value = [
      accentColor.r,
      accentColor.g,
      accentColor.b,
    ];
  }

  abductionUniforms.uColor.value.set(accentColorStr.value);

  scanUniforms.uColor.value = [accentColor.r, accentColor.g, accentColor.b];

  renderState.isNavPhase = lightingStore.phase === 'NAV';
  renderState.isContentPhase = lightingStore.phase === 'CONTENT';
  renderState.isBlueprintMode = themeStore.isBlueprintMode ? 1.0 : 0.0;
  renderState.lightingEnabled = themeStore.lightingEnabled;
});

onBeforeRender(({ elapsed, delta }) => {
  if (ufoRef.value && camera.activeCamera.value) {
    const ufoTargetY = renderState.isNavPhase ? 1.6 + Math.sin(elapsed * 2) * 0.1 : 15.0;
    const ufoSmoothing = 1.0 - Math.exp((renderState.isNavPhase ? -2.0 : -3.0) * delta);
    ufoRef.value.position.y += (ufoTargetY - ufoRef.value.position.y) * ufoSmoothing;

    const isVisible = ufoRef.value.position.y < 10.0;
    ufoRef.value.visible = isVisible;

    if (!isVisible && !renderState.isNavPhase) {
      ufoIsTransitioning.value = false;
    }

    if (isVisible && shaderMaterialRef.value) {
      projectToScreenSpace(
        ufoRef.value.position,
        camera.activeCamera.value,
        shaderMaterialRef.value.uniforms.uUfoPosition.value
      );
    }
  }

  if (droneRef.value) {
    const droneVisible = renderState.isContentPhase;
    if (droneRef.value.visible !== droneVisible) {
      droneRef.value.visible = droneVisible;

      // Reset scan state when leaving content phase mid-scan
      if (!droneVisible && scanActive) {
        scanActive = false;
        if (scanRingRef.value) {
          scanRingRef.value.visible = false;
          scanUniforms.uProgress.value = 0;
          scanUniforms.uOpacity.value = 0;
        }
      }
    }

    if (droneVisible) {
      // ── Organic Physics-Based Flight (§7) ──
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const xLimitScale = Math.max(0.35, Math.min(1.0, screenWidth / 1200));

      // ── Update Focus Weight (Timed Bento Inspection) ──
      if (lightingStore.focusedElementPos) {
        if (lightingStore.focusedElementPos !== lastFocusedElement) {
          focusStartTime = elapsed;
          lastFocusedElement = lightingStore.focusedElementPos;
        }
        const focusAge = elapsed - focusStartTime;
        // Drone only stays focused for a few seconds before returning to duty
        const targetWeight = focusAge < MAX_FOCUS_DURATION ? 1.0 : 0.0;
        focusWeight = MathUtils.lerp(focusWeight, targetWeight, delta * 3);
      } else {
        focusWeight = MathUtils.lerp(focusWeight, 0.0, delta * 4);
        lastFocusedElement = null;
      }

      // Trigger new maneuvers periodically
      if (elapsed > nextManeuverCheck) {
        triggerManeuver(elapsed);
      }

      // Reset maneuver state when finished
      if (
        currentManeuver.value !== 'IDLE' &&
        elapsed > maneuverStartTime.value + maneuverDuration.value
      ) {
        currentManeuver.value = 'IDLE';
        // Reset color if it was changed by a gimmick
        if (droneScene.value) recolorAccentMeshes(droneScene.value, accentColorStr.value);
      }

      getOrganicFlightPosition(elapsed, _droneTargetPos);

      // 1. Physical Position Simulation (Spring-Damper for fluid inertia)
      const springForce = _droneTargetPos
        .clone()
        .sub(droneCurrentPos)
        .multiplyScalar(droneSpringStrength);
      droneVelocity.add(springForce.multiplyScalar(delta));

      // Apply damping (exponential decay towards 0 velocity)
      const dampingFactor = droneDamping ** (delta * 60);
      droneVelocity.multiplyScalar(dampingFactor);

      // Integrate velocity into position
      droneCurrentPos.add(droneVelocity.clone().multiplyScalar(delta));

      // Add micro-hover bobbing to the final visual position
      const hoverY = Math.sin(elapsed * 3.5) * 0.1;
      droneRef.value.position.copy(droneCurrentPos);
      droneRef.value.position.y += hoverY;

      // 2. Calculate ideal rotation
      getOrganicFlightPosition(elapsed + 0.4, _droneLookAtPos);

      // Bento Card Inspection: Look directly at the card being hovered
      if (lightingStore.focusedElementPos && focusWeight > 0.1) {
        const focusX = lightingStore.focusedElementPos.x * 5 * xLimitScale;
        const focusY = lightingStore.focusedElementPos.y * 3;
        // Look slightly "behind" the card to ensure the beam hits it flush
        _droneLookAtPos.set(focusX, focusY, -2.0);
      }

      // Gimmick: Mouse Curiosity (peek towards mouse when idle)
      else if (currentManeuver.value === 'IDLE') {
        const mouseX = (viewportStore.rawMouse.x / sizes.width.value - 0.5) * 5;
        const mouseY = -(viewportStore.rawMouse.y / sizes.height.value - 0.5) * 3;
        _droneLookAtPos.x += mouseX * 0.5;
        _droneLookAtPos.y += mouseY * 0.5;
      }

      // Gimmick: Face Look (Look at camera when very close)
      const distToCam = droneCurrentPos.distanceTo(new Vector3(0, 0, 5));
      const isVeryClose = currentManeuver.value === 'CLOSE_VISIT' && distToCam < 2.5;
      if (isVeryClose) {
        _droneLookAtPos.set(0, 0, 8); // Look "through" the camera at the user
      }

      droneDummyObj.position.copy(droneCurrentPos);
      droneDummyObj.lookAt(_droneLookAtPos);

      // Dynamic pitch based on vertical climb/dive
      const vY = _droneTargetPos.y - droneCurrentPos.y;
      const targetPitch = -vY * 0.8;

      // Dynamic bank (roll) based on turning
      const yawDiff = droneDummyObj.rotation.y - droneRef.value.rotation.y;
      const normYaw = Math.atan2(Math.sin(yawDiff), Math.cos(yawDiff));
      const targetBank = normYaw * 1.5;

      droneDummyObj.rotateX(targetPitch);
      droneDummyObj.rotateZ(targetBank);

      // 3. Smoothly interpolate rotation (adds heavy, fluid feel)
      const rotSmoothing = 1.0 - Math.exp(-3.5 * delta);
      droneRef.value.quaternion.slerp(droneDummyObj.quaternion, rotSmoothing);

      // ── Gimmick: Face Scan (Glitch + Red Flash) ──
      if (isVeryClose && distToCam < 1.8) {
        if (glitchPass && !glitchPass.enabled && Math.random() > 0.95) {
          glitchPass.enabled = true;
          if (droneScene.value) recolorAccentMeshes(droneScene.value, '#ef4444'); // Red alert!
          setTimeout(() => {
            if (glitchPass) glitchPass.enabled = false;
            if (droneScene.value) recolorAccentMeshes(droneScene.value, accentColorStr.value);
          }, 400);
        }
      }

      // ── Spotlight target rigidly follows drone (§8) ──
      if (droneSpotlightRef.value && droneSpotTargetRef.value) {
        // Bind the spotlight to its local target
        droneSpotlightRef.value.target = droneSpotTargetRef.value;

        // Gimmick: Speed-based intensity (brighter when moving fast or close)
        const speed = _droneTargetPos.distanceTo(droneCurrentPos) / delta;
        const speedBoost = Math.min(speed * 0.1, 4.0);
        const proximityBoost = isVeryClose ? 5.0 : 0.0;

        // Subtle intensity flicker/breathing + boosts
        droneSpotlightRef.value.intensity =
          3 +
          speedBoost +
          proximityBoost +
          Math.sin(elapsed * 8) * 0.5 +
          Math.sin(elapsed * 13) * 0.3;

        // Update beam color/intensity
        const intensity = 1.0 + speedBoost * 0.2 + proximityBoost * 0.5;
        beamUniforms.uColor.value.set(accentColorStr.value).multiplyScalar(intensity);
      }

      if (elapsed - lastScanTime >= SCAN_INTERVAL && !scanActive) {
        scanActive = true;
        scanElapsed = 0;
        lastScanTime = elapsed;

        // Trigger glitch pass briefly during scan
        if (glitchPass) {
          glitchPass.enabled = true;
          setTimeout(() => {
            if (glitchPass) glitchPass.enabled = false;
          }, 300);
        }
      }

      if (scanActive && scanRingRef.value) {
        scanElapsed += delta;
        const scanProgress = Math.min(scanElapsed / SCAN_DURATION, 1);

        scanRingRef.value.visible = true;
        scanRingRef.value.position.copy(droneRef.value.position);
        scanRingRef.value.position.y -= 0.5;

        // Drive grid-scan shader uniforms
        scanUniforms.uProgress.value = scanProgress;
        scanUniforms.uOpacity.value = 1.0 - scanProgress * scanProgress;

        if (scanProgress >= 1) {
          scanActive = false;
          scanRingRef.value.visible = false;
          scanUniforms.uProgress.value = 0;
          scanUniforms.uOpacity.value = 0;
        }
      }
    }
  }

  if (abductionParticlesRef.value) {
    const posAttr = abductionParticlesRef.value.geometry?.attributes?.position;

    if (posAttr) {
      const isAbducting =
        renderState.isContentPhase && ufoRef.value && ufoRef.value.position.y < 8.0;

      if (isAbducting && !abductionParticlesRef.value.visible) {
        // Record activation time to trigger bottom-up streaming effect
        abductionUniforms.uActivationTime.value = elapsed;
      }

      if (isAbducting) {
        abductionOpacity = MathUtils.lerp(abductionOpacity, 1.0, delta * 10);
        abductionParticlesRef.value.visible = true;
      } else {
        abductionOpacity = MathUtils.lerp(abductionOpacity, 0.0, delta * 5);
        if (abductionOpacity < 0.01) {
          abductionParticlesRef.value.visible = false;
        }
      }

      if (abductionParticlesRef.value.visible) {
        // Update uniforms instead of modifying positions on CPU
        abductionUniforms.uOpacity.value = abductionOpacity * 0.8;
      }
    }
  }

  if (dustRef.value) {
    dustRef.value.rotation.y += 0.05 * delta;
    dustRef.value.rotation.x += 0.02 * delta;
  }

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

  abductionUniforms.uTime.value = elapsed;

  if (!shaderMaterialRef.value) return;

  const u = shaderMaterialRef.value.uniforms;
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
