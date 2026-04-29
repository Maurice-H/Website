## 1. Global Scrollbars & Transitions

- [ ] 1.1 Update global CSS to hide scrollbars on the `body` and main scroll containers (using `::-webkit-scrollbar` and `scrollbar-width`).
- [ ] 1.2 Wrap the main `<RouterView>` in `App.vue` (or the default layout) with `<Transition name="page" mode="out-in">`.
- [ ] 1.3 Add CSS transition classes (`.page-enter-active`, `.page-leave-active`, etc.) using `var(--theme-transition-duration)`.

## 2. Keyboard Navigation

- [ ] 2.1 Create a `useKeyboardNavigation.ts` composable to handle global keyboard events.
- [ ] 2.2 Implement logic to map WASD keys to scroll actions, ensuring it ignores inputs when `document.activeElement` is an input/textarea.
- [ ] 2.3 Map the ESC key to clear focus or close active overlays.
- [ ] 2.4 Initialize the composable in `App.vue` or the main layout component.

## 3. Scroll Snapping & Tab Navigation

- [ ] 3.1 Update the Landing Page tabs container component to apply `scroll-snap-type: x mandatory` (or `y` if vertical).
- [ ] 3.2 Update individual tab content blocks to apply `scroll-snap-align: start` or `center`.
- [ ] 3.3 Verify that scrolling through tabs feels smooth and snaps correctly to boundaries.

## 4. Visual Fixes (Bento & Cards)

- [ ] 4.1 Update `BentoCard.vue` and related CSS to correct outline states and remove any forced white outlines on project cards.
- [ ] 4.2 Fix alignment and responsiveness of interaction buttons within the bento grid layout.
- [ ] 4.3 Ensure all focus/hover states rely on CSS variables rather than hardcoded Tailwind outline classes.

## 5. Back-to-Top Button

- [ ] 5.1 Create `BackToTop.vue` component with a fixed floating layout.
- [ ] 5.2 Use `useViewportStore` to track `scrollY` and toggle the button's visibility (fade in/out).
- [ ] 5.3 Add a click handler that executes `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- [ ] 5.4 Mount `BackToTop.vue` globally in `App.vue`.

## 6. Verification

- [ ] 6.1 Run Biome linter/formatter (`npm run lint` / `npm run format`).
- [ ] 6.2 Run Vitest tests (`npm run test:unit`) and verify no existing functionality is broken.
- [ ] 6.3 Manually verify WASD navigation, tab snapping, and the back-to-top button in the browser.
