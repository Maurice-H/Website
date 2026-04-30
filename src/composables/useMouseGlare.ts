import { computed, onMounted, onUnmounted, type Ref, ref } from 'vue';

export function useMouseGlare(elementRef: Ref<HTMLElement | null>, options = { glareMax: 60 }) {
  const isHovered = ref(false);
  const isReducedMotion = ref(false);

  const handleMouseEnter = () => {
    if (isReducedMotion.value) return;
    isHovered.value = true;
  };

  const handleMouseLeave = () => {
    isHovered.value = false;
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
      elementRef.value.addEventListener('mouseenter', handleMouseEnter);
      elementRef.value.addEventListener('mouseleave', handleMouseLeave);
    }
  });

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', checkMotionPreference);
    }
    if (elementRef.value) {
      elementRef.value.removeEventListener('mouseenter', handleMouseEnter);
      elementRef.value.removeEventListener('mouseleave', handleMouseLeave);
    }
  });

  const glareStyle = computed(() => {
    if (isReducedMotion.value) return { opacity: 0 };

    if (!isHovered.value || !elementRef.value) {
      return { opacity: 0, transition: 'opacity 0.4s ease' };
    }

    return {
      background: `radial-gradient(circle at calc(var(--mouse-x) - var(--card-left, 0px)) calc(var(--mouse-y) - var(--card-top, 0px)), var(--finished-accent, rgba(255,255,255,0.8)) 0%, transparent ${options.glareMax}%)`,
      transition: 'opacity 0.2s ease',
      mixBlendMode: 'overlay' as import('csstype').Property.MixBlendMode,
      opacity: '0.15',
      willChange: 'background',
    };
  });

  return {
    isHovered,
    glareStyle,
  };
}
