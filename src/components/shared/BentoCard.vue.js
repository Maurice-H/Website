/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useLightingStore } from '../../stores/lighting';
import { useViewportStore } from '../../stores/viewport';
import WindowFrame from './WindowFrame.vue';
const props = withDefaults(defineProps(), {
    id: '',
    colSpan: 1,
    rowSpan: 1,
    withWindow: false,
    title: '',
    isLowEnd: false,
});
const cardRef = ref(null);
const viewport = useViewportStore();
const lighting = useLightingStore();
let unregisterFn = null;
const isHovered = ref(false);
const handleMouseEnter = () => {
    isHovered.value = true;
    if (!cardRef.value)
        return;
    const rect = cardRef.value.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    lighting.focusedElementPos = {
        x: (centerX / window.innerWidth) * 2 - 1,
        y: -((centerY / window.innerHeight) * 2 - 1),
    };
};
const handleMouseLeave = () => {
    isHovered.value = false;
    lighting.focusedElementPos = null;
};
const revealStyle = computed(() => {
    return {
        opacity: 1, // Full opacity for the content, global mask will handle the reveal
    };
});
// Grid classes
const colSpanClass = computed(() => {
    switch (props.colSpan) {
        case 2:
            return 'md:col-span-2';
        case 3:
            return 'md:col-span-2 lg:col-span-3';
        case 4:
            return 'md:col-span-2 lg:col-span-4';
        default:
            return 'col-span-1';
    }
});
const rowSpanClass = computed(() => {
    switch (props.rowSpan) {
        case 2:
            return 'row-span-2';
        case 3:
            return 'row-span-3';
        case 4:
            return 'row-span-4';
        default:
            return 'row-span-1';
    }
});
onMounted(() => {
    if (cardRef.value) {
        const reg = viewport.register(props.id, cardRef.value);
        unregisterFn = reg.unregister;
    }
});
onUnmounted(() => {
    unregisterFn?.();
});
const __VLS_defaults = {
    id: '',
    colSpan: 1,
    rowSpan: 1,
    withWindow: false,
    title: '',
    isLowEnd: false,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['bento-card']} */ ;
/** @type {__VLS_StyleScopedClasses['is-low-end']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-reveal']} */ ;
/** @type {__VLS_StyleScopedClasses['bento-card']} */ ;
/** @type {__VLS_StyleScopedClasses['layer-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bento-card']} */ ;
/** @type {__VLS_StyleScopedClasses['layer-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bento-card']} */ ;
/** @type {__VLS_StyleScopedClasses['layer-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bento-card']} */ ;
/** @type {__VLS_StyleScopedClasses['bento-card']} */ ;
/** @type {__VLS_StyleScopedClasses['is-low-end']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onMouseenter: (__VLS_ctx.handleMouseEnter) },
    ...{ onMouseleave: (__VLS_ctx.handleMouseLeave) },
    ref: "cardRef",
    id: (__VLS_ctx.id),
    ...{ class: "bento-card relative rounded-2xl p-4 md:p-6 overflow-hidden flex flex-col min-w-0 w-full h-full group" },
    ...{ class: ([__VLS_ctx.colSpanClass, __VLS_ctx.rowSpanClass, { 'is-low-end': __VLS_ctx.isLowEnd }]) },
    'data-drone-target': (__VLS_ctx.isHovered ? 'true' : 'false'),
});
/** @type {__VLS_StyleScopedClasses['bento-card']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['is-low-end']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "absolute inset-0 bg-finished-bg/40 z-[-1]" },
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-finished-bg/40']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[-1]']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "absolute inset-0 border border-dashed border-blueprint-border rounded-2xl pointer-events-none z-0" },
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blueprint-border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 rounded-[inherit] glass-reveal" },
    ...{ style: (__VLS_ctx.revealStyle) },
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-[inherit]']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-reveal']} */ ;
if (!__VLS_ctx.isLowEnd) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "noise-overlay" },
    });
    /** @type {__VLS_StyleScopedClasses['noise-overlay']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "absolute inset-0 bg-[var(--glass-reflection)] z-0 opacity-40" },
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--glass-reflection)]']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-40']} */ ;
if (!__VLS_ctx.isLowEnd) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "bento-card-stack-layer layer-1" },
    });
    /** @type {__VLS_StyleScopedClasses['bento-card-stack-layer']} */ ;
    /** @type {__VLS_StyleScopedClasses['layer-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "bento-card-stack-layer layer-2" },
    });
    /** @type {__VLS_StyleScopedClasses['bento-card-stack-layer']} */ ;
    /** @type {__VLS_StyleScopedClasses['layer-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "bento-card-stack-layer layer-3" },
    });
    /** @type {__VLS_StyleScopedClasses['bento-card-stack-layer']} */ ;
    /** @type {__VLS_StyleScopedClasses['layer-3']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "relative z-20 flex-1 flex flex-col w-full h-full" },
});
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
if (__VLS_ctx.withWindow) {
    const __VLS_0 = WindowFrame || WindowFrame;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        title: (__VLS_ctx.title),
    }));
    const __VLS_2 = __VLS_1({
        title: (__VLS_ctx.title),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    var __VLS_6 = {};
    // @ts-ignore
    [handleMouseEnter, handleMouseLeave, id, colSpanClass, rowSpanClass, isLowEnd, isLowEnd, isLowEnd, isHovered, revealStyle, withWindow, title,];
    var __VLS_3;
}
else {
    var __VLS_8 = {};
}
// @ts-ignore
var __VLS_7 = __VLS_6, __VLS_9 = __VLS_8;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
