import { defineStore } from 'pinia';
import { markRaw, reactive, ref } from 'vue';

interface ViewportOffset {
  left: number;
  top: number;
}

interface ComponentRegistration {
  el: HTMLElement;
  offsets: ViewportOffset;
  isVisible: boolean;
}

export const useViewportStore = defineStore('viewport', () => {
  const registeredComponents = reactive<Map<string, ComponentRegistration>>(new Map());
  const elementMap = new WeakMap<HTMLElement, ComponentRegistration>();
  const mousePosition = reactive({ x: 0, y: 0 });
  const isListening = ref(false);

  /**
   * Non-reactive mouse coordinates for the WebGL uniform bridge.
   * Updated on every mousemove event BEFORE the rAF gate, so the
   * TresJS render loop always reads the freshest position without
   * triggering Vue dependency tracking.
   * markRaw ensures Pinia doesn't automatically wrap this in a proxy.
   */
  const rawMouse = markRaw({ x: 0, y: 0 });

  let observer: IntersectionObserver | null = null;
  let updateRafId: number | null = null;

  const updateAll = () => {
    if (updateRafId !== null) return;
    // ... rest of updateAll ...

    updateRafId = requestAnimationFrame(() => {
      const updates = [];

      // Phase 1: Batch all READS
      for (const [_id, reg] of registeredComponents) {
        if (!reg.isVisible) continue;
        const rect = reg.el.getBoundingClientRect();
        updates.push({ reg, rect });
      }

      // Phase 2: Batch all WRITES
      for (const { reg, rect } of updates) {
        reg.offsets.left = rect.left;
        reg.offsets.top = rect.top;
        reg.el.style.setProperty('--card-left', `${rect.left}px`);
        reg.el.style.setProperty('--card-top', `${rect.top}px`);
      }

      updateRafId = null;
    });
  };

  let rafId: number | null = null;

  const handlePointerMove = (e: PointerEvent) => {
    const cx = e.clientX;
    const cy = e.clientY;

    // Raw coordinates — written every event, read by WebGL render loop
    rawMouse.x = cx;
    rawMouse.y = cy;

    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      // Reactive coordinates — only for Vue consumers (watchers, computed, etc.)
      // Read from rawMouse to ensure we process the absolute latest position for the frame
      mousePosition.x = rawMouse.x;
      mousePosition.y = rawMouse.y;
      rafId = null;
    });
  };

  const init = () => {
    if (isListening.value) return;

    window.addEventListener('scroll', updateAll, {
      passive: true,
      capture: true,
    });
    window.addEventListener('resize', updateAll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          let needsUpdate = false;
          entries.forEach((entry) => {
            const reg = elementMap.get(entry.target as HTMLElement);
            if (reg) {
              reg.isVisible = entry.isIntersecting;
              needsUpdate = true;
            }
          });
          if (needsUpdate) {
            updateAll();
          }
        },
        {
          root: null,
          rootMargin: '100px',
          threshold: 0,
        }
      );

      for (const reg of registeredComponents.values()) {
        observer.observe(reg.el);
      }
    }

    isListening.value = true;
  };

  const register = (id: string, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    registeredComponents.set(id, {
      el,
      offsets: { left: rect.left || 0, top: rect.top || 0 },
      isVisible: true,
    });

    const reg = registeredComponents.get(id);
    if (reg) {
      elementMap.set(el, reg);
    }

    if (observer) {
      observer.observe(el);
    }

    return {
      update: () => {
        const rect = el.getBoundingClientRect();
        const reg = registeredComponents.get(id);
        if (reg) {
          reg.offsets.left = rect.left;
          reg.offsets.top = rect.top;
        }
      },
      unregister: () => {
        const reg = registeredComponents.get(id);
        if (reg) {
          if (observer) {
            observer.unobserve(reg.el);
          }
          elementMap.delete(reg.el);
        }
        registeredComponents.delete(id);
      },
    };
  };

  const getOffsets = (id: string): ViewportOffset => {
    return registeredComponents.get(id)?.offsets || { left: 0, top: 0 };
  };

  const destroy = () => {
    if (observer) {
      observer.disconnect();
    }
    window.removeEventListener('scroll', updateAll, { capture: true });
    window.removeEventListener('resize', updateAll);
    window.removeEventListener('pointermove', handlePointerMove);
    isListening.value = false;
  };

  return {
    mousePosition,
    rawMouse,
    init,
    destroy,
    register,
    getOffsets,
    registeredComponents,
  };
});
