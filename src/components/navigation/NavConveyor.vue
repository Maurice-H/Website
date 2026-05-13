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
      @scroll="handleScroll()"
    >
      <!-- ⚡ Bolt: Use v-memo to skip virtual DOM diffing for inactive tabs during scroll events -->
      <NavWindow
        v-for="tab in tabs"
        :key="tab.id"
        v-memo="[activeId === tab.id, locale, isLoading, error, projectCount]"
        :theme="tab.theme"
        :label="tab.labelKey ? $t(tab.labelKey) : tab.label"
        :active="activeId === tab.id"
        :data-testid="`nav-window-${tab.id}`"
        @click="selectTab(tab.id, $event)"
        @keydown.enter="selectTab(tab.id, $event)"
        @keydown.space.prevent="selectTab(tab.id, $event)"
      >
        <!-- EXPERIENCE Card -->
        <div
          v-if="tab.theme === 'career'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <div class="flex flex-col items-center md:items-start text-center md:text-left gap-1 w-full px-4 md:px-0 md:w-auto">
            <div class="code-line justify-center md:justify-start">
              <span class="opacity-30">$</span> {{ $t("nav.career.command") }}
            </div>
            <div class="code-line justify-center md:justify-start text-finished-accent/60">
              {{ $t("nav.career.role") }}
            </div>
            <div class="code-line justify-center md:justify-start opacity-50">{{ $t("nav.career.stack") }}</div>
            <div
              class="code-line justify-center md:justify-start mt-1 text-finished-text/20 text-xs tracking-widest uppercase"
            >
              {{ $t("nav.career.cta") }}
            </div>
          </div>
        </div>

        <!-- ABOUT Card -->
        <div
          v-else-if="tab.theme === 'about'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <div class="flex flex-col items-center md:items-start text-center md:text-left gap-1 w-full px-4 md:px-0 md:w-auto">
            <div class="code-line justify-center md:justify-start">
              <span class="opacity-30">$</span> {{ $t("nav.about.command") }}
            </div>
            <div class="code-line justify-center md:justify-start text-finished-accent/60">
              {{ $t("nav.about.role") }}
            </div>
            <div class="code-line justify-center md:justify-start opacity-50">
              {{ $t("nav.about.location") }}
            </div>
            <div
              class="code-line justify-center md:justify-start mt-1 text-finished-text/20 text-xs tracking-widest uppercase"
            >
              {{ $t("nav.about.cta") }}
            </div>
          </div>
        </div>

        <!-- PROJECTS Card -->
        <div
          v-else-if="tab.theme === 'projects'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <div class="flex flex-col items-center md:items-start text-center md:text-left gap-1 w-full px-4 md:px-0 md:w-auto">
            <div class="code-line justify-center md:justify-start">
              <span class="opacity-30">$</span>
              {{ $t("nav.projectsCard.command") }}
            </div>
            <div class="code-line justify-center md:justify-start text-finished-accent/60">
              <template v-if="isLoading">
                <span class="animate-pulse">{{ $t("nav.projectsCard.count", { count: "..." }) }}</span>
              </template>
              <template v-else-if="error">
                {{ $t("nav.projectsCard.count", { count: "?" }) }}
              </template>
              <template v-else>
                {{ $t("nav.projectsCard.count", { count: projectCount }) }}
              </template>
            </div>
            <div class="code-line justify-center md:justify-start opacity-50">
              {{ $t("nav.projectsCard.stack") }}
            </div>
            <div
              class="code-line justify-center md:justify-start mt-1 text-finished-text/20 text-xs tracking-widest uppercase"
            >
              {{ $t("nav.projectsCard.cta") }}
            </div>
          </div>
        </div>

        <!-- CONTACT Card -->
        <div
          v-else-if="tab.theme === 'contact'"
          class="content-terminal flex flex-col items-center justify-center h-full"
        >
          <div class="flex flex-col items-center gap-3">
            <EnvelopeIcon />
            <div
              class="code-line text-finished-text/20 text-xs tracking-widest uppercase"
            >
              {{ $t("nav.contactCard.channels") }}
            </div>
          </div>
        </div>
      </NavWindow>
    </div>

    <!-- Keyboard Shortcut Display -->
    <div class="shortcut-bar">
      <div class="shortcut-items">
        <div
          v-for="action in shortcutActions"
          :key="action"
          role="button"
          tabindex="0"
          class="shortcut-item focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          :class="{
            'shortcut-item--rebinding':
              shortcutStore.rebindingAction === action,
          }"
          @click.stop="handleShortcutClick(action)"
          @keydown.enter.stop="handleShortcutClick(action)"
          @keydown.space.prevent.stop="handleShortcutClick(action)"
        >
          <kbd>{{
            shortcutStore.rebindingAction === action
              ? "..."
              : shortcutStore.getDisplay(action)
          }}</kbd>
          <span>{{ shortcutStore.getLabel(action) }}</span>
        </div>
      </div>
      <button
        v-if="!isMobile"
        type="button"
        class="shortcut-edit-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        :title="
          shortcutStore.rebindingAction ? 'Cancel rebind' : 'Edit shortcuts'
        "
        :aria-label="
          shortcutStore.rebindingAction ? 'Cancel rebind' : 'Edit shortcuts'
        "
        :aria-pressed="!!shortcutStore.rebindingAction"
        :class="{ 'shortcut-edit-btn--active': shortcutStore.rebindingAction }"
        @click.stop="
          shortcutStore.rebindingAction
            ? shortcutStore.cancelRebind()
            : shortcutStore.startRebind('lighting')
        "
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button
        v-if="!isMobile"
        type="button"
        class="shortcut-reset-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        title="Reset all shortcuts"
        aria-label="Reset all shortcuts"
        @click.stop="shortcutStore.resetAll()"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
      <LocaleSwitcher />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAudio } from '../../composables/useAudio';
import { useGitHubProjects } from '../../composables/useGitHubProjects';
import { NAV_TABS as tabs } from '../../data/portfolio';
import { useLightingStore } from '../../stores/lighting';
import { type ShortcutAction, useShortcutStore } from '../../stores/useShortcutStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { LightingPhase } from '../../types/index';
import EnvelopeIcon from '../icons/EnvelopeIcon.vue';
import LocaleSwitcher from '../shared/LocaleSwitcher.vue';
import NavWindow from './NavWindow.vue';

const lightingStore = useLightingStore();
const shortcutStore = useShortcutStore();
const themeStore = useThemeStore();
const { playClick, playGlitch } = useAudio();
const { locale } = useI18n();

const isMobile = ref(typeof window !== 'undefined' && window.innerWidth < 768);
const updateMobileState = () => {
  isMobile.value = typeof window !== 'undefined' && window.innerWidth < 768;
};

const shortcutActions = computed<ShortcutAction[]>(() =>
  isMobile.value ? ['lighting', 'theme'] : ['lighting', 'theme', 'back']
);

const handleShortcutClick = (action: ShortcutAction) => {
  if (isMobile.value) {
    if (action === 'lighting') {
      themeStore.toggleLighting();
      playClick();
    } else if (action === 'theme') {
      themeStore.toggleTheme();
      playGlitch();
    }
  } else {
    shortcutStore.startRebind(action);
  }
};
const trackEl = ref<HTMLElement | null>(null);

const activeId = ref('skills'); // Start at EXPERIENCE to match mockup

const { projects, isLoading, error } = useGitHubProjects();
const projectCount = computed(() => projects.value.length);

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

const handleScroll = (force = false) => {
  if (!force && (isProgrammaticScroll || !trackEl.value?.children[0])) return;

  const track = trackEl.value;
  if (!track) return;

  const children = Array.from(track.children) as HTMLElement[];
  if (children.length === 0) return;

  // ⚡ Bolt: Using scrollLeft + clientWidth / 2 instead of getBoundingClientRect
  // prevents layout thrashing on high-frequency scroll events
  const trackCenter = track.scrollLeft + track.clientWidth / 2;

  let closestIndex = 0;
  let minDistance = Infinity;

  children.forEach((child, i) => {
    const childCenter = child.offsetLeft + child.clientWidth / 2;
    const distance = Math.abs(childCenter - trackCenter);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  });

  const clampedIndex = Math.max(0, Math.min(closestIndex, tabs.length - 1));
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

const scrollToTab = (id: string) => {
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

const selectTab = (id: string, e: PointerEvent | KeyboardEvent) => {
  if (e instanceof PointerEvent) {
    // Distance-based check is much more robust for E2E tests than a simple flag
    const moveDistance = Math.abs(e.pageX - (mouseDownX || e.pageX));
    if (moveDistance > 15) {
      return;
    }
  }

  // ── Two-Step Navigation ──
  // Step 1: Clicking an inactive tab only highlights it
  if (activeId.value !== id) {
    activeId.value = id;
    scrollToTab(id);
    return;
  }

  // Step 2: Clicking the already-highlighted tab navigates
  const tab = tabs.find((t) => t.id === id);
  lightingStore.pendingScrollTarget = tab?.targetSection ?? null;
  lightingStore.setPhase(LightingPhase.CONTENT);
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
  window.addEventListener('resize', updateMobileState);
  window.addEventListener('pointermove', onDrag);
  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('keydown', handleGlobalKeydown);
  // Initial scroll to EXPERIENCE (Skills)
  if (trackEl.value) {
    const index = tabs.findIndex((t) => t.id === 'skills');
    if (index >= 0) {
      isProgrammaticScroll = true;
      setTimeout(() => {
        const targetEl = trackEl.value?.children[index] as HTMLElement;
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
          handleScroll(true);
        }
        setTimeout(() => {
          isProgrammaticScroll = false;
        }, 150);
      }, 150);
    }
  }
});
onUnmounted(() => {
  window.removeEventListener('resize', updateMobileState);
  window.removeEventListener('pointermove', onDrag);
  window.removeEventListener('pointerup', stopDrag);
  window.removeEventListener('keydown', handleGlobalKeydown);
  if (scrollTimeout) clearTimeout(scrollTimeout);
});
</script>

<style scoped>
.nav-conveyor {
  height: 100vh;
  height: 100dvh;
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
  position: relative; /* ⚡ Bolt: Required to make this the offsetParent for children's offsetLeft */
  display: flex;
  gap: 140px;
  padding: 100px var(--track-px);
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

/* ---- Shortcut Bar ---- */
.shortcut-bar {
  position: absolute;
  bottom: max(48px, calc(env(safe-area-inset-bottom, 0px) + 32px));
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  padding: 6px 10px;
  border: 1px solid color-mix(in srgb, var(--finished-accent) 20%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--finished-accent) 4%, transparent);
  backdrop-filter: blur(8px);
}

.shortcut-items {
  display: flex;
  gap: 12px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  opacity: 0.55;
}

.shortcut-item:hover {
  opacity: 0.7;
}

.shortcut-item--rebinding {
  opacity: 1;
}

.shortcut-item--rebinding kbd {
  border-color: var(--finished-accent);
  color: var(--finished-accent);
  animation: rebind-pulse 0.8s ease-in-out infinite;
}

.shortcut-item kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--finished-accent);
  background: color-mix(in srgb, var(--finished-accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--finished-accent) 25%, transparent);
  border-radius: 3px;
  box-shadow: 0 0 8px color-mix(in srgb, var(--finished-accent) 8%, transparent);
  transition: all 0.2s ease;
}

.shortcut-item span {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.45);
}

.shortcut-edit-btn,
.shortcut-reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: color-mix(in srgb, var(--finished-accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--finished-accent) 20%, transparent);
  border-radius: 3px;
  color: var(--finished-accent);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.shortcut-edit-btn:hover,
.shortcut-reset-btn:hover {
  opacity: 1;
  color: var(--finished-accent);
  border-color: color-mix(in srgb, var(--finished-accent) 40%, transparent);
  background: color-mix(in srgb, var(--finished-accent) 15%, transparent);
}

.shortcut-edit-btn--active {
  opacity: 1;
  color: var(--finished-accent);
  border-color: var(--finished-accent);
}

@keyframes rebind-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@media (min-width: 769px) {
  .shortcut-bar {
    bottom: 40px;
  }

  .shortcut-items {
    gap: 16px;
  }

  .shortcut-item kbd {
    font-size: 0.75rem;
    min-width: 22px;
    height: 22px;
  }

  .shortcut-item span {
    font-size: 0.75rem;
  }
}
</style>
