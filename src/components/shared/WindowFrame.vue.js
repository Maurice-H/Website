/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
const props = defineProps();
// If the title naturally has brackets (like "[ STACK ]"), format it monospace
const isBracketed = computed(() => {
    if (!props.title)
        return false;
    return props.title.trim().startsWith('[') || props.title.toLowerCase() === 'stack';
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-frame-container h-full flex flex-col" },
});
/** @type {__VLS_StyleScopedClasses['window-frame-container']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-header flex items-center px-6 pt-6 pb-2" },
});
/** @type {__VLS_StyleScopedClasses['window-header']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-title font-bold tracking-wide" },
    ...{ style: ({ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)' }) },
    ...{ class: (__VLS_ctx.isBracketed
            ? 'text-finished-text/70 font-mono tracking-widest'
            : 'text-[var(--finished-accent)]') },
});
/** @type {__VLS_StyleScopedClasses['window-title']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
(__VLS_ctx.isBracketed
    ? `[ ${__VLS_ctx.title?.replace(/[\[\]]/g, "").trim() || ""} ]`
    : __VLS_ctx.title);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "window-content-area flex-1 overflow-auto relative px-6 pb-6 pt-2" },
});
/** @type {__VLS_StyleScopedClasses['window-content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
// @ts-ignore
[isBracketed, isBracketed, title, title,];
const __VLS_base = (await import('vue')).defineComponent({
    __typeProps: {},
});
const __VLS_export = {};
export default {};
