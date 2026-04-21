<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <BentoCard 
      v-for="project in projects" 
      :key="project.id"
      :id="`project-${project.id}`"
      :colSpan="2"
      :rowSpan="2"
      class="group cursor-pointer"
    >
      <FusedReveal :id="`project-reveal-${project.id}`">
        <template #blueprint>
          <div class="flex flex-col h-full text-white/5 select-none opacity-20 transition-none">
            <div class="flex-1">
              <h3 class="text-2xl font-bold mb-3">{{ project.title }}</h3>
              <p class="mb-6 text-sm leading-relaxed">
                {{ project.description }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2 mt-auto">
              <span 
                v-for="tag in project.tags" 
                :key="tag"
                class="px-3 py-1 text-xs font-semibold rounded-full border border-dashed border-white/5 transition-none"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </template>
        
        <template #finished>
          <div class="flex flex-col h-full select-none">
            <div class="flex-1">
              <h3 class="text-2xl font-bold mb-3 text-finished-accent">{{ project.title }}</h3>
              <p class="mb-6 text-sm leading-relaxed text-finished-text/70">
                {{ project.description }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2 mt-auto">
              <span 
                v-for="tag in project.tags" 
                :key="tag"
                class="px-3 py-1 text-xs font-semibold rounded-full border border-finished-border bg-finished-bg/50 backdrop-blur-md text-finished-accent"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Decorative Glow -->
            <div 
              class="absolute -bottom-12 -right-12 w-48 h-48 opacity-20 rounded-full bg-gradient-to-br from-blue-500 to-finished-accent blur-3xl group-hover:opacity-40 transition-opacity duration-500"
            ></div>
          </div>
        </template>
      </FusedReveal>
    </BentoCard>
  </div>
</template>

<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: template-use
import { PROJECTS as projects } from '../../data/portfolio';
// biome-ignore lint/correctness/noUnusedImports: template-use
import BentoCard from '../shared/BentoCard.vue';
// biome-ignore lint/correctness/noUnusedImports: template-use
import FusedReveal from '../shared/FusedReveal.vue';
</script>
