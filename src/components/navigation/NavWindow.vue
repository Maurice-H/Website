<template>
  <div 
    class="nav-window group"
    :class="[
      `theme-${theme}`,
      { 'is-active': active }
    ]"
  >
    <!-- Window Frame -->
    <div class="window-container">
      <WindowFrame :title="label">
        <!-- Content Area (Slot-based) -->
        <div class="window-content">
          <slot></slot>
        </div>
      </WindowFrame>
    </div>
    
    <!-- Label Below -->
    <div class="window-label">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
import type { NavWindowTheme } from '../../types';
// biome-ignore lint/correctness/noUnusedImports: template-use
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

.window-container {
  width: 100%;
  aspect-ratio: 16/10;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.4s var(--lighting-transition);
}

.is-active .window-container {
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(16, 185, 129, 0.15);
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

.window-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  font-weight: 900;
  opacity: 0.15;
  transition: all 0.3s ease;
  margin-top: 12px;
  color: white;
}

.is-active .window-label {
  opacity: 1;
  color: var(--finished-accent);
  text-shadow: 0 0 10px var(--finished-accent);
}

/* --- Theme Specific Content (High-Fidelity) --- */
:deep(.content-terminal) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
  line-height: 1.8;
  color: rgba(16, 185, 129, 0.8);
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
  background: rgba(16, 185, 129, 0.08);
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
