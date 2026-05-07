<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path v-if="showFilament" d="M12 2v1" />
    <path
      d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.25.5 2.4 1.5 3.5.76.76 1.23 1.52 1.41 2.5"
    />
    <template v-if="showRays">
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="19.78" y1="4.22" x2="18.36" y2="5.64" />
      <line x1="21" y1="12" x2="23" y2="12" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  showFilament?: boolean;
  showRays?: boolean;
}>();
</script>
