## 1. Contact Form Logic Extraction

- [ ] 1.1 Define TypeScript interfaces in `src/types/contact.ts` for form state, Turnstile token, and API responses
- [ ] 1.2 Create `src/composables/useContactForm.ts`
- [ ] 1.3 Migrate `fetch` logic (Formspree), DNS validation, and local validation state from `ContactForm.vue` into `useContactForm.ts`
- [ ] 1.4 Write unit tests for `useContactForm.ts` mocking the API layer
- [ ] 1.5 Create `src/components/features/TurnstileWidget.vue` and migrate the Cloudflare Turnstile lifecycle methods (`onMounted` script injection, `render`) from `ContactForm.vue`
- [ ] 1.6 Refactor `ContactForm.vue` template to use `useContactForm.ts` refs and the `<TurnstileWidget>` component

## 2. App Phase Machine

- [ ] 2.1 Create `src/composables/useAppPhase.ts` to manage transition states ('NAV', 'CONTENT', etc.)
- [ ] 2.2 Migrate phase logic and layout orchestration out of `App.vue` into `useAppPhase.ts`
- [ ] 2.3 Refactor `App.vue`'s `handleAfterEnter` to replace `setTimeout` with `nextTick` and template ref checks
- [ ] 2.4 Update `App.vue` template to rely on the clean refs returned from `useAppPhase.ts`

## 3. Testing & Verification

- [ ] 3.1 Run Biome formatter and linter (`npx biome check .`)
- [ ] 3.2 Write/Update Vitest unit tests for `useAppPhase.ts`
- [ ] 3.3 Run Vitest test suite (`npm run test:unit`)
- [ ] 3.4 Run Playwright E2E tests (`npm run test:e2e`) to verify that the contact form submission flow and the global phase transitions are fully functional
