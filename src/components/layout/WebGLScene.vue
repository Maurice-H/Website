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
      <TresObject3D ref="droneSpotTargetRef" :position="[0, -3, 0]" />

      <!-- Visible Light Cone -->
      <TresMesh :position="[-0.78, -0.67, 1.2]" :rotation="[5, 0, 0]">
        <TresConeGeometry :args="[0.4, 3, 16, 1, true]" />
        <TresMeshBasicMaterial
          :color="accentColorStr"
          :transparent="true"
          :opacity="0.08"
          :depth-write="false"
          :side="2"
        />
      </TresMesh>
    </TresGroup>
  </TresGroup>

  <!-- Drone Area Scan (grid sweep shader) -->
  <TresMesh ref="scanRingRef" :visible="false" :rotation="[0, 0, 0]">
    <TresPlaneGeometry :args="[10, 10]" />
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
  Color,
  type Group,
  type Material,
  type Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  type SpotLight,
  type Object3D,
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
import { computed, onMounted, shallowRef, watch, watchEffect } from "vue";
import fragmentShader from "../../shaders/main.frag.glsl?raw";
import vertexShader from "../../shaders/main.vert.glsl?raw";
import { useLightingStore } from "../../stores/lighting";
import { usePerformanceStore } from "../../stores/usePerformanceStore";
import { useThemeStore } from "../../stores/useThemeStore";
import { useViewportStore } from "../../stores/viewport";
import { projectToScreenSpace } from "../../utils/webgl";

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

        if (mat.map && !mat.emissiveMap) {
          mat.emissiveMap = mat.map;
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
      mat.color.setHSL(hsl.h, hsl.s, Math.min(mat.l * 1.5, 1.0));
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

    if (isLens) {
      mat.emissive.set(newColorHex);
      mat.color.set(newColorHex);
      mat.emissiveIntensity = 1.0;
      mat.needsUpdate = true;
      return;
    }

    const hsl = { h: 0, s: 0, l: 0 };
    original.getHSL(hsl);
    const isGreenHue = hsl.h >= 0.278 && hsl.h <= 0.5 && hsl.s > 0.1;
    if (isGreenHue) {
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

// ── Drone Patrol Waypoint System (§7) ──
interface PatrolWaypoint {
  position: Vector3;
  t: number;
}

const PATROL_CYCLE_DURATION = 45;
const patrolWaypoints: PatrolWaypoint[] = [
  { position: new Vector3(-5, 0.5, -3), t: 0 },
  { position: new Vector3(0, 1.0, -4), t: 0.17 },
  { position: new Vector3(5, 0.5, -3), t: 0.33 },
  { position: new Vector3(3, -0.5, -1), t: 0.44 },
  { position: new Vector3(0, -1.0, 1), t: 0.56 },
  { position: new Vector3(0, -1.0, 1), t: 0.67 },
  { position: new Vector3(-3, 0.0, -1), t: 0.78 },
  { position: new Vector3(-5, 0.5, -3), t: 1.0 },
];

const droneForward = new Vector3();

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function getPatrolPosition(elapsed: number, target: Vector3): void {
  const cycleT = (elapsed % PATROL_CYCLE_DURATION) / PATROL_CYCLE_DURATION;

  let fromIdx = 0;
  for (let i = 0; i < patrolWaypoints.length - 1; i++) {
    if (cycleT >= patrolWaypoints[i].t && cycleT < patrolWaypoints[i + 1].t) {
      fromIdx = i;
      break;
    }
  }

  const from = patrolWaypoints[fromIdx];
  const to = patrolWaypoints[fromIdx + 1] ?? patrolWaypoints[0];
  const segmentDuration = to.t - from.t;
  const segmentT =
    segmentDuration > 0 ? (cycleT - from.t) / segmentDuration : 0;
  const eased = smoothstep(Math.min(Math.max(segmentT, 0), 1));

  target.lerpVectors(from.position, to.position, eased);
}

// ── Scan Grid State & Shader (§9) ──
const SCAN_INTERVAL = 30;
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

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float dist = length(p);
    if (dist > 1.0) discard;

    float sweepW = 0.12;
    float sweep = smoothstep(uProgress - sweepW, uProgress, dist)
                * (1.0 - smoothstep(uProgress, uProgress + 0.03, dist));

    float rings = 1.0 - smoothstep(0.005, 0.02, abs(fract(dist * 8.0) - 0.5));

    float angle = atan(p.y, p.x);
    float sector = abs(fract(angle * 6.0 / PI) - 0.5);
    float radials = 1.0 - smoothstep(0.005, 0.04, sector);

    float gridMask = smoothstep(uProgress + 0.05, uProgress - 0.05, dist);
    float grid = max(rings, radials) * gridMask * 0.3;

    float alpha = (sweep * 0.9 + grid) * uOpacity;
    alpha *= smoothstep(1.0, 0.85, dist);
    gl_FragColor = vec4(uColor, alpha);
  }`;

const scanUniforms = {
  uProgress: { value: 0.0 },
  uColor: { value: [0.063, 0.725, 0.506] },
  uOpacity: { value: 0.0 },
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
      const prevPos = new Vector3().copy(droneRef.value.position);
      getPatrolPosition(elapsed, droneRef.value.position);

      droneRef.value.position.y += Math.sin(elapsed * 2.5) * 0.15;

      droneForward.subVectors(droneRef.value.position, prevPos);
      if (droneForward.lengthSq() > 0.0001) {
        const lookTarget = new Vector3().addVectors(
          droneRef.value.position,
          droneForward,
        );
        droneRef.value.rotation.set(0, 0, 0);
        droneRef.value.lookAt(lookTarget);

        droneRef.value.rotateZ(Math.sin(elapsed * 1.5) * 0.15);
        droneRef.value.rotateX(Math.sin(elapsed * 2) * 0.05);
      }

      // ── Spotlight target rigidly follows drone (§8) ──
      if (droneSpotlightRef.value && droneSpotTargetRef.value) {
        droneSpotlightRef.value.target = droneSpotTargetRef.value;

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
