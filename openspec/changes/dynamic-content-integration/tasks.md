## 1. Pre-flight & Types

- [ ] 1.1 PRE-FLIGHT: Read and apply all guidelines from `.docs/skills/` directory.
- [ ] 1.2 Extend `PortfolioProject` interface in `src/types/index.ts` with optional fields: `repoUrl: string`, `language: string`, `stars: number`, `updatedAt: string`.
- [ ] 1.3 Define `ContactMethod` interface in `src/types/index.ts`: `{ id: string; label: string; value: string; icon: string; action: 'link' | 'copy'; url?: string }`.
- [ ] 1.4 Define `ToastOptions` interface in `src/types/index.ts`: `{ message: string; type: 'success' | 'error' | 'info'; duration?: number }`.
- [ ] 1.5 Define `GitHubRepo` and `GitHubLanguages` response interfaces in `src/types/github.ts` (typed API response shapes — no `any`).

## 2. GitHub Data Fetcher Composable

- [ ] 2.1 Create `src/composables/useGitHubProjects.ts` with `fetch` calls to `/users/{username}/repos` and `/repos/{owner}/{repo}/languages`.
- [ ] 2.2 Implement `sessionStorage` caching with a 5-minute TTL inside the composable.
- [ ] 2.3 Implement fallback logic: if API fails, return the static `PROJECTS` from `src/data/portfolio.ts` with their manually defined `tags` intact.
- [ ] 2.4 Expose reactive state: `{ projects: Ref<PortfolioProject[]>; isLoading: Ref<boolean>; error: Ref<string | null> }`.
- [ ] 2.5 Write Vitest unit tests for `useGitHubProjects` — mock `fetch`, test caching, test fallback behavior.

## 3. Skeleton Loader Component

- [ ] 3.1 Create `src/components/shared/SkeletonLoader.vue` with props `shape: 'text' | 'card' | 'circle'` and optional `width`/`height`.
- [ ] 3.2 Implement CSS shimmer animation using `var(--finished-accent)` / `var(--color-blueprint-line)` for theme-aware gradients.
- [ ] 3.3 Write Vitest component test verifying the skeleton renders the correct shape and adapts CSS variables per theme.

## 4. Toast Notification System

- [ ] 4.1 Create `src/composables/useToast.ts` exposing `show(message, type)` and reactive `toasts` array.
- [ ] 4.2 Create `src/components/shared/ToastNotification.vue` using `<Teleport to="body">`, auto-dismiss after 3s, fade-in/out transitions.
- [ ] 4.3 Style toast with CSS variables (`var(--finished-accent)` for success, themed borders/backgrounds).
- [ ] 4.4 Write Vitest unit test for `useToast` — test show, auto-dismiss timing, and queue behavior.

## 5. Smart Contact Actions

- [ ] 5.1 Create `src/data/contacts.ts` with `CONTACT_METHODS: ContactMethod[]` entries for GitHub, Email, LinkedIn, Xing, Discord.
- [ ] 5.2 Refactor `ContactForm.vue` to render contact action buttons from `CONTACT_METHODS` data instead of (or alongside) the existing form.
- [ ] 5.3 Implement click handlers: `action === 'link'` → `window.open(url, '_blank')`; `action === 'copy'` → `navigator.clipboard.writeText(value)` + toast.
- [ ] 5.4 Add clipboard fallback with error toast for insecure contexts.
- [ ] 5.5 Write Vitest component test for contact action buttons (mock `navigator.clipboard` and `window.open`).

## 6. Projects Section Integration

- [ ] 6.1 Refactor `ProjectsSection.vue` to use `useGitHubProjects()` composable instead of static `PROJECTS` import.
- [ ] 6.2 Render `SkeletonLoader` cards during `isLoading` state, real cards once resolved.
- [ ] 6.3 Add repository link button/icon to each project card (opens `repoUrl` in new tab).
- [ ] 6.4 Render a themed "See More" link below the project grid when the fetched repo count reaches the configured display limit, linking to the user's GitHub profile.
- [ ] 6.5 Write Vitest component test verifying skeleton → loaded transition, fallback rendering, and "See More" visibility logic.

## 7. Placeholder Text Updates

- [ ] 7.1 Update `HeroSection.vue`: change "Alex" to "Maurice" in the `<h1>` element.
- [ ] 7.2 Update `index.html`: set `<title>` to "Maurice | Portfolio" and add `<meta name="description">`.
- [ ] 7.3 Audit all files for remaining "Alex" references and replace with "Maurice".

## 8. Post-flight & Verification

- [ ] 8.1 Run Biome linter/formatter (`npx biome check --write .`) and fix all issues.
- [ ] 8.2 Run Vitest unit/component tests (`npm run test:unit`) — all must pass.
- [ ] 8.3 Run Playwright E2E tests if UI flows were affected (`npm run test:e2e`).
- [ ] 8.4 Manual verification: confirm skeleton → project card transition, toast notifications, clipboard copy, and external link opening in dev server.
