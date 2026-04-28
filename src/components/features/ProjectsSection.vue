<template>
  <BentoCard 
    v-for="project in projects" 
    :key="project.id"
    class="md:col-span-2 md:row-span-1 group cursor-pointer"
    with-window
    :title="project.title"
  >
    <div class="p-8 flex flex-col h-full">
      <div class="flex-1 mt-6">
        <p class="mb-6 text-sm leading-relaxed text-white/50">
          {{ project.description }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2 mt-auto">
        <span 
          v-for="tag in project.tags" 
          :key="tag"
          class="px-2 py-0.5 text-[10px] uppercase tracking-widest rounded border border-white/10 bg-transparent text-white/30 group-hover:border-accent-color/20 group-hover:text-white/60 transition-all"
        >
          {{ tag }}
        </span>
      </div>
      
      <!-- Subtle Industrial Border on hover -->
      <div class="absolute inset-0 border border-accent-color/0 group-hover:border-accent-color/10 transition-all pointer-events-none rounded-[inherit]"></div>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: template use
import { PROJECTS as projects } from '../../data/portfolio';
// biome-ignore lint/correctness/noUnusedImports: template use
import BentoCard from '../shared/BentoCard.vue';
</script>
