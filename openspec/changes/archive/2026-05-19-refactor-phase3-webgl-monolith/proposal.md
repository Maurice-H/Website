## Why

The current `WebGLScene.vue` is a massive 1300+ line "God Object". Following the recent migration to a WebGL pipeline using TresJS, the component has accumulated responsibilities including shader definitions, GLB model normalization, physics (drone flight logic), global Three.js monkey patching, and Vue reactivity. This structure is unmaintainable, violates enterprise standards, and prevents the scalable addition of new 3D features. We need to modularize it to leverage the true power of TresJS's component ecosystem.

## What Changes

- **BREAKING**: Extract global `Object3D.prototype.traverse` monkey patching out of the component layer and into an isolated, dedicated bootstrapping script that runs before the Vue app mounts.
- **Shader Extraction**: Move all hardcoded GLSL strings and shader injection logic from `WebGLScene.vue` into dedicated `.glsl` files or specialized `useShaders.ts` utilities.
- **Component Breakdown**: Break the monolithic scene into smaller, focused TresJS Vue components (e.g., `DroneEntity.vue`, `UfoEntity.vue`, `LightingEnvironment.vue`).
- **Physics Extraction**: Move the complex drone flight mathematics and physics state out of the rendering component into a dedicated `useDroneFlight.ts` composable.

## Capabilities

### New Capabilities
- `isolated-threejs-bootstrapping`: A system that ensures global WebGL/Three.js patches are applied safely outside the Vue component lifecycle.
- `webgl-shader-utilities`: A structured approach to managing, importing, and injecting custom GLSL shaders into TresJS materials.
- `tresjs-component-structure`: Defining the hierarchical requirements for composing complex 3D scenes out of modular Vue entities.

### Modified Capabilities
- (None - the visual output of the scene remains identical, only the internal architecture changes).

## Impact

- **Affected Code**: `src/components/layout/WebGLScene.vue`.
- **New Code**: Multiple new components within a new `src/components/webgl/` directory, new composables (`useDroneFlight.ts`), and new utility files (`src/utils/three-bootstrap.ts`).
- **System Quality**: Vastly improved maintainability, separation of concerns, and developer experience.
- **Performance**: Potentially improved frame rates due to reduced Vue reactivity overhead in the main scene component.

## Non-goals

- We will not add new 3D models or visual features in this phase; this is purely a structural refactoring.
- We will not migrate away from TresJS.

## Testing Strategy

- **Visual Regression**: Since this is a graphics-heavy refactoring without visual changes, testing will primarily rely on manual visual QA of the WebGL scene to ensure lighting, models, and physics behave identically.
- **Unit Tests**: Add unit tests for the extracted `useDroneFlight.ts` composable to verify its mathematical outputs independently of the rendering layer.
