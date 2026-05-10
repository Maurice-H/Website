/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onBeforeUnmount, ref } from 'vue';
import BentoCard from './BentoCard.vue';
const containerEl = ref(null);
let rafId = null;
// Use plain variables outside the closure so RAF reads the latest values
let currentClientX = 0;
let currentClientY = 0;
const handlePointerMove = (e) => {
    // ⚡ Bolt: Cache coordinates and bypass Vue reactivity for high-frequency updates
    currentClientX = e.clientX;
    currentClientY = e.clientY;
    const target = e.currentTarget;
    if (rafId === null) {
        rafId = requestAnimationFrame(() => {
            if (containerEl.value) {
                const rect = target.getBoundingClientRect();
                const x = (currentClientX - rect.left) / rect.width - 0.5;
                const y = (currentClientY - rect.top) / rect.height - 0.5;
                containerEl.value.style.transform = `rotateX(${-y * 20}deg) rotateY(${x * 20}deg)`;
            }
            rafId = null;
        });
    }
};
const resetRotation = () => {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    if (containerEl.value) {
        containerEl.value.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
};
onBeforeUnmount(() => {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
});
const getStackLayerStyle = (index) => {
    return {
        transform: `translateZ(${-index * 20}px) translateY(${index * 10}px) scale(${1 - index * 0.05})`,
        opacity: 1 - index * 0.2,
        zIndex: -index,
    };
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stacked-card-wrapper perspective-1000" },
});
/** @type {__VLS_StyleScopedClasses['stacked-card-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['perspective-1000']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onPointermove: (__VLS_ctx.handlePointerMove) },
    ...{ onMouseleave: (__VLS_ctx.resetRotation) },
    ref: "containerEl",
    ...{ class: "stacked-card-container relative w-full h-64 transition-transform duration-500 transform-style-3d will-change-transform hover:rotate-y-12" },
});
/** @type {__VLS_StyleScopedClasses['stacked-card-container']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-64']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transform-style-3d']} */ ;
/** @type {__VLS_StyleScopedClasses['will-change-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:rotate-y-12']} */ ;
for (const [i] of __VLS_vFor((3))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (i),
        ...{ class: "absolute inset-0 rounded-2xl border border-finished-text/10 bg-finished-text/5 backdrop-blur-md transition-transform transition-opacity duration-300 pointer-events-none" },
        ...{ style: (__VLS_ctx.getStackLayerStyle(i)) },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-finished-text/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-finished-text/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
    // @ts-ignore
    [handlePointerMove, resetRotation, getStackLayerStyle,];
}
const __VLS_0 = BentoCard || BentoCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    id: "stacked-main",
    ...{ class: "absolute inset-0 z-10 !bg-finished-text/10 !backdrop-blur-xl border border-finished-text/20 shadow-2xl" },
}));
const __VLS_2 = __VLS_1({
    id: "stacked-main",
    ...{ class: "absolute inset-0 z-10 !bg-finished-text/10 !backdrop-blur-xl border border-finished-text/20 shadow-2xl" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['!bg-finished-text/10']} */ ;
/** @type {__VLS_StyleScopedClasses['!backdrop-blur-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-finished-text/20']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
var __VLS_6 = {};
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_7 = __VLS_6;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({});
const __VLS_export = {};
export default {};
