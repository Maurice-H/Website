<template>
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
        <TresMeshBasicMaterial :color="accentColor" />
      </TresMesh>
    </TresMesh>

    <!-- Beam System (rigidly attached to drone lens) -->
    <TresGroup :position="[0.27, 0.26, -0.1]">
      <!-- Drone Spotlight -->
      <TresSpotLight
        ref="droneSpotlightRef"
        :color="accentColor"
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
          v-if="lightingEnabled"
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
</template>

<script setup lang="ts">
import { Color, type Group, type Mesh, type Object3D, type SpotLight } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { onMounted, onUnmounted, shallowRef, watch } from 'vue';

import { beamFragShader } from '@/shaders/beam.frag';
import { beamVertShader } from '@/shaders/beam.vert';
import { scanFragShader } from '@/shaders/scan.frag';
import { scanVertShader } from '@/shaders/scan.vert';
import { envConfig } from '@/utils/env';
import { normalizeModel, prepareForScreenBlend, recolorAccentMeshes } from '@/utils/glb-helpers';

const props = defineProps<{
  accentColor: string;
  lightingEnabled: boolean;
}>();

const DRONE_TARGET_SIZE = 0.3;

const droneScene = shallowRef<Group | null>(null);
const droneRef = shallowRef<Group | null>(null);
const droneSpotlightRef = shallowRef<SpotLight | null>(null);
const droneSpotTargetRef = shallowRef<Object3D | null>(null);
const scanRingRef = shallowRef();

const beamUniforms = {
  uColor: { value: new Color(props.accentColor) },
};

const scanUniforms = {
  uProgress: { value: 0.0 },
  uColor: { value: [0.063, 0.725, 0.506] },
  uOpacity: { value: 0.0 },
};

// Sync accent color changes to uniforms
watch(
  () => props.accentColor,
  (newColor) => {
    beamUniforms.uColor.value.set(newColor);
    const c = new Color(newColor);
    scanUniforms.uColor.value = [c.r, c.g, c.b];

    if (droneScene.value) recolorAccentMeshes(droneScene.value, newColor);
  }
);

// ── Model Loading ──
const gltfLoader = new GLTFLoader();
let droneLoadStarted = false;

function loadDroneModel() {
  if (droneLoadStarted || droneScene.value) return;
  droneLoadStarted = true;

  gltfLoader.load(
    `${envConfig.BASE_URL}models/drone.glb`,
    (gltf) => {
      // Hide rogue artifact meshes included in the downloaded GLB
      gltf.scene.traverse((child) => {
        const mesh = child as Mesh;
        if (mesh.isMesh && mesh.name.toLowerCase().includes('plane')) {
          mesh.visible = false;
        }
      });

      prepareForScreenBlend(gltf.scene);
      normalizeModel(gltf.scene, DRONE_TARGET_SIZE);
      recolorAccentMeshes(gltf.scene, props.accentColor);
      droneScene.value = gltf.scene;
    },
    undefined,
    (error) => {
      console.error('[DroneEntity] drone.glb not found — using primitive fallback.', error);
      droneLoadStarted = false;
    }
  );
}

/** Start loading the drone model — called by parent when ready */
function startLoading() {
  loadDroneModel();
}

defineExpose({
  droneRef,
  droneScene,
  droneSpotlightRef,
  droneSpotTargetRef,
  scanRingRef,
  scanUniforms,
  beamUniforms,
  startLoading,
});

onMounted(() => {
  // Bind spotlight to its target after mount
  if (droneSpotlightRef.value && droneSpotTargetRef.value) {
    droneSpotlightRef.value.target = droneSpotTargetRef.value;
  }
});

onUnmounted(() => {
  droneScene.value = null;
});
</script>
