import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { useLightingStore } from './lighting';

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

  const updateAll = () => {
    for (const [_id, reg] of registeredComponents) {
      const rect = reg.el.getBoundingClientRect();
      reg.offsets.left = rect.left;
      reg.offsets.top = rect.top;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;

    // Update global mask variables only in CONTENT phase
    if (lighting.phase === 'CONTENT') {
      document.documentElement.style.setProperty('--mask-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mask-y', `${e.clientY}px`);

      const xPct = (e.clientX / window.innerWidth) * 100;
      const yPct = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--spotlight-x-raw', `${xPct}%`);
      document.documentElement.style.setProperty('--spotlight-y-raw', `${yPct}%`);

      // Delegate to lighting store
      lighting.updateFlashlightRotation();
    }
  };

  const init = () => {
    if (isListening.value) return;

    // Set initial mask positions to center screen
    document.documentElement.style.setProperty('--mask-x', '50vw');
    document.documentElement.style.setProperty('--mask-y', '50vh');
    document.documentElement.style.setProperty('--spotlight-x-raw', '50%');
    document.documentElement.style.setProperty('--spotlight-y-raw', '50%');

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
    init,
    register,
    getOffsets,
    registeredComponents,
  };
});
