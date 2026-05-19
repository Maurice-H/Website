import type { CSSProperties } from 'vue';
import { computed, nextTick } from 'vue';
import { useLightingStore } from '@/stores/lighting';
import { useThemeStore } from '@/stores/useThemeStore';
import { useResponsive } from './useResponsive';

export const useAppPhase = () => {
  const lighting = useLightingStore();
  const themeStore = useThemeStore();
  const { isMobile } = useResponsive();

  const currentPhase = computed(() => lighting.phase);
  const isNav = computed(() => lighting.phase === 'NAV');
  const isContent = computed(() => lighting.phase === 'CONTENT');

  const rootCssVars = computed<CSSProperties>(() => {
    if (!themeStore.lightingEnabled) return {};

    const maskSize = isMobile.value ? '80% 120%' : '40% 160%';

    return {
      '--reveal-mask': isNav.value
        ? `radial-gradient(ellipse ${maskSize} at 50% -10%, black 0%, rgba(0,0,0,0) 100%)`
        : '',
    } as CSSProperties;
  });

  const handleBackToNav = () => {
    lighting.setPhase('NAV');
  };

  const handleGlobalKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isContent.value) {
      handleBackToNav();
    }
  };

  const handleAfterEnter = async () => {
    const target = lighting.pendingScrollTarget;
    if (!target) return;
    lighting.pendingScrollTarget = null;

    // Use nextTick instead of setTimeout to ensure DOM is ready
    await nextTick();
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return {
    currentPhase,
    isNav,
    isContent,
    rootCssVars,
    handleBackToNav,
    handleGlobalKeydown,
    handleAfterEnter,
  };
};
