<template>
  <div class="app-root" :class="{ 
    'hide-system-cursor': isCustomCursorActive,
    'is-ci-mode': performance.isCiMode
  }">
    <!-- WebGL Canvas Background (replaces SpotlightMask, PerspectiveGrid, VolumetricBeam) -->
    <WebGLBackground v-if="performance.isWebGLSupported" />
    <ResilienceLayer />

    <!-- Scrolling Content Layer -->
    <div
      v-if="performance.isReady"
      class="content-stage"
      :style="rootCssVars"
    >
      <Transition name="fade-overlay" mode="out-in" @after-enter="handleAfterEnter">
        <!-- Navigation Phase -->
        <div
          v-if="lighting.phase === 'NAV'"
          key="nav"
          class="h-screen w-full relative"
        >
          <!-- Floating Controls (NAV Phase — Responsive Layout) -->
          <div
            class="fixed top-2 right-2 md:top-8 md:right-8 z-[100] flex flex-col md:flex-row items-end md:items-center gap-1.5 md:gap-4 pointer-events-auto"
          >
            <LightingToggle />
            <ThemeToggle />
          </div>
          <!-- Fused Background Text (Landing Page Parity) -->
          <div
            class="absolute inset-0 flex items-end justify-center pointer-events-none pb-[10vh]"
            style="
              mask-image: var(--reveal-mask);
              -webkit-mask-image: var(--reveal-mask);
            "
          >
            <div
              class="text-[10vw] md:text-[12vw] font-black uppercase tracking-tighter select-none text-white/[0.03] leading-none"
            >
              Technical DNA
            </div>
          </div>
          <NavConveyor />
        </div>

        <!-- Content Phase (Fused Bento Grid) -->
        <div
          v-else
          key="content"
          class="p-4 md:p-8 lg:p-16 min-h-screen relative"
        >
          <!-- Floating Controls (Responsive Layout) -->
          <div
            class="fixed top-2 right-2 md:top-8 md:right-8 z-[100] flex flex-col md:flex-row items-end md:items-center gap-1.5 md:gap-4 pointer-events-auto"
          >
            <LightingToggle />
            <ThemeToggle />
            <button
              type="button"
              @click="handleBackToNav"
              class="px-2 md:px-4 py-2 border whitespace-nowrap border-white/10 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/10 transition-all duration-200 text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98]"
            >
              [ ESC ] Back
            </button>
          </div>

          <div
            class="max-w-6xl mx-auto flex flex-col gap-6 pt-12 md:pt-20 relative z-10"
          >
            <!-- High-Fidelity Hero (Outside Bento for dominance) -->
            <HeroSection />

            <BentoLayout>
              <SkillsAbout />
              <ProjectsSection />
              <ContactForm />
            </BentoLayout>
          </div>

          <BackToTop />
        </div>
      </Transition>
    </div>

    <!-- Flash Overlay for Transitions -->
    <div
      class="flash-overlay"
      :class="{ 'flash-active': lighting.isFlashActive }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import ContactForm from './components/features/ContactForm.vue';
import HeroSection from './components/features/HeroSection.vue';
import ProjectsSection from './components/features/ProjectsSection.vue';
import SkillsAbout from './components/features/SkillsAbout.vue';
import BentoLayout from './components/layout/BentoLayout.vue';

// Lazy load the heavy WebGL background to keep the initial bundle small
const WebGLBackground = defineAsyncComponent(
  () => import('./components/layout/WebGLBackground.vue')
);

import ResilienceLayer from './components/layout/ResilienceLayer.vue';
import BackToTop from './components/navigation/BackToTop.vue';
import LightingToggle from './components/navigation/LightingToggle.vue';
import NavConveyor from './components/navigation/NavConveyor.vue';
import ThemeToggle from './components/navigation/ThemeToggle.vue';
import { initGlobalViewportService } from './composables/useViewportStore';
import { useLightingStore } from './stores/lighting';
import { usePerformanceStore } from './stores/usePerformanceStore';
import { useThemeStore } from './stores/useThemeStore';
import { LightingPhase } from './types';

// Use the stores directly to avoid any destructuring reactivity caveats
const lighting = useLightingStore();
const themeStore = useThemeStore();
const performance = usePerformanceStore();

// Check if we use the WebGL scanner (only on Content page + light on)
const isCustomCursorActive = computed(() => {
  return themeStore.lightingEnabled && lighting.phase === 'CONTENT';
});

/**
 * CSS custom properties set on root element for child access.
 * --reveal-mask is consumed by FusedReveal and App.vue slotted content.
 * Only changes on phase transition (NAV ↔ CONTENT), not on every mouse move.
 */
const rootCssVars = computed<CSSProperties>(() => {
  if (!themeStore.lightingEnabled) return {};

  const isNav = lighting.phase === 'NAV';
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Use a wider gradient on mobile to cover more of the smaller screen
  const maskSize = isMobile ? '80% 120%' : '40% 160%';

  return {
    '--reveal-mask': isNav
      ? `radial-gradient(ellipse ${maskSize} at 50% -10%, black 0%, rgba(0,0,0,0) 100%)`
      : '',
  } as CSSProperties;
});

const handleBackToNav = () => {
  lighting.setPhase(LightingPhase.NAV);
};

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && lighting.phase === 'CONTENT') {
    handleBackToNav();
  }
};

const handleAfterEnter = () => {
  const target = lighting.pendingScrollTarget;
  if (!target) return;
  lighting.pendingScrollTarget = null;

  // Wait for the transition to settle and the DOM to be fully updated
  setTimeout(() => {
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

onMounted(async () => {
  window.addEventListener('keydown', handleGlobalKeydown);

  console.log('App Mounted in Fused Single-Layer Mode');
  initGlobalViewportService();

  // Run GPU performance benchmark early to determine rendering tier
  await performance.checkPerformance();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<style>
.app-root {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh; /* Fallback */
  height: 100dvh;
  overflow: hidden;
  background: black;
  transition: background-color var(--theme-transition-duration) ease-in-out;
}

.content-stage {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  z-index: 1;

  /* Hide scrollbar completely */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.content-stage::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

.flash-overlay {
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  pointer-events: none;
  z-index: 999;
  transition: opacity 0.3s ease-out;
}
.flash-active {
  opacity: 0.1;
  transition: opacity 0.05s ease-in;
}

/* Versteckt den Mauszeiger NUR, wenn der Custom-Scanner aktiv ist */
.hide-system-cursor,
.hide-system-cursor * {
  cursor: none !important;
}

/* CI Mode Overrides: Eliminate transitions for stable Lighthouse scores */
.is-ci-mode,
.is-ci-mode * {
  transition-duration: 0s !important;
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-delay: 0s !important;
}
</style>
