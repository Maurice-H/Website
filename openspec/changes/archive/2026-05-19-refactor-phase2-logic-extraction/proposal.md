## Why

The current `ContactForm.vue` and `App.vue` components have grown into "God Objects" by mixing UI rendering with complex business logic (e.g., DNS MX record checks, CAPTCHA validation, and manual phase routing). This violates the Single Responsibility Principle, making the components difficult to test, maintain, and comprehend. Extracting this logic into dedicated composables and smaller components will dramatically improve code readability and testability.

## What Changes

- **Contact Form Extraction**: Remove all API fetching, DNS MX record validation, and custom spam-check logic from `ContactForm.vue` and place it into a dedicated `useContactForm.ts` composable.
- **Turnstile Widget**: Extract the Cloudflare Turnstile rendering and validation logic into a separate `TurnstileWidget.vue` component.
- **App Phase Routing**: Extract the manual state-based "routing" (e.g., switching between 'NAV' and content phases) and related layout logic from `App.vue` into a `useAppPhase.ts` composable.
- **Timing Hacks**: Replace unreliable `setTimeout` calls used for DOM readiness in `App.vue` with Vue's native `nextTick` combined with lifecycle hooks.

## Capabilities

### New Capabilities
- `contact-form-logic`: A centralized capability managing form state, external DNS validation, and API submissions independent of the UI layer.
- `turnstile-integration`: A standalone capability for handling Cloudflare Turnstile lifecycle and token generation.
- `app-phase-machine`: A capability that manages the high-level application states (e.g., Navigation vs. Content modes) without bloating the root component.

### Modified Capabilities
- (None - we are strictly refactoring implementation details without changing the user-facing spec requirements of the contact form or app layout).

## Impact

- **Affected Code**: `src/components/features/ContactForm.vue`, `src/App.vue`.
- **New Code**: `src/composables/useContactForm.ts`, `src/components/features/TurnstileWidget.vue`, `src/composables/useAppPhase.ts`.
- **System Quality**: Vastly improved maintainability. UI components will become pure view layers.
- **Testing**: Business logic for form validation and app phase transitions can now be unit-tested without mounting the entire DOM.

## Non-goals

- We will not migrate to `vue-router`. The application will remain a single-page immersive experience governed by a phase machine.
- We will not redesign the visual appearance of the contact form.

## Testing Strategy

- **Unit Tests**: Add tests for `useContactForm.ts` to mock API responses and test DNS validation logic in isolation. Test `useAppPhase.ts` to ensure phase transitions update state correctly.
- **E2E Tests**: Use Playwright to verify that the contact form still submits correctly (including Turnstile interaction) and that phase transitions between 'NAV' and content work smoothly.
