import { type Camera, Vector2, type Vector3 } from 'three';

/**
 * Projects a 3D point to 2D screen space coordinates (0..1).
 * Useful for aligning shader uniforms with 3D mesh positions.
 *
 * @param position The 3D position to project
 * @param camera The active camera
 * @returns Vector2 containing screen space x and y (0 to 1)
 */
export function projectToScreenSpace(position: Vector3, camera: Camera): Vector2 {
  const vector = position.clone();
  vector.project(camera);

  // Convert from NDC (-1..1) to screen space (0..1)
  // Note: Y is flipped in standard screen space (0 at top),
  // but many shaders prefer 0 at bottom.
  // We keep it as (0,0) = bottom-left for GLSL st coordinates.
  return new Vector2((vector.x + 1) / 2, (vector.y + 1) / 2);
}
