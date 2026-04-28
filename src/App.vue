<template>
  <SpotlightMask>
    <Transition name="fade-overlay" mode="out-in">
      <!-- Navigation Phase -->
      <div v-if="lighting.phase === 'NAV'" key="nav" class="h-screen w-full relative">
        <!-- Fused Background Text (Landing Page Parity) -->
        <div 
          class="absolute inset-0 flex items-end justify-center pointer-events-none pb-[10vh]"
          style="mask-image: var(--reveal-mask); -webkit-mask-image: var(--reveal-mask);"
        >
          <div class="text-[12vw] font-black uppercase tracking-tighter select-none text-white/[0.03] leading-none">
            Technical DNA
          </div>
        </div>
        <NavConveyor />
      </div>

      <!-- Content Phase (Fused Bento Grid) -->
      <div v-else key="content" class="p-4 md:p-8 lg:p-16 min-h-screen relative">
        <!-- Floating Controls (Theme Toggle + ESC Back) -->
        <div class="fixed top-8 right-8 z-[100] flex items-center gap-4 pointer-events-auto">
          <ThemeToggle />
          <button 
            type="button"
            @click="handleBackToNav"
            class="px-4 py-2 border border-white/10 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/10 transition-all text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white cursor-pointer"
          >
            [ ESC ] Back
          </button>
        </div>

        <div class="max-w-6xl mx-auto flex flex-col gap-6 pt-12 md:pt-20 relative z-10">
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
  </SpotlightMask>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ContactForm from './components/features/ContactForm.vue';
import HeroSection from './components/features/HeroSection.vue';
import ProjectsSection from './components/features/ProjectsSection.vue';
import SkillsAbout from './components/features/SkillsAbout.vue';
import BentoLayout from './components/layout/BentoLayout.vue';
import SpotlightMask from './components/layout/SpotlightMask.vue';
import NavConveyor from './components/navigation/NavConveyor.vue';
import ThemeToggle from './components/navigation/ThemeToggle.vue';
import { initGlobalViewportService } from './composables/useViewportStore';
import { useLightingStore } from './stores/lighting';
import { LightingPhase } from './types';

// Use the store directly to avoid any destructuring reactivity caveats
const lighting = useLightingStore();

const handleBackToNav = () => {
  lighting.setPhase(LightingPhase.NAV);
};

onMounted(() => {
  console.log('App Mounted in Fused Single-Layer Mode');
  initGlobalViewportService();
});
</script>

<style>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}
</style>
