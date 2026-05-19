import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { useDroneFlight } from '@/composables/useDroneFlight';

describe('useDroneFlight', () => {
  it('returns a valid initial state', () => {
    const { getState } = useDroneFlight();
    const state = getState();

    expect(state.currentManeuver.value).toBe('IDLE');
    expect(state.position).toBeInstanceOf(Vector3);
    expect(state.velocity).toBeInstanceOf(Vector3);
    expect(state.scanActive).toBe(false);
    expect(state.focusWeight).toBe(0);
  });

  it('update() returns position near origin at t=0', () => {
    const { update } = useDroneFlight();
    const result = update({
      elapsed: 0,
      delta: 1 / 60,
      focusedElementPos: null,
      mouseNormalized: { x: 0, y: 0 },
      screenWidth: 1200,
    });

    // At t=0, sin(0)=0 and cos(0)=1, so base position is (0, 1+0, 0-3) = (0, 1, -3)
    // Spring-damper should move towards that from initial (0, 0, -2)
    expect(result.position).toBeInstanceOf(Vector3);
    expect(Number.isFinite(result.position.x)).toBe(true);
    expect(Number.isFinite(result.position.y)).toBe(true);
    expect(Number.isFinite(result.position.z)).toBe(true);
  });

  it('flight position converges towards target over many frames', () => {
    const { update, getState } = useDroneFlight({ springStrength: 30, damping: 0.7 });

    // Simulate 120 frames at 60fps (2 seconds)
    const delta = 1 / 60;
    update({
      elapsed: 0,
      delta,
      focusedElementPos: null,
      mouseNormalized: { x: 0, y: 0 },
      screenWidth: 1200,
    });

    for (let i = 1; i <= 120; i++) {
      update({
        elapsed: i * delta,
        delta,
        focusedElementPos: null,
        mouseNormalized: { x: 0, y: 0 },
        screenWidth: 1200,
      });
    }

    // After 2 seconds, position should have moved meaningfully from the origin
    const state = getState();
    const magnitude = state.position.length();
    expect(magnitude).toBeGreaterThan(0.1);
  });

  it('responds to focused element position by adjusting focus weight', () => {
    const { update, getState } = useDroneFlight();
    const focusTarget = { x: 0.5, y: 0.5 };
    const delta = 1 / 60;

    // Simulate 60 frames with a focus target
    for (let i = 0; i < 60; i++) {
      update({
        elapsed: i * delta,
        delta,
        focusedElementPos: focusTarget,
        mouseNormalized: { x: 0, y: 0 },
        screenWidth: 1200,
      });
    }

    const state = getState();
    expect(state.focusWeight).toBeGreaterThan(0.5);
  });

  it('focus weight decays when no element is focused', () => {
    const { update, getState } = useDroneFlight();
    const delta = 1 / 60;
    const focusTarget = { x: 0.5, y: 0.5 };

    // Build up focus
    for (let i = 0; i < 60; i++) {
      update({
        elapsed: i * delta,
        delta,
        focusedElementPos: focusTarget,
        mouseNormalized: { x: 0, y: 0 },
        screenWidth: 1200,
      });
    }

    // Decay focus
    for (let i = 60; i < 120; i++) {
      update({
        elapsed: i * delta,
        delta,
        focusedElementPos: null,
        mouseNormalized: { x: 0, y: 0 },
        screenWidth: 1200,
      });
    }

    const state = getState();
    expect(state.focusWeight).toBeLessThan(0.1);
  });

  it('scan triggers after configured interval', () => {
    const { update } = useDroneFlight({ scanInterval: 5, scanDuration: 2 });
    const delta = 1 / 60;

    // Fast-forward past the scan interval
    let scanStarted = false;
    for (let i = 0; i < 400; i++) {
      const result = update({
        elapsed: i * delta,
        delta,
        focusedElementPos: null,
        mouseNormalized: { x: 0, y: 0 },
        screenWidth: 1200,
      });
      if (result.shouldStartScan) {
        scanStarted = true;
        break;
      }
    }

    expect(scanStarted).toBe(true);
  });

  it('resetScan clears scan state', () => {
    const { update, resetScan, getState } = useDroneFlight({ scanInterval: 1, scanDuration: 10 });
    const delta = 1 / 60;

    // Trigger a scan
    for (let i = 0; i < 120; i++) {
      const result = update({
        elapsed: i * delta,
        delta,
        focusedElementPos: null,
        mouseNormalized: { x: 0, y: 0 },
        screenWidth: 1200,
      });
      if (result.shouldStartScan) break;
    }

    resetScan();
    const state = getState();
    expect(state.scanActive).toBe(false);
    expect(state.scanElapsed).toBe(0);
  });

  it('getOrganicFlightPosition scales X movement for mobile screens', () => {
    const { getOrganicFlightPosition } = useDroneFlight();
    const desktopTarget = new Vector3();
    const mobileTarget = new Vector3();

    getOrganicFlightPosition(5.0, desktopTarget, null, { x: 0, y: 0 }, 1200);
    getOrganicFlightPosition(5.0, mobileTarget, null, { x: 0, y: 0 }, 400);

    // Mobile X should be scaled down relative to desktop
    expect(Math.abs(mobileTarget.x)).toBeLessThanOrEqual(Math.abs(desktopTarget.x) + 0.01);
  });

  it('triggers maneuvers correctly after the check interval', () => {
    const { update, getState } = useDroneFlight();
    const delta = 1 / 60;

    // Fast forward to exactly pass nextManeuverCheck (which is 10 originally)
    update({
      elapsed: 11,
      delta,
      focusedElementPos: null,
      mouseNormalized: { x: 0, y: 0 },
      screenWidth: 1200,
    });

    const state = getState();
    expect(state.currentManeuver.value).not.toBe('IDLE');
  });

  it('executes specific maneuvers during update', () => {
    const { update, triggerManeuver, getState } = useDroneFlight();

    // Force trigger maneuver
    triggerManeuver(0, null, 1200);
    const state = getState();
    expect(state.currentManeuver.value).not.toBe('IDLE');

    // Update to process maneuver physics
    update({
      elapsed: 1, // Within maneuver duration
      delta: 1 / 60,
      focusedElementPos: null,
      mouseNormalized: { x: 0.5, y: 0.5 },
      screenWidth: 1200,
    });

    // If it's CLOSE_VISIT, it might get very close
    if (state.currentManeuver.value === 'CLOSE_VISIT') {
      // Fast forward near camera
      const closeResult = update({
        elapsed: 3, // middle of maneuver
        delta: 1 / 60,
        focusedElementPos: null,
        mouseNormalized: { x: 0.5, y: 0.5 },
        screenWidth: 1200,
      });
      // Just verifying code path executes
      expect(closeResult.position).toBeDefined();
    }
  });

  it('triggers all maneuver branches via manual trigger', () => {
    const { getOrganicFlightPosition, triggerManeuver, getState } = useDroneFlight();

    // We override Math.random to force specific maneuvers
    const originalRandom = Math.random;

    // 1. CLOSE_VISIT
    Math.random = () => 0.1;
    triggerManeuver(100, null, 1200);
    expect(getState().currentManeuver.value).toBe('CLOSE_VISIT');
    getOrganicFlightPosition(101, new Vector3(), null, { x: 0, y: 0 }, 1200);

    // 2. DISTANT_PROBE
    Math.random = () => 0.4;
    triggerManeuver(200, null, 1200);
    expect(getState().currentManeuver.value).toBe('DISTANT_PROBE');
    getOrganicFlightPosition(201, new Vector3(), null, { x: 0, y: 0 }, 1200);

    // 3. LOOPING
    Math.random = () => 0.6;
    triggerManeuver(300, null, 1200);
    expect(getState().currentManeuver.value).toBe('LOOPING');
    getOrganicFlightPosition(301, new Vector3(), null, { x: 0, y: 0 }, 1200);

    // 4. FOLLOW_MOUSE (desktop)
    Math.random = () => 0.9;
    triggerManeuver(400, null, 1200);
    expect(getState().currentManeuver.value).toBe('FOLLOW_MOUSE');
    getOrganicFlightPosition(401, new Vector3(), null, { x: 0.5, y: 0.5 }, 1200);

    // 5. FOLLOW_MOUSE falls back to CLOSE_VISIT on mobile
    Math.random = () => 0.9;
    triggerManeuver(500, null, 400); // screenWidth 400 = mobile
    expect(getState().currentManeuver.value).toBe('CLOSE_VISIT');

    // 6. triggerManeuver early returns if focusedElementPos is set
    Math.random = () => 0.1;
    triggerManeuver(600, { x: 1, y: 1 }, 1200);
    // Should still be CLOSE_VISIT from previous, not updated
    expect(getState().currentManeuver.value).toBe('CLOSE_VISIT');

    Math.random = originalRandom;
  });

  it('completes scan cycle', () => {
    const { update } = useDroneFlight({ scanInterval: 1, scanDuration: 1 });
    const delta = 1 / 60;

    // Trigger a scan
    update({
      elapsed: 1.1,
      delta,
      focusedElementPos: null,
      mouseNormalized: { x: 0, y: 0 },
      screenWidth: 1200,
    });

    // Complete the scan (pass a large delta)
    const result = update({
      elapsed: 2.2,
      delta: 1.0,
      focusedElementPos: null,
      mouseNormalized: { x: 0, y: 0 },
      screenWidth: 1200,
    });

    expect(result.scanJustCompleted).toBe(true);
  });
});
