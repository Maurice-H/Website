# Responsive Breakpoints

## Purpose
This capability defines the shared reactive breakpoint detection system that provides consistent mobile/desktop state across all components, replacing scattered inline implementations with a single-listener singleton pattern.

## Requirements

### Requirement: Shared Reactive Breakpoint State
The `useResponsive()` composable SHALL provide a reactive `isMobile` ref that is `true` when `window.innerWidth < 768` and `false` otherwise.

#### Scenario: Initial state on mobile device
- **WHEN** the composable is first called on a device with viewport width 375px
- **THEN** `isMobile` SHALL be `true`

#### Scenario: Initial state on desktop
- **WHEN** the composable is first called on a device with viewport width 1440px
- **THEN** `isMobile` SHALL be `false`

#### Scenario: Dynamic resize triggers update
- **WHEN** the browser window is resized from 1024px to 600px
- **THEN** `isMobile` SHALL reactively update to `true`

### Requirement: Single Resize Listener
The composable SHALL register at most one `resize` event listener on `window`, shared across all consumers.

#### Scenario: Multiple consumers share one listener
- **WHEN** `useResponsive()` is called from `NavConveyor.vue`, `BackToTop.vue`, `App.vue`, and `ContactForm.vue`
- **THEN** only one `resize` event listener SHALL exist on `window` for breakpoint detection

### Requirement: SSR Guard
The composable SHALL include a `typeof window !== 'undefined'` guard to prevent errors in non-browser environments.

#### Scenario: Server-side rendering context
- **WHEN** `useResponsive()` is called in an environment where `window` is undefined
- **THEN** `isMobile` SHALL default to `false` without throwing

### Requirement: Replace All Duplicate Implementations
All existing inline `isMobile` detection in components SHALL be replaced by the shared composable.

#### Scenario: NavConveyor uses shared composable
- **WHEN** `NavConveyor.vue` needs mobile state
- **THEN** it SHALL import `isMobile` from `useResponsive()` instead of defining its own `ref` and resize listener

#### Scenario: App.vue computed bug is fixed
- **WHEN** `App.vue` uses `isMobile` from the shared composable
- **THEN** the value SHALL reactively update on resize (fixing the current computed-without-listener bug)
