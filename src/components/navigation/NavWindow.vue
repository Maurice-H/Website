<template>
  <div 
    class="nav-window group"
    :class="[
      `theme-${theme}`,
      { 'is-active': active }
    ]"
  >
    <!-- Window Frame -->
    <div class="window-frame">
      <div class="window-header">
        <div class="window-controls">
          <span></span><span></span><span></span>
        </div>
        <div class="window-title">{{ label }}</div>
      </div>
      
      <!-- Content Area (Slot-based) -->
      <div class="window-content">
        <slot></slot>
      </div>
    </div>
    
    <!-- Label Below -->
    <div class="window-label">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
import type { NavWindowTheme } from "../../types";

defineProps<{
	theme: NavWindowTheme;
	label: string;
	active?: boolean;
}>();
</script>

<style scoped>
.nav-window {
  flex-shrink: 0;
  width: 280px;
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

.window-frame {
  width: 100%;
  aspect-ratio: 4/3;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.4s var(--lighting-transition);
}

.is-active .window-frame {
  border-color: var(--finished-accent);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(74, 222, 128, 0.1);
}

.window-header {
  height: 24px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
}

.window-controls {
  display: flex;
  gap: 4px;
}
.window-controls span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.window-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.4;
}

.window-content {
  flex: 1;
  padding: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.window-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 800;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.is-active .window-label {
  opacity: 1;
  color: var(--finished-text);
}

/* --- Theme Specific Content --- */
:deep(.content-terminal) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  line-height: 1.6;
}
:deep(.cursor) {
  display: inline-block;
  animation: blink 1s infinite;
}
@keyframes blink { 50% { opacity: 0; } }

:deep(.content-profile) {
  display: flex;
  align-items: center;
  gap: 12px;
}
:deep(.profile-circle) {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}
:deep(.profile-lines) .line {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  margin-bottom: 6px;
}

:deep(.content-grid) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
:deep(.grid-box) {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

:deep(.content-envelope) {
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.envelope-back) {
  width: 60px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  border-radius: 2px;
}
:deep(.envelope-flap) {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-top: 20px solid rgba(255, 255, 255, 0.1);
}
</style>
