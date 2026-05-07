## 2024-05-02 - Sentinel Strict State Enforcement
 **Learning:** TypeScript enum validation is easily bypassed during runtime serialization or coercion. Standard store actions assumed type safety would catch invalid enums.
 **Action:** Implemented strict runtime phase validation in `lighting.ts` by explicitly verifying that the incoming payload is an approved `LightingPhase` before executing state transitions.

## 2026-05-03 - Unhandled Promise Rejections in Audio Playback
 **Learning:** HTMLAudioElement.play() returns a Promise which rejects if the browser blocks the audio playback (e.g., due to missing user interaction before the playback starts). If not caught, this results in an unhandled promise rejection error that could lead to instability or warnings.
 **Action:** Added a `.catch(() => {})` block to all `audio.play()` calls to silently handle potential rejection without crashing or cluttering logs.
## 2026-05-04 - Strict Environment Variable Type Enforcement
 **Learning:** Using `import.meta.env` directly throughout the application bypasses strict typing and can lead to unexpected runtime issues if Vite's AST replacement does not resolve properly, or if undefined values are expected as booleans.
 **Action:** Implemented `src/utils/env.ts` to act as a centralized, strict validation and parsing layer for all environment configurations, ensuring missing or malformed variables are caught and logged during initialization.
