<template>
  <!-- About Tile (Discovery Path) -->
  <BentoCard id="about-discovery" class="md:col-span-3 md:row-span-1" with-window title="Discovery Path" :is-low-end="performance.isLowEnd">
    <div class="p-4 md:p-8 flex flex-col h-full">
      <p class="text-finished-text/50 text-sm md:text-base leading-relaxed max-w-2xl">
        {{ bio.content }}
      </p>
    </div>
  </BentoCard>

  <!-- Skills Tile (STACK) -->
  <BentoCard id="skills-stack" class="md:col-span-1 md:row-span-1" with-window title="Stack" :is-low-end="performance.isLowEnd">
    <div class="p-4 md:p-8 flex flex-col h-full">
      <div class="flex flex-wrap gap-2 md:gap-3">
        <span 
          v-for="skill in stack.skills" 
          :key="skill"
          class="px-2.5 py-1 md:px-3 md:py-1.5 border border-finished-text/5 bg-finished-text/[0.03] rounded-full text-[9px] md:text-[10px] uppercase tracking-widest text-finished-text/40 hover:border-finished-accent/30 hover:text-finished-text/80 transition-colors duration-300"
        >
          {{ skill }}
        </span>
      </div>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import { SKILL_SECTIONS } from '../../data/portfolio';
import { usePerformanceStore } from '../../stores/usePerformanceStore';
import BentoCard from '../shared/BentoCard.vue';

const performance = usePerformanceStore();
const bio = SKILL_SECTIONS.find((s) => s.id === 'bio') || SKILL_SECTIONS[0];
const stack = SKILL_SECTIONS.find((s) => s.id === 'stack') || SKILL_SECTIONS[0];
</script>
