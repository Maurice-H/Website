# Capability: Smart Contact Actions

## ADDED Requirements

### Requirement: Contact Methods Data
The system SHALL externalize contact methods to `src/data/contacts.ts` as a typed `ContactMethod[]` array containing entries for GitHub, Email, LinkedIn, Xing, and Discord.

#### Scenario: Contact data structure
- **WHEN** the contact methods are imported
- **THEN** each entry SHALL have `id`, `label`, `value`, `icon`, `action` (`'link'` | `'copy'`), and optional `url`.

### Requirement: External Link Actions
The system SHALL open external profile URLs (GitHub, LinkedIn, Xing) in a new browser tab when clicked.

#### Scenario: Click LinkedIn button
- **WHEN** the visitor clicks the LinkedIn contact button
- **THEN** `https://www.linkedin.com/in/maurice-hanl` SHALL open in a new tab via `window.open(url, '_blank')`.

### Requirement: Clipboard Copy Actions
The system SHALL copy identifier values (Discord username, email address) to the clipboard when clicked, with toast notification feedback.

#### Scenario: Copy Discord username
- **WHEN** the visitor clicks the Discord contact button
- **THEN** `mauzi_i` SHALL be copied to the clipboard and a success toast SHALL appear.

#### Scenario: Clipboard API unavailable
- **WHEN** `navigator.clipboard.writeText` fails (insecure context)
- **THEN** an error toast SHALL appear with the message "Copy failed — please copy manually" (localized per active locale).

### Requirement: Toast Notification System
The system SHALL provide a `useToast()` composable exposing `show(message: string, type: 'success' | 'error' | 'info')` and a `ToastNotification.vue` component teleported to `<body>`.

#### Scenario: Toast appears and auto-dismisses
- **WHEN** `useToast().show()` is called
- **THEN** a toast notification SHALL appear with a fade-in transition and auto-dismiss after 3 seconds with a fade-out transition.
