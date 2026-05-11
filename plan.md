1. **Remove Unused Imports & Merge `vue` Imports in `src/components/layout/WebGLScene.vue`**
   - We will merge multiple `vue` imports spread across `WebGLScene.vue` into a single statement.
   - Lines 161, 179, and 487 import different functions from `vue` (`onMounted`, `shallowRef`, `watch`, `computed`, `ref`, `watchEffect`, `onUnmounted`).
   - We will remove the redundant/scattered imports and consolidate them at the top.

2. **Remove the Unused Import in `src/stores/lighting.ts`**
   - The file imports `ref` from `vue` but it is not needed if the store does not use `ref` directly or it's incorrectly placed. Wait, `ref` is used. Nevermind. Wait, is it? Let me check `src/stores/lighting.ts` again. `ref` is used for `phase`, `isFlashActive`, `pendingScrollTarget`, `focusedElementPos`. It is not unused.

3. **Remove `console.log` in `src/composables/useTheme.ts`**
   - Remove `console.log('[Theme] Toggle Triggered. New state:', isBlueprint.value);` on line 17.

4. **Remove `console.log` in `src/App.vue`**
   - Remove `console.log('App Mounted in Fused Single-Layer Mode');` on line 175.

5. **Clean up Dead Code & `console.info`/`console.error` in `src/components/layout/WebGLScene.vue`**
   - Remove `console.error` and `console.info` statements left behind as debugging slop in lines 231, 463, 527, 554. Wait, the prompt specifically asks to find forgotten `console.log()` or `debugger` statements. Let's just remove the `console.log`s in `useTheme.ts` and `App.vue`. And the prompt asks to provide ready-to-paste task prompts to clean it up. Ah! The user is acting as the "Janitor" who generated the prompt, and I need to ACT AS THE JANITOR to generate a prompt.

Wait, let's re-read the task instructions:
"You DO NOT write code directly. You analyze the codebase to find 'dirty' code left behind during the rapid AI development phase. You generate **ready-to-paste task prompts** to clean it up."

Oh! I am supposed to GENERATE A TASK PROMPT. I am NOT supposed to clean it up.
Let me review the findings.

1. `src/App.vue` has a `console.log('App Mounted in Fused Single-Layer Mode');` on line 175.
2. `src/composables/useTheme.ts` has a `console.log('[Theme] Toggle Triggered. New state:', isBlueprint.value);` on line 17.
3. `src/components/layout/WebGLScene.vue` has scattered Vue imports (lines 161, 179, 487).
4. `src/App.vue` has commented out dead code `<!-- Floating Controls removed — lighting via 3D model click, theme via shortcut -->` (line 33).
5. `src/components/layout/WebGLScene.vue` has commented out `// --- TRESJS CRASH PREVENTION PATCH ---` block? No, that's actual code.
6. `src/composables/useAudio.ts` has `import { ref } from 'vue'` - used? `isMuted` uses it.

Let me review the evaluation criteria:
1. **Dead Code:** Find commented-out code blocks (`` in Vue, `//` in TS) that are no longer needed.
   - `src/App.vue`: `<!-- Floating Controls removed — lighting via 3D model click, theme via shortcut -->`
2. **Unused Imports & Variables:** Spot imports from Vue, Pinia, or TresJS that are declared but never used.
   - `src/components/layout/WebGLScene.vue`: Wait, are any of those unused?
Let's run Biome again to check for unused imports.
