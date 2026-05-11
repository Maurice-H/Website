**Task: Clean Up Janitor Finds (Dead Code, Console Logs, and Import Slop)**

**Context:** Several artifacts from rapid AI development are cluttering the codebase. We need to remove dead code, unused/duplicate imports, and leftover debug statements to maintain a clean workspace.

**Target Files:**
1. `src/App.vue`
2. `src/composables/useTheme.ts`
3. `src/components/layout/WebGLScene.vue`

**Instructions:**
1. In `src/App.vue`:
   - Delete the commented-out dead code: `<!-- Floating Controls removed — lighting via 3D model click, theme via shortcut -->` (around line 33).
   - Remove the `console.log('App Mounted in Fused Single-Layer Mode');` statement (around line 175).
2. In `src/composables/useTheme.ts`:
   - Remove the `console.log('[Theme] Toggle Triggered. New state:', isBlueprint.value);` statement (around line 17).
3. In `src/components/layout/WebGLScene.vue`:
   - Consolidate the scattered `vue` imports into a single, clean import statement at the top. You will find redundant/scattered imports on lines 161, 179, and 487 (e.g. `import { onMounted, shallowRef, watch } from 'vue';`, `import { computed, ref, watchEffect } from 'vue';`, and `import { onUnmounted } from 'vue';`). Merge them into `import { computed, onMounted, onUnmounted, ref, shallowRef, watch, watchEffect } from 'vue';`.
   - Remove the `console.error` and `console.info` statements left behind as debugging slop (around lines 231, 463, 527, and 554).
4. Run `npm run lint` or `npx @biomejs/biome check src/` to ensure Biome confirms the files are perfectly clean.
