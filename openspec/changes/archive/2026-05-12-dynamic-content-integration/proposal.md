## Why

The portfolio currently renders hardcoded placeholder projects ("Neon E-Commerce", "FlowState Dashboard"), uses a generic bio blurb, and lists a duplicate-containing skill array. The real owner's career data — extracted from verified application documents — is not represented. Additionally, the site is English-only despite the owner being a native German speaker targeting both DE and EN job markets. This change replaces all static placeholder content with real, dynamic data (GitHub API for projects, CV-sourced profile data) and adds internationalization support so the portfolio speaks both languages.

## What Changes

- **Dynamic GitHub Projects**: Replace the hardcoded `PROJECTS` array with a `useGitHubProjects` composable that fetches the top 5 public repos (sorted by recent update) from the GitHub REST API (`Maurice-H`). Auto-detect tech-stack tags via each repo's `/languages` endpoint. Show a "See More" link to `https://github.com/Maurice-H` below the project grid when repos are at the display limit.
- **Profile Data Update**: Replace the generic bio, skills array, and hero tagline with real data sourced from the owner's CV:
  - Hero title: `Frontend Engineer (Vue/TS) | UI/UX Architecture | Backend (Node/Python) & Cloud DevOps (AWS/Terraform)` (from LinkedIn)
  - Bio: CV-sourced Kurzprofil (translated per locale)
  - Stack: Curated top-10 skills from CV with a "Show More" expansion for the full list
- **Internationalization (i18n)**: Integrate `vue-i18n` for DE/EN locale switching. All user-facing strings (hero, bio, nav labels, contact, skill section titles, meta tags) must be translatable. Default locale: `de`.
- **Smart Contact Actions**: Transform contact buttons into functional elements — external profiles (GitHub, LinkedIn, Xing) open in new tabs; identifiers (Discord, email) copy to clipboard with a toast notification.
- **Skeleton Loaders**: Add themed skeleton placeholders for the projects section that render while the GitHub API call is in-flight.
- **Toast Notification System**: Lightweight composable + teleported component for clipboard-copy feedback and error states.

## Capabilities

### New Capabilities
- `github-data-fetcher`: Composable for fetching and transforming GitHub API data (repos, languages) into the existing `PortfolioProject` interface. Includes sessionStorage caching and fallback to static data.
- `smart-contact-actions`: Clipboard copy, external link routing, and toast notification system for the contact section.
- `skeleton-loaders`: Reusable skeleton placeholder components that respect the current theme (Finished/Blueprint).
- `i18n-support`: Vue-i18n integration with DE/EN locale files, locale switcher UI, and SSR-safe locale detection.

### Modified Capabilities
- `portfolio-content`: Requirements change from static-only rendering to supporting async data sources with loading/error states. Contact layout gains functional action buttons. Skills section gains "show more" expansion. Bio content sourced from CV data per locale.

## Impact

- **Dependencies**: New npm package: `vue-i18n`. No other new packages.
- **Types**: `PortfolioProject` interface gains optional fields (`repoUrl`, `language`, `stars`, `updatedAt`). New `ContactMethod`, `ToastOptions`, `GitHubRepo`, `GitHubLanguages` interfaces.
- **Data Layer**: `src/data/portfolio.ts` static exports remain as GitHub API fallback. New `src/data/contacts.ts` for contact methods. New `src/locales/de.json` and `src/locales/en.json` for i18n message catalogs.
- **Components**: `ProjectsSection.vue` gains loading/error states + "See More" link. `ContactForm.vue` gains action buttons. `HeroSection.vue` title/tagline driven by i18n. `SkillsAbout.vue` gains "show more" toggle. New: `SkeletonLoader.vue`, `ToastNotification.vue`, `LocaleSwitcher.vue`.
- **Composables**: New: `useGitHubProjects.ts`, `useToast.ts`.
- **SEO**: `<title>` and `<meta>` tags updated per locale. `<html lang>` attribute set dynamically.
- **CSP**: `index.html` Content-Security-Policy `connect-src` must allow `https://api.github.com`.
