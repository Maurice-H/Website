## 2024-05-02 - ARIA Press State Synchronization
 Learning: Toggles with complex multi-state logic (e.g. Blueprint/Finished mode, Lighting on/off) often fail to properly communicate their active state to screen readers if they only rely on visual class changes (`is-active`).
 Action: Ensure that all toggle buttons dynamically map their state to `aria-pressed="true|false"` and dynamically update their `aria-label` to provide accurate context to screen readers on state change.

## 2024-05-03 - Keyboard Interaction on Custom UI Components
 Learning: Custom interactive components (like `NavWindow.vue` acting as a tab inside `NavConveyor.vue`) must explicitly receive `role`, `tabindex="0"`, explicit keyboard event handlers (like `@keydown.enter` and `@keydown.space`), and highly visible focus states via `focus-visible:ring-*` utilities to be accessible to keyboard navigators. Furthermore, decorative SVGs within button toggles must have `aria-hidden="true"`.
 Action: Always pair pointer events with keyboard equivalents and ensure all custom interactive elements include semantic roles and `focus-visible` styling.

## 2024-05-04 - Keyboard Shortcuts & Tactile Feedback
 Learning: Floating UI controls that advertise keyboard shortcuts (e.g. `[ ESC ] Back`) must actually implement those shortcuts globally to meet user expectations. Additionally, floating buttons often miss visual focus indicators and tactile active states.
 Action: Ensure that explicit keyboard listeners are implemented for advertised shortcuts, and always apply `focus-visible:ring-*` and `active:scale-*` to floating controls for proper accessibility and tactile feedback.

## 2024-05-06 - Interactive Components Missing Accessibility Controls
 Learning: Vue components mimicking interactive elements must pair `cursor-pointer` with full keyboard accessibility (`tabindex`, `role`, event listeners, and `focus-visible` outlines).
 Action: When adding `cursor-pointer` to an element, ensure it also implements `tabindex="0"`, `role="button"|"link"`, `focus-visible` styles, and explicit `@keydown.enter` / `@keydown.space` handlers.

## 2024-05-07 - Form Error State ARIA Binding
 Learning: Form inputs in Vue templates must dynamically link to their corresponding error messages for screen readers using `aria-invalid` and `aria-describedby` pointing to the error message ID. Furthermore, error message elements should use `aria-live="polite"` so screen readers announce them when they conditionally render into the DOM.
 Action: Ensure that conditional error messages have an `id` and `aria-live="polite"`, and pair the related inputs with `:aria-invalid="!!error"` and `:aria-describedby="error ? 'id' : undefined"`.

## 2024-05-08 - SVG Icons Missing aria-hidden Attribute
 Learning: Purely decorative SVGs packaged as Vue components often miss the `aria-hidden="true"` attribute, which can lead to screen readers announcing unnecessary elements, particularly when these components are nested inside buttons or links that already have sufficient accessible names (e.g. `aria-label`).
 Action: Ensure that all newly created standalone SVG icon components include `aria-hidden="true"` on their root `<svg>` element unless they specifically serve a unique semantic purpose and provide their own accessible title.

## 2026-05-09 - Dynamic Text State Announcements
 Learning: When a button's text dynamically updates to indicate a state change (e.g., from "Copy" to "✓ Copied") without focusing another element or reloading the page, screen readers will not announce the updated text by default, leaving non-visual users unaware of the successful interaction.
 Action: When dynamically updating UI text to indicate temporary or changed states, ensure the element uses `aria-live="polite"` so screen readers appropriately announce the visual change.

## 2026-05-11 - Keyboard Accessibility on Clickable Divs
 Learning: Custom clickable components (like `<div @click="...">` with `cursor-pointer`) must implement complete keyboard interactivity to be fully accessible. They need `role="button"`, `tabindex="0"`, explicit keyboard event listeners (like `@keydown.enter.prevent` and `@keydown.space.prevent`), and clear focus states (e.g., `focus-visible:ring-*`).
 Action: When adding `@click` and `cursor-pointer` to non-button elements, always ensure they are paired with complete keyboard accessibility properties and focus indicators.
