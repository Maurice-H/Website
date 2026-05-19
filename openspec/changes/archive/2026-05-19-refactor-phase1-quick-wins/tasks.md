## 1. Memory Management & Cleanup

- [x] 1.1 Update `useToast.ts` to attach `setTimeout` IDs to the internal toast objects
- [x] 1.2 Update `useToast.ts` `removeToast` to call `clearTimeout` using the stored ID
- [x] 1.3 Add a `clearAll` cleanup function to `useToast.ts` and call it on application unmount (or via a lifecycle hook where appropriate)
- [x] 1.4 Update `useAudio.ts` to expose a `cleanup` function that pauses and removes all HTMLAudioElements from the `audioCache`
- [x] 1.5 Ensure `useAudio` cleanup is called when the main app unmounts

## 2. Store Purity (DOM Extraction)

- [x] 2.1 Create a new composable `src/composables/useThemeDomSync.ts`
- [x] 2.2 Migrate DOM manipulation logic (`document.documentElement.setAttribute`, meta tag manipulation) from `useThemeStore.ts` into `useThemeDomSync.ts`
- [x] 2.3 Setup watchers in `useThemeDomSync.ts` to react to `useThemeStore` state changes
- [x] 2.4 Migrate `document.startViewTransition` and DOM queries out of `lighting.ts` into a dedicated watcher/composable (e.g., in `App.vue` or a new `useLightingDomSync.ts`)
- [x] 2.5 Instantiate these new sync composables in `App.vue` `<script setup>`

## 3. Component Decoupling

- [x] 3.1 Define TypeScript interfaces/types for events in `src/components/shared/BentoCard.vue` (`defineEmits<{ (e: 'hover-change', position: any): void }>`)
- [x] 3.2 Refactor `BentoCard.vue` to emit hover states instead of importing and modifying `useLightingStore` directly
- [x] 3.3 Update all parent components using `BentoCard.vue` (e.g., `BentoLayout.vue` or specific sections) to listen for `@hover-change` and forward the payload to `useLightingStore`

## 4. Testing & Quality Assurance

- [x] 4.1 Run Biome formatter and linter (`npx biome check .`) to ensure no regressions
- [x] 4.2 Write/Update Vitest unit tests for `useThemeDomSync.ts` to verify DOM manipulation outside the store
- [x] 4.3 Update `BentoCard.vue` unit tests to ensure they pass without a mocked Pinia instance for the lighting store
- [x] 4.4 Run Vitest test suite (`npm run test:unit`)
- [x] 4.5 Run Playwright E2E tests (`npm run test:e2e`) to verify theme switching and toast notifications still work correctly in the browser
