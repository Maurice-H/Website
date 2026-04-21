<template>
  <SpotlightMask>
    <!-- Navigation Phase -->
    <div v-if="state.phase === phases.NAV" class="h-screen w-full relative">
      <!-- Fused Background Text -->
      <div 
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
        style="mask-image: var(--reveal-mask); -webkit-mask-image: var(--reveal-mask);"
      >
        <div class="text-[8vw] font-black uppercase tracking-tighter select-none text-white/[0.03]">
          Portfolio
        </div>
      </div>
      <NavConveyor />
    </div>

    <!-- Content Phase (Fused Bento Grid) -->
    <div v-else class="p-8 lg:p-16 min-h-screen">
      <div class="max-w-7xl mx-auto flex flex-col gap-6">
        <header class="w-full flex justify-between items-center px-6 mb-8">
          <button 
            @click="setPhase(phases.NAV)"
            class="px-4 py-2 border border-[var(--finished-border)] box-shadow-[var(--finished-glow)] rounded-xl bg-finished-bg hover:scale-105 transition-transform text-xs uppercase tracking-widest text-finished-accent"
          >
            Back to Navigation
          </button>
          <div class="flex items-center gap-4">
            <ThemeToggle />
            <div class="text-xs tracking-widest opacity-30 select-none">
              [ PORTFOLIO v2 // 2026 ]
            </div>
          </div>
        </header>
        
        <BentoLayout>
          <HeroSection />
          <SkillsAbout />
          <ProjectsSection />
          <ContactForm />
        </BentoLayout>
      </div>
    </div>
  </SpotlightMask>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import ContactForm from "./components/features/ContactForm.vue";
import HeroSection from "./components/features/HeroSection.vue";
import ProjectsSection from "./components/features/ProjectsSection.vue";
import SkillsAbout from "./components/features/SkillsAbout.vue";
import NavConveyor from "./components/navigation/NavConveyor.vue";
import SpotlightMask from "./components/layout/SpotlightMask.vue";
import BentoLayout from "./components/layout/BentoLayout.vue";
import ThemeToggle from "./components/navigation/ThemeToggle.vue";
import { useLightingEngine } from "./composables/useLightingEngine";
import { initGlobalViewportService } from "./composables/useViewportStore";
import { LightingPhase } from "./types";

const { state, setPhase } = useLightingEngine();

// Reference for template use
const phases = LightingPhase;

onMounted(() => {
	console.log("App Mounted in Fused Single-Layer Mode");
	initGlobalViewportService();
});
</script>

<style>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
