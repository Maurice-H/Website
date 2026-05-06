## Context

The portfolio uses a bento grid layout, a NavConveyor for tab-based navigation, and distinct visual themes (blueprint → finished). The foundational navigation work is complete: scrollbar hiding, phase transitions (`<Transition>`), scroll snapping (CSS `scroll-snap-type: x proximity`), keyboard navigation (ArrowKeys + ESC), and BentoCard visual fixes are all implemented.

The remaining work targets three areas:
1. **Navigation Intelligence** — deep linking from tabs to sections, improved tab labels, View Transitions API.
2. **Utility** — back-to-top button.
3. **Contact Form** — multi-channel contact (Discord, Xing, LinkedIn) and real email submission with validation.

## Goals / Non-Goals

**Goals:**
- Implement deep linking so NavConveyor tabs scroll to their corresponding Bento sections.
- Improve NavConveyor tab content with richer, more engaging previews.
- Add View Transitions API as a progressive enhancement for phase switches.
- Create a back-to-top button component for the CONTENT phase.
- Add social channel sub-tabs (Discord, Xing, LinkedIn) to the Contact Form.
- Replace the fake email handler with a real backend submission including validation and anti-spam.

**Non-Goals:**
- WASD keyboard navigation (dropped — excessive for a portfolio).
- Complete restructuring of the Bento Grid layout.
- Adding new pages or significantly changing the content structure.
- Migrating away from Pinia or the current state management architecture.

## Decisions

### 1. Deep Linking (Nav Tabs → Bento Sections)

When a user clicks a NavConveyor tab, the app transitions to CONTENT phase AND auto-scrolls to the matching Bento section. Implementation:

- Each `NAV_TABS` entry maps to a target element ID:
  ```
  skills    → #skills-about
  projects  → #projects-section
  contact   → #contact-form
  ```
- After the `<Transition>` completes (`@after-enter`), call `document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' })`.
- The `selectTab` function in `NavConveyor.vue` (or a new composable) passes the target section ID to the lighting store or emits it.

### 2. Nav Labels & Content

The current NavConveyor cards show basic terminal-style mockups. These should be enhanced:
- More dynamic/engaging preview content (possibly pulling real data like project count, latest role, etc.)
- Better copy that communicates what each section contains.
- Visual hierarchy improvements within the card content.

### 3. View Transitions API

Use the browser's View Transitions API (`document.startViewTransition`) for smoother NAV ↔ CONTENT phase switches:
- **Progressive enhancement:** Check `document.startViewTransition` existence before using.
- **Fallback:** Current `<Transition name="fade-overlay">` continues to work in unsupported browsers.
- Wrap the phase change (`lighting.setPhase()`) inside `startViewTransition()` callback.

### 4. Back-to-Top Button

- A floating `BackToTop.vue` component, fixed position (bottom-right), visible only in CONTENT phase.
- Uses `useViewportStore` or a local `scrollY` ref to show/hide with a fade transition.
- Click handler: `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- Styled to match the sci-fi ghost-button aesthetic (`border-finished-accent`, glow on hover).

### 5. Contact Form — Social Channel Tabs

Extend `ContactForm.vue` with a tab/button switcher at the top:

```
┌─────────────────────────────────────────────┐
│  GET IN TOUCH                               │
├─────────────────────────────────────────────┤
│  [ ✉ Email ]  [ 🎮 Discord ]  [ Xing ]  [ in ] │
├─────────────────────────────────────────────┤
│                                             │
│  (Active tab content renders here)          │
│                                             │
└─────────────────────────────────────────────┘
```

- **Email tab:** The existing contact form (enhanced with real submission).
- **Discord tab:** Username/invite link with a copy-to-clipboard interaction.
- **Xing tab:** Styled external link to the Xing profile.
- **LinkedIn tab:** Styled external link to the LinkedIn profile.
- Tab buttons use the ghost-button style (`.border-finished-accent/40`, glow on hover/active).
- Active tab has a visible accent indicator (bottom border or background highlight).

### 6. Contact Form — Real Email Backend

Replace the fake `setTimeout` handler with an actual submission flow:

- **Service options:** Formspree (simplest, no backend needed), Netlify Forms, or a custom Vercel/Cloudflare serverless function.
- **Client-side validation:** Email format regex, required fields check (already present via HTML `required`).
- **Anti-spam:** Honeypot hidden field (invisible to users, bots fill it → rejected), possibly a lightweight CAPTCHA if spam becomes an issue.
- **Error handling:** Network errors, validation failures, and spam rejection all show distinct UI feedback.
- **Form states:** `idle` → `submitting` → `success` | `error` (extend current `formState` ref).

## Risks / Trade-offs

- **Deep Linking scroll timing:** The scroll-to-section must wait until the CONTENT phase transition finishes and the target DOM element exists. Using `@after-enter` or `nextTick` is critical.
- **View Transitions API support:** Still not universal. Must be purely additive — the site must work identically without it.
- **Form backend dependency:** Using an external service (Formspree) introduces a third-party dependency. A serverless function gives more control but adds complexity.
- **Social links maintenance:** Discord usernames, Xing/LinkedIn URLs need to be kept up to date. Consider storing them in a central config/data file.
