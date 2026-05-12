<template>
  <div
    class="nav-window group focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-xl"
    :class="[`theme-${theme}`, { 'is-active': active }]"
    data-testid="nav-window"
    role="tab"
    :aria-selected="active"
    tabindex="0"
  >
    <!-- Window Frame -->
    <div class="window-container-wrapper">
      <div class="window-container">
        <WindowFrame :title="label">
          <!-- Content Area (Slot-based) -->
          <div class="window-content">
            <slot></slot>
          </div>
        </WindowFrame>
      </div>
      <div class="window-active-glow"></div>
    </div>

    <!-- Encoded Label Below -->
    <div class="window-label-wrapper">
      <div class="window-label-base">{{ encodedLabel }}</div>
      <div class="window-label-active" :class="{ 'label-fading': isFading }">
        {{ activeEncodedLabel }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import type { NavWindowTheme } from '../../types';
import WindowFrame from '../shared/WindowFrame.vue';

const props = defineProps<{
  theme: NavWindowTheme;
  label: string;
  active?: boolean;
}>();

// --- Number system encoding ---
type EncodingSystem = 'hex' | 'bin' | 'oct' | 'dec';

const ENCODING_ORDER: EncodingSystem[] = ['hex', 'bin', 'oct', 'dec'];
const CYCLE_INTERVAL_MS = 3000;
const FADE_DURATION_MS = 400;

function encodeLabel(text: string, system: EncodingSystem): string {
  const bytes = Array.from(new TextEncoder().encode(text.toUpperCase()));
  switch (system) {
    case 'hex':
      return bytes.map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
    case 'bin':
      return bytes
        .slice(0, 4)
        .map((b) => b.toString(2).padStart(8, '0'))
        .join(' ');
    case 'oct':
      return bytes.map((b) => b.toString(8).padStart(3, '0')).join(' ');
    case 'dec':
      return bytes.map((b) => b.toString(10).padStart(3, '0')).join(' ');
  }
}

// Static base label always shows hex
const encodedLabel = computed(() => encodeLabel(props.label, 'hex'));

// Active label cycles through number systems
const currentSystemIndex = ref(0);
const isFading = ref(false);

const currentSystem = computed(() => ENCODING_ORDER[currentSystemIndex.value]);

const activeEncodedLabel = computed(() => encodeLabel(props.label, currentSystem.value));

// Cycle timer — only runs when active
let cycleTimer: ReturnType<typeof setInterval> | null = null;

function startCycling() {
  stopCycling();
  cycleTimer = setInterval(() => {
    // Trigger fade-out
    isFading.value = true;
    // After fade-out completes, switch system and fade-in
    setTimeout(() => {
      currentSystemIndex.value = (currentSystemIndex.value + 1) % ENCODING_ORDER.length;
      isFading.value = false;
    }, FADE_DURATION_MS);
  }, CYCLE_INTERVAL_MS);
}

function stopCycling() {
  if (cycleTimer) {
    clearInterval(cycleTimer);
    cycleTimer = null;
  }
  isFading.value = false;
}

// Start/stop cycling when active state changes
watch(
  () => props.active,
  (isActive) => {
    if (isActive) {
      currentSystemIndex.value = 0;
      startCycling();
    } else {
      stopCycling();
      currentSystemIndex.value = 0;
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  stopCycling();
});
</script>

<style scoped>
.nav-window {
  flex-shrink: 0;
  width: min(480px, 80vw);
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  transition: transform 0.4s var(--lighting-transition);
  cursor: pointer;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

@media (max-width: 768px) {
  .nav-window {
    width: 280px;
    gap: 12px;
  }
}

.nav-window.is-active {
  transform: scale(1.15);
}

.window-container-wrapper {
  position: relative;
  width: 100%;
  border-radius: 12px;
}

.window-container {
  position: relative;
  width: 100%;
  background: #000;
  border: 1px solid var(--blueprint-border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.window-active-glow {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--finished-accent) 50%, transparent);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 30px color-mix(in srgb, var(--finished-accent) 15%, transparent);
  opacity: 0;
  transition: opacity 0.4s var(--lighting-transition);
  z-index: 3;
  pointer-events: none;
}

.is-active .window-active-glow {
  opacity: 1;
}

.window-content {
  flex: 1;
  padding: clamp(16px, 3vw, 24px) clamp(12px, 3vw, 16px);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #000;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .window-content {
    padding: 0;
  }
}

.window-label-wrapper {
  position: relative;
  margin-top: 16px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 10px;
  letter-spacing: 0.25em;
  font-weight: 400;
  height: 1.4em;
}

.window-label-base,
.window-label-active {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  transition: opacity 0.4s var(--lighting-transition);
}

.window-label-base {
  opacity: 0.08;
  color: white;
}

.is-active .window-label-base {
  opacity: 0;
}

.window-label-active {
  opacity: 0;
  color: var(--finished-accent);
  text-shadow: 0 0 8px color-mix(in srgb, var(--finished-accent) 40%, transparent);
  transition:
    opacity 0.4s var(--lighting-transition);
}

.is-active .window-label-active {
  opacity: 1;
}

/* Fade-out during system transition */
.window-label-active.label-fading {
  opacity: 0 !important;
  transition: opacity 0.35s ease-out;
}

/* --- Center the WindowFrame title in nav card context --- */
:deep(.window-header) {
  text-align: center;
  justify-content: center;
  padding-top: 1.25rem;
}

/* --- Theme Specific Content (High-Fidelity) --- */
:deep(.content-terminal) {
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: clamp(0.75rem, 2.5vw, 0.9rem);
  line-height: 1.6;
  color: color-mix(in srgb, var(--finished-accent) 80%, transparent);
}
:deep(.code-line) {
  display: flex;
  gap: 8px;
}
:deep(.cursor) {
  display: inline-block;
  width: 6px;
  height: 14px;
  background: var(--finished-accent);
  margin-left: 2px;
  animation: blink 1s infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

:deep(.content-profile) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
:deep(.profile-header) {
  display: flex;
  align-items: center;
  gap: 12px;
}
:deep(.profile-circle) {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: linear-gradient(135deg, var(--finished-accent), transparent);
  border: 1px solid var(--finished-accent);
  opacity: 0.6;
}
:deep(.profile-lines) .line {
  height: 4px;
  background: color-mix(in srgb, var(--finished-accent) 8%, transparent);
  border-radius: 2px;
  margin-bottom: 8px;
}

:deep(.content-envelope) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
:deep(.comm-link) {
  padding: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  font-family: monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
}
</style>
