<template>
  <!-- UFO (GLB model with primitive fallback) -->
  <TresGroup
    v-if="visible || isTransitioning"
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
        <TresMeshBasicMaterial :color="accentColor" />
      </TresMesh>
    </TresMesh>
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
</template>

<script setup lang="ts">
import { Color, type Group, type Material, type Mesh } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';

import { abductionFragShader } from '@/shaders/abduction.frag';
import { abductionVertShader } from '@/shaders/abduction.vert';
import { envConfig } from '@/utils/env';
import { normalizeModel, prepareForScreenBlend, recolorAccentMeshes } from '@/utils/glb-helpers';

const props = defineProps<{
  accentColor: string;
  visible: boolean;
}>();

const emit = defineEmits<{
  loaded: [];
}>();

const UFO_TARGET_SIZE = 0.8;
const ABDUCTION_PARTICLE_COUNT = 150;

const ufoScene = shallowRef<Group | null>(null);
const ufoRef = shallowRef<Group | null>(null);
const abductionParticlesRef = shallowRef();
const isTransitioning = ref(false);

// ── Abduction Particles ──
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

const abductionUniforms = {
  uTime: { value: 0 },
  uActivationTime: { value: 0 },
  uPixelRatio: { value: typeof window !== 'undefined' ? window.devicePixelRatio || 1.0 : 1.0 },
  uColor: { value: new Color(props.accentColor) },
  uOpacity: { value: 0.0 },
};

watch(
  () => props.accentColor,
  (newColor) => {
    abductionUniforms.uColor.value.set(newColor);
    if (ufoScene.value) recolorAccentMeshes(ufoScene.value, newColor);
  }
);

/** Allow parent to flag transitioning state when phase changes NAV → CONTENT */
function setTransitioning(value: boolean) {
  isTransitioning.value = value;
}

defineExpose({
  ufoRef,
  ufoScene,
  abductionParticlesRef,
  abductionUniforms,
  isTransitioning,
  setTransitioning,
});

// ── Model Loading ──
const gltfLoader = new GLTFLoader();

onMounted(() => {
  gltfLoader.load(
    `${envConfig.BASE_URL}models/ufo.glb`,
    (gltf) => {
      // Tag UFO materials definitively
      gltf.scene.traverse((child) => {
        const mesh = child as Mesh;
        if (mesh.isMesh && mesh.material) {
          (mesh.material as Material).userData.isUfoMaterial = true;
        }
      });

      prepareForScreenBlend(gltf.scene);
      normalizeModel(gltf.scene, UFO_TARGET_SIZE);
      recolorAccentMeshes(gltf.scene, props.accentColor);
      ufoScene.value = gltf.scene;
      emit('loaded');
    },
    undefined,
    (error) => {
      console.error('[UfoEntity] ufo.glb not found — using primitive fallback.', error);
      emit('loaded');
    }
  );
});

onUnmounted(() => {
  ufoScene.value = null;
});
</script>
