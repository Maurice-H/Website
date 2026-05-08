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
  <TresGroup ref="ufoRef" :position="[0, 1.6, 0]">
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
    <TresGroup :position="[0.5, -0.2, 0.5]">
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
import { useLoop, useTresContext } from "@tresjs/core";
import {
  Box3,
  BufferAttribute,
  CanvasTexture,
  Color,
  type Group,
  type Material,
  type Mesh,
  type Texture,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  type SpotLight,
  Vector2,
  Vector3,
  type WebGLRenderer,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GLTFLoader } from "three-stdlib";
import { onMounted, shallowRef, watch } from "vue";

// --- TRESJS CRASH PREVENTION PATCH ---
// TresJS memory profiler crashes if it encounters a Mesh without a position attribute
// (e.g. HighlightMesh from DevTools). We intercept all traverses to guarantee stability.
const originalTraverse = Object3D.prototype.traverse;
Object3D.prototype.traverse = function (callback: (object: Object3D) => any) {
  if ((this as any).isMesh) {
    const mesh = this as any;
    if (mesh.geometry && !mesh.geometry.attributes.position) {
      mesh.geometry.setAttribute(
        "position",
        new BufferAttribute(new Float32Array([0, 0, 0]), 3),
      );
    }
  }
  return originalTraverse.call(this, callback);
};

// -------------------------------------

import { computed, watchEffect } from "vue";
import fragmentShader from "../../shaders/main.frag.glsl?raw";
import vertexShader from "../../shaders/main.vert.glsl?raw";
import { useLightingStore } from "../../stores/lighting";
import { usePerformanceStore } from "../../stores/usePerformanceStore";
import { useThemeStore } from "../../stores/useThemeStore";
import { useViewportStore } from "../../stores/viewport";
import { projectToScreenSpace } from "../../utils/webgl";

function grayscaleTexture(tex: Texture | null): Texture | null {
  if (!tex || !tex.image) return tex;
  const img = tex.image;

  const canvas = document.createElement("canvas");
  canvas.width = img.width || 1024;
  canvas.height = img.height || 1024;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
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
    console.error("Grayscale texture failed:", e);
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
    obj.traverse((child: any) => {
      if (child.isMesh && child.visible && child.geometry) {
        if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
        const childBox = child.geometry.boundingBox.clone();
        childBox.applyMatrix4(child.matrixWorld);
        box.union(childBox);
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

    const meshName = (mesh.name || "").toLowerCase();
    const matName = (mat.name || "").toLowerCase();
    if (
      meshName.includes("shadow") ||
      matName.includes("shadow") ||
      meshName.includes("collision") ||
      meshName.includes("proxy")
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

      const isGlass = mat.transparent && mat.opacity < 0.9;

      if (!isGlass) {
        const hsl = { h: 0, s: 0, l: 0 };
        mat.color.getHSL(hsl);
        if (hsl.l < 0.15) {
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

    const matName = (mat.name || "").toLowerCase();
    const meshName = (mesh.name || "").toLowerCase();
    const isLens =
      matName.includes("lens") ||
      matName.includes("glass") ||
      matName.includes("eye") ||
      meshName.includes("lens") ||
      meshName.includes("glass") ||
      meshName.includes("eye");

    const isAccent =
      matName.includes("glow") ||
      matName.includes("accent") ||
      matName.includes("light") ||
      matName.includes("neon") ||
      matName.includes("ring") ||
      matName.includes("emitter") ||
      meshName.includes("glow") ||
      meshName.includes("accent") ||
      meshName.includes("light") ||
      meshName.includes("neon") ||
      meshName.includes("ring") ||
      meshName.includes("emitter");

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

function logModelDiagnostics(label: string, scene: Group): void {
  let meshCount = 0;
  const materialTypes = new Set<string>();

  scene.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    meshCount++;
    const mat = mesh.material as Material;
    materialTypes.add(mat.type);
  });

  const box = new Box3().setFromObject(scene);
  const size = new Vector3();
  box.getSize(size);

  console.info(
    `[WebGLScene] ${label}: ${meshCount} meshes, materials: [${[...materialTypes].join(", ")}], bbox: ${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)}`,
  );
}

// ── Stores & Reactive State ──
const themeStore = useThemeStore();
const accentColorStr = computed(() =>
  themeStore.isBlueprintMode ? "#38bdf8" : "#10b981",
);

// ── 3D Model Loading ──
const ufoScene = shallowRef<Group | null>(null);
const droneScene = shallowRef<Group | null>(null);

const UFO_TARGET_SIZE = 0.8;
const DRONE_TARGET_SIZE = 1.2;

onMounted(() => {
  const loader = new GLTFLoader();

  loader.load(
    "/models/ufo.glb",
    (gltf) => {
      logModelDiagnostics("UFO", gltf.scene);

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
    },
    undefined,
    (error) => {
      console.error(
        "[WebGLScene] ufo.glb not found — using primitive fallback.",
        error,
      );
    },
  );

  loader.load(
    "/models/drone-v2.glb",
    (gltf) => {
      logModelDiagnostics("Drone", gltf.scene);
      prepareForScreenBlend(gltf.scene);
      normalizeModel(gltf.scene, DRONE_TARGET_SIZE);
      recolorAccentMeshes(gltf.scene, accentColorStr.value);
      droneScene.value = gltf.scene;
    },
    undefined,
    (error) => {
      console.error(
        "[WebGLScene] drone-v2.glb not found — using primitive fallback.",
        error,
      );
    },
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
const isHighEnd = computed(
  () => performanceStore.gpuTier && performanceStore.gpuTier >= 3,
);

const shaderMaterialRef = shallowRef();
const dustRef = shallowRef();
const ufoRef = shallowRef();
const droneRef = shallowRef<Group | null>(null);
const droneSpotlightRef = shallowRef<SpotLight | null>(null);
const droneSpotTargetRef = shallowRef<Object3D | null>(null);
const scanRingRef = shallowRef();
const viewportStore = useViewportStore();
const lightingStore = useLightingStore();

// ── Organic Drone Flight System (§7) ──
function getOrganicFlightPosition(time: number, target: Vector3): void {
  // X: Wide horizontal sweeps from -6 to +6 (figure-8 patterns)
  const x = Math.sin(time * 0.2) * 4 + Math.sin(time * 0.5) * 2;

  // Y: Height variation from -1.5 to 1.5
  const y = Math.cos(time * 0.3) * 1.0 + Math.sin(time * 0.8) * 0.5;

  // Z: Depth variation from -5 to -1
  const z = Math.sin(time * 0.25) * 2 - 3;

  target.set(x, y, z);
}

const droneCurrentPos = new Vector3(0, 0, -2);
const droneDummyObj = new Object3D();

// ── Scan Grid State & Shader (§9) ──
const SCAN_INTERVAL = 20;
let lastScanTime = 0;
let scanActive = false;
let scanElapsed = 0;
const SCAN_DURATION = 3;

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
    composer = new EffectComposer(activeRenderer as unknown as WebGLRenderer);

    const renderPass = new RenderPass(scene.value, activeCamera);
    composer.addPass(renderPass);

    if (isHighEnd.value && !performanceStore.isCiMode) {
      const bloomPass = new UnrealBloomPass(
        new Vector2(sizes.width.value, sizes.height.value),
        0.15,
        0.5,
        0.9,
      );
      composer.addPass(bloomPass);
    }

    rgbShiftPass = new ShaderPass(RGB_SHIFT_SHADER);
    rgbShiftPass.uniforms.amount.value = 0.0;
    composer.addPass(rgbShiftPass);

    if (isHighEnd.value) {
      glitchPass = new GlitchPass();
      glitchPass.enabled = false;
      glitchPass.goWild = false;
      composer.addPass(glitchPass);
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
  },
);

const particleCount = performanceStore.isCiMode
  ? 10
  : isHighEnd.value
    ? 200
    : 50;
const dustPositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  dustPositions[i] = (Math.random() - 0.5) * 6;
}

const uniforms = {
  uMouse: { value: new Vector2(window.innerWidth / 2, window.innerHeight / 2) },
  uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
  uTime: { value: 0 },
  uThemeState: { value: 0.0 },
  uLightingEnabled: { value: true },
  uPhase: { value: 0.0 },
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

  scanUniforms.uColor.value = [accentColor.r, accentColor.g, accentColor.b];

  renderState.isNavPhase = lightingStore.phase === "NAV";
  renderState.isContentPhase = lightingStore.phase === "CONTENT";
  renderState.isBlueprintMode = themeStore.isBlueprintMode ? 1.0 : 0.0;
  renderState.lightingEnabled = themeStore.lightingEnabled;
});

onBeforeRender(({ elapsed, delta }) => {
  if (ufoRef.value && camera.activeCamera.value) {
    if (ufoRef.value.visible !== renderState.isNavPhase) {
      ufoRef.value.visible = renderState.isNavPhase;
    }

    if (renderState.isNavPhase) {
      ufoRef.value.position.y = 1.6 + Math.sin(elapsed * 2) * 0.1;

      if (shaderMaterialRef.value) {
        projectToScreenSpace(
          ufoRef.value.position,
          camera.activeCamera.value,
          shaderMaterialRef.value.uniforms.uUfoPosition.value,
        );
      }
    }
  }

  if (droneRef.value) {
    const droneVisible = renderState.isContentPhase;
    if (droneRef.value.visible !== droneVisible) {
      droneRef.value.visible = droneVisible;
    }

    if (droneVisible) {
      // ── Organic Physics-Based Flight (§7) ──
      const targetPos = new Vector3();
      getOrganicFlightPosition(elapsed, targetPos);

      // 1. Smoothly interpolate position (adds weight/inertia)
      const posSmoothing = 1.0 - Math.exp(-2.0 * delta);
      droneCurrentPos.lerp(targetPos, posSmoothing);

      // Add micro-hover bobbing to the physical position
      const hoverY = Math.sin(elapsed * 3.5) * 0.1;
      droneRef.value.position.copy(droneCurrentPos);
      droneRef.value.position.y += hoverY;

      // 2. Calculate ideal rotation (look at future point on the curve)
      const lookAtPos = new Vector3();
      getOrganicFlightPosition(elapsed + 0.4, lookAtPos);

      droneDummyObj.position.copy(droneCurrentPos);
      droneDummyObj.lookAt(lookAtPos);

      // Dynamic pitch based on vertical climb/dive
      const vY = targetPos.y - droneCurrentPos.y;
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

      // ── Spotlight target rigidly follows drone (§8) ──
      if (droneSpotlightRef.value && droneSpotTargetRef.value) {
        // Bind the spotlight to its local target
        droneSpotlightRef.value.target = droneSpotTargetRef.value;

        // Subtle intensity flicker/breathing
        droneSpotlightRef.value.intensity =
          3 + Math.sin(elapsed * 8) * 0.5 + Math.sin(elapsed * 13) * 0.3;
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
    rgbShiftPass.uniforms.amount.value +=
      (targetAmount - rgbShiftPass.uniforms.amount.value) * 0.1;
  }

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

  const currentPhase = renderState.isContentPhase ? 1.0 : 0.0;
  if (u.uPhase.value !== currentPhase) {
    u.uPhase.value = currentPhase;
  }
});
</script>
