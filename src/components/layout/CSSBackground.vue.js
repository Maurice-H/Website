/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { useLightingStore } from '@/stores/lighting';
import { useThemeStore } from '@/stores/useThemeStore';
import { LightingPhase } from '@/types';
const lightingStore = useLightingStore();
const themeStore = useThemeStore();
const isNavPhase = computed(() => lightingStore.phase === LightingPhase.NAV);
const isContentPhase = computed(() => lightingStore.phase === LightingPhase.CONTENT);
const isLightingEnabled = computed(() => themeStore.lightingEnabled);
const isBlueprintMode = computed(() => themeStore.isBlueprintMode);
/**
 * Generate deterministic-but-varied inline styles for ambient particles.
 * Avoids randomness so the DOM is stable across re-renders.
 */
const particleStyle = (index) => {
    const delay = (index * 1.3) % 6;
    const duration = 4 + (index % 4);
    const left = (index * 8.3) % 100;
    const top = (index * 7.1) % 100;
    const size = 2 + (index % 3);
    return {
        '--p-delay': `${delay}s`,
        '--p-duration': `${duration}s`,
        left: `${left}%`,
        top: `${top}%`,
        width: `${size}px`,
        height: `${size}px`,
    };
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['css-ufo']} */ ;
/** @type {__VLS_StyleScopedClasses['css-ufo']} */ ;
/** @type {__VLS_StyleScopedClasses['css-drone']} */ ;
/** @type {__VLS_StyleScopedClasses['css-drone']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "css-background" },
    ...{ class: ({ 'phase-content': __VLS_ctx.isContentPhase }) },
});
/** @type {__VLS_StyleScopedClasses['css-background']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "css-ufo" },
    ...{ class: ({
            'ufo-visible': __VLS_ctx.isNavPhase,
            'ufo-blueprint': __VLS_ctx.isBlueprintMode,
        }) },
});
/** @type {__VLS_StyleScopedClasses['css-ufo']} */ ;
/** @type {__VLS_StyleScopedClasses['ufo-visible']} */ ;
/** @type {__VLS_StyleScopedClasses['ufo-blueprint']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ufo-body" },
});
/** @type {__VLS_StyleScopedClasses['ufo-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ...{ class: "ufo-dome" },
});
/** @type {__VLS_StyleScopedClasses['ufo-dome']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ...{ class: "ufo-hull" },
});
/** @type {__VLS_StyleScopedClasses['ufo-hull']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ...{ class: "ufo-ring" },
});
/** @type {__VLS_StyleScopedClasses['ufo-ring']} */ ;
if (__VLS_ctx.isLightingEnabled) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ class: "ufo-glow" },
    });
    /** @type {__VLS_StyleScopedClasses['ufo-glow']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "css-drone" },
    ...{ class: ({
            'drone-visible': __VLS_ctx.isContentPhase,
            'drone-blueprint': __VLS_ctx.isBlueprintMode,
        }) },
});
/** @type {__VLS_StyleScopedClasses['css-drone']} */ ;
/** @type {__VLS_StyleScopedClasses['drone-visible']} */ ;
/** @type {__VLS_StyleScopedClasses['drone-blueprint']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "drone-body" },
});
/** @type {__VLS_StyleScopedClasses['drone-body']} */ ;
if (__VLS_ctx.isLightingEnabled) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ class: "drone-scanner" },
    });
    /** @type {__VLS_StyleScopedClasses['drone-scanner']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ...{ class: "drone-base" },
});
/** @type {__VLS_StyleScopedClasses['drone-base']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ...{ class: "drone-pulse" },
});
/** @type {__VLS_StyleScopedClasses['drone-pulse']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ...{ class: "drone-core" },
});
/** @type {__VLS_StyleScopedClasses['drone-core']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ...{ class: "drone-ring" },
});
/** @type {__VLS_StyleScopedClasses['drone-ring']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "css-particles" },
});
/** @type {__VLS_StyleScopedClasses['css-particles']} */ ;
for (const [i] of __VLS_vFor((12))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        key: (i),
        ...{ class: "particle" },
        ...{ style: (__VLS_ctx.particleStyle(i)) },
    });
    /** @type {__VLS_StyleScopedClasses['particle']} */ ;
    // @ts-ignore
    [isContentPhase, isContentPhase, isNavPhase, isBlueprintMode, isBlueprintMode, isLightingEnabled, isLightingEnabled, particleStyle,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
