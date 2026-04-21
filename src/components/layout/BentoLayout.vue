<template>
  <div class="flex flex-col gap-16 w-full max-w-7xl mx-auto p-6 md:p-8 z-10 relative">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isBlueprint?: boolean;
}>();
</script>
