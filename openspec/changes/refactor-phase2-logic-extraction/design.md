## Context

`ContactForm.vue` has grown to over 750 lines, incorporating multiple concerns: UI rendering, form state management, DNS MX record validation (business logic), and Cloudflare Turnstile integration (third-party script management). Similarly, `App.vue` manages the global application phase state (routing equivalent) and relies on fragile `setTimeout` functions to orchestrate DOM updates during layout transitions.

## Goals / Non-Goals

**Goals:**
- Extract all non-UI logic out of `ContactForm.vue` to achieve a pure presentation component.
- Modularize the Turnstile widget to make it reusable and testable.
- Remove state-machine "routing" logic from the `App.vue` template/script and encapsulate it in a testable composable.
- Replace race-condition-prone timeouts with deterministic Vue lifecycle reactivity (`nextTick`).

**Non-Goals:**
- We are not redesigning the form UI or changing the backend submission endpoints (Formspree).
- We are not introducing a formal router (`vue-router`); the phase machine pattern fits the portfolio's immersive needs.

## Decisions

- **Logic Extraction Pattern**: We will use the Composition API to create `useContactForm.ts`. This composable will return reactive refs for form fields (`name`, `email`, `message`), validation state, and the `submit` function. The UI will simply bind to these refs.
  - *Alternative Considered*: Moving logic to a Pinia store. *Rationale for Rejection*: Form state is inherently local to the form instance; a global store would be overkill.
- **Turnstile Component**: The `TurnstileWidget.vue` will encapsulate the loading of the Cloudflare script and emitting the verified token. It will accept a `sitekey` prop and emit a `@verify` event.
- **Phase Machine**: `useAppPhase.ts` will manage the transition logic between `NAV` and content states.
- **DOM Timings**: We will replace `setTimeout(..., 100)` in `App.vue`'s `handleAfterEnter` with `await nextTick()` and explicit template ref checks to ensure DOM elements exist before manipulating them.

## Risks / Trade-offs

- **Risk**: Extracting Turnstile might break the script loading timing if not handled carefully in the component lifecycle.
  - **Mitigation**: Ensure the script tag injection and widget rendering happens in `onMounted` within `TurnstileWidget.vue`, and proper cleanup occurs in `onUnmounted`.
- **Risk**: Moving form state to a composable might disconnect template validation feedback if refs lose reactivity.
  - **Mitigation**: Strictly use `toRefs` or return `ref` objects directly from the composable to maintain reactivity.
