## 2024-05-02 - ARIA Press State Synchronization
 Learning: Toggles with complex multi-state logic (e.g. Blueprint/Finished mode, Lighting on/off) often fail to properly communicate their active state to screen readers if they only rely on visual class changes (`is-active`).
 Action: Ensure that all toggle buttons dynamically map their state to `aria-pressed="true|false"` and dynamically update their `aria-label` to provide accurate context to screen readers on state change.
