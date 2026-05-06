## Why

The landing page navigation and layout interactions have been partially refined but still lack key features for a premium, immersive experience. Several foundational tasks (scrollbar hiding, phase transitions, scroll snapping, visual fixes) are already complete. The remaining work focuses on deeper navigation intelligence (deep linking from tabs to content sections, improved tab labels), modern browser APIs (View Transitions), utility features (back-to-top), and transforming the Contact Form from a static email-only mock into a real multi-channel communication hub.

## What Changes

### Already Completed ✅
- **Scrollbar Hiding:** Global scrollbars hidden via CSS on `App.vue` and `NavConveyor.vue`.
- **Phase Transitions:** `<Transition name="fade-overlay">` wraps NAV/CONTENT phases with fade animation.
- **Scroll Snapping:** NavConveyor uses `scroll-snap-type: x proximity` with `scroll-snap-align: center` on cards.
- **Keyboard Navigation:** ArrowLeft/Right for tab navigation, ESC to return to NAV phase.
- **Visual Fixes:** BentoCard outlines and hover states use CSS variables, no hardcoded white outlines.

### Remaining Work 🔧
- **Deep Linking:** Clicking a NavConveyor tab scrolls to the corresponding Bento section after transitioning to CONTENT phase.
- **Nav Labels:** Improve the content and copy inside NavConveyor tab cards for richer previews.
- **View Transitions API:** Progressive enhancement using the browser's View Transitions API for smoother phase switches.
- **Back-to-Top Button:** Floating utility button visible during CONTENT phase.
- **Contact Form — Social Channels:** Sub-tabs/buttons for Discord, Xing, and LinkedIn alongside the email form.
- **Contact Form — Real Email:** Replace the fake `setTimeout` with a real backend submission, including email validation and anti-spam measures.

## Capabilities

### New Capabilities
- `deep-linking`: Navigation tabs link directly to Bento content sections.
- `back-to-top`: Floating scroll-to-top button component.
- `contact-social-channels`: Multi-channel contact via Discord, Xing, LinkedIn.
- `contact-email-backend`: Real email submission with validation and anti-spam.

### Modified Capabilities
- `landing-page-tabs`: Improved tab content/labels and View Transitions API integration.
- `keyboard-navigation`: Simplified to ArrowKeys + ESC (WASD dropped).

### Dropped
- `wasd-navigation`: Dropped — WASD is excessive for a portfolio site. ArrowKeys + ESC are sufficient.

## Impact

- **UI/UX:** Multi-channel contact options, deep linking for seamless navigation, smoother transitions.
- **Backend:** Requires a form submission service (Formspree, Netlify Forms, or serverless function).
- **CSS:** View Transitions API as progressive enhancement.
- **Vue Components:** New `BackToTop.vue`, updated `ContactForm.vue` with tab switcher, updated `NavConveyor.vue` for deep linking.
