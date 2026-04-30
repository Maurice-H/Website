<template>
  <div class="window-frame-container h-full flex flex-col">
    <!-- Window Header (Minimalist, no borders/bg) -->
    <div class="window-header flex items-center px-6 pt-6 pb-2">
      <!-- Title in Mockup Style (Large, clean, matching subpage mockups) -->
      <div
        class="window-title text-xl md:text-2xl font-bold tracking-wide"
        :class="
          isBracketed
            ? 'text-finished-text/70 font-mono tracking-widest text-lg'
            : 'text-[var(--finished-accent)]'
        "
      >
        {{
          isBracketed
            ? `[ ${title?.replace(/[\[\]]/g, "").trim() || ""} ]`
            : title
        }}
      </div>
    </div>

    <!-- Window Content -->
    <div
      class="window-content-area flex-1 overflow-auto relative px-6 pb-6 pt-2"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  title?: string;
}>();

// If the title naturally has brackets (like "[ STACK ]"), format it monospace
const isBracketed = computed(() => {
  if (!props.title) return false;
  return (
    props.title.trim().startsWith("[") || props.title.toLowerCase() === "stack"
  );
});
</script>

<style scoped>
.window-header {
  position: relative;
}

.window-title {
  text-shadow: 0 0 20px var(--finished-glow);
}
</style>
