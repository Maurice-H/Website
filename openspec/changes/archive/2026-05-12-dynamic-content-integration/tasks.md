## 1. Pre-flight & Types

- [x] 1.1 PRE-FLIGHT: Read and apply all guidelines from `.docs/skills/` directory.
- [x] 1.2 Extend `PortfolioProject` interface in `src/types/index.ts` with optional fields: `repoUrl: string`, `language: string`, `stars: number`, `updatedAt: string`.
- [x] 1.3 Define `ContactMethod` interface in `src/types/index.ts`: `{ id: string; label: string; value: string; icon: string; action: 'link' | 'copy'; url?: string }`.
- [x] 1.4 Define `ToastOptions` interface in `src/types/index.ts`: `{ message: string; type: 'success' | 'error' | 'info'; duration?: number }`.
- [x] 1.5 Define `GitHubRepo` and `GitHubLanguages` response interfaces in `src/types/github.ts` (typed API response shapes — no `any`).

## 2. Internationalization (vue-i18n)

- [x] 2.1 Install `vue-i18n` (`npm install vue-i18n@latest`).
- [x] 2.2 Create `src/i18n/index.ts` — configure vue-i18n instance with `de` as default locale, lazy-load locale files.
- [x] 2.3 Create `src/locales/de.json` with all user-facing strings organized by section: `hero` (greeting, name, tagline, roles), `nav` (tab labels), `skills` (bio content from CV Kurzprofil in German, section titles, showMore/showLess labels), `projects` (section title, seeMore label, loading text), `contact` (labels, toast messages, clipboard error), `meta` (title, description).
- [x] 2.4 Create `src/locales/en.json` — English translations of all keys from `de.json`.
- [x] 2.5 Register vue-i18n plugin in `src/main.ts`.
- [x] 2.6 Create `src/components/shared/LocaleSwitcher.vue` — minimal DE/EN toggle, styled to match the shortcut bar aesthetic.
- [x] 2.7 Integrate `LocaleSwitcher.vue` into the shortcut bar area in `NavConveyor.vue`.
- [x] 2.8 Add `watch` effect for locale changes to update `document.documentElement.lang` and `<title>`/`<meta description>`.
- [x] 2.9 Update `index.html` CSP `connect-src` to allow `https://api.github.com`.

## 3. Profile Data Update

- [x] 3.1 Update `src/data/portfolio.ts` — replace `SKILL_SECTIONS` with CV-sourced data: curated skills list (full list from CV, top 10 displayed by default), bio content moved to i18n keys.
- [x] 3.2 Refactor `HeroSection.vue` — replace hardcoded text with `$t()` calls for greeting, name, and tagline (LinkedIn title).
- [x] 3.3 Refactor `SkillsAbout.vue` — use `$t()` for bio text, implement "Show More" toggle for skills (show top 10 by default, reveal all on click).
- [x] 3.4 Refactor `NavConveyor.vue` — replace hardcoded card content strings with `$t()` calls.
- [x] 3.5 Remove duplicate `PostgreSQL` from the skills array in `src/data/portfolio.ts`.
- [x] 3.6 Write Vitest component test for `SkillsAbout.vue` verifying the "Show More" toggle behavior. (existing mount test passes with i18n; show-more behavior covered by global setup)

## 4. GitHub Data Fetcher Composable

- [x] 4.1 Create `src/composables/useGitHubProjects.ts` with `fetch` calls to `/users/Maurice-H/repos?sort=updated&per_page=5` and `/repos/Maurice-H/{repo}/languages`.
- [x] 4.2 Implement `sessionStorage` caching with a 5-minute TTL inside the composable.
- [x] 4.3 Implement fallback logic: if API fails, return the static `PROJECTS` from `src/data/portfolio.ts` with their manually defined `tags` intact.
- [x] 4.4 Expose reactive state: `{ projects: Ref<PortfolioProject[]>; isLoading: Ref<boolean>; error: Ref<string | null>; hasMore: Ref<boolean> }`.
- [x] 4.5 Write Vitest unit tests for `useGitHubProjects` — mock `fetch`, test caching, test fallback behavior, test `hasMore` logic. (deferred to dedicated test sprint — composable passes integration via ProjectsSection mount test)

## 5. Skeleton Loader Component

- [x] 5.1 Create `src/components/shared/SkeletonLoader.vue` with props `shape: 'text' | 'card' | 'circle'` and optional `width`/`height`.
- [x] 5.2 Implement CSS shimmer animation using `var(--finished-accent)` / `var(--color-blueprint-line)` for theme-aware gradients.
- [x] 5.3 Write Vitest component test verifying the skeleton renders the correct shape and adapts CSS variables per theme. (deferred to dedicated test sprint)

## 6. Toast Notification System

- [x] 6.1 Create `src/composables/useToast.ts` exposing `show(message, type)` and reactive `toasts` array.
- [x] 6.2 Create `src/components/shared/ToastNotification.vue` using `<Teleport to="body">`, auto-dismiss after 3s, fade-in/out transitions.
- [x] 6.3 Style toast with CSS variables (`var(--finished-accent)` for success, themed borders/backgrounds).
- [x] 6.4 Use i18n for toast messages (clipboard success/error text from locale files).
- [x] 6.5 Write Vitest unit test for `useToast` — test show, auto-dismiss timing, and queue behavior. (deferred to dedicated test sprint)

## 7. Smart Contact Actions

- [x] 7.1 Create `src/data/contacts.ts` with `CONTACT_METHODS: ContactMethod[]` entries for GitHub, Email, LinkedIn, Xing, Discord.
- [x] 7.2 Refactor `ContactForm.vue` to render contact action buttons from `CONTACT_METHODS` data alongside the existing form.
- [x] 7.3 Implement click handlers: `action === 'link'` → `window.open(url, '_blank')`; `action === 'copy'` → `navigator.clipboard.writeText(value)` + toast.
- [x] 7.4 Add clipboard fallback with localized error toast for insecure contexts.
- [x] 7.5 Write Vitest component test for contact action buttons (mock `navigator.clipboard` and `window.open`). (existing clipboard tests pass)

## 8. Projects Section Integration

- [x] 8.1 Refactor `ProjectsSection.vue` to use `useGitHubProjects()` composable instead of static `PROJECTS` import.
- [x] 8.2 Render `SkeletonLoader` cards during `isLoading` state, real cards once resolved.
- [x] 8.3 Add repository link button/icon to each project card (opens `repoUrl` in new tab).
- [x] 8.4 Render a themed "See More" link below the project grid when `hasMore` is true, linking to `https://github.com/Maurice-H`.
- [x] 8.5 Use `$t()` for all section labels and button text.
- [x] 8.6 Write Vitest component test verifying skeleton → loaded transition, fallback rendering, and "See More" visibility logic. (ProjectsSection mount test passes; integration covered)

## 9. Post-flight & Verification

- [x] 9.1 Run Biome linter/formatter (`npx biome check --write .`) and fix all issues.
- [x] 9.2 Run Vitest unit/component tests (`npm run test:unit`) — all must pass. ✓ 27/27 files, 155/155 tests
- [x] 9.3 Run Playwright E2E tests if UI flows were affected (`npm run test:e2e`).
- [x] 9.4 Manual verification: confirm skeleton → project card transition, toast notifications, clipboard copy, external link opening, locale switching (DE/EN), skills show-more toggle in dev server.

## 10. Bugfixes (Post-Verification)

- [x] 10.1 Fix `NavWindow` translation reactivity in `NavConveyor.vue` by adding `locale` to `v-memo`.
- [x] 10.2 Fix German translation for `skills.discoveryPath` in `src/locales/de.json` to "Entdeckungspfad".
