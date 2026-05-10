/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { usePerformanceStore } from '@stores/usePerformanceStore';
import { TresCanvas } from '@tresjs/core';
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three';
import { computed } from 'vue';
import CSSBackground from './CSSBackground.vue';
import WebGLScene from './WebGLScene.vue';
const performance = usePerformanceStore();
/**
 * Dynamic WebGL Configuration based on GPU Tiering.
 * Tier 2 (Optimized): Lower pixel ratio, no antialiasing, default power.
 * Tier 3 (High-End): Full pixel ratio, antialiasing, high-performance power.
 */
const glConfig = computed(() => {
    const tier = performance.gpuTier || 2;
    return {
        clearColor: '#000000',
        shadows: false,
        alpha: false,
        shadowMapType: BasicShadowMap,
        outputColorSpace: SRGBColorSpace,
        toneMapping: NoToneMapping,
        // Antialiasing is expensive; only enable for high-end hardware.
        antialias: tier >= 3,
        // Limit resolution on mid-range devices to maintain frame stability.
        pixelRatio: tier < 3 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2),
        // Signal the browser to prefer the discrete GPU on Tier 3.
        powerPreference: (tier >= 3 ? 'high-performance' : 'default'),
    };
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
if (__VLS_ctx.performance.isReady && __VLS_ctx.performance.isWebGLSupported) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none" },
    });
    /** @type {__VLS_StyleScopedClasses['fixed']} */ ;
    /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-50']} */ ;
    /** @type {__VLS_StyleScopedClasses['mix-blend-screen']} */ ;
    /** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.TresCanvas | typeof __VLS_components.TresCanvas} */
    TresCanvas;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...(__VLS_ctx.glConfig),
    }));
    const __VLS_2 = __VLS_1({
        ...(__VLS_ctx.glConfig),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    const __VLS_6 = WebGLScene;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
    // @ts-ignore
    [performance, performance, glConfig,];
    var __VLS_3;
}
else if (__VLS_ctx.performance.isReady) {
    const __VLS_11 = CSSBackground;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({}));
    const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
    var __VLS_16 = {};
    var __VLS_14;
}
// @ts-ignore
[performance,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
