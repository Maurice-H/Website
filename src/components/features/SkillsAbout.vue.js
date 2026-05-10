/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { SKILL_SECTIONS } from '../../data/portfolio';
import { usePerformanceStore } from '../../stores/usePerformanceStore';
import BentoCard from '../shared/BentoCard.vue';
const performance = usePerformanceStore();
const bio = SKILL_SECTIONS.find((s) => s.id === 'bio') || SKILL_SECTIONS[0];
const stack = SKILL_SECTIONS.find((s) => s.id === 'stack') || SKILL_SECTIONS[0];
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
const __VLS_0 = BentoCard || BentoCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    id: "about-discovery",
    ...{ class: "md:col-span-3 md:row-span-1" },
    withWindow: true,
    title: "Discovery Path",
    isLowEnd: (__VLS_ctx.performance.isLowEnd),
}));
const __VLS_2 = __VLS_1({
    id: "about-discovery",
    ...{ class: "md:col-span-3 md:row-span-1" },
    withWindow: true,
    title: "Discovery Path",
    isLowEnd: (__VLS_ctx.performance.isLowEnd),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['md:col-span-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:row-span-1']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-4 md:p-8 flex flex-col h-full" },
});
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-finished-text/50 text-sm md:text-base leading-relaxed max-w-2xl transition-colors duration-[var(--theme-transition-duration)]" },
});
/** @type {__VLS_StyleScopedClasses['text-finished-text/50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
(__VLS_ctx.bio.content);
// @ts-ignore
[performance, bio,];
var __VLS_3;
const __VLS_6 = BentoCard || BentoCard;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    id: "skills-stack",
    ...{ class: "md:col-span-1 md:row-span-1" },
    withWindow: true,
    title: "Stack",
    isLowEnd: (__VLS_ctx.performance.isLowEnd),
}));
const __VLS_8 = __VLS_7({
    id: "skills-stack",
    ...{ class: "md:col-span-1 md:row-span-1" },
    withWindow: true,
    title: "Stack",
    isLowEnd: (__VLS_ctx.performance.isLowEnd),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['md:col-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:row-span-1']} */ ;
const { default: __VLS_11 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-4 md:p-8 flex flex-col h-full" },
});
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-wrap gap-2 md:gap-3" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-3']} */ ;
for (const [skill] of __VLS_vFor((__VLS_ctx.stack.skills))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        key: (skill),
        ...{ class: "px-2.5 py-1 md:px-3 md:py-1.5 border border-finished-text/5 bg-finished-text/[0.03] rounded-full text-xs uppercase tracking-widest text-finished-text/40 hover:border-finished-accent/30 hover:text-finished-text/80 transition-colors duration-[var(--theme-transition-duration)]" },
    });
    /** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:px-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:py-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-finished-text/5']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-finished-text/[0.03]']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-finished-text/40']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:border-finished-accent/30']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-finished-text/80']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    (skill);
    // @ts-ignore
    [performance, stack,];
}
// @ts-ignore
[];
var __VLS_9;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
