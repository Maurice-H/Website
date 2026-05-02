import type { IUniform } from 'three';

export interface LightingUniforms {
  uMouse: IUniform<[number, number]>;
  uResolution: IUniform<[number, number]>;
  uTime: IUniform<number>;
  uThemeState: IUniform<number>; // e.g. 0.0 to 1.0 representing transition between states
  uLightingEnabled: IUniform<boolean>;
  uPhase: IUniform<number>; // 0.0 = NAV, 1.0 = CONTENT
  uAccentColor: IUniform<[number, number, number]>; // RGB accent for the lamp cone
}
