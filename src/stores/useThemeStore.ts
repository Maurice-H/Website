import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { ThemeState } from '@/types';

const LIGHTING_STORAGE_KEY = 'portfolio-lighting-enabled';

export const useThemeStore = defineStore('theme', () => {
  const isBlueprintMode = ref<ThemeState['isBlueprint']>(false);

  // Lighting effects toggle — persisted to localStorage
  const storedLighting =
    typeof window !== 'undefined' ? localStorage.getItem(LIGHTING_STORAGE_KEY) : null;
  const lightingEnabled = ref<boolean>(storedLighting !== null ? storedLighting === 'true' : true);

  const toggleTheme = () => {
    isBlueprintMode.value = !isBlueprintMode.value;
  };

  const toggleLighting = () => {
    lightingEnabled.value = !lightingEnabled.value;
  };

  // Sync blueprint mode to root element for CSS variables
  watch(
    isBlueprintMode,
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

  // Persist lighting preference to localStorage
  watch(lightingEnabled, (enabled) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LIGHTING_STORAGE_KEY, String(enabled));
    }
  });

  return {
    isBlueprintMode,
    lightingEnabled,
    toggleTheme,
    toggleLighting,
  };
});
