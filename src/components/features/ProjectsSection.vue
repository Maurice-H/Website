<template>
  <BentoCard 
    v-for="project in projects" 
    :key="project.id"
    class="md:col-span-2 md:row-span-1 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-4 focus-visible:ring-offset-black transition-transform duration-300 active:scale-[0.98]"
    with-window
    :title="project.title"
    :is-low-end="performance.isLowEnd"
    tabindex="0"
    role="link"
    :aria-label="`Open project: ${project.title}`"
    @click="openProject(project.link || project.repoUrl)"
    @keydown.enter.prevent="openProject(project.link || project.repoUrl)"
    @keydown.space.prevent="openProject(project.link || project.repoUrl)"
  >
    <div class="p-4 md:p-8 flex flex-col h-full">
      <div class="flex-1 mt-6">
        <p class="mb-6 text-sm leading-relaxed text-finished-text/50">
          {{ project.description }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2 mt-auto">
        <span 
          v-for="tag in project.tags" 
          :key="tag"
          class="px-2 py-0.5 text-xs uppercase tracking-widest rounded border border-finished-text/10 bg-transparent text-finished-text/30 group-hover:border-finished-accent/20 group-hover:text-finished-text/60 transition-colors"
        >
          {{ tag }}
        </span>
      </div>
      
      <!-- Subtle Industrial Border on hover -->
      <div class="absolute inset-0 border border-finished-accent/0 group-hover:border-finished-accent/10 transition-colors pointer-events-none rounded-[inherit]"></div>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import { PROJECTS as projects } from '../../data/portfolio';
import { usePerformanceStore } from '../../stores/usePerformanceStore';
import BentoCard from '../shared/BentoCard.vue';

const performance = usePerformanceStore();

const openProject = (url?: string) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
</script>
