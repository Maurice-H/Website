/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { PROJECTS as projects } from '../../data/portfolio';
import { usePerformanceStore } from '../../stores/usePerformanceStore';
import BentoCard from '../shared/BentoCard.vue';
const performance = usePerformanceStore();
const openProject = (url) => {
    if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "projects-section",
    ...{ class: "col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" },
});
/** @type {__VLS_StyleScopedClasses['col-span-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
for (const [project] of __VLS_vFor((__VLS_ctx.projects))) {
    const __VLS_0 = BentoCard || BentoCard;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        ...{ 'onKeydown': {} },
        ...{ 'onKeydown': {} },
        key: (project.id),
        ...{ class: "md:col-span-1 md:row-span-1 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-4 focus-visible:ring-offset-black transition-transform duration-300 active:scale-[0.98]" },
        withWindow: true,
        title: (project.title),
        isLowEnd: (__VLS_ctx.performance.isLowEnd),
        tabindex: "0",
        role: "link",
        'aria-label': (`Open project: ${project.title}`),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        ...{ 'onKeydown': {} },
        ...{ 'onKeydown': {} },
        key: (project.id),
        ...{ class: "md:col-span-1 md:row-span-1 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-4 focus-visible:ring-offset-black transition-transform duration-300 active:scale-[0.98]" },
        withWindow: true,
        title: (project.title),
        isLowEnd: (__VLS_ctx.performance.isLowEnd),
        tabindex: "0",
        role: "link",
        'aria-label': (`Open project: ${project.title}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    const __VLS_6 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.openProject(project.link || project.repoUrl);
                // @ts-ignore
                [projects, performance, openProject,];
            } });
    const __VLS_7 = ({ keydown: {} },
        { onKeydown: (...[$event]) => {
                __VLS_ctx.openProject(project.link || project.repoUrl);
                // @ts-ignore
                [openProject,];
            } });
    const __VLS_8 = ({ keydown: {} },
        { onKeydown: (...[$event]) => {
                __VLS_ctx.openProject(project.link || project.repoUrl);
                // @ts-ignore
                [openProject,];
            } });
    /** @type {__VLS_StyleScopedClasses['md:col-span-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:row-span-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['group']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['active:scale-[0.98]']} */ ;
    const { default: __VLS_9 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-4 md:p-8 flex flex-col h-full" },
    });
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:p-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-1 mt-6" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "mb-6 text-sm leading-relaxed text-finished-text/50 transition-colors duration-[var(--theme-transition-duration)]" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-finished-text/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    (project.description);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-wrap gap-2 mt-auto" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
    for (const [tag] of __VLS_vFor((project.tags))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            key: (tag),
            ...{ class: "px-2 py-0.5 text-xs uppercase tracking-widest rounded border border-finished-text/10 bg-transparent text-finished-text/30 group-hover:border-finished-accent/20 group-hover:text-finished-text/60 transition-colors duration-[var(--theme-transition-duration)]" },
        });
        /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-finished-text/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-finished-text/30']} */ ;
        /** @type {__VLS_StyleScopedClasses['group-hover:border-finished-accent/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['group-hover:text-finished-text/60']} */ ;
        /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
        /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
        (tag);
        // @ts-ignore
        [];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "absolute inset-0 border border-finished-accent/0 group-hover:border-finished-accent/10 transition-colors pointer-events-none rounded-[inherit]" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-finished-accent/0']} */ ;
    /** @type {__VLS_StyleScopedClasses['group-hover:border-finished-accent/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-[inherit]']} */ ;
    // @ts-ignore
    [];
    var __VLS_3;
    var __VLS_4;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
