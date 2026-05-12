<template>
  <div
    class="skeleton-loader"
    :class="[`skeleton-loader--${shape}`]"
    :style="customStyle"
    role="status"
    aria-label="Loading..."
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    shape: 'text' | 'card' | 'circle';
    width?: string;
    height?: string;
  }>(),
  {
    width: undefined,
    height: undefined,
  }
);

const customStyle = computed(() => ({
  ...(props.width ? { width: props.width } : {}),
  ...(props.height ? { height: props.height } : {}),
}));
</script>

<style scoped>
.skeleton-loader {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--finished-accent) 5%, transparent) 25%,
    color-mix(in srgb, var(--finished-accent) 12%, transparent) 50%,
    color-mix(in srgb, var(--finished-accent) 5%, transparent) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border: 1px solid color-mix(in srgb, var(--finished-accent) 8%, transparent);
}

.skeleton-loader--text {
  height: 1em;
  width: 100%;
  border-radius: 4px;
}

.skeleton-loader--card {
  height: 200px;
  width: 100%;
  border-radius: 12px;
}

.skeleton-loader--circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
