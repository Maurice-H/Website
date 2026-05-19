import {
  Box3,
  CanvasTexture,
  Color,
  type Group,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  type Texture,
  Vector3,
} from 'three';

/**
 * Converts a texture's green-channel-heavy pixels to grayscale.
 * Used to neutralize baked-in green accent lights on GLB models (e.g. UFO)
 * so that `recolorAccentMeshes` can recolor them cleanly.
 */
export function grayscaleTexture(tex: Texture | null): Texture | null {
  if (!tex?.image) return tex;
  const img = tex.image as HTMLImageElement | ImageBitmap;

  const canvas = document.createElement('canvas');
  canvas.width = img.width || 1024;
  canvas.height = img.height || 1024;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return tex;

  try {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const sum = r + g + b || 1;
      const gRatio = g / sum;

      if (gRatio > 0.35 && g > 15) {
        const l = Math.min(255, (0.299 * r + 0.587 * g + 0.114 * b) * 2.0);
        data[i] = l;
        data[i + 1] = l;
        data[i + 2] = l;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const newTex = new CanvasTexture(canvas);
    newTex.flipY = tex.flipY;
    newTex.colorSpace = tex.colorSpace;
    newTex.wrapS = tex.wrapS;
    newTex.wrapT = tex.wrapT;
    newTex.magFilter = tex.magFilter;
    newTex.minFilter = tex.minFilter;
    newTex.needsUpdate = true;
    return newTex;
  } catch (e) {
    console.error('Grayscale texture failed:', e);
    return tex;
  }
}

/**
 * Normalizes a loaded GLB scene to fit within a target size.
 * Computes the bounding box ONLY using visible meshes, scales uniformly, and centers the model.
 */
export function normalizeModel(scene: Group, targetSize: number): void {
  const computeVisibleBox = (obj: Group) => {
    const box = new Box3();
    box.makeEmpty();
    obj.updateWorldMatrix(true, true);
    obj.traverse((child) => {
      if (child instanceof Mesh) {
        if (child.visible && child.geometry) {
          const geometry = child.geometry;
          if (!geometry.boundingBox) geometry.computeBoundingBox();
          if (geometry.boundingBox) {
            const childBox = geometry.boundingBox.clone();
            childBox.applyMatrix4(child.matrixWorld);
            box.union(childBox);
          }
        }
      }
    });
    return box;
  };

  const box = computeVisibleBox(scene);
  if (box.isEmpty()) return;

  const size = new Vector3();
  box.getSize(size);

  const maxDimension = Math.max(size.x, size.y, size.z);
  if (maxDimension === 0) return;

  const scaleFactor = targetSize / maxDimension;
  scene.scale.setScalar(scaleFactor);

  // Re-center after scaling using the scaled visible box
  const centerBox = computeVisibleBox(scene);
  const center = new Vector3();
  centerBox.getCenter(center);
  scene.position.sub(center);
}

/**
 * Makes GLB model materials visible through mix-blend-screen compositing.
 */
export function prepareForScreenBlend(scene: Group): void {
  scene.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;

    const mat = mesh.material as Material;

    const meshName = (mesh.name || '').toLowerCase();
    const matName = (mat.name || '').toLowerCase();
    if (
      meshName.includes('shadow') ||
      matName.includes('shadow') ||
      meshName.includes('collision') ||
      meshName.includes('proxy')
    ) {
      mesh.visible = false;
      return;
    }

    if (mat.transparent && mat.opacity < 0.05) return;

    if (mat instanceof MeshStandardMaterial) {
      if (!mesh.userData.__originalEmissive) {
        mesh.userData.__originalEmissive = mat.emissive.clone();
        mesh.userData.__hadEmissiveMap = !!mat.emissiveMap;
        mesh.userData.__originalColor = mat.color.clone();
      }

      // Any transparent mesh (glass, glow planes, particle emitters) should be excluded
      // from the solid-emissive override below, otherwise they turn into solid gray boxes.
      const isGlass = mat.transparent;

      if (!isGlass) {
        const hsl = { h: 0, s: 0, l: 0 };
        mat.color.getHSL(hsl);

        // Models with no diffuse map and pure-white base colors (l ≈ 1.0) render
        // as blinding white rectangles through mix-blend-screen. Darken them to a
        // visible-but-subtle level.
        if (!mat.map && hsl.l > 0.85) {
          mat.color.setHSL(hsl.h, hsl.s, 0.35);
        } else if (hsl.l < 0.15) {
          mat.color.setHSL(hsl.h, Math.max(hsl.s, 0.2), 0.35);
        }

        mat.emissive.copy(mat.color);
        mat.emissiveIntensity = 0.8;

        // The UFO has green lights painted directly into its texture maps.
        // By replacing the green with grayscale on the canvas, it allows `mat.emissive.set()`
        // in recolorAccentMeshes to work perfectly without complex shader hacks.
        if (mat.userData.isUfoMaterial) {
          if (mat.emissiveMap && !mat.userData.__grayscaledEmissive) {
            mat.emissiveMap = grayscaleTexture(mat.emissiveMap);
            mat.userData.__grayscaledEmissive = true;
          }
          mat.needsUpdate = true;
        }
      }

      mat.metalness = isGlass ? mat.metalness : Math.min(mat.metalness, 0.3);
      mat.roughness = isGlass ? mat.roughness : Math.max(mat.roughness, 0.4);
      mat.needsUpdate = true;
      return;
    }

    if (mat instanceof MeshBasicMaterial) {
      const hsl = { h: 0, s: 0, l: 0 };
      mat.color.getHSL(hsl);
      mat.color.setHSL(hsl.h, hsl.s, Math.min(hsl.l * 1.5, 1.0));
      mat.needsUpdate = true;
    }
  });
}

/**
 * Identifies meshes with green-hue emissive colors (HSL h ≈ 100-180°)
 * and shifts them to the target accent color, preserving lightness/saturation.
 */
export function recolorAccentMeshes(scene: Group, newColorHex: string): void {
  const targetColor = new Color(newColorHex);
  const targetHSL = { h: 0, s: 0, l: 0 };
  targetColor.getHSL(targetHSL);

  scene.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;

    const mat = mesh.material as MeshStandardMaterial;
    if (!(mat instanceof MeshStandardMaterial)) return;

    const original = mesh.userData.__originalEmissive as Color | undefined;
    if (!original) return;

    if (mat.userData.isUfoMaterial) {
      mat.emissive.set(newColorHex);
      mat.emissiveIntensity = 0.9;
      mat.needsUpdate = true;
      return;
    }

    if (mesh.userData.__hadEmissiveMap && mat.emissiveMap) {
      mat.emissive.set(newColorHex);
      mat.emissiveIntensity = 0.9;
      mat.needsUpdate = true;
      return;
    }

    const matName = (mat.name || '').toLowerCase();
    const meshName = (mesh.name || '').toLowerCase();
    const isLens =
      matName.includes('lens') ||
      matName.includes('glass') ||
      matName.includes('eye') ||
      meshName.includes('lens') ||
      meshName.includes('glass') ||
      meshName.includes('eye');

    const isAccent =
      matName.includes('glow') ||
      matName.includes('accent') ||
      matName.includes('light') ||
      matName.includes('neon') ||
      matName.includes('ring') ||
      matName.includes('emitter') ||
      meshName.includes('glow') ||
      meshName.includes('accent') ||
      meshName.includes('light') ||
      meshName.includes('neon') ||
      meshName.includes('ring') ||
      meshName.includes('emitter');

    if (isLens || isAccent) {
      mat.emissive.set(newColorHex);
      if (isAccent) mat.color.set(newColorHex);
      mat.emissiveIntensity = 1.0;
      mat.needsUpdate = true;
      return;
    }

    const hsl = { h: 0, s: 0, l: 0 };
    original.getHSL(hsl);
    let isGreenHue = hsl.h >= 0.278 && hsl.h <= 0.5 && hsl.s > 0.1;

    // Fallback: check original albedo color if emissive was black
    if (!isGreenHue && mesh.userData.__originalColor) {
      const origColor = mesh.userData.__originalColor as Color;
      origColor.getHSL(hsl);
      isGreenHue = hsl.h >= 0.278 && hsl.h <= 0.5 && hsl.s > 0.1;
    }

    if (isGreenHue) {
      mat.color.set(newColorHex);
      mat.emissive.set(newColorHex);
      mat.emissiveIntensity = 0.9;
      mat.needsUpdate = true;
      return;
    }
  });
}
