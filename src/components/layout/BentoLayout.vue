<template>
  <div class="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 md:gap-6 w-full max-w-7xl mx-auto p-4 md:p-8 z-10 relative">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isBlueprint?: boolean;
}>();
</script>
