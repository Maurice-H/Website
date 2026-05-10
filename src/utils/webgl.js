import { Vector2, Vector3 } from 'three';
// Module-scoped working vector to prevent allocating a new Vector3 on every frame
const _workingVector = new Vector3();
/**
 * Projects a 3D point to 2D screen space coordinates (0..1).
 * Useful for aligning shader uniforms with 3D mesh positions.
 *
 * @param position The 3D position to project
 * @param camera The active camera
 * @param target Optional Vector2 to update with the result to avoid GC
 * @returns Vector2 containing screen space x and y (0 to 1)
 */
export function projectToScreenSpace(position, camera, target) {
    // Use the working vector to avoid GC pressure
    _workingVector.copy(position).project(camera);
    // Convert from NDC (-1..1) to screen space (0..1)
    // Note: Y is flipped in standard screen space (0 at top),
    // but many shaders prefer 0 at bottom.
    // We keep it as (0,0) = bottom-left for GLSL st coordinates.
    const x = (_workingVector.x + 1) / 2;
    const y = (_workingVector.y + 1) / 2;
    if (target) {
        return target.set(x, y);
    }
    return new Vector2(x, y);
}
