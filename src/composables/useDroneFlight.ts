import { MathUtils, Object3D, Vector3 } from 'three';
import { type Ref, ref } from 'vue';

// ── Types ──
export type Maneuver = 'IDLE' | 'CLOSE_VISIT' | 'DISTANT_PROBE' | 'LOOPING' | 'FOLLOW_MOUSE';

export interface DroneFlightConfig {
  /** Reactive spring constant — higher = snappier response */
  springStrength?: number;
  /** Air resistance / friction (0–1 range, applied exponentially) */
  damping?: number;
  /** Max seconds the drone focuses on a single hovered element */
  maxFocusDuration?: number;
  /** Seconds between scan triggers */
  scanInterval?: number;
  /** Duration of each scan sweep */
  scanDuration?: number;
}

export interface FocusTarget {
  x: number;
  y: number;
}

export interface DroneFlightState {
  /** Current maneuver being executed */
  currentManeuver: Ref<Maneuver>;
  /** Current physical position of the drone */
  position: Vector3;
  /** Current velocity vector */
  velocity: Vector3;
  /** Dummy Object3D used for rotation calculation */
  rotationHelper: Object3D;
  /** Whether a scan is currently active */
  scanActive: boolean;
  /** Elapsed time of the current scan */
  scanElapsed: number;
  /** Focus weight (0–1) for bento card hover inspection */
  focusWeight: number;
}

const DEFAULT_CONFIG: Required<DroneFlightConfig> = {
  springStrength: 15.0,
  damping: 0.82,
  maxFocusDuration: 3.2,
  scanInterval: 20,
  scanDuration: 3,
};

/**
 * Composable that encapsulates the drone's organic flight physics,
 * maneuver system, and scan timing — completely decoupled from Vue rendering.
 */
export function useDroneFlight(config: DroneFlightConfig = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // ── Reactive maneuver state ──
  const currentManeuver = ref<Maneuver>('IDLE');
  const maneuverStartTime = ref(0);
  const maneuverDuration = ref(0);
  let nextManeuverCheck = 10;

  // ── Physical state (non-reactive for perf — mutated in render loop) ──
  const droneCurrentPos = new Vector3(0, 0, -2);
  const droneVelocity = new Vector3();
  const droneDummyObj = new Object3D();

  // Pre-allocated vectors to avoid GC pressure in the render loop
  const _targetPos = new Vector3();
  const _lookAtPos = new Vector3();

  // ── Interaction state ──
  let focusWeight = 0;
  let focusStartTime = 0;
  let lastFocusedElement: FocusTarget | null = null;

  // ── Scan state ──
  let lastScanTime = 0;
  let scanActive = false;
  let scanElapsed = 0;

  // ───────────────────────────────────
  //  Core Flight Math
  // ───────────────────────────────────

  /**
   * Computes the desired flight target position based on time, maneuver state,
   * and optional UI focus. Pure math — no Vue or Three.js scene dependencies.
   */
  function getOrganicFlightPosition(
    time: number,
    target: Vector3,
    focusedElementPos: FocusTarget | null,
    mouseNormalized: { x: number; y: number },
    screenWidth: number
  ): void {
    const xLimitScale = Math.max(0.35, Math.min(1.0, screenWidth / 1200));
    const isMobile = screenWidth < 768;

    // ── Base Figure-8 Organic Motion ──
    let x = (Math.sin(time * 0.2) * 4 + Math.sin(time * 0.5) * 2) * xLimitScale;
    let y = Math.cos(time * 0.3) * 1.0 + Math.sin(time * 0.8) * 0.5;
    let z = Math.sin(time * 0.25) * 2 - 3;

    // ── UI / Bento Card Interaction ──
    if (!isMobile && focusedElementPos && focusWeight > 0.01) {
      const targetX = focusedElementPos.x * 5 * xLimitScale;
      const targetY = focusedElementPos.y * 3;
      x = MathUtils.lerp(x, targetX, 0.85 * focusWeight);
      y = MathUtils.lerp(y, targetY, 0.85 * focusWeight);
      z = MathUtils.lerp(z, -1.2, 0.85 * focusWeight);
    }

    // ── Maneuver Overrides ──
    const timeInManeuver = time - maneuverStartTime.value;
    if (timeInManeuver > 0 && timeInManeuver < maneuverDuration.value) {
      const progress = timeInManeuver / maneuverDuration.value;
      const easeProgress =
        progress < 0.5 ? 4 * progress * progress * progress : 1 - (-2 * progress + 2) ** 3 / 2;
      const envelope = Math.sin(easeProgress * Math.PI);

      if (currentManeuver.value === 'CLOSE_VISIT') {
        z = MathUtils.lerp(z, 3.8, envelope);
        x = MathUtils.lerp(x, Math.sin(time * 0.5) * 1.5 * xLimitScale, envelope);
        y = MathUtils.lerp(y, Math.cos(time * 0.4) * 0.5, envelope);
      } else if (currentManeuver.value === 'DISTANT_PROBE') {
        z = MathUtils.lerp(z, -18, envelope);
        x = MathUtils.lerp(x, x * 1.5, envelope);
      } else if (!isMobile && currentManeuver.value === 'FOLLOW_MOUSE' && !focusedElementPos) {
        const mouseX = mouseNormalized.x * 8 * xLimitScale;
        const mouseY = mouseNormalized.y * -5;
        x = MathUtils.lerp(x, mouseX + Math.sin(time * 2) * 0.5, envelope);
        y = MathUtils.lerp(y, mouseY + Math.cos(time * 2) * 0.5, envelope);
        z = MathUtils.lerp(z, -1.5, envelope);
      } else if (currentManeuver.value === 'LOOPING') {
        const radius = 2.5 * envelope;
        const angle = progress * Math.PI * 2;
        y += Math.sin(angle) * radius;
        z += (Math.cos(angle) - 1.0) * radius;
      }
    }

    target.set(x, y, z);
  }

  /**
   * Triggers a random maneuver, selecting from CLOSE_VISIT, DISTANT_PROBE,
   * LOOPING, or FOLLOW_MOUSE (desktop only).
   */
  function triggerManeuver(
    time: number,
    focusedElementPos: FocusTarget | null,
    screenWidth: number
  ): void {
    if (focusedElementPos) return;

    const isMobile = screenWidth < 768;
    const r = Math.random();

    if (r < 0.3) {
      currentManeuver.value = 'CLOSE_VISIT';
      maneuverDuration.value = 6;
    } else if (r < 0.5) {
      currentManeuver.value = 'DISTANT_PROBE';
      maneuverDuration.value = 8;
    } else if (r < 0.75) {
      currentManeuver.value = 'LOOPING';
      maneuverDuration.value = 5;
    } else {
      currentManeuver.value = isMobile ? 'CLOSE_VISIT' : 'FOLLOW_MOUSE';
      maneuverDuration.value = 10;
    }

    maneuverStartTime.value = time;
    nextManeuverCheck = time + maneuverDuration.value + 12 + Math.random() * 8;
  }

  // ───────────────────────────────────
  //  Per-Frame Update
  // ───────────────────────────────────

  interface UpdateParams {
    elapsed: number;
    delta: number;
    focusedElementPos: FocusTarget | null;
    /** Mouse position normalized to -0.5..0.5 range */
    mouseNormalized: { x: number; y: number };
    screenWidth: number;
  }

  interface UpdateResult {
    /** Final world position for the drone group */
    position: Vector3;
    /** Rotation quaternion for slerp */
    quaternion: typeof droneDummyObj.quaternion;
    /** Whether the drone is in a very close visit (within 2.5 units of camera) */
    isVeryClose: boolean;
    /** Whether a scan should start this frame */
    shouldStartScan: boolean;
    /** Current scan progress (0–1) if scan is active, null otherwise */
    scanProgress: number | null;
    /** Whether scan just completed this frame */
    scanJustCompleted: boolean;
  }

  function update(params: UpdateParams): UpdateResult {
    const { elapsed, delta, focusedElementPos, mouseNormalized, screenWidth } = params;
    const xLimitScale = Math.max(0.35, Math.min(1.0, screenWidth / 1200));

    // ── Update Focus Weight ──
    if (focusedElementPos) {
      if (focusedElementPos !== lastFocusedElement) {
        focusStartTime = elapsed;
        lastFocusedElement = focusedElementPos;
      }
      const focusAge = elapsed - focusStartTime;
      const targetWeight = focusAge < cfg.maxFocusDuration ? 1.0 : 0.0;
      focusWeight = MathUtils.lerp(focusWeight, targetWeight, delta * 3);
    } else {
      focusWeight = MathUtils.lerp(focusWeight, 0.0, delta * 4);
      lastFocusedElement = null;
    }

    // ── Trigger Maneuvers ──
    if (elapsed > nextManeuverCheck) {
      triggerManeuver(elapsed, focusedElementPos, screenWidth);
    }

    // ── Reset Finished Maneuvers ──
    if (
      currentManeuver.value !== 'IDLE' &&
      elapsed > maneuverStartTime.value + maneuverDuration.value
    ) {
      currentManeuver.value = 'IDLE';
    }

    // ── Compute target position ──
    getOrganicFlightPosition(elapsed, _targetPos, focusedElementPos, mouseNormalized, screenWidth);

    // ── Spring-Damper Physics ──
    const springForce = _targetPos.clone().sub(droneCurrentPos).multiplyScalar(cfg.springStrength);
    droneVelocity.add(springForce.multiplyScalar(delta));

    const dampingFactor = cfg.damping ** (delta * 60);
    droneVelocity.multiplyScalar(dampingFactor);
    droneCurrentPos.add(droneVelocity.clone().multiplyScalar(delta));

    // ── Micro-hover bobbing ──
    const hoverY = Math.sin(elapsed * 3.5) * 0.1;
    const finalPos = droneCurrentPos.clone();
    finalPos.y += hoverY;

    // ── Rotation (look-at + pitch/bank) ──
    getOrganicFlightPosition(
      elapsed + 0.4,
      _lookAtPos,
      focusedElementPos,
      mouseNormalized,
      screenWidth
    );

    // Bento Card Inspection — look directly at the card
    if (focusedElementPos && focusWeight > 0.1) {
      const focusX = focusedElementPos.x * 5 * xLimitScale;
      const focusY = focusedElementPos.y * 3;
      _lookAtPos.set(focusX, focusY, -2.0);
    } else if (currentManeuver.value === 'IDLE') {
      // Mouse curiosity when idle
      _lookAtPos.x += mouseNormalized.x * 5 * 0.5;
      _lookAtPos.y += mouseNormalized.y * -3 * 0.5;
    }

    // Face Look — look at camera when very close
    const distToCam = droneCurrentPos.distanceTo(new Vector3(0, 0, 5));
    const isVeryClose = currentManeuver.value === 'CLOSE_VISIT' && distToCam < 2.5;
    if (isVeryClose) {
      _lookAtPos.set(0, 0, 8);
    }

    droneDummyObj.position.copy(droneCurrentPos);
    droneDummyObj.lookAt(_lookAtPos);

    // Dynamic pitch from vertical climb/dive
    const vY = _targetPos.y - droneCurrentPos.y;
    const targetPitch = -vY * 0.8;

    // Dynamic bank (roll) from turning
    const yawDiff =
      droneDummyObj.rotation.y - (droneDummyObj.userData.lastYaw ?? droneDummyObj.rotation.y);
    droneDummyObj.userData.lastYaw = droneDummyObj.rotation.y;
    const normYaw = Math.atan2(Math.sin(yawDiff), Math.cos(yawDiff));
    const targetBank = normYaw * 1.5;

    droneDummyObj.rotateX(targetPitch);
    droneDummyObj.rotateZ(targetBank);

    // ── Scan Timing ──
    let shouldStartScan = false;
    let scanProgress: number | null = null;
    let scanJustCompleted = false;

    if (elapsed - lastScanTime >= cfg.scanInterval && !scanActive) {
      scanActive = true;
      scanElapsed = 0;
      lastScanTime = elapsed;
      shouldStartScan = true;
    }

    if (scanActive) {
      scanElapsed += delta;
      scanProgress = Math.min(scanElapsed / cfg.scanDuration, 1);

      if (scanProgress >= 1) {
        scanActive = false;
        scanJustCompleted = true;
        scanProgress = null;
      }
    }

    return {
      position: finalPos,
      quaternion: droneDummyObj.quaternion,
      isVeryClose,
      shouldStartScan,
      scanProgress,
      scanJustCompleted,
    };
  }

  /**
   * Returns a snapshot of the internal state — useful for unit tests.
   */
  function getState(): DroneFlightState {
    return {
      currentManeuver,
      position: droneCurrentPos.clone(),
      velocity: droneVelocity.clone(),
      rotationHelper: droneDummyObj,
      scanActive,
      scanElapsed,
      focusWeight,
    };
  }

  /**
   * Resets the scan state — called when leaving content phase mid-scan.
   */
  function resetScan(): void {
    scanActive = false;
    scanElapsed = 0;
  }

  return {
    currentManeuver,
    update,
    getState,
    resetScan,
    getOrganicFlightPosition,
    triggerManeuver,
  };
}
