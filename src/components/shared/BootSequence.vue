<template>
  <div class="boot-sequence font-mono text-[10px] uppercase tracking-widest text-emerald-400/80 p-6 relative overflow-hidden h-full flex flex-col">
    <!-- Scanline Effect -->
    <div class="scanlines"></div>
    <div class="crt-glow"></div>

    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <div v-for="(line, index) in activeLines" :key="index" class="mb-1.5 flex items-start">
        <span class="mr-3 opacity-30 shrink-0">[{{ getTimestamp() }}]</span>
        <span :class="getTypeClass(line.type)" class="leading-relaxed">{{ line.text }}</span>
        <span v-if="index === activeLines.length - 1" class="ml-1 animate-pulse inline-block w-1.5 h-3 bg-emerald-400/50"></span>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mt-4 pt-4 border-t border-emerald-900/30">
      <div class="flex justify-between mb-1 text-[8px] opacity-50">
        <span>SYSTEM_LOAD</span>
        <span>{{ Math.round(progress) }}%</span>
      </div>
      <div class="w-full h-1 bg-emerald-900/20 rounded-full overflow-hidden">
        <div 
          class="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import bootData from '../../data/boot-sequence.json';

interface BootLine {
  text: string;
  delay: number;
  type: string;
}

const activeLines = ref<BootLine[]>([]);
const progress = ref(0);

// biome-ignore lint/correctness/noUnusedVariables: template use
const getTimestamp = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// biome-ignore lint/correctness/noUnusedVariables: template use
const getTypeClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-emerald-400 font-bold';
    case 'warning':
      return 'text-amber-400';
    default:
      return 'text-emerald-500/90';
  }
};

onMounted(async () => {
  const total = bootData.length;
  let count = 0;
  for (const line of bootData) {
    await new Promise((resolve) => setTimeout(resolve, line.delay));
    activeLines.value.push(line);
    count++;
    progress.value = (count / total) * 100;
  }
});
</script>

<style scoped>
.boot-sequence {
  text-shadow: 0 0 5px rgba(16, 185, 129, 0.4);
}

.scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px;
  z-index: 10;
  pointer-events: none;
}

.crt-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
  pointer-events: none;
  z-index: 5;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 2px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.2);
}
</style>
