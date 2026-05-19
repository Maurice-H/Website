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
