<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Biography / Path -->
    <BentoCard id="bio" :colSpan="2" :rowSpan="2" class="relative group">
      <FusedReveal id="bio-reveal">
        <template #blueprint>
          <div class="flex flex-col h-full text-white/5 select-none opacity-20">
            <h3 class="text-3xl font-bold mb-6">{{ bio.title }}</h3>
            <p class="text-lg leading-relaxed mb-6">{{ bio.content }}</p>
          </div>
        </template>
        <template #finished>
          <div class="flex flex-col h-full select-none">
            <h3 class="text-3xl font-bold mb-6 text-finished-accent">{{ bio.title }}</h3>
            <p class="text-lg leading-relaxed mb-6 text-finished-text/70">{{ bio.content }}</p>
          </div>
        </template>
      </FusedReveal>
    </BentoCard>

    <!-- Tech Stack / Artifacts -->
    <BentoCard id="stack" :colSpan="1" :rowSpan="2" class="group relative">
      <FusedReveal id="stack-reveal">
        <template #blueprint>
          <div class="flex flex-col h-full text-white/5 select-none opacity-20">
            <h3 class="text-2xl font-bold mb-6 italic uppercase tracking-widest">[ {{ stack.title }} ]</h3>
            <div class="flex flex-wrap gap-3">
              <span v-for="skill in stack.skills" :key="skill" class="px-3 py-1 border border-dashed border-white/5 rounded-full text-sm">
                {{ skill }}
              </span>
            </div>
          </div>
        </template>
        <template #finished>
          <div class="flex flex-col h-full select-none">
            <h3 class="text-2xl font-bold mb-6 italic uppercase tracking-widest text-finished-accent">[ {{ stack.title }} ]</h3>
            <div class="flex flex-wrap gap-3">
              <span 
                v-for="skill in stack.skills" 
                :key="skill" 
                class="px-3 py-1 border border-finished-border bg-finished-bg/50 backdrop-blur-md rounded-full text-sm text-finished-accent shadow-[0_0_10px_rgba(34,211,238,0.2)]"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </template>
      </FusedReveal>
    </BentoCard>
  </div>
</template>

<script setup lang="ts">
import { SKILL_SECTIONS } from "../../data/portfolio";
import BentoCard from "../shared/BentoCard.vue";
import FusedReveal from "../shared/FusedReveal.vue";

// Protect from aggressive linting
const _ui = [BentoCard, FusedReveal];

const bio = SKILL_SECTIONS.find((s) => s.id === "bio") || SKILL_SECTIONS[0];
const stack = SKILL_SECTIONS.find((s) => s.id === "stack") || SKILL_SECTIONS[1];
</script>
