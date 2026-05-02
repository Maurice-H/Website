<template>
  <div class="nav-conveyor">
    <!-- Grid Background -->
    <div class="nav-grid"></div>

    

    <!-- Conveyor Belt (drag-scrollable) -->
    <div
      class="conveyor-track mask-fused"
      ref="trackEl"
      @mousedown="startDrag"
      @wheel.prevent="onWheel"
      @scroll="handleScroll"
    >
      <NavWindow
        v-for="tab in tabs"
        :key="tab.id"
        :theme="tab.theme"
        :label="tab.label"
        :active="activeId === tab.id"
        @click="selectTab(tab.id)"
      >
        <!-- The mockup has a large title inside the card for EXPERIENCE -->
        <div
          v-if="tab.theme === 'career'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <h2 class="window-title">EXPERIENCE</h2>
          <div class="w-full text-left">
            <div class="code-line">
              <span class="opacity-30">></span> system.boot_sequence(91)...
            </div>
            <div class="code-line">LOADING DATA...</div>
            <div class="code-line">
              2024: FRONTEND DEV - SYSTEM ARCHITECT...
            </div>
            <div class="cursor mt-2"></div>
          </div>
        </div>

        <div
          v-else-if="tab.theme === 'about'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <h2 class="window-title">ABOUT ME</h2>
          <div class="w-full text-left">
            <div class="code-line">
              <span class="opacity-30">></span> fetch_profile(maurice)...
            </div>
            <div class="code-line">STATUS: ONLINE</div>
            <div class="code-line">LOCATION: GERMANY</div>
            <div class="cursor mt-2"></div>
          </div>
        </div>

        <div
          v-else-if="tab.theme === 'projects'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <h2 class="window-title">PROJECTS</h2>
          <div class="w-full text-left">
            <div class="code-line">
              <span class="opacity-30">></span> ls -la /works
            </div>
            <div class="code-line">FOUND: 42 REPOSITORIES</div>
            <div class="code-line">STACK: VUE3 / TS / NODE</div>
            <div class="cursor mt-2"></div>
          </div>
        </div>

        <div
          v-else-if="tab.theme === 'contact'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <h2 class="window-title">GET IN TOUCH</h2>
          <div class="w-full text-left flex justify-center">
            <svg
              class="w-12 h-12 text-finished-text/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </NavWindow>
    </div>

    <!-- Hint matching the mockup 'TECHNICAL DNA' text -->
    <div class="drag-hint">TECHNICAL DNA</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { NAV_TABS as tabs } from '../../data/portfolio';
import { useLightingStore } from '../../stores/lighting';
import { LightingPhase } from '../../types/index';
import NavWindow from './NavWindow.vue';

const lightingStore = useLightingStore();
const trackEl = ref<HTMLElement | null>(null);

const activeId = ref('skills'); // Start at EXPERIENCE to match mockup

// ---------- Drag-to-scroll ----------
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

const startDrag = (e: MouseEvent) => {
  if (!trackEl.value) return;
  isDragging = true;
  startX = e.pageX - trackEl.value.offsetLeft;
  scrollLeft = trackEl.value.scrollLeft;
  trackEl.value.style.cursor = 'grabbing';
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging || !trackEl.value) return;
  e.preventDefault();
  const x = e.pageX - trackEl.value.offsetLeft;
  const walk = (x - startX) * 2; // speed multiplier
  trackEl.value.scrollLeft = scrollLeft - walk;
};

const stopDrag = () => {
  isDragging = false;
  if (trackEl.value) trackEl.value.style.cursor = 'grab';
};

const handleScroll = () => {
  if (!trackEl.value) return;

  // Find which tab is closest to center
  const elements = trackEl.value.querySelectorAll('.nav-window');
  let closestId = tabs[0].id;
  let minDistance = Infinity;

  elements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const elCenter = rect.left + rect.width / 2;
    const distance = Math.abs(window.innerWidth / 2 - elCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closestId = tabs[index].id;
    }
  });

  activeId.value = closestId;
};

const onWheel = (e: WheelEvent) => {
  if (!trackEl.value) return;
  trackEl.value.scrollLeft += e.deltaY;
};

const selectTab = (id: string) => {
  if (isDragging) return; // ignore click after drag
  if (id !== activeId.value) {
    // Optionally auto-scroll to it, but for now we just require it to be centered to click
    return;
  }
  lightingStore.setPhase(LightingPhase.CONTENT);
};

onMounted(() => {
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  // Initial scroll to EXPERIENCE
  if (trackEl.value) {
    // Find the skills tab
    const index = tabs.findIndex((t) => t.id === 'skills');
    if (index >= 0) {
      setTimeout(() => {
        if (!trackEl.value) return;
        const targetScroll = index * 600 - window.innerWidth / 2 + 240;
        trackEl.value.scrollLeft = Math.max(0, targetScroll);
        handleScroll();
      }, 100);
    }
  }
});
onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
.nav-conveyor {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: transparent; /* WebGL canvas shows through from behind */
}

/* ---- Background Grid ---- */
.nav-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  background-position: center center;
  z-index: 0;
  pointer-events: none;
}






/* ---- Conveyor Track ---- */
.conveyor-track {
  display: flex;
  gap: 120px;
  padding: 60px calc(50vw - 240px);
  width: 100%;
  height: min-content;
  align-self: flex-start;
  overflow-x: auto;
  cursor: grab;
  user-select: none;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  align-items: center;
  position: relative;
  z-index: 60; /* bring cards in front of the light base but inside the glow */
}
/* Ensure the active card is illuminated and inactive ones are dark */
:deep(.nav-window:not(.is-active)) {
  opacity: 0.3;
  filter: brightness(0.5) contrast(1.2);
}

.conveyor-track::-webkit-scrollbar {
  display: none;
}

/* Window Frame Title*/
.window-title {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  margin-bottom: 1.5rem;
  color: var(--finished-accent);
  filter: drop-shadow(
    0 0 15px color-mix(in srgb, var(--finished-accent) 50%, transparent)
  );
}

/* ---- Hint ---- */
.drag-hint {
  position: absolute;
  bottom: 40px;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  opacity: 0.4;
  color: #fff;
  pointer-events: none;
  z-index: 10;
}
</style>
