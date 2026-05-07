<template>
  <div class="nav-conveyor">
    <!-- Grid Background -->
    <div class="nav-grid"></div>

    <!-- Conveyor Belt (drag-scrollable) -->
    <div
      class="conveyor-track mask-fused"
      ref="trackEl"
      role="tablist"
      aria-label="Navigation Conveyor"
      @pointerdown="startDrag"
      @wheel.prevent="onWheel"
      @scroll="handleScroll"
    >
      <!-- ⚡ Bolt: Use v-memo to skip virtual DOM diffing for inactive tabs during scroll events -->
      <NavWindow
        v-for="tab in tabs"
        :key="tab.id"
        v-memo="[activeId === tab.id]"
        :theme="tab.theme"
        :label="tab.label"
        :active="activeId === tab.id"
        @click="selectTab(tab.id, $event)"
        @keydown.enter="selectTab(tab.id, $event)"
        @keydown.space.prevent="selectTab(tab.id, $event)"
      >
        <!-- EXPERIENCE Card -->
        <div
          v-if="tab.theme === 'career'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <h2 class="window-title">EXPERIENCE</h2>
          <div class="flex flex-col items-start gap-1">
            <div class="code-line">
              <span class="opacity-30">$</span> career --summary
            </div>
            <div class="code-line text-finished-accent/60">
              Frontend Developer &amp; System Architect
            </div>
            <div class="code-line opacity-50">
              Vue 3 · TypeScript · WebGL
            </div>
            <div class="code-line mt-1 text-finished-text/20 text-[0.65rem] tracking-widest uppercase">
              Click to explore →
            </div>
          </div>
        </div>

        <!-- ABOUT Card -->
        <div
          v-else-if="tab.theme === 'about'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <h2 class="window-title">ABOUT ME</h2>
          <div class="flex flex-col items-start gap-1">
            <div class="code-line">
              <span class="opacity-30">$</span> whoami
            </div>
            <div class="code-line text-finished-accent/60">
              Maurice — Junior Developer
            </div>
            <div class="code-line opacity-50">
              Germany · Performance Obsessed
            </div>
            <div class="code-line mt-1 text-finished-text/20 text-[0.65rem] tracking-widest uppercase">
              Click to explore →
            </div>
          </div>
        </div>

        <!-- PROJECTS Card -->
        <div
          v-else-if="tab.theme === 'projects'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <h2 class="window-title">PROJECTS</h2>
          <div class="flex flex-col items-start gap-1">
            <div class="code-line">
              <span class="opacity-30">$</span> ls ~/works --count
            </div>
            <div class="code-line text-finished-accent/60">
              {{ projectCount }} repositories indexed
            </div>
            <div class="code-line opacity-50">
              Vue 3 · Node.js · Three.js
            </div>
            <div class="code-line mt-1 text-finished-text/20 text-[0.65rem] tracking-widest uppercase">
              Click to explore →
            </div>
          </div>
        </div>

        <!-- CONTACT Card -->
        <div
          v-else-if="tab.theme === 'contact'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <h2 class="window-title">GET IN TOUCH</h2>
          <div class="flex flex-col items-center gap-3">
            <EnvelopeIcon />
            <div class="code-line text-finished-text/20 text-[0.65rem] tracking-widest uppercase">
              Email · Discord · LinkedIn
            </div>
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
import { PROJECTS, NAV_TABS as tabs } from '../../data/portfolio';
import { useLightingStore } from '../../stores/lighting';
import { LightingPhase } from '../../types/index';
import EnvelopeIcon from '../icons/EnvelopeIcon.vue';
import NavWindow from './NavWindow.vue';

const lightingStore = useLightingStore();
const trackEl = ref<HTMLElement | null>(null);

const activeId = ref('skills'); // Start at EXPERIENCE to match mockup
const projectCount = PROJECTS.length;

// ---------- Drag-to-scroll ----------
let isDragging = false;
let hasMoved = false;
let isProgrammaticScroll = false;
let scrollTimeout: number | null = null;
let startX = 0;
let mouseDownX = 0; // Added for distance-based click detection
let scrollLeft = 0;

const startDrag = (e: PointerEvent) => {
  if (!trackEl.value) return;
  isDragging = true;
  hasMoved = false;
  startX = e.pageX - trackEl.value.offsetLeft;
  mouseDownX = e.pageX; // Capture start X
  scrollLeft = trackEl.value.scrollLeft;
  trackEl.value.style.cursor = 'grabbing';
};

const onDrag = (e: PointerEvent) => {
  if (!isDragging || !trackEl.value) return;
  const x = e.pageX - trackEl.value.offsetLeft;
  const walk = (x - startX) * 2;

  if (Math.abs(walk) > 5) {
    hasMoved = true;
  }

  if (hasMoved) {
    e.preventDefault();
    trackEl.value.scrollLeft = scrollLeft - walk;
  }
};

const stopDrag = (_e: PointerEvent) => {
  isDragging = false;
  if (trackEl.value) {
    trackEl.value.style.cursor = 'grab';
  }
};

const handleScroll = () => {
  if (isProgrammaticScroll || !trackEl.value?.children[0]) return;

  const firstChild = trackEl.value.children[0] as HTMLElement;
  const gap = window.innerWidth < 768 ? 40 : 120;
  const step = firstChild.offsetWidth + gap;

  // Pure math calculation to find active tab index based on scrollLeft
  const rawIndex = Math.round(Math.max(0, trackEl.value.scrollLeft) / step);
  const clampedIndex = Math.max(0, Math.min(rawIndex, tabs.length - 1));

  activeId.value = tabs[clampedIndex].id;
};

const onWheel = (e: WheelEvent) => {
  if (!trackEl.value) return;
  // Use scrollBy for more consistent behavior across browsers with snap
  trackEl.value.scrollBy({
    left: e.deltaY * 4.0 + e.deltaX,
    behavior: 'smooth',
  });
};

const selectTab = (id: string, e: PointerEvent | KeyboardEvent) => {
  if (e instanceof PointerEvent) {
    // Distance-based check is much more robust for E2E tests than a simple flag
    const moveDistance = Math.abs(e.pageX - (mouseDownX || e.pageX));

    if (moveDistance > 15) {
      return;
    }
  }

  activeId.value = id;
  const tab = tabs.find((t) => t.id === id);
  lightingStore.pendingScrollTarget = tab?.targetSection ?? null;
  lightingStore.setPhase(LightingPhase.CONTENT);

  // Smooth scroll to the selected tab if it's not centered
  const index = tabs.findIndex((t) => t.id === id);
  if (trackEl.value?.children[index]) {
    isProgrammaticScroll = true;
    const targetEl = trackEl.value.children[index] as HTMLElement;
    targetEl.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });

    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      isProgrammaticScroll = false;
    }, 600);
  }
};

const navigate = (direction: 'prev' | 'next') => {
  const currentIndex = tabs.findIndex((t) => t.id === activeId.value);
  let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

  if (nextIndex < 0) nextIndex = 0;
  if (nextIndex >= tabs.length) nextIndex = tabs.length - 1;

  // Scroll to the new target. We DO NOT set activeId manually here,
  // allowing handleScroll to update it naturally as it centers.
  if (trackEl.value?.children[nextIndex]) {
    const targetEl = trackEl.value.children[nextIndex] as HTMLElement;
    targetEl.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }
};

const handleGlobalKeydown = (e: KeyboardEvent) => {
  // Prevent default arrow key scrolling and handle navigation
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    navigate('prev');
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    navigate('next');
  }
};

onMounted(() => {
  window.addEventListener('pointermove', onDrag);
  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('keydown', handleGlobalKeydown);
  // Initial scroll to EXPERIENCE
  if (trackEl.value) {
    // Find the skills tab
    const index = tabs.findIndex((t) => t.id === 'skills');
    if (index >= 0) {
      setTimeout(() => {
        if (!trackEl.value?.children[0]) return;
        const firstChild = trackEl.value.children[0] as HTMLElement;
        const gap = window.innerWidth < 768 ? 40 : 120;
        const step = firstChild.offsetWidth + gap;

        const targetScroll = index * step - window.innerWidth / 2 + firstChild.offsetWidth / 2;
        trackEl.value.scrollLeft = Math.max(0, targetScroll);
        handleScroll();
      }, 100);
    }
  }
});
onUnmounted(() => {
  window.removeEventListener('pointermove', onDrag);
  window.removeEventListener('pointerup', stopDrag);
  window.removeEventListener('keydown', handleGlobalKeydown);
  if (scrollTimeout) clearTimeout(scrollTimeout);
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
  --track-px: max(2rem, calc(50vw - 240px));
  display: flex;
  gap: 120px;
  padding: 60px var(--track-px);
  width: 100%;
  height: min-content;
  align-self: flex-start;
  overflow-x: auto;
  cursor: grab;
  user-select: none;
  scroll-behavior: auto; /* Allow immediate programmatic scroll for wheel/drag */
  -ms-overflow-style: none;
  scrollbar-width: none;
  align-items: center;
  z-index: 60;
  scroll-snap-type: x proximity; /* Proximity is less sticky than mandatory for wheel scroll */
  touch-action: none;
}

@media (max-width: 768px) {
  .conveyor-track {
    /* Half of mobile card width (280px) ensures centering of first/last items */
    --track-px: calc(50vw - 140px);
    gap: 40px;
    padding: 30px var(--track-px);
  }
}

/* Ensure cards snap to center */
:deep(.nav-window) {
  scroll-snap-align: center;
}

/* Ensure the active card is illuminated and inactive ones are dark */
:deep(.nav-window:not(.is-active)) {
  opacity: 0.3;
  filter: brightness(0.5) contrast(1.2);
}

.conveyor-track::-webkit-scrollbar,
.conveyor-track *::-webkit-scrollbar {
  display: none;
}

/* Window Frame Title*/
.window-title {
  font-size: clamp(1rem, 4vw, 1.5rem);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-bottom: clamp(0.75rem, 3vw, 1.5rem);
  color: var(--finished-accent);
  text-align: center;
  filter: drop-shadow(
    0 0 15px color-mix(in srgb, var(--finished-accent) 50%, transparent)
  );
}

.icon-envelope {
  width: clamp(2rem, 10vw, 3rem);
  height: clamp(2rem, 10vw, 3rem);
}

/* ---- Hint ---- */
.drag-hint {
  position: absolute;
  bottom: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  opacity: 0.3;
  color: #fff;
  pointer-events: none;
  z-index: 10;
}

@media (min-width: 769px) {
  .drag-hint {
    bottom: 40px;
    font-size: 0.8rem;
    opacity: 0.4;
  }
}
</style>
