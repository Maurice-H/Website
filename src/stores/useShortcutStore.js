import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
const STORAGE_KEY = 'portfolio-shortcuts';
const DEFAULT_BINDINGS = {
    lighting: { key: 'l', label: 'Lighting' },
    theme: { key: 't', label: 'Theme' },
    back: { key: 'escape', label: 'Back' },
};
function loadFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored)
            return structuredClone(DEFAULT_BINDINGS);
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new actions added after storage was saved
        return { ...structuredClone(DEFAULT_BINDINGS), ...parsed };
    }
    catch {
        return structuredClone(DEFAULT_BINDINGS);
    }
}
export const useShortcutStore = defineStore('shortcuts', () => {
    const bindings = ref(loadFromStorage());
    /** The action currently being rebound (null = not editing) */
    const rebindingAction = ref(null);
    /** All currently assigned keys as a Set for fast duplicate detection */
    const assignedKeys = computed(() => {
        const keys = new Set();
        for (const entry of Object.values(bindings.value)) {
            keys.add(entry.key);
        }
        return keys;
    });
    /** Get the display label for a key (e.g., 'escape' → 'ESC') */
    const formatKey = (key) => {
        const map = {
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
    const getDisplay = (action) => {
        return formatKey(bindings.value[action].key);
    };
    /** Get the bound key for an action */
    const getKey = (action) => {
        return bindings.value[action].key;
    };
    /** Get the label for an action */
    const getLabel = (action) => {
        return bindings.value[action].label;
    };
    /** Find which action (if any) is bound to this key */
    const findAction = (key) => {
        const normalized = key.toLowerCase();
        for (const [action, entry] of Object.entries(bindings.value)) {
            if (entry.key === normalized)
                return action;
        }
        return null;
    };
    /** Start rebinding an action — the next keypress will be captured */
    const startRebind = (action) => {
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
    const tryRebind = (newKey) => {
        if (!rebindingAction.value)
            return false;
        const normalized = newKey.toLowerCase();
        const currentAction = rebindingAction.value;
        // Allow re-assigning the same key (no-op)
        if (bindings.value[currentAction].key === normalized) {
            rebindingAction.value = null;
            return true;
        }
        // Check if key is taken by a different action
        const existing = findAction(normalized);
        if (existing)
            return false;
        bindings.value[currentAction] = {
            ...bindings.value[currentAction],
            key: normalized,
        };
        rebindingAction.value = null;
        return true;
    };
    /** Reset all bindings to defaults */
    const resetDefaults = () => {
        bindings.value = structuredClone(DEFAULT_BINDINGS);
        rebindingAction.value = null;
    };
    // Persist to localStorage on change
    watch(bindings, (val) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
        }
        catch {
            /* storage full or unavailable */
        }
    }, { deep: true });
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
        resetDefaults,
    };
});
