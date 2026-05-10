/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, onUnmounted, ref } from 'vue';
const DISMISS_KEY = 'shortcut-hints-seen';
const SHOW_DELAY_MS = 2000;
const VISIBLE_DURATION_MS = 6000;
const visible = ref(false);
let showTimeout;
let hideTimeout;
const dismiss = () => {
    visible.value = false;
    try {
        sessionStorage.setItem(DISMISS_KEY, '1');
    }
    catch {
        /* storage unavailable */
    }
};
onMounted(() => {
    // Only show once per session
    try {
        if (sessionStorage.getItem(DISMISS_KEY))
            return;
    }
    catch {
        /* storage unavailable */
    }
    showTimeout = setTimeout(() => {
        visible.value = true;
        hideTimeout = setTimeout(dismiss, VISIBLE_DURATION_MS);
    }, SHOW_DELAY_MS);
});
onUnmounted(() => {
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['hint-row']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-row']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "hint-fade",
}));
const __VLS_2 = __VLS_1({
    name: "hint-fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.visible) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shortcut-hints" },
    });
    /** @type {__VLS_StyleScopedClasses['shortcut-hints']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hint-row" },
    });
    /** @type {__VLS_StyleScopedClasses['hint-row']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.kbd, __VLS_intrinsics.kbd)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hint-row" },
    });
    /** @type {__VLS_StyleScopedClasses['hint-row']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.kbd, __VLS_intrinsics.kbd)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hint-row" },
    });
    /** @type {__VLS_StyleScopedClasses['hint-row']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.kbd, __VLS_intrinsics.kbd)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
// @ts-ignore
[visible,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
