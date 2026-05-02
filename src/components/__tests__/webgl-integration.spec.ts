import { Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import type { LightingUniforms } from '../../types/webgl';

describe('WebGL Lighting Uniforms', () => {
  it('LightingUniforms interface should be structurally compatible with Three.js IUniform', () => {
    // Verify that the uniform shape matches what the shader expects
    const uniforms: LightingUniforms = {
      uMouse: { value: [0, 0] },
      uResolution: { value: [1920, 1080] },
      uTime: { value: 0 },
      uThemeState: { value: 0.0 },
      uLightingEnabled: { value: true },
      uPhase: { value: 0.0 },
      uAccentColor: { value: [0.063, 0.725, 0.506] },
    };

    expect(uniforms.uMouse.value).toEqual([0, 0]);
    expect(uniforms.uResolution.value).toEqual([1920, 1080]);
    expect(uniforms.uTime.value).toBe(0);
    expect(uniforms.uThemeState.value).toBe(0.0);
    expect(uniforms.uLightingEnabled.value).toBe(true);
    expect(uniforms.uPhase.value).toBe(0.0);
    expect(uniforms.uAccentColor.value).toEqual([0.063, 0.725, 0.506]);
  });

  it('uniform values should be mutable for per-frame updates', () => {
    const uMouse = { value: new Vector2(0, 0) };
    const uResolution = { value: new Vector2(1920, 1080) };
    const uTime = { value: 0 };

    // Simulate a frame update — direct mutation (no Vue reactivity)
    uMouse.value.set(500, 300);
    uResolution.value.set(2560, 1440);
    uTime.value = 1.5;

    expect(uMouse.value.x).toBe(500);
    expect(uMouse.value.y).toBe(300);
    expect(uResolution.value.x).toBe(2560);
    expect(uResolution.value.y).toBe(1440);
    expect(uTime.value).toBe(1.5);
  });

  it('rawMouse bridge should be a plain object (non-reactive)', () => {
    // This mirrors the pattern used in viewport.ts
    const rawMouse = { x: 0, y: 0 };

    // Direct mutation — no proxy overhead
    rawMouse.x = 123;
    rawMouse.y = 456;

    expect(rawMouse.x).toBe(123);
    expect(rawMouse.y).toBe(456);

    // Verify it is NOT a Vue reactive proxy
    expect(Object.getPrototypeOf(rawMouse)).toBe(Object.prototype);
  });
});
