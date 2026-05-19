## Context

A recent codebase audit highlighted several high-impact, low-effort areas for improvement regarding memory management and separation of concerns. Specifically:
- `useToast.ts` and `useAudio.ts` maintain global state but lack proper cleanup mechanisms, posing a memory leak risk.
- Store modules like `useThemeStore.ts` and `lighting.ts` are tightly coupled with the DOM (writing meta tags, calling `document.startViewTransition`), violating the purity of Pinia stores.
- The shared UI component `BentoCard.vue` directly imports a global business logic store (`useLightingStore`), tightly coupling a reusable component to a specific app domain context.

## Goals / Non-Goals

**Goals:**
- Eliminate memory leak risks in audio pooling and toast notifications.
- Decouple DOM side effects from Pinia stores, enabling purer unit testing and better architecture.
- Ensure generic UI components like `BentoCard.vue` are decoupled from global state management via Vue component communication patterns.

**Non-Goals:**
- We are not rewriting the entire audio subsystem or replacing the toast system with a heavy third-party library.
- We are not addressing the larger architectural issues in `WebGLScene.vue` or `ContactForm.vue` in this change.

## Decisions

- **Store Side-Effect Extraction**: We will extract the DOM synchronization logic from `useThemeStore.ts` into a dedicated composable (e.g., `useThemeDomSync.ts`). This composable will use Vue's `watch` or `watchEffect` to react to store state changes and manipulate the DOM accordingly.
  - *Alternative Considered*: Running side effects directly in `App.vue`. *Rationale for Rejection*: A dedicated composable keeps `App.vue` cleaner.
- **Component Decoupling**: For `BentoCard.vue`, we will use Vue's `defineEmits` or `provide/inject` instead of directly importing the store. Since the hover state needs to be communicated, an emit (e.g., `@emit('hover-change', pos)`) is the cleanest solution for a shared component.
- **Memory Management**: For `useToast.ts`, we will store timer IDs directly on the toast objects and clear them upon removal or component unmount. For `useAudio.ts`, we will expose a `cleanup` function that iterates through the `audioCache` and pauses/dereferences audio instances.

## Risks / Trade-offs

- **Risk**: Refactoring the theme synchronization logic might introduce a brief unstyled flash if the DOM sync doesn't run early enough.
  - **Mitigation**: Ensure `useThemeDomSync.ts` is initialized synchronously in the main app lifecycle (e.g., in `App.vue` `<script setup>`), mirroring the current behavior.
- **Risk**: Refactoring `BentoCard.vue` to emit events might require updating every parent component that uses it.
  - **Mitigation**: Since `BentoCard` is used within specific layout contexts (like `BentoLayout`), the updates to parent wrappers are minimal and easily verifiable.
