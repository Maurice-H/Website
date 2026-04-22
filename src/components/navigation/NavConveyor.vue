<template>
  <div class="nav-conveyor">
    <!-- Physical Lamp Fixture -->
    <div class="lamp-fixture">
      <div class="lamp-wire"></div>
      <div class="lamp-housing">
        <div class="lamp-bulb"></div>
      </div>
    </div>

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
        <div v-if="tab.theme === 'career'" class="content-terminal">
          <div class="code-line">
            <span class="text-finished-accent">></span> experience.list()
          </div>
          <div class="code-line opacity-50">Loading data...</div>
          <div class="code-line text-xs">2024: Frontend Dev</div>
          <div class="cursor">_</div>
        </div>

        <div v-else-if="tab.theme === 'about'" class="content-profile">
          <div class="profile-circle"></div>
          <div class="profile-lines">
            <div class="line"></div>
            <div class="line w-3/4"></div>
          </div>
        </div>

        <div v-else-if="tab.theme === 'projects'" class="content-grid">
          <div class="grid-box" v-for="i in 4" :key="i"></div>
        </div>

        <div v-else-if="tab.theme === 'contact'" class="content-envelope">
          <div class="envelope-back">
            <div class="envelope-flap"></div>
          </div>
        </div>
      </NavWindow>
    </div>

    <!-- Hint -->
    <div class="drag-hint">
      <span v-if="activeId === 'about'">← Explore My Story</span>
      <span v-else-if="activeId === 'projects'">Browse My Work</span>
      <span v-else-if="activeId === 'skills'">Technical DNA</span>
      <span v-else-if="activeId === 'contact'">Let's Connect →</span>
      <span v-else>← drag or scroll to browse →</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useLightingEngine } from '../../composables/useLightingEngine';
import { NAV_TABS as tabs } from '../../data/portfolio';
import { LightingPhase } from '../../types/index';
// biome-ignore lint/correctness/noUnusedImports: template-use
import NavWindow from './NavWindow.vue';

const { setPhase } = useLightingEngine();
const trackEl = ref<HTMLElement | null>(null);

const activeId = ref('about');

// ---------- Drag-to-scroll ----------
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

// biome-ignore lint/correctness/noUnusedVariables: template-use
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

// biome-ignore lint/correctness/noUnusedVariables: template-use
const onWheel = (e: WheelEvent) => {
  if (!trackEl.value) return;
  trackEl.value.scrollLeft += e.deltaY;
};

// biome-ignore lint/correctness/noUnusedVariables: template-use
const selectTab = (id: string) => {
  if (isDragging) return; // ignore click after drag
  if (id !== activeId.value) {
    // Scroll to it first?
    return;
  }
  setPhase(LightingPhase.CONTENT);
};

onMounted(() => {
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  handleScroll(); // Initial check
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
}

/* ---- Lamp Fixture ---- */
.lamp-fixture {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 30;
}

.lamp-wire {
  width: 2px;
  height: 40px;
  background: linear-gradient(to bottom, #333, #555);
}

.lamp-housing {
  width: 60px;
  height: 34px;
  background: linear-gradient(to bottom, #2a2a2a, #111);
  clip-path: polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 5px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
}

.lamp-housing::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 4px;
  background: #333;
}

.lamp-bulb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 30%, var(--finished-accent) 100%);
  box-shadow:
    0 0 12px var(--finished-accent),
    0 0 32px var(--finished-accent),
    0 0 80px rgba(74, 222, 128, 0.4);
}

/* ---- Conveyor Track ---- */
.conveyor-track {
  display: flex;
  gap: 80px;
  padding: 60px calc(50vw - 140px); /* Vertical padding prevents clipping during scale-up */
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
}
.conveyor-track.mask-fused {
  mask-image: var(--reveal-mask);
  -webkit-mask-image: var(--reveal-mask);
}
.conveyor-track::-webkit-scrollbar {
  display: none;
}

/* ---- Hint ---- */
.drag-hint {
  position: absolute;
  bottom: 60px;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.25;
  color: var(--finished-text);
  pointer-events: none;
}
</style>
