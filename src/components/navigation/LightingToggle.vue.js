/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { storeToRefs } from 'pinia';
import { useAudio } from '../../composables/useAudio';
import { useThemeStore } from '../../stores/useThemeStore';
import LampIcon from '../icons/LampIcon.vue';
const themeStore = useThemeStore();
const { lightingEnabled, isBlueprintMode: isBlueprint } = storeToRefs(themeStore);
const { playClick: playSwitchSound } = useAudio();
const toggleLighting = () => {
    themeStore.toggleLighting();
    playSwitchSound();
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.toggleLighting) },
    type: "button",
    'aria-label': (`Lighting ${__VLS_ctx.lightingEnabled ? 'On' : 'Off'}`),
    'data-testid': "lighting-toggle",
    ...{ class: "group relative flex items-center justify-center md:justify-start p-3 md:p-5 w-full md:w-56 rounded-2xl md:rounded-3xl transition-all duration-[var(--theme-transition-duration)] border cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black" },
    ...{ class: ([
            __VLS_ctx.isBlueprint
                ? 'border-blueprint-border border-dashed text-finished-accent bg-black/20 backdrop-blur-md shadow-[0_0_20px_rgba(96,165,250,0.1)] hover:bg-finished-accent/10 hover:border-finished-accent/30'
                : 'border-finished-border text-finished-accent bg-black/20 backdrop-blur-md hover:bg-finished-accent/10 shadow-[var(--finished-glow)] hover:border-finished-accent/30',
        ]) },
    'aria-pressed': (__VLS_ctx.lightingEnabled),
});
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['md:justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-56']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-black']} */ ;
const __VLS_0 = LampIcon;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    lightingEnabled: (__VLS_ctx.lightingEnabled),
}));
const __VLS_2 = __VLS_1({
    lightingEnabled: (__VLS_ctx.lightingEnabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-2 md:ml-4 flex flex-col items-start transition-colors duration-[var(--theme-transition-duration)]" },
});
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-xs uppercase tracking-widest font-bold opacity-60" },
});
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "font-mono font-bold tracking-wider text-xs md:text-sm mt-0.5 md:mt-1" },
});
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:mt-1']} */ ;
(__VLS_ctx.lightingEnabled ? "On" : "Off");
// @ts-ignore
[toggleLighting, lightingEnabled, lightingEnabled, lightingEnabled, lightingEnabled, isBlueprint,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
