## Why

The current codebase has accrued minor technical debt in the form of memory leaks and violations of separation of concerns, particularly in the global stores and shared components. These "Quick Wins" address high-impact, low-effort issues identified in a recent codebase audit. Fixing these will stabilize memory usage (crucial for long-lived SPA sessions) and ensure Pinia stores remain pure state containers without DOM side effects.

## What Changes

- **Memory Management**: Add proper cleanup mechanisms (`clearTimeout`) in `useToast.ts` and a cleanup function for audio instances in `useAudio.ts` to prevent memory leaks on unmount.
- **Store Purity**: Extract DOM manipulation logic (e.g., meta tags, `document.documentElement` attributes) from `useThemeStore.ts` and `lighting.ts` into dedicated composables (e.g., `useThemeDomSync.ts`) or component-level watch effects.
- **Component Decoupling**: Remove direct imports of global stores (like `useLightingStore`) from shared UI components such as `BentoCard.vue`. Communication will be refactored to use props/emits or Vue's provide/inject to ensure the shared component remains decoupled and reusable.

## Capabilities

### New Capabilities
- `store-dom-sync`: A new utility capability to synchronize pure Pinia state with native DOM elements, decoupling side-effects from the state layer.

### Modified Capabilities
- `ui-interaction-sounds`: Modify the audio system requirements to enforce lifecycle memory cleanup.
- `toast-notifications`: Modify the notification system requirements to enforce strict timeout cleanup and prevent memory leaks.

## Impact

- **Affected Code**: `useToast.ts`, `useAudio.ts`, `useThemeStore.ts`, `lighting.ts`, `BentoCard.vue`.
- **System Stability**: Improved memory footprint and predictability of state changes.
- **Testing**: Pinia stores become significantly easier to unit test once DOM side effects are extracted.

## Non-goals

- We will not refactor the entire `WebGLScene.vue` or `ContactForm.vue` in this phase (those are reserved for Phase 2 and Phase 3).
- We will not replace `vue-router` with a different routing paradigm or change the core application state machine.

## Testing Strategy

- **Unit Tests**: Add tests for the new `useThemeDomSync.ts` composable (mocking the DOM) and verify that Pinia stores can be tested purely without DOM dependencies. Ensure `BentoCard.vue` unit tests pass without needing a Pinia instance.
- **E2E Tests**: Verify that theme switching still correctly updates the DOM and that toast notifications appear/disappear at the correct timings.
