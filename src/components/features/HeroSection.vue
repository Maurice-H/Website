<template>
  <header class="py-20 px-8 relative">
    <div class="max-w-7xl mx-auto relative min-h-[300px]">
      <FusedReveal id="hero">
        <template #blueprint>
          <div class="flex flex-col gap-6 select-none opacity-20">
            <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-white">
              Hi. I'm <span class="text-blue-500">{{ HERO_DATA.name }}</span>
            </h1>
            <p class="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed">
              {{ HERO_DATA.tagline }}
            </p>
            <div class="flex gap-4 mt-4 font-mono text-sm text-blue-500/30 uppercase tracking-[0.2em]">
              <span>[ {{ HERO_DATA.roles.join(' / ') }} ]</span>
            </div>
          </div>
        </template>

        <template #finished>
          <div class="flex flex-col gap-6 select-none">
            <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-white">
              Hi. I'm <span class="text-finished-accent">{{ HERO_DATA.name }}</span>
            </h1>
            <p class="text-xl md:text-2xl text-finished-text/70 max-w-2xl leading-relaxed">
              {{ HERO_DATA.tagline }}
            </p>
            <div class="flex gap-4 mt-4 font-mono text-sm text-finished-accent/50 uppercase tracking-[0.2em]">
              <span>[ {{ HERO_DATA.roles.join(' / ') }} ]</span>
            </div>
          </div>
        </template>
      </FusedReveal>
    </div>
  </header>
</template>

<script setup lang="ts">
import { HERO_DATA } from "../../data/portfolio";
import FusedReveal from "../shared/FusedReveal.vue";
</script>
