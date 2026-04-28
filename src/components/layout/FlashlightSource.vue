<template>
  <div 
    v-if="lighting.phase === 'CONTENT'"
    class="flashlight-container fixed pointer-events-none z-[100]"
    :style="containerStyle"
  >
    <!-- The physical flashlight body (Technical industrial look) -->
    <div class="flashlight-body">
      <!-- Emitter head / lens -->
      <div class="flashlight-head">
        <div class="flashlight-lens"></div>
        <div class="flashlight-lens-glow"></div>
      </div>
      
      <!-- Grip section -->
      <div class="flashlight-grip">
        <div class="grip-texture"></div>
        <div class="flashlight-button"></div>
      </div>
      
      <!-- Tail cap -->
      <div class="flashlight-tail"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLightingStore } from '../../stores/lighting';

const lighting = useLightingStore();

const _containerStyle = computed(() => {
  return {
    right: '100px',
    bottom: '-50px',
    // translateX(50%) centers the 50px wide flashlight exactly on the 150px right mark
    transform: `translateX(50%) rotate(${lighting.flashlightRotation + 90}deg)`,
    transformOrigin: '50% 20px',
    transition: 'transform 0.1s linear',
  };
});
</script>

<style scoped>
.flashlight-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.4));
}

/* Emitter Head */
.flashlight-head {
  width: 50px;
  height: 28px;
  background: linear-gradient(to right, #08110c, #142a20, #1e3d2e, #142a20, #08110c);
  border-radius: 8px 8px 4px 4px;
  position: relative;
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: 
    0 4px 10px rgba(0,0,0,0.8),
    inset 0 2px 4px rgba(255,255,255,0.1);
}

/* Metallic rim */
.flashlight-head::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  height: 4px;
  background: linear-gradient(to bottom, rgba(16, 185, 129, 0.3), transparent);
  border-radius: 4px 4px 0 0;
}

.flashlight-lens {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 12px;
  background: radial-gradient(circle, #fff 0%, rgba(16, 185, 129, 0.8) 40%, transparent 100%);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
}

.flashlight-lens-glow {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  background: radial-gradient(ellipse, var(--finished-accent) 0%, transparent 70%);
  filter: blur(15px);
  opacity: 0.8;
}

/* Grip Section */
.flashlight-grip {
  width: 34px;
  height: 120px;
  background: linear-gradient(to right, #050a07, #0d1a13, #142a20, #0d1a13, #050a07);
  border-left: 1px solid rgba(16, 185, 129, 0.1);
  border-right: 1px solid rgba(16, 185, 129, 0.1);
  position: relative;
}

.grip-texture {
  position: absolute;
  inset: 12px 6px;
  background: 
    repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3) 0px,
      rgba(0, 0, 0, 0.3) 1px,
      transparent 1px,
      transparent 3px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.3) 0px,
      rgba(0, 0, 0, 0.3) 1px,
      transparent 1px,
      transparent 3px
    );
  border-radius: 4px;
  opacity: 0.5;
}

.flashlight-button {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  background: radial-gradient(circle at 30% 30%, #142a20, #050a07);
  border-radius: 50%;
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: 
    0 2px 4px rgba(0,0,0,0.5),
    inset 0 1px 2px rgba(255,255,255,0.1);
}

.flashlight-button::after {
  content: "";
  position: absolute;
  inset: 4px;
  background: var(--finished-accent);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--finished-accent);
  opacity: 0.8;
}

/* Tail Cap */
.flashlight-tail {
  width: 38px;
  height: 16px;
  background: linear-gradient(to bottom, #142a20, #050a07);
  border-radius: 0 0 10px 10px;
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-top: none;
}

.emitter-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
