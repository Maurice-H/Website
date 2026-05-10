/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useAudio } from '../../composables/useAudio';
import { PROJECTS, NAV_TABS as tabs } from '../../data/portfolio';
import { useLightingStore } from '../../stores/lighting';
import { useShortcutStore } from '../../stores/useShortcutStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { LightingPhase } from '../../types/index';
import EnvelopeIcon from '../icons/EnvelopeIcon.vue';
import NavWindow from './NavWindow.vue';
const lightingStore = useLightingStore();
const shortcutStore = useShortcutStore();
const themeStore = useThemeStore();
const { playClick, playGlitch } = useAudio();
const isMobile = ref(typeof window !== 'undefined' && window.innerWidth < 768);
const updateMobileState = () => {
    isMobile.value = typeof window !== 'undefined' && window.innerWidth < 768;
};
const shortcutActions = computed(() => isMobile.value ? ['lighting', 'theme'] : ['lighting', 'theme', 'back']);
const handleShortcutClick = (action) => {
    if (isMobile.value) {
        if (action === 'lighting') {
            themeStore.toggleLighting();
            playClick();
        }
        else if (action === 'theme') {
            themeStore.toggleTheme();
            playGlitch();
        }
    }
    else {
        shortcutStore.startRebind(action);
    }
};
const trackEl = ref(null);
const activeId = ref('skills'); // Start at EXPERIENCE to match mockup
const projectCount = PROJECTS.length;
// ---------- Drag-to-scroll ----------
let isDragging = false;
let hasMoved = false;
let isProgrammaticScroll = false;
let scrollTimeout = null;
let startX = 0;
let mouseDownX = 0; // Added for distance-based click detection
let scrollLeft = 0;
const startDrag = (e) => {
    if (!trackEl.value)
        return;
    isDragging = true;
    hasMoved = false;
    startX = e.pageX - trackEl.value.offsetLeft;
    mouseDownX = e.pageX; // Capture start X
    scrollLeft = trackEl.value.scrollLeft;
    trackEl.value.style.cursor = 'grabbing';
};
const onDrag = (e) => {
    if (!isDragging || !trackEl.value)
        return;
    const x = e.pageX - trackEl.value.offsetLeft;
    const walk = (x - startX) * 2;
    if (Math.abs(walk) > 5) {
        hasMoved = true;
    }
    if (hasMoved) {
        e.preventDefault();
        trackEl.value.scrollLeft = scrollLeft - walk;
    }
};
const stopDrag = (_e) => {
    isDragging = false;
    if (trackEl.value) {
        trackEl.value.style.cursor = 'grab';
    }
};
const handleScroll = () => {
    if (isProgrammaticScroll || !trackEl.value?.children[0])
        return;
    const firstChild = trackEl.value.children[0];
    const gap = window.innerWidth < 768 ? 40 : 120;
    const step = firstChild.offsetWidth + gap;
    // Pure math calculation to find active tab index based on scrollLeft
    const rawIndex = Math.round(Math.max(0, trackEl.value.scrollLeft) / step);
    const clampedIndex = Math.max(0, Math.min(rawIndex, tabs.length - 1));
    activeId.value = tabs[clampedIndex].id;
};
const onWheel = (e) => {
    if (!trackEl.value)
        return;
    // Use scrollBy for more consistent behavior across browsers with snap
    trackEl.value.scrollBy({
        left: e.deltaY * 4.0 + e.deltaX,
        behavior: 'smooth',
    });
};
const scrollToTab = (id) => {
    const index = tabs.findIndex((t) => t.id === id);
    if (trackEl.value?.children[index]) {
        isProgrammaticScroll = true;
        const targetEl = trackEl.value.children[index];
        targetEl.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
        });
        if (scrollTimeout)
            clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
            isProgrammaticScroll = false;
        }, 600);
    }
};
const selectTab = (id, e) => {
    if (e instanceof PointerEvent) {
        // Distance-based check is much more robust for E2E tests than a simple flag
        const moveDistance = Math.abs(e.pageX - (mouseDownX || e.pageX));
        if (moveDistance > 15) {
            return;
        }
    }
    // ── Two-Step Navigation ──
    // Step 1: Clicking an inactive tab only highlights it
    if (activeId.value !== id) {
        activeId.value = id;
        scrollToTab(id);
        return;
    }
    // Step 2: Clicking the already-highlighted tab navigates
    const tab = tabs.find((t) => t.id === id);
    lightingStore.pendingScrollTarget = tab?.targetSection ?? null;
    lightingStore.setPhase(LightingPhase.CONTENT);
};
const navigate = (direction) => {
    const currentIndex = tabs.findIndex((t) => t.id === activeId.value);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0)
        nextIndex = 0;
    if (nextIndex >= tabs.length)
        nextIndex = tabs.length - 1;
    // Scroll to the new target. We DO NOT set activeId manually here,
    // allowing handleScroll to update it naturally as it centers.
    if (trackEl.value?.children[nextIndex]) {
        const targetEl = trackEl.value.children[nextIndex];
        targetEl.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
        });
    }
};
const handleGlobalKeydown = (e) => {
    // Prevent default arrow key scrolling and handle navigation
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate('prev');
    }
    else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate('next');
    }
};
onMounted(() => {
    window.addEventListener('resize', updateMobileState);
    window.addEventListener('pointermove', onDrag);
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('keydown', handleGlobalKeydown);
    // Initial scroll to EXPERIENCE
    if (trackEl.value) {
        // Find the skills tab
        const index = tabs.findIndex((t) => t.id === 'skills');
        if (index >= 0) {
            setTimeout(() => {
                if (!trackEl.value?.children[0])
                    return;
                const firstChild = trackEl.value.children[0];
                const gap = window.innerWidth < 768 ? 40 : 120;
                const step = firstChild.offsetWidth + gap;
                const targetScroll = index * step - window.innerWidth / 2 + firstChild.offsetWidth / 2;
                trackEl.value.scrollLeft = Math.max(0, targetScroll);
                handleScroll();
            }, 100);
        }
    }
});
onUnmounted(() => {
    window.removeEventListener('resize', updateMobileState);
    window.removeEventListener('pointermove', onDrag);
    window.removeEventListener('pointerup', stopDrag);
    window.removeEventListener('keydown', handleGlobalKeydown);
    if (scrollTimeout)
        clearTimeout(scrollTimeout);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['conveyor-track']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-window']} */ ;
/** @type {__VLS_StyleScopedClasses['conveyor-track']} */ ;
/** @type {__VLS_StyleScopedClasses['conveyor-track']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-item--rebinding']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-items']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "nav-conveyor" },
});
/** @type {__VLS_StyleScopedClasses['nav-conveyor']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "nav-grid" },
});
/** @type {__VLS_StyleScopedClasses['nav-grid']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onPointerdown: (__VLS_ctx.startDrag) },
    ...{ onWheel: (__VLS_ctx.onWheel) },
    ...{ onScroll: (__VLS_ctx.handleScroll) },
    ...{ class: "conveyor-track mask-fused" },
    ref: "trackEl",
    role: "tablist",
    'aria-label': "Navigation Conveyor",
});
/** @type {__VLS_StyleScopedClasses['conveyor-track']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-fused']} */ ;
for (const [tab] of __VLS_vFor((__VLS_ctx.tabs))) {
    const __VLS_0 = NavWindow || NavWindow;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        ...{ 'onKeydown': {} },
        ...{ 'onKeydown': {} },
        key: (tab.id),
        theme: (tab.theme),
        label: (tab.label),
        active: (__VLS_ctx.activeId === tab.id),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        ...{ 'onKeydown': {} },
        ...{ 'onKeydown': {} },
        key: (tab.id),
        theme: (tab.theme),
        label: (tab.label),
        active: (__VLS_ctx.activeId === tab.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    const __VLS_6 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.selectTab(tab.id, $event);
                // @ts-ignore
                [startDrag, onWheel, handleScroll, tabs, activeId, selectTab,];
            } });
    const __VLS_7 = ({ keydown: {} },
        { onKeydown: (...[$event]) => {
                __VLS_ctx.selectTab(tab.id, $event);
                // @ts-ignore
                [selectTab,];
            } });
    const __VLS_8 = ({ keydown: {} },
        { onKeydown: (...[$event]) => {
                __VLS_ctx.selectTab(tab.id, $event);
                // @ts-ignore
                [selectTab,];
            } });
    __VLS_asFunctionalDirective(__VLS_directives.vMemo, {})(null, { ...__VLS_directiveBindingRestFields, value: ([__VLS_ctx.activeId === tab.id]) }, null, null);
    const { default: __VLS_9 } = __VLS_3.slots;
    if (tab.theme === 'career') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "content-terminal flex flex-col items-center justify-center h-full" },
        });
        /** @type {__VLS_StyleScopedClasses['content-terminal']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "window-title" },
        });
        /** @type {__VLS_StyleScopedClasses['window-title']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-col items-start gap-1" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-start']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "opacity-30" },
        });
        /** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line text-finished-accent/60" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-finished-accent/60']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line opacity-50" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line mt-1 text-finished-text/20 text-[0.65rem] tracking-widest uppercase" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-finished-text/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    }
    else if (tab.theme === 'about') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "content-terminal flex flex-col items-center justify-center h-full" },
        });
        /** @type {__VLS_StyleScopedClasses['content-terminal']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "window-title" },
        });
        /** @type {__VLS_StyleScopedClasses['window-title']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-col items-start gap-1" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-start']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "opacity-30" },
        });
        /** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line text-finished-accent/60" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-finished-accent/60']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line opacity-50" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line mt-1 text-finished-text/20 text-[0.65rem] tracking-widest uppercase" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-finished-text/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    }
    else if (tab.theme === 'projects') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "content-terminal flex flex-col items-center justify-center h-full" },
        });
        /** @type {__VLS_StyleScopedClasses['content-terminal']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "window-title" },
        });
        /** @type {__VLS_StyleScopedClasses['window-title']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-col items-start gap-1" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-start']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "opacity-30" },
        });
        /** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line text-finished-accent/60" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-finished-accent/60']} */ ;
        (__VLS_ctx.projectCount);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line opacity-50" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line mt-1 text-finished-text/20 text-[0.65rem] tracking-widest uppercase" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-finished-text/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    }
    else if (tab.theme === 'contact') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "content-terminal flex flex-col items-center justify-center h-full" },
        });
        /** @type {__VLS_StyleScopedClasses['content-terminal']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "window-title" },
        });
        /** @type {__VLS_StyleScopedClasses['window-title']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-col items-center gap-3" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
        const __VLS_10 = EnvelopeIcon;
        // @ts-ignore
        const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({}));
        const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "code-line text-finished-text/20 text-[0.65rem] tracking-widest uppercase" },
        });
        /** @type {__VLS_StyleScopedClasses['code-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-finished-text/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
        /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
        /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    }
    // @ts-ignore
    [activeId, projectCount,];
    var __VLS_3;
    var __VLS_4;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "shortcut-bar" },
});
/** @type {__VLS_StyleScopedClasses['shortcut-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "shortcut-items" },
});
/** @type {__VLS_StyleScopedClasses['shortcut-items']} */ ;
for (const [action] of __VLS_vFor((__VLS_ctx.shortcutActions))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleShortcutClick(action);
                // @ts-ignore
                [shortcutActions, handleShortcutClick,];
            } },
        key: (action),
        ...{ class: "shortcut-item" },
        ...{ class: ({ 'shortcut-item--rebinding': __VLS_ctx.shortcutStore.rebindingAction === action }) },
    });
    /** @type {__VLS_StyleScopedClasses['shortcut-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['shortcut-item--rebinding']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.kbd, __VLS_intrinsics.kbd)({});
    (__VLS_ctx.shortcutStore.rebindingAction === action ? '...' : __VLS_ctx.shortcutStore.getDisplay(action));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.shortcutStore.getLabel(action));
    // @ts-ignore
    [shortcutStore, shortcutStore, shortcutStore, shortcutStore,];
}
if (!__VLS_ctx.isMobile) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isMobile))
                    return;
                __VLS_ctx.shortcutStore.rebindingAction ? __VLS_ctx.shortcutStore.cancelRebind() : __VLS_ctx.shortcutStore.startRebind('lighting');
                // @ts-ignore
                [shortcutStore, shortcutStore, shortcutStore, isMobile,];
            } },
        type: "button",
        ...{ class: "shortcut-edit-btn" },
        title: "Edit shortcuts",
        ...{ class: ({ 'shortcut-edit-btn--active': __VLS_ctx.shortcutStore.rebindingAction }) },
    });
    /** @type {__VLS_StyleScopedClasses['shortcut-edit-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['shortcut-edit-btn--active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "12",
        height: "12",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    });
}
// @ts-ignore
[shortcutStore,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
