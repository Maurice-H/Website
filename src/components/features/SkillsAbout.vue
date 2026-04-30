<template>
  <!-- About Tile (Discovery Path) -->
  <BentoCard id="about-discovery" class="md:col-span-3 md:row-span-1" with-window title="Discovery Path">
    <div class="p-10 flex flex-col h-full">
      <p class="text-finished-text/50 text-lg leading-relaxed max-w-2xl">
        {{ bio.content }}
      </p>
    </div>
  </BentoCard>

  <!-- Skills Tile (STACK) -->
  <BentoCard id="skills-stack" class="md:col-span-1 md:row-span-1" with-window title="Stack">
    <div class="p-10 flex flex-col h-full">
      <div class="flex flex-wrap gap-3">
        <span 
          v-for="skill in stack.skills" 
          :key="skill"
          class="px-3 py-1.5 border border-finished-text/5 bg-finished-text/[0.03] rounded-full text-[10px] uppercase tracking-widest text-finished-text/40 hover:border-finished-accent/30 hover:text-finished-text/80 transition-all duration-300"
        >
          {{ skill }}
        </span>
      </div>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import { SKILL_SECTIONS } from '../../data/portfolio';
import BentoCard from '../shared/BentoCard.vue';

const bio = SKILL_SECTIONS.find((s) => s.id === 'bio') || SKILL_SECTIONS[0];
const stack = SKILL_SECTIONS.find((s) => s.id === 'stack') || SKILL_SECTIONS[0];
</script>
