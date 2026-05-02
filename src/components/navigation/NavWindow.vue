<template>
  <div 
    class="nav-window group"
    :class="[
      `theme-${theme}`,
      { 'is-active': active }
    ]"
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
    
    <!-- Label Below -->
    <div class="window-label-wrapper">
      <div class="window-label-base">{{ label }}</div>
      <div class="window-label-active">{{ label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavWindowTheme } from '../../types';
import WindowFrame from '../shared/WindowFrame.vue';

defineProps<{
  theme: NavWindowTheme;
  label: string;
  active?: boolean;
}>();
</script>

<style scoped>
.nav-window {
  flex-shrink: 0;
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  transition: transform 0.4s var(--lighting-transition);
  cursor: pointer;
}

.nav-window.is-active {
  transform: scale(1.15);
}

.window-container-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;
  border-radius: 12px;
}

.window-container {
  position: absolute;
  inset: 0;
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
  padding: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: #000;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.window-label-wrapper {
  position: relative;
  margin-top: 12px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  font-weight: 900;
  height: 1.2em; /* Ensure stable height */
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
  opacity: 0.15;
  color: white;
}

.is-active .window-label-base {
  opacity: 0;
}

.window-label-active {
  opacity: 0;
  color: var(--finished-accent);
  text-shadow: 0 0 10px var(--finished-accent);
}

.is-active .window-label-active {
  opacity: 1;
}

/* --- Theme Specific Content (High-Fidelity) --- */
:deep(.content-terminal) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
  line-height: 1.8;
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
@keyframes blink { 50% { opacity: 0; } }

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
  border: 1px dashed rgba(255,255,255,0.1);
  font-family: monospace;
  font-size: 10px;
  color: rgba(255,255,255,0.3);
}
</style>
