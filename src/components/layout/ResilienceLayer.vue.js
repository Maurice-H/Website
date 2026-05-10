/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useLightingStore } from '@/stores/lighting';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { LightingPhase } from '@/types';
const lighting = useLightingStore();
const performance = usePerformanceStore();
const themeStore = useThemeStore();
const cursorEl = ref(null);
// Plain JS variables to avoid Vue reactivity overhead on high-frequency events
let rawMouseX = -100;
let rawMouseY = -100;
let rafId = null;
const onPointerMove = (e) => {
    rawMouseX = e.clientX;
    rawMouseY = e.clientY;
    if (rafId === null) {
        rafId = requestAnimationFrame(() => {
            if (cursorEl.value) {
                cursorEl.value.style.transform = `translate(${rawMouseX - 50}px, ${rawMouseY - 50}px)`;
            }
            rafId = null;
        });
    }
};
onMounted(() => {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
});
onUnmounted(() => {
    window.removeEventListener('pointermove', onPointerMove);
});
const getAccentColor = (opacity) => {
    return themeStore.isBlueprintMode
        ? `rgba(56, 189, 248, ${opacity})`
        : `rgba(16, 185, 129, ${opacity})`;
};
const isVisible = computed(() => {
    return !performance.isWebGLSupported && themeStore.lightingEnabled;
});
const navStyle = computed(() => {
    const color = getAccentColor(0.3);
    const transparent = getAccentColor(0);
    return {
        background: `radial-gradient(ellipse 60% 120% at 50% -10%, ${color} 0%, ${transparent} 85%)`,
    };
});
const baseCursorStyle = computed(() => {
    const color = getAccentColor(0.8);
    const transparent = getAccentColor(0);
    return {
        // Initial off-screen positioning until the first mouse move
        transform: 'translate(-100px, -100px)',
        background: `radial-gradient(circle 40px at center, ${color} 0%, ${transparent} 100%)`,
    };
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['cursor-glow']} */ ;
if (__VLS_ctx.isVisible) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "resilience-layer" },
        ...{ class: (`phase-${__VLS_ctx.lighting.phase.toLowerCase()}`) },
    });
    /** @type {__VLS_StyleScopedClasses['resilience-layer']} */ ;
    if (__VLS_ctx.lighting.phase === __VLS_ctx.LightingPhase.NAV) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "beam-layer" },
            ...{ style: (__VLS_ctx.navStyle) },
        });
        /** @type {__VLS_StyleScopedClasses['beam-layer']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ref: "cursorEl",
            ...{ class: "cursor-glow" },
            ...{ style: (__VLS_ctx.baseCursorStyle) },
        });
        /** @type {__VLS_StyleScopedClasses['cursor-glow']} */ ;
    }
}
// @ts-ignore
[isVisible, lighting, lighting, LightingPhase, navStyle, baseCursorStyle,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
