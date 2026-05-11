import { onMounted, onUnmounted } from 'vue';
import { useLightingStore } from '../stores/lighting';
import { useShortcutStore } from '../stores/useShortcutStore';
import { useThemeStore } from '../stores/useThemeStore';
import { LightingPhase } from '../types';
import { useAudio } from './useAudio';

/**
 * Registers global keyboard shortcuts for toggle controls.
 * Bindings are read from the shortcut store and update reactively
 * when the user remaps keys.
 *
 * Shortcuts are suppressed when focus is inside form inputs
 * (input, textarea, select, [contenteditable]) to prevent
 * conflicts with text entry.
 */
export function useKeyboardShortcuts(): void {
  const themeStore = useThemeStore();
  const lightingStore = useLightingStore();
  const shortcutStore = useShortcutStore();
  const { playClick, playGlitch, playSwoosh } = useAudio();

  const isInsideFormField = (): boolean => {
    const active = document.activeElement;
    if (!active) return false;
    const tag = active.tagName;
    return (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      (active as HTMLElement).isContentEditable
    );
  };

  const handleKeydown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    // ── Rebind mode: capture the next key for the active rebind ──
    if (shortcutStore.rebindingAction) {
      e.preventDefault();

      // Escape cancels rebind UNLESS we are specifically rebinding the 'back' action
      if (key === 'escape' && shortcutStore.rebindingAction !== 'back') {
        shortcutStore.cancelRebind();
        return;
      }

      // Skip modifier-only presses
      if (['shift', 'control', 'alt', 'meta'].includes(key)) return;

      const success = shortcutStore.tryRebind(key);
      if (!success) {
        // Key already taken — could flash feedback, but for now just ignore
      }
      return;
    }

    // ── Normal mode ──
    if (isInsideFormField()) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const action = shortcutStore.findAction(key);
    if (!action) return;

    e.preventDefault();

    switch (action) {
      case 'lighting':
        themeStore.toggleLighting();
        playClick();
        break;
      case 'theme':
        themeStore.toggleTheme();
        playGlitch();
        break;
      case 'back':
        if (lightingStore.phase === LightingPhase.CONTENT) {
          lightingStore.setPhase(LightingPhase.NAV);
          playSwoosh();
        }
        break;
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
}
