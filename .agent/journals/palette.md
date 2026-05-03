## 2024-05-02 - ARIA Press State Synchronization
 Learning: Toggles with complex multi-state logic (e.g. Blueprint/Finished mode, Lighting on/off) often fail to properly communicate their active state to screen readers if they only rely on visual class changes (`is-active`).
 Action: Ensure that all toggle buttons dynamically map their state to `aria-pressed="true|false"` and dynamically update their `aria-label` to provide accurate context to screen readers on state change.

## 2024-05-03 - Keyboard Interaction on Custom UI Components
 Learning: Custom interactive components (like `NavWindow.vue` acting as a tab inside `NavConveyor.vue`) must explicitly receive `role`, `tabindex="0"`, explicit keyboard event handlers (like `@keydown.enter` and `@keydown.space`), and highly visible focus states via `focus-visible:ring-*` utilities to be accessible to keyboard navigators. Furthermore, decorative SVGs within button toggles must have `aria-hidden="true"`.
 Action: Always pair pointer events with keyboard equivalents and ensure all custom interactive elements include semantic roles and `focus-visible` styling.
