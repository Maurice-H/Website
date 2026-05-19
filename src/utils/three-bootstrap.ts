import { BufferAttribute, type Mesh, Object3D } from 'three';

/**
 * Global Three.js bootstrap — executed once in main.ts before the Vue app mounts.
 *
 * TresJS memory profiler crashes if it encounters a Mesh without a position attribute
 * (e.g. HighlightMesh from DevTools). We intercept all traverses to guarantee stability.
 */
export function bootstrapThreeJS(): void {
  const originalTraverse = Object3D.prototype.traverse;

  Object3D.prototype.traverse = function (callback: (object: Object3D) => unknown) {
    if ((this as unknown as { isMesh: boolean }).isMesh) {
      const mesh = this as unknown as Mesh;
      if (mesh.geometry && !mesh.geometry.attributes.position) {
        mesh.geometry.setAttribute('position', new BufferAttribute(new Float32Array([0, 0, 0]), 3));
      }
    }
    return originalTraverse.call(this, callback);
  };
}
