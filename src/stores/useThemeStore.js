import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
const LIGHTING_STORAGE_KEY = 'portfolio-lighting-enabled';
export const useThemeStore = defineStore('theme', () => {
    const isBlueprintMode = ref(false);
    // Lighting effects toggle — persisted to localStorage
    const storedLighting = typeof window !== 'undefined' ? localStorage.getItem(LIGHTING_STORAGE_KEY) : null;
    const lightingEnabled = ref(storedLighting !== null ? storedLighting === 'true' : true);
    const toggleTheme = () => {
        isBlueprintMode.value = !isBlueprintMode.value;
    };
    const toggleLighting = () => {
        lightingEnabled.value = !lightingEnabled.value;
    };
    // Sync blueprint mode to root element for CSS variables
    watch(isBlueprintMode, (isBlueprint) => {
        if (typeof document !== 'undefined') {
            if (isBlueprint) {
                document.documentElement.setAttribute('data-theme', 'blueprint');
            }
            else {
                document.documentElement.removeAttribute('data-theme');
            }
        }
    }, { immediate: true });
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
