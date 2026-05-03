<template>
  <div class="app-root" :class="{ 'hide-system-cursor': isCustomCursorActive }">
    <!-- WebGL Canvas Background (replaces SpotlightMask, PerspectiveGrid, VolumetricBeam) -->
    <WebGLBackground />

    <!-- Scrolling Content Layer -->
    <div class="content-stage" :style="rootCssVars">
      <Transition name="fade-overlay" mode="out-in">
        <!-- Navigation Phase -->
        <div
          v-if="lighting.phase === 'NAV'"
          key="nav"
          class="h-screen w-full relative"
        >
          <!-- Floating Controls (NAV Phase — Lighting Toggle only) -->
          <div
            class="fixed top-8 right-8 z-[100] flex items-center gap-4 pointer-events-auto"
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
              class="text-[12vw] font-black uppercase tracking-tighter select-none text-white/[0.03] leading-none"
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
          <!-- Floating Controls (Theme Toggle + ESC Back) -->
          <div
            class="fixed top-8 right-8 z-[100] flex items-center gap-4 pointer-events-auto"
          >
            <LightingToggle />
            <ThemeToggle />
            <button
              type="button"
              @click="handleBackToNav"
              class="px-2 md:px-4 py-2 border whitespace-nowrap border-white/10 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/10 transition-colors text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white cursor-pointer"
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
import { computed, defineAsyncComponent, onMounted } from 'vue';
import ContactForm from './components/features/ContactForm.vue';
import HeroSection from './components/features/HeroSection.vue';
import ProjectsSection from './components/features/ProjectsSection.vue';
import SkillsAbout from './components/features/SkillsAbout.vue';
import BentoLayout from './components/layout/BentoLayout.vue';

// Lazy load the heavy WebGL background to keep the initial bundle small
const WebGLBackground = defineAsyncComponent(
  () => import('./components/layout/WebGLBackground.vue')
);

import LightingToggle from './components/navigation/LightingToggle.vue';
import NavConveyor from './components/navigation/NavConveyor.vue';
import ThemeToggle from './components/navigation/ThemeToggle.vue';
import { initGlobalViewportService } from './composables/useViewportStore';
import { useLightingStore } from './stores/lighting';
import { useThemeStore } from './stores/useThemeStore';
import { LightingPhase } from './types';

// Use the store directly to avoid any destructuring reactivity caveats
const lighting = useLightingStore();
const themeStore = useThemeStore();

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

  return {
    '--reveal-mask': isNav
      ? `radial-gradient(ellipse 40% 160% at 50% -10%, black 0%, rgba(0,0,0,0) 100%)`
      : '',
  } as CSSProperties;
});

const handleBackToNav = () => {
  lighting.setPhase(LightingPhase.NAV);
};

onMounted(() => {
  console.log('App Mounted in Fused Single-Layer Mode');
  initGlobalViewportService();
});
</script>

<style>
.app-root {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
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
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
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
</style>
