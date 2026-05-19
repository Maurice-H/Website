import { watch } from 'vue';
import { useThemeStore } from '@/stores/useThemeStore';

export function useThemeDomSync() {
  const themeStore = useThemeStore();

  // Sync blueprint mode to root element for CSS variables
  watch(
    () => themeStore.isBlueprintMode,
    (isBlueprint) => {
      if (typeof document !== 'undefined') {
        // Background-Sync: Use background colors for system UI to ensure
        // a seamless full-screen experience regardless of system dark/light mode.
        const themeColor = isBlueprint ? '#0a1628' : '#020205';

        // Update root attribute for CSS variable overrides
        if (isBlueprint) {
          document.documentElement.setAttribute('data-theme', 'blueprint');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }

        // Update mobile system theme-color (affects status bar and nav bar on Android/iOS)
        const updateMetas = () => {
          if (typeof document === 'undefined') return;
          // Select both standard and media-query theme-color tags
          const metas = document.querySelectorAll(
            'meta[name="theme-color"], meta[name="msapplication-navbutton-color"]'
          );
          metas.forEach((meta) => {
            meta.setAttribute('content', themeColor);
          });
        };

        // Aggressive update sequence to catch OS registration windows
        updateMetas();
        setTimeout(updateMetas, 100);
        setTimeout(updateMetas, 500);
      }
    },
    { immediate: true }
  );
}
