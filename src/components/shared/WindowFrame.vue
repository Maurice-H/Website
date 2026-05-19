<template>
  <div class="window-frame-container h-full flex flex-col">
    <!-- Window Header (Minimalist, no borders/bg) -->
    <div class="window-header flex items-center px-4 pt-4 pb-1 md:px-6 md:pt-6 md:pb-2">
      <!-- Title in Mockup Style (Large, clean, matching subpage mockups) -->
      <h2
        class="window-title font-bold tracking-wide"
        :style="{ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)' }"
        :class="
          isBracketed
            ? 'text-finished-text/70 font-mono tracking-widest'
            : 'text-[var(--finished-accent)]'
        "
      >
        {{
          isBracketed
            ? `[ ${title?.replace(/[\[\]]/g, "").trim() || ""} ]`
            : title
        }}
      </h2>
    </div>

    <!-- Window Content -->
    <div
      class="window-content-area flex-1 overflow-auto relative px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title?: string;
}>();

// If the title naturally has brackets (like "[ STACK ]"), format it monospace
const isBracketed = computed(() => {
  if (!props.title) return false;
  return props.title.trim().startsWith('[') || props.title.toLowerCase() === 'stack';
});
</script>

<style scoped>
.window-header {
  position: relative;
}

.window-title {
  text-shadow: 0 0 20px var(--finished-glow);
  margin-top: 0.5rem;
}
</style>
