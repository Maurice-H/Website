import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { useLightingStore } from './lighting';
import { useThemeStore } from './useThemeStore';

interface ViewportOffset {
  left: number;
  top: number;
}

interface ComponentRegistration {
  el: HTMLElement;
  offsets: ViewportOffset;
}

export const useViewportStore = defineStore('viewport', () => {
  const registeredComponents = reactive<Map<string, ComponentRegistration>>(new Map());
  const mousePosition = reactive({ x: 0, y: 0 });
  const isListening = ref(false);
  const lighting = useLightingStore();
  const themeStore = useThemeStore();

  /**
   * Non-reactive mouse coordinates for the WebGL uniform bridge.
   * Updated on every mousemove event BEFORE the rAF gate, so the
   * TresJS render loop always reads the freshest position without
   * triggering Vue dependency tracking.
   */
  const rawMouse = { x: 0, y: 0 };

  const updateAll = () => {
    for (const [_id, reg] of registeredComponents) {
      const rect = reg.el.getBoundingClientRect();
      reg.offsets.left = rect.left;
      reg.offsets.top = rect.top;
      reg.el.style.setProperty('--card-left', `${rect.left}px`);
      reg.el.style.setProperty('--card-top', `${rect.top}px`);
    }
  };

  let rafId: number | null = null;

  const handleMouseMove = (e: MouseEvent) => {
    const cx = e.clientX;
    const cy = e.clientY;

    // Raw coordinates — written every event, read by WebGL render loop
    rawMouse.x = cx;
    rawMouse.y = cy;

    // Reactive coordinates — only for Vue consumers (watchers, computed, etc.)
    mousePosition.x = cx;
    mousePosition.y = cy;

    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      // Skip all lighting-related tracking when effects are disabled
      if (themeStore.lightingEnabled && lighting.phase === 'CONTENT') {
        // --mask-x/y consumed by FusedReveal mask positioning
        document.documentElement.style.setProperty('--mask-x', `${cx}px`);
        document.documentElement.style.setProperty('--mask-y', `${cy}px`);
      }
      rafId = null;
    });
  };

  const init = () => {
    if (isListening.value) return;

    // Set initial mask positions to center screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    document.documentElement.style.setProperty('--mouse-x', `${centerX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${centerY}px`);
    document.documentElement.style.setProperty('--mask-x', '50vw');
    document.documentElement.style.setProperty('--mask-y', '50vh');

    window.addEventListener('scroll', updateAll, { passive: true, capture: true });
    window.addEventListener('resize', updateAll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    isListening.value = true;
  };

  const register = (id: string, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    registeredComponents.set(id, {
      el,
      offsets: { left: rect.left || 0, top: rect.top || 0 },
    });

    return {
      update: () => {
        const rect = el.getBoundingClientRect();
        const reg = registeredComponents.get(id);
        if (reg) {
          reg.offsets.left = rect.left;
          reg.offsets.top = rect.top;
        }
      },
      unregister: () => registeredComponents.delete(id),
    };
  };

  const getOffsets = (id: string): ViewportOffset => {
    return registeredComponents.get(id)?.offsets || { left: 0, top: 0 };
  };

  return {
    mousePosition,
    rawMouse,
    init,
    register,
    getOffsets,
    registeredComponents,
  };
});
