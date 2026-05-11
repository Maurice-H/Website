import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

/**
 * Available shortcut actions.
 * Each action maps to a specific app behavior.
 */
export type ShortcutAction = 'lighting' | 'theme' | 'back';

interface ShortcutEntry {
  key: string;
  label: string;
}

const STORAGE_KEY = 'portfolio-shortcuts';

const DEFAULT_BINDINGS: Record<ShortcutAction, ShortcutEntry> = {
  lighting: { key: 'l', label: 'Lighting' },
  theme: { key: 't', label: 'Theme' },
  back: { key: 'escape', label: 'Back' },
};

function loadFromStorage(): Record<ShortcutAction, ShortcutEntry> {
  const bindings = structuredClone(DEFAULT_BINDINGS);
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return bindings;

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return bindings;
    }

    const validActions = Object.keys(DEFAULT_BINDINGS) as ShortcutAction[];

    for (const action of validActions) {
      const entry = parsed[action];

      if (
        entry &&
        typeof entry === 'object' &&
        !Array.isArray(entry) &&
        typeof entry.key === 'string' &&
        typeof entry.label === 'string'
      ) {
        const normalizedKey = entry.key.toLowerCase().trim();

        // Security: Validate key length and basic content to prevent malicious or malformed keys
        // Most keys are single chars or short strings like 'escape', 'arrowup'.
        if (normalizedKey.length > 0 && normalizedKey.length < 20) {
          bindings[action] = {
            key: normalizedKey,
            label: entry.label,
          };
        }
      }
    }
  } catch {
    // Fall back to default bindings on any parsing error
  }
  return bindings;
}

export const useShortcutStore = defineStore('shortcuts', () => {
  const bindings = ref<Record<ShortcutAction, ShortcutEntry>>(loadFromStorage());

  /** The action currently being rebound (null = not editing) */
  const rebindingAction = ref<ShortcutAction | null>(null);

  /** All currently assigned keys as a Set for fast duplicate detection */
  const assignedKeys = computed(() => {
    const keys = new Set<string>();
    for (const entry of Object.values(bindings.value)) {
      keys.add(entry.key);
    }
    return keys;
  });

  /** Get the display label for a key (e.g., 'escape' → 'ESC') */
  const formatKey = (key: string): string => {
    const map: Record<string, string> = {
      escape: 'ESC',
      arrowleft: '←',
      arrowright: '→',
      arrowup: '↑',
      arrowdown: '↓',
      ' ': 'SPACE',
      enter: 'ENTER',
    };
    return map[key] ?? key.toUpperCase();
  };

  /** Get the display string for a shortcut action */
  const getDisplay = (action: ShortcutAction): string => {
    return formatKey(bindings.value[action].key);
  };

  /** Get the bound key for an action */
  const getKey = (action: ShortcutAction): string => {
    return bindings.value[action].key;
  };

  /** Get the label for an action */
  const getLabel = (action: ShortcutAction): string => {
    return bindings.value[action].label;
  };

  /** Find which action (if any) is bound to this key */
  const findAction = (key: string): ShortcutAction | null => {
    const normalized = key.toLowerCase();
    for (const [action, entry] of Object.entries(bindings.value)) {
      if (entry.key === normalized) return action as ShortcutAction;
    }
    return null;
  };

  /** Start rebinding an action — the next keypress will be captured */
  const startRebind = (action: ShortcutAction) => {
    rebindingAction.value = action;
  };

  /** Cancel an active rebind */
  const cancelRebind = () => {
    rebindingAction.value = null;
  };

  /**
   * Attempt to rebind the current action to a new key.
   * Returns false if the key is already taken by another action.
   */
  const tryRebind = (newKey: string): boolean => {
    if (!rebindingAction.value) return false;

    const normalized = newKey.toLowerCase();
    const currentAction = rebindingAction.value;

    // Allow re-assigning the same key (no-op)
    if (bindings.value[currentAction].key === normalized) {
      rebindingAction.value = null;
      return true;
    }

    // Check if key is taken by a different action
    const existing = findAction(normalized);
    if (existing) return false;

    bindings.value[currentAction] = {
      ...bindings.value[currentAction],
      key: normalized,
    };
    rebindingAction.value = null;
    return true;
  };

  /** Reset all bindings to defaults */
  const resetAll = () => {
    bindings.value = structuredClone(DEFAULT_BINDINGS);
    rebindingAction.value = null;
  };

  // Persist to localStorage on change
  watch(
    bindings,
    (val) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
      } catch {
        /* storage full or unavailable */
      }
    },
    { deep: true }
  );

  return {
    bindings,
    rebindingAction,
    assignedKeys,
    formatKey,
    getDisplay,
    getKey,
    getLabel,
    findAction,
    startRebind,
    cancelRebind,
    tryRebind,
    resetAll,
  };
});
