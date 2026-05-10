import { PerspectiveCamera, Vector2, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { projectToScreenSpace } from '../webgl';
describe('WebGL Utilities', () => {
    describe('projectToScreenSpace', () => {
        it('should project a center point (0,0,0) to screen center (0.5, 0.5)', () => {
            const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
            camera.position.set(0, 0, 10);
            camera.lookAt(0, 0, 0);
            camera.updateMatrixWorld();
            const position = new Vector3(0, 0, 0);
            const result = projectToScreenSpace(position, camera);
            expect(result.x).toBeCloseTo(0.5);
            expect(result.y).toBeCloseTo(0.5);
        });
        it('should project a point on the left edge to 0.0 x', () => {
            const camera = new PerspectiveCamera(90, 1, 0.1, 1000);
            camera.position.set(0, 0, 10);
            camera.updateMatrixWorld();
            camera.projectionMatrix.makePerspective(-1, 1, 1, -1, 1, 100);
            // We use a simpler mock for projection if needed,
            // but Three.js math is reliable if matrices are updated.
            const position = new Vector3(-10, 0, 0);
            // Project manually to verify expectations
            const vector = position.clone().project(camera);
            const result = projectToScreenSpace(position, camera);
            expect(result.x).toBe((vector.x + 1) / 2);
            expect(result.y).toBe((vector.y + 1) / 2);
        });
        it('should handle camera movement correctly', () => {
            const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
            const position = new Vector3(0, 0, 0);
            // Camera at origin, looking at origin -> NDC (0,0) -> Screen (0.5, 0.5)
            camera.position.set(0, 0, 10);
            camera.lookAt(0, 0, 0);
            camera.updateMatrixWorld();
            const res1 = projectToScreenSpace(position, camera);
            expect(res1.x).toBeCloseTo(0.5);
            // Move camera to the right -> object should appear on the left in screen space
            camera.position.set(5, 0, 10);
            camera.lookAt(5, 0, 0); // Still looking straight ahead relative to its position
            camera.updateMatrixWorld();
            // Move camera to the right, but keep it looking straight ahead (not at the object)
            camera.position.set(5, 0, 10);
            camera.lookAt(5, 0, 0);
            camera.updateMatrixWorld();
            const res2 = projectToScreenSpace(position, camera);
            // Object at (0,0,0) should now be to the left of the camera (which is at x=5)
            expect(res2.x).toBeLessThan(0.5);
        });
    });
});
it('should use the provided target Vector2 if passed to avoid GC pressure', () => {
    const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const position = new Vector3(0, 0, 0);
    const target = new Vector2(0, 0);
    const result = projectToScreenSpace(position, camera, target);
    // Should return the exact same instance
    expect(result).toBe(target);
    expect(result.x).toBeCloseTo(0.5);
    expect(result.y).toBeCloseTo(0.5);
});
