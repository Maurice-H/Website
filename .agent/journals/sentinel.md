## 2026-05-07 - Remove Hardcoded Turnstile Site Key

**Severity:** Low (Test/Dummy key)
**Issue:** A hardcoded Cloudflare Turnstile site key fallback was present in `ContactForm.vue`.
**Impact:** Exposure of API keys/secrets in source code, even if dummy keys, is a bad practice and can lead to accidental exposure of real keys if they are swapped without moving to environment variables.
**Fix:** Centralized environment variable management in `src/utils/env.ts` with strict typing and validation. Updated `ContactForm.vue` to use this centralized config and removed all hardcoded fallbacks.
**Verification:** Manual verification of code changes in `ContactForm.vue` and `env.ts`. Environment issues prevented full automated test execution.
