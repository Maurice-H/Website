## 1. Global Scrollbars & Transitions

- [x] 1.1 Update global CSS to hide scrollbars on the `body` and main scroll containers (using `::-webkit-scrollbar` and `scrollbar-width`).
- [x] 1.2 Wrap the main content phases in `App.vue` with `<Transition name="fade-overlay" mode="out-in">`.
- [x] 1.3 Add CSS transition classes (`.fade-overlay-enter-active`, `.fade-overlay-leave-active`, etc.).

## 2. Keyboard Navigation

- [x] 2.1 Map ESC key to return from CONTENT phase to NAV phase (implemented inline in `App.vue`).
- [x] 2.2 Map ArrowLeft/ArrowRight to navigate between NavConveyor tabs (implemented in `NavConveyor.vue`).

## 3. Scroll Snapping & Tab Navigation

- [x] 3.1 Apply `scroll-snap-type: x proximity` to the NavConveyor track container.
- [x] 3.2 Apply `scroll-snap-align: center` to individual NavWindow cards.
- [x] 3.3 Verify smooth snapping behavior with proximity mode for natural wheel scrolling.

## 4. Visual Fixes (Bento & Cards)

- [x] 4.1 Update `BentoCard.vue` and related CSS to correct outline states and remove any forced white outlines on project cards.
- [x] 4.2 Fix alignment and responsiveness of interaction buttons within the bento grid layout.
- [x] 4.3 Ensure all focus/hover states rely on CSS variables (`--finished-accent`, `--finished-border`, `--finished-glow`) rather than hardcoded Tailwind outline classes.

## 5. Back-to-Top Button

- [x] 5.1 Create `BackToTop.vue` component with a fixed floating layout matching the sci-fi aesthetic.
- [x] 5.2 Use `useViewportStore` to track `scrollY` and toggle the button's visibility (fade in/out).
- [x] 5.3 Add a click handler that executes `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- [x] 5.4 Mount `BackToTop.vue` globally in `App.vue` (visible only in CONTENT phase).

## 6. Deep Linking

- [x] 6.1 Implement scroll-to-section logic: clicking a NavConveyor tab (e.g. "Experience") transitions to CONTENT phase AND scrolls to the corresponding Bento section.
- [x] 6.2 Map each `NAV_TABS` entry to a target section ID (e.g. `skills` → `#skills-about`, `projects` → `#projects-section`, `contact` → `#contact-form`).
- [x] 6.3 Add smooth `scrollIntoView` behavior after phase transition completes.

## 7. Nav Labels & Content

- [x] 7.1 Improve the content inside NavConveyor tab cards — richer previews, better copy, or dynamic data instead of static terminal mockups.
- [x] 7.2 Review and update tab labels/themes in `NAV_TABS` data for clarity and appeal.

## 8. View Transitions API

- [x] 8.1 Investigate browser support for the View Transitions API (`document.startViewTransition`).
- [x] 8.2 If viable, implement soft phase transitions (NAV ↔ CONTENT) using the API as a progressive enhancement over the existing `<Transition>` wrapper.
- [x] 8.3 Provide fallback to current `<Transition>` for unsupported browsers.

## 9. Contact Form — Social Channels

- [x] 9.1 Add sub-tabs or toggle buttons to `ContactForm.vue`: **Email** (default), **Discord**, **Xing**, **LinkedIn**.
- [x] 9.2 Email tab: keep the current form (enhanced with real submission in task 10).
- [x] 9.3 Discord tab: display Discord username/invite link with a copy-to-clipboard button.
- [x] 9.4 Xing tab: display a styled link/button to the Xing profile.
- [x] 9.5 LinkedIn tab: display a styled link/button to the LinkedIn profile.
- [x] 9.6 Style the tab switcher to match the sci-fi / ghost-button aesthetic.

## 10. Contact Form — Real Email Submission

- [x] 10.1 Choose and integrate a form backend service (e.g. Formspree, Netlify Forms, or a custom serverless function).
- [x] 10.2 Replace the fake `setTimeout` submit handler with a real `fetch` POST to the backend.
- [x] 10.3 Add client-side email validation (format check).
- [x] 10.4 Add anti-spam measures (honeypot field, CAPTCHA, or service-side filtering).
- [x] 10.5 Handle error states in the UI (network failure, validation error, spam rejection).
- [x] 10.6 Show success/error feedback with appropriate animations.

## 11. Verification

- [x] 11.1 Run Biome linter/formatter (`npm run lint` / `npm run format`).
- [x] 11.2 Run Vitest tests (`npm run test:unit`) and verify no existing functionality is broken.
- [x] 11.3 Manually verify keyboard navigation, tab snapping, deep linking, and back-to-top in the browser.
- [x] 11.4 Verify Contact Form social tabs render correctly and email submission reaches the backend.
- [x] 11.5 Test on mobile breakpoints for responsive behavior of all new components.
