## 2024-05-02 - ARIA Press State Synchronization
 Learning: Toggles with complex multi-state logic (e.g. Blueprint/Finished mode, Lighting on/off) often fail to properly communicate their active state to screen readers if they only rely on visual class changes (`is-active`).
 Action: Ensure that all toggle buttons dynamically map their state to `aria-pressed="true|false"` and dynamically update their `aria-label` to provide accurate context to screen readers on state change.

## 2024-05-03 - Keyboard Interaction on Custom UI Components
 Learning: Custom interactive components (like `NavWindow.vue` acting as a tab inside `NavConveyor.vue`) must explicitly receive `role`, `tabindex="0"`, explicit keyboard event handlers (like `@keydown.enter` and `@keydown.space`), and highly visible focus states via `focus-visible:ring-*` utilities to be accessible to keyboard navigators. Furthermore, decorative SVGs within button toggles must have `aria-hidden="true"`.
 Action: Always pair pointer events with keyboard equivalents and ensure all custom interactive elements include semantic roles and `focus-visible` styling.

## 2024-05-04 - Keyboard Shortcuts & Tactile Feedback
 Learning: Floating UI controls that advertise keyboard shortcuts (e.g. `[ ESC ] Back`) must actually implement those shortcuts globally to meet user expectations. Additionally, floating buttons often miss visual focus indicators and tactile active states.
 Action: Ensure that explicit keyboard listeners are implemented for advertised shortcuts, and always apply `focus-visible:ring-*` and `active:scale-*` to floating controls for proper accessibility and tactile feedback.
