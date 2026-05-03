import { Ref } from 'vue';
import { LightingPhase } from './index';

/**
 * Public interface for the Viewport Store.
 * Manages mouse tracking, component registration, and scroll/resize synchronization.
 */
export interface ViewportStore {
  /** Reactive mouse coordinates for UI usage */
  mousePosition: { x: number; y: number };
  /** Non-reactive mouse coordinates for WebGL uniform bridge */
  rawMouse: { x: number; y: number };
  /** Map of registered components for viewport tracking */
  registeredComponents: Map<string, unknown>;
  /** Initialize event listeners */
  init: () => void;
  /** Register a component for bounding box tracking */
  register: (id: string, el: HTMLElement) => { update: () => void; unregister: () => void };
  /** Get current offsets for a registered component */
  getOffsets: (id: string) => { left: number; top: number };
}

/**
 * Public interface for the Lighting Store.
 * Controls the overall lighting phase and transition effects.
 */
export interface LightingStore {
  /** Current active lighting phase (NAV | CONTENT) */
  phase: Ref<LightingPhase>;
  /** Whether the transition flash effect is currently active */
  isFlashActive: Ref<boolean>;
  /** Transition to a new lighting phase */
  setPhase: (newPhase: LightingPhase) => void;
}

/**
 * Public interface for the Theme Store.
 * Manages aesthetic preferences like Blueprint mode and Lighting toggles.
 */
export interface ThemeStore {
  /** Whether blueprint/schematic mode is active */
  isBlueprintMode: Ref<boolean>;
  /** Whether dynamic lighting effects are enabled */
  lightingEnabled: Ref<boolean>;
  /** Toggle between standard and blueprint mode */
  toggleTheme: () => void;
  /** Toggle dynamic lighting effects globally */
  toggleLighting: () => void;
}
