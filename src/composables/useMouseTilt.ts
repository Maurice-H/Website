import { computed, onMounted, onUnmounted, type Ref, ref } from 'vue';

export function useMouseTilt(
  elementRef: Ref<HTMLElement | null>,
  options = { tiltMax: 3, glareMax: 60 }
) {
  const isHovered = ref(false);
  const tiltX = ref(0);
  const tiltY = ref(0);
  const mouseX = ref(0);
  const mouseY = ref(0);

  let frameId = 0;
  const isReducedMotion = ref(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!elementRef.value || isReducedMotion.value) return;

    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
      if (!elementRef.value) return;
      const rect = elementRef.value.getBoundingClientRect();

      const width = rect.width;
      const height = rect.height;
      const left = rect.left;
      const top = rect.top;

      const x = e.clientX - left;
      const y = e.clientY - top;

      mouseX.value = x;
      mouseY.value = y;

      const normalizedX = (x / width) * 2 - 1;
      const normalizedY = (y / height) * 2 - 1;

      tiltX.value = normalizedY * -options.tiltMax;
      tiltY.value = normalizedX * options.tiltMax;
    });
  };

  const handleMouseEnter = () => {
    if (isReducedMotion.value) return;
    isHovered.value = true;
  };

  const handleMouseLeave = () => {
    cancelAnimationFrame(frameId);
    isHovered.value = false;
    tiltX.value = 0;
    tiltY.value = 0;
  };

  const checkMotionPreference = (e: MediaQueryListEvent | MediaQueryList) => {
    isReducedMotion.value = e.matches;
  };

  let mediaQuery: MediaQueryList | null = null;

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    checkMotionPreference(mediaQuery);
    mediaQuery.addEventListener('change', checkMotionPreference);

    if (elementRef.value) {
      elementRef.value.addEventListener('mousemove', handleMouseMove);
      elementRef.value.addEventListener('mouseenter', handleMouseEnter);
      elementRef.value.addEventListener('mouseleave', handleMouseLeave);
    }
  });

  onUnmounted(() => {
    cancelAnimationFrame(frameId);
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', checkMotionPreference);
    }
    if (elementRef.value) {
      elementRef.value.removeEventListener('mousemove', handleMouseMove);
      elementRef.value.removeEventListener('mouseenter', handleMouseEnter);
      elementRef.value.removeEventListener('mouseleave', handleMouseLeave);
    }
  });

  const glareStyle = computed(() => {
    if (isReducedMotion.value) return { opacity: 0 };

    if (!isHovered.value || !elementRef.value) {
      return { opacity: 0, transition: 'opacity 0.4s ease' };
    }

    const rect = elementRef.value.getBoundingClientRect();
    const xPct = (mouseX.value / rect.width) * 100;
    const yPct = (mouseY.value / rect.height) * 100;

    return {
      background: `radial-gradient(circle at ${xPct}% ${yPct}%, var(--finished-accent, rgba(255,255,255,0.8)) 0%, transparent ${options.glareMax}%)`,
      transition: 'opacity 0.2s ease',
      mixBlendMode: 'overlay' as import('csstype').Property.MixBlendMode,
      opacity: '0.15',
    };
  });

  return {
    isHovered,
    glareStyle,
  };
}
