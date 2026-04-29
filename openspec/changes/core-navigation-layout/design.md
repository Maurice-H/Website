## Context

The portfolio uses a bento grid layout and distinct visual themes. However, navigating the content currently feels unpolished. Interactions such as scrolling through tabs, global scrollbars, and lack of keyboard navigation make the site feel more like a standard webpage than a premium, native-app-like experience. Additionally, minor visual bugs (like white outlines around project cards and bento outlines) disrupt the immersion. This change aims to refine these layout and navigation elements.

## Goals / Non-Goals

**Goals:**
- Implement global keyboard navigation (WASD for scrolling/tabbing, ESC for dismissing modals/overlays).
- Enable smooth CSS-based scroll snapping for tab navigation.
- Add a "back-to-top" button driven by the existing `useViewportStore` scroll state.
- Implement global smooth page transitions using Vue `<Transition>`.
- Remove global scrollbars and fix visual bugs (white outlines, bento card interactions).

**Non-Goals:**
- Complete restructuring of the Bento Grid layout.
- Adding new pages or significantly changing the content structure.
- Migrating away from Pinia or the current state management architecture.

## Decisions

1. **Keyboard Navigation (`useKeyboardNavigation` composable):**
   - We will introduce a global composable that binds WASD and ESC keydowns to layout actions.
   - For WASD, we will map them to horizontal/vertical scroll actions on the main viewports or active tab containers.
   - **Input guard:** WASD handlers MUST be suppressed when `document.activeElement` is an `<input>`, `<textarea>`, or `[contenteditable]` element so typing in forms (e.g. Contact) is never intercepted.
   - For ESC, we'll map it to closing any active overlays (if any) or resetting focus.

2. **Scroll Snapping & Scrollbars:**
   - Use CSS `scroll-snap-type: x mandatory` for horizontal tabs, and `scroll-snap-align: center` or `start` on the tab items.
   - Apply `::-webkit-scrollbar { display: none; }` and `scrollbar-width: none` to `body` or the main scroll container to create an app-like feel.

3. **Transitions & Visual Fixes:**
   - For page transitions, we will wrap the main router view in a `<Transition name="page" mode="out-in">` and use standard CSS variables for the fade/slide effect to align with `var(--theme-transition-duration)`.
   - Remove outline rules (`outline: none` or specific target classes) causing the white artifacts on project cards.
   - Update `BentoCard.vue` styles to fix incorrect border/outline states, relying on CSS variables.

4. **Back-to-Top Button:**
   - A floating component that listens to `useViewportStore().scrollY` (or similar property) and uses `window.scrollTo({ top: 0, behavior: 'smooth' })`.

## Risks / Trade-offs

- **Scroll Snapping Accessibility:** Strict scroll snapping can sometimes frustrate users if not configured correctly (e.g., getting stuck). We must ensure it's smooth and forgiving.
- **Keyboard Navigation Conflicts:** WASD navigation might conflict if there are form inputs on the page. The composable must check `document.activeElement` to ignore WASD when the user is typing in an input field (like the Contact Form).
- **Removing Scrollbars:** Hiding scrollbars removes visual cues about page length. We assume the bento grid and visual design provide enough context for users to understand it's a scrollable interface.
