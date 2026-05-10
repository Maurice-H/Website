/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import WindowFrame from '../shared/WindowFrame.vue';
const __VLS_props = defineProps();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['nav-window']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-window']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['window-active-glow']} */ ;
/** @type {__VLS_StyleScopedClasses['window-content']} */ ;
/** @type {__VLS_StyleScopedClasses['window-label-base']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['window-label-base']} */ ;
/** @type {__VLS_StyleScopedClasses['window-label-active']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['window-label-active']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "nav-window group focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-xl" },
    ...{ class: ([`theme-${__VLS_ctx.theme}`, { 'is-active': __VLS_ctx.active }]) },
    role: "tab",
    'aria-selected': (__VLS_ctx.active),
    tabindex: "0",
});
/** @type {__VLS_StyleScopedClasses['nav-window']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-black']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-container-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['window-container-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-container" },
});
/** @type {__VLS_StyleScopedClasses['window-container']} */ ;
const __VLS_0 = WindowFrame || WindowFrame;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: (__VLS_ctx.label),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.label),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-content" },
});
/** @type {__VLS_StyleScopedClasses['window-content']} */ ;
var __VLS_6 = {};
// @ts-ignore
[theme, active, active, label,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-active-glow" },
});
/** @type {__VLS_StyleScopedClasses['window-active-glow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-label-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['window-label-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-label-base" },
});
/** @type {__VLS_StyleScopedClasses['window-label-base']} */ ;
(__VLS_ctx.label);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-label-active" },
});
/** @type {__VLS_StyleScopedClasses['window-label-active']} */ ;
(__VLS_ctx.label);
// @ts-ignore
var __VLS_7 = __VLS_6;
// @ts-ignore
[label, label,];
const __VLS_base = (await import('vue')).defineComponent({
    __typeProps: {},
});
const __VLS_export = {};
export default {};
