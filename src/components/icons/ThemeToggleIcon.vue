<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="w-10 h-10 transition-all duration-[var(--theme-transition-duration)] drop-shadow-[0_0_15px_currentColor]"
    aria-hidden="true"
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path v-if="!isBlueprint" d="M12 2v1" />
    <path
      d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.25.5 2.4 1.5 3.5.76.76 1.23 1.52 1.41 2.5"
    />
  </svg>
</template>
<script setup lang="ts">
defineProps<{
  isBlueprint: boolean;
}>();
</script>
