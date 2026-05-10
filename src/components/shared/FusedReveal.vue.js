/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useViewportStore } from '../../composables/useViewportStore';
const props = defineProps();
const containerRef = ref(null);
const { register, getOffsets } = useViewportStore();
let unregisterFn = null;
const offsets = computed(() => getOffsets(props.id));
// Viewport-synchronized mask: gradient center is at 50% 50% of a 100vw×100vh mask.
// We offset by -50vw/-50vh so the gradient center aligns with the mouse cursor,
// then subtract the component's viewport position to map coordinates correctly.
const finalMaskStyle = computed(() => {
    const { left, top } = offsets.value;
    return {
        maskImage: 'var(--reveal-mask)',
        WebkitMaskImage: 'var(--reveal-mask)',
        maskSize: '100vw 100vh',
        WebkitMaskSize: '100vw 100vh',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: `calc(var(--mask-x) - ${left}px - 50vw) calc(var(--mask-y) - ${top}px - 50vh)`,
        WebkitMaskPosition: `calc(var(--mask-x) - ${left}px - 50vw) calc(var(--mask-y) - ${top}px - 50vh)`,
    };
});
onMounted(() => {
    if (containerRef.value) {
        const { unregister } = register(props.id, containerRef.value);
        unregisterFn = unregister;
    }
});
onUnmounted(() => {
    unregisterFn?.();
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
    ref: "containerRef",
    ...{ class: "fused-reveal-container relative w-full h-full" },
});
/** @type {__VLS_StyleScopedClasses['fused-reveal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fused-layer-blueprint contents" },
});
/** @type {__VLS_StyleScopedClasses['fused-layer-blueprint']} */ ;
/** @type {__VLS_StyleScopedClasses['contents']} */ ;
var __VLS_0 = {};
if (!__VLS_ctx.$slots.blueprint) {
    var __VLS_2 = {};
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fused-layer-finished absolute inset-0 pointer-events-none select-none overflow-hidden" },
    ...{ style: (__VLS_ctx.finalMaskStyle) },
});
/** @type {__VLS_StyleScopedClasses['fused-layer-finished']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "contents" },
});
/** @type {__VLS_StyleScopedClasses['contents']} */ ;
var __VLS_4 = {};
if (!__VLS_ctx.$slots.finished) {
    var __VLS_6 = {};
}
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_3 = __VLS_2, __VLS_5 = __VLS_4, __VLS_7 = __VLS_6;
// @ts-ignore
[$slots, $slots, finalMaskStyle,];
const __VLS_base = (await import('vue')).defineComponent({
    __typeProps: {},
});
const __VLS_export = {};
export default {};
