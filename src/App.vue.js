/// <reference types="../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import ContactForm from './components/features/ContactForm.vue';
import HeroSection from './components/features/HeroSection.vue';
import ProjectsSection from './components/features/ProjectsSection.vue';
import SkillsAbout from './components/features/SkillsAbout.vue';
import BentoLayout from './components/layout/BentoLayout.vue';
// Lazy load the heavy WebGL background to keep the initial bundle small
const WebGLBackground = defineAsyncComponent(() => import('./components/layout/WebGLBackground.vue'));
import ResilienceLayer from './components/layout/ResilienceLayer.vue';
import BackToTop from './components/navigation/BackToTop.vue';
import NavConveyor from './components/navigation/NavConveyor.vue';
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts';
import { initGlobalViewportService } from './composables/useViewportStore';
import { useLightingStore } from './stores/lighting';
import { usePerformanceStore } from './stores/usePerformanceStore';
import { useThemeStore } from './stores/useThemeStore';
import { LightingPhase } from './types';
// Use the stores directly to avoid any destructuring reactivity caveats
const lighting = useLightingStore();
const themeStore = useThemeStore();
const performance = usePerformanceStore();
// Register global keyboard shortcuts (L = lighting, T = theme)
useKeyboardShortcuts();
// Check if we use the WebGL scanner (only on Content page + light on)
const isCustomCursorActive = computed(() => {
    return themeStore.lightingEnabled && lighting.phase === 'CONTENT';
});
/**
 * CSS custom properties set on root element for child access.
 * --reveal-mask is consumed by FusedReveal and App.vue slotted content.
 * Only changes on phase transition (NAV ↔ CONTENT), not on every mouse move.
 */
const rootCssVars = computed(() => {
    if (!themeStore.lightingEnabled)
        return {};
    const isNav = lighting.phase === 'NAV';
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    // Use a wider gradient on mobile to cover more of the smaller screen
    const maskSize = isMobile ? '80% 120%' : '40% 160%';
    return {
        '--reveal-mask': isNav
            ? `radial-gradient(ellipse ${maskSize} at 50% -10%, black 0%, rgba(0,0,0,0) 100%)`
            : '',
    };
});
const handleBackToNav = () => {
    lighting.setPhase(LightingPhase.NAV);
};
const handleGlobalKeydown = (e) => {
    if (e.key === 'Escape' && lighting.phase === 'CONTENT') {
        handleBackToNav();
    }
};
const handleAfterEnter = () => {
    const target = lighting.pendingScrollTarget;
    if (!target)
        return;
    lighting.pendingScrollTarget = null;
    // Wait for the transition to settle and the DOM to be fully updated
    setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
};
onMounted(async () => {
    window.addEventListener('keydown', handleGlobalKeydown);
    console.log('App Mounted in Fused Single-Layer Mode');
    initGlobalViewportService();
    // Run GPU performance benchmark early to determine rendering tier
    await performance.checkPerformance();
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-root" },
    ...{ class: ({
            'hide-system-cursor': __VLS_ctx.isCustomCursorActive,
            'is-ci-mode': __VLS_ctx.performance.isCiMode,
        }) },
    'data-drone-focused': (__VLS_ctx.lighting.focusedElementPos ? 'true' : 'false'),
});
/** @type {__VLS_StyleScopedClasses['app-root']} */ ;
/** @type {__VLS_StyleScopedClasses['hide-system-cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['is-ci-mode']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.WebGLBackground} */
WebGLBackground;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_5 = ResilienceLayer;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ...{ class: "flash-overlay" },
    ...{ class: ({ 'flash-active': __VLS_ctx.lighting.isFlashActive }) },
});
/** @type {__VLS_StyleScopedClasses['flash-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['flash-active']} */ ;
if (__VLS_ctx.performance.isReady) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "content-stage" },
        ...{ style: (__VLS_ctx.rootCssVars) },
    });
    /** @type {__VLS_StyleScopedClasses['content-stage']} */ ;
    let __VLS_10;
    /** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
    Transition;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        ...{ 'onAfterEnter': {} },
        name: "fade-overlay",
        mode: "out-in",
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onAfterEnter': {} },
        name: "fade-overlay",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_15;
    const __VLS_16 = ({ afterEnter: {} },
        { onAfterEnter: (__VLS_ctx.handleAfterEnter) });
    const { default: __VLS_17 } = __VLS_13.slots;
    if (__VLS_ctx.lighting.phase === 'NAV') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: "nav",
            ...{ class: "h-screen w-full relative" },
        });
        /** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['relative']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "absolute inset-0 flex items-end justify-center pointer-events-none pb-[10vh]" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
        /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-end']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
        /** @type {__VLS_StyleScopedClasses['pb-[10vh]']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-[10vw] md:text-[12vw] font-black uppercase tracking-tighter select-none text-white/[0.03] leading-none" },
        });
        /** @type {__VLS_StyleScopedClasses['text-[10vw]']} */ ;
        /** @type {__VLS_StyleScopedClasses['md:text-[12vw]']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-tighter']} */ ;
        /** @type {__VLS_StyleScopedClasses['select-none']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/[0.03]']} */ ;
        /** @type {__VLS_StyleScopedClasses['leading-none']} */ ;
        const __VLS_18 = NavConveyor;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({}));
        const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: "content",
            ...{ class: "p-4 md:p-8 lg:p-16 min-h-screen relative" },
        });
        /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['md:p-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['lg:p-16']} */ ;
        /** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
        /** @type {__VLS_StyleScopedClasses['relative']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "fixed top-2 right-2 md:top-8 md:right-8 z-[100] flex flex-col md:flex-row items-end md:items-center gap-1.5 md:gap-4 pointer-events-auto" },
        });
        /** @type {__VLS_StyleScopedClasses['fixed']} */ ;
        /** @type {__VLS_StyleScopedClasses['top-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['right-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['md:top-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['md:right-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['z-[100]']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-end']} */ ;
        /** @type {__VLS_StyleScopedClasses['md:items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['md:gap-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['pointer-events-auto']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.handleBackToNav) },
            type: "button",
            ...{ class: "px-2 md:px-4 py-2 border whitespace-nowrap border-white/10 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/10 transition-all duration-200 text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98]" },
        });
        /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['md:px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-black/40']} */ ;
        /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
        /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-[0.2em]']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/40']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
        /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
        /** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent']} */ ;
        /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-black']} */ ;
        /** @type {__VLS_StyleScopedClasses['active:scale-[0.98]']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "max-w-6xl mx-auto flex flex-col gap-6 pt-12 md:pt-20 relative z-10" },
        });
        /** @type {__VLS_StyleScopedClasses['max-w-6xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['pt-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['md:pt-20']} */ ;
        /** @type {__VLS_StyleScopedClasses['relative']} */ ;
        /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
        const __VLS_23 = HeroSection;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({}));
        const __VLS_25 = __VLS_24({}, ...__VLS_functionalComponentArgsRest(__VLS_24));
        const __VLS_28 = BentoLayout || BentoLayout;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({}));
        const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
        const { default: __VLS_33 } = __VLS_31.slots;
        const __VLS_34 = SkillsAbout;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({}));
        const __VLS_36 = __VLS_35({}, ...__VLS_functionalComponentArgsRest(__VLS_35));
        const __VLS_39 = ProjectsSection;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({}));
        const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
        const __VLS_44 = ContactForm;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({}));
        const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
        // @ts-ignore
        [isCustomCursorActive, performance, performance, lighting, lighting, lighting, rootCssVars, handleAfterEnter, handleBackToNav,];
        var __VLS_31;
        const __VLS_49 = BackToTop;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
        const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    }
    // @ts-ignore
    [];
    var __VLS_13;
    var __VLS_14;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
