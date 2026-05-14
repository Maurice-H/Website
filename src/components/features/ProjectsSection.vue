<template>
  <BentoCard
    id="projects-section"
    class="md:col-span-4 md:row-span-1"
    with-window
    :title="$t('projects.title')"
    :is-low-end="performance.isLowEnd"
  >
    <div class="p-4 md:p-8 flex flex-col gap-4 md:gap-6">
      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
      >
        <SkeletonLoader
          v-for="i in 4"
          :key="`skeleton-${i}`"
          shape="card"
          height="180px"
        />
      </div>

      <!-- Error State (no projects at all) -->
      <div
        v-else-if="error && projects.length === 0"
        class="flex flex-col items-center justify-center py-12 gap-4"
      >
        <svg
          class="w-10 h-10 text-finished-text/20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
        <p class="text-finished-text/40 text-sm text-center font-mono">
          {{ $t('projects.errorTitle') }}
        </p>
        <a
          href="https://github.com/Maurice-H"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-mono tracking-widest uppercase text-finished-accent/50 hover:text-finished-accent transition-colors duration-200"
        >
          {{ $t('projects.errorLink') }}
        </a>
      </div>

      <!-- Project Cards -->
      <template v-else>
        <!-- Error Banner (has fallback projects) -->
        <div
          v-if="error"
          class="text-xs font-mono text-finished-text/30 border border-finished-text/10 rounded px-3 py-2"
        >
          {{ $t('projects.errorFallback') }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div
            v-for="project in projects"
            :key="project.id"
            class="group relative cursor-pointer rounded-xl border border-finished-text/5 bg-finished-text/[0.02] hover:bg-finished-text/[0.04] hover:border-finished-accent/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent"
            role="link"
            tabindex="0"
            :aria-label="`Open project: ${project.title}`"
            @click="openProject(project.link || project.repoUrl)"
            @keydown.enter.prevent="openProject(project.link || project.repoUrl)"
            @keydown.space.prevent="openProject(project.link || project.repoUrl)"
          >
            <div class="p-4 md:p-6 flex flex-col h-full gap-3">
              <!-- Title row -->
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-finished-accent text-sm md:text-base font-bold tracking-wide transition-colors duration-[var(--theme-transition-duration)]">
                  {{ project.title }}
                </h3>
                <a
                  v-if="project.repoUrl"
                  :href="project.repoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-shrink-0 w-4 h-4 text-finished-text/20 hover:text-finished-accent transition-colors duration-200"
                  :aria-label="`View ${project.title} on GitHub`"
                  @click.stop
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>

              <!-- Description -->
              <p class="text-xs md:text-sm leading-relaxed text-finished-text/40 transition-colors duration-[var(--theme-transition-duration)]">
                {{ project.description || $t('projects.noDescription') }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 mt-auto">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="px-2 py-0.5 text-xs uppercase tracking-widest rounded border border-finished-text/8 bg-transparent text-finished-text/25 group-hover:border-finished-accent/15 group-hover:text-finished-text/50 transition-colors duration-[var(--theme-transition-duration)]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- "See More" link (always show GitHub link at bottom) -->
      <div class="flex justify-center">
        <a
          href="https://github.com/Maurice-H"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-mono tracking-widest uppercase text-finished-accent/50 hover:text-finished-accent transition-colors duration-200"
        >
          {{ $t('projects.seeMore') }}
        </a>
      </div>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import { useGitHubProjects } from '@/composables/useGitHubProjects';
import { usePerformanceStore } from '../../stores/usePerformanceStore';
import BentoCard from '../shared/BentoCard.vue';
import SkeletonLoader from '../shared/SkeletonLoader.vue';

const performance = usePerformanceStore();
const { projects, isLoading, error } = useGitHubProjects();

const openProject = (url?: string) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
</script>

<style scoped></style>
