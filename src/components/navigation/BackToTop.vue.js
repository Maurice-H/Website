/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, onUnmounted, ref } from 'vue';
import { useAudio } from '../../composables/useAudio';
import { useThemeStore } from '../../stores/useThemeStore';
import ChevronUpIcon from '../icons/ChevronUpIcon.vue';
const themeStore = useThemeStore();
const { playClick, playGlitch } = useAudio();
const SCROLL_THRESHOLD = 300;
const isVisible = ref(false);
let rafId = null;
const isMobile = ref(typeof window !== 'undefined' && window.innerWidth < 768);
const updateMobileState = () => {
    isMobile.value = typeof window !== 'undefined' && window.innerWidth < 768;
};
const handleTheme = () => {
    themeStore.toggleTheme();
    playGlitch();
};
const handleLighting = () => {
    themeStore.toggleLighting();
    playClick();
};
const handleScroll = () => {
    if (rafId !== null)
        return;
    rafId = requestAnimationFrame(() => {
        const scrollContainer = document.querySelector('.content-stage');
        isVisible.value = (scrollContainer?.scrollTop ?? 0) > SCROLL_THRESHOLD;
        rafId = null;
    });
};
const scrollToTop = () => {
    const scrollContainer = document.querySelector('.content-stage');
    scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
};
onMounted(() => {
    window.addEventListener('resize', updateMobileState);
    const scrollContainer = document.querySelector('.content-stage');
    scrollContainer?.addEventListener('scroll', handleScroll, { passive: true });
});
onUnmounted(() => {
    window.removeEventListener('resize', updateMobileState);
    const scrollContainer = document.querySelector('.content-stage');
    scrollContainer?.removeEventListener('scroll', handleScroll);
    if (rafId !== null)
        cancelAnimationFrame(rafId);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['floating-actions-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['floating-actions-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-toggle-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-toggle-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['back-to-top-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['back-to-top-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['back-to-top-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['back-to-top-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "floating-actions-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['floating-actions-wrapper']} */ ;
if (__VLS_ctx.isMobile) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mobile-toggles" },
    });
    /** @type {__VLS_StyleScopedClasses['mobile-toggles']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.handleTheme) },
        ...{ class: "mobile-toggle-btn" },
        'aria-label': "Toggle Theme",
    });
    /** @type {__VLS_StyleScopedClasses['mobile-toggle-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.kbd, __VLS_intrinsics.kbd)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.handleLighting) },
        ...{ class: "mobile-toggle-btn" },
        'aria-label': "Toggle Lighting",
    });
    /** @type {__VLS_StyleScopedClasses['mobile-toggle-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.kbd, __VLS_intrinsics.kbd)({});
}
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "back-to-top",
}));
const __VLS_2 = __VLS_1({
    name: "back-to-top",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.isVisible) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.scrollToTop) },
        type: "button",
        ...{ class: "back-to-top-btn" },
        'aria-label': "Scroll to top",
    });
    /** @type {__VLS_StyleScopedClasses['back-to-top-btn']} */ ;
    const __VLS_6 = ChevronUpIcon;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
}
// @ts-ignore
[isMobile, handleTheme, handleLighting, isVisible, scrollToTop,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
