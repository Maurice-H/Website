import {
  Box3,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Texture,
  Vector3,
} from 'three';
import { describe, expect, it, vi } from 'vitest';
import {
  grayscaleTexture,
  normalizeModel,
  prepareForScreenBlend,
  recolorAccentMeshes,
} from '../glb-helpers';

describe('glb-helpers', () => {
  describe('grayscaleTexture', () => {
    it('returns null if no texture or image provided', () => {
      expect(grayscaleTexture(null)).toBeNull();
      const tex = new Texture();
      expect(grayscaleTexture(tex)).toBe(tex);
    });

    it('processes image and returns a CanvasTexture', () => {
      const tex = new Texture();
      const img = { width: 4, height: 4 };
      tex.image = img;

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 4,
            height: 4,
            getContext: vi.fn(() => ({
              drawImage: vi.fn(),
              getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(16) })),
              putImageData: vi.fn(),
            })),
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement.call(document, tagName);
      });

      const result = grayscaleTexture(tex);
      expect(result).not.toBeNull();
      expect(result).not.toBe(tex);

      vi.restoreAllMocks();
    });
  });

  describe('normalizeModel', () => {
    it('scales and centers a model based on visible meshes', () => {
      const group = new Group();
      const mesh = new Mesh();

      // Mock bounding box for testing
      mesh.geometry.computeBoundingBox = vi.fn(() => {
        mesh.geometry.boundingBox = new Box3(new Vector3(-5, -5, -5), new Vector3(5, 5, 5));
      });
      mesh.geometry.boundingBox = new Box3(new Vector3(-5, -5, -5), new Vector3(5, 5, 5));

      group.add(mesh);

      normalizeModel(group, 2);

      // Expected scale factor = targetSize (2) / maxDimension (10) = 0.2
      expect(group.scale.x).toBeCloseTo(0.2);
      expect(group.scale.y).toBeCloseTo(0.2);
      expect(group.scale.z).toBeCloseTo(0.2);
    });
  });

  describe('prepareForScreenBlend', () => {
    it('hides meshes with shadow/collision in name', () => {
      const group = new Group();
      const mesh = new Mesh(undefined, new MeshStandardMaterial());
      mesh.name = 'shadow_plane';
      group.add(mesh);

      prepareForScreenBlend(group);
      expect(mesh.visible).toBe(false);
    });

    it('processes MeshStandardMaterial correctly', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial({ color: 0xffffff }); // Light color
      const mesh = new Mesh(undefined, mat);
      group.add(mesh);

      prepareForScreenBlend(group);
      expect(mesh.userData.__originalColor).toBeDefined();
      expect(mat.emissiveIntensity).toBe(0.8);
      // Light color should be darkened
      const hsl = { h: 0, s: 0, l: 0 };
      mat.color.getHSL(hsl);
      expect(hsl.l).toBeCloseTo(0.35);
    });

    it('processes MeshBasicMaterial correctly', () => {
      const group = new Group();
      const mat = new MeshBasicMaterial({ color: 0x888888 });
      const mesh = new Mesh(undefined, mat);
      group.add(mesh);

      prepareForScreenBlend(group);
      expect(mat.color.getHex()).not.toBe(0x888888); // Lightness increased
    });
  });

  describe('recolorAccentMeshes', () => {
    it('recolors UfoMaterial correctly', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial();
      mat.userData.isUfoMaterial = true;
      const mesh = new Mesh(undefined, mat);
      mesh.userData.__originalEmissive = new Color();
      group.add(mesh);

      recolorAccentMeshes(group, '#ff0000');
      expect(mat.emissive.getHexString()).toBe('ff0000');
      expect(mat.emissiveIntensity).toBe(0.9);
    });

    it('recolors lens/accent meshes based on name', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial();
      mat.name = 'glow_mat';
      const mesh = new Mesh(undefined, mat);
      mesh.userData.__originalEmissive = new Color();
      group.add(mesh);

      recolorAccentMeshes(group, '#00ff00');
      expect(mat.emissive.getHexString()).toBe('00ff00');
    });

    it('recolors green hue materials', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial();
      mat.color.setHSL(0.35, 1.0, 0.5); // Green hue
      const mesh = new Mesh(undefined, mat);
      mesh.userData.__originalColor = mat.color.clone();
      mesh.userData.__originalEmissive = new Color(); // Black emissive
      group.add(mesh);

      recolorAccentMeshes(group, '#0000ff');
      expect(mat.color.getHexString()).toBe('0000ff');
      expect(mat.emissive.getHexString()).toBe('0000ff');
    });

    it('recolors lens mesh by name', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial();
      mat.name = 'lens_material';
      const mesh = new Mesh(undefined, mat);
      mesh.userData.__originalEmissive = new Color();
      group.add(mesh);

      recolorAccentMeshes(group, '#ff00ff');
      expect(mat.emissive.getHexString()).toBe('ff00ff');
      expect(mat.emissiveIntensity).toBe(1.0);
    });

    it('recolors mesh with emissive map via hadEmissiveMap flag', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial();
      mat.emissiveMap = new Texture();
      const mesh = new Mesh(undefined, mat);
      mesh.userData.__originalEmissive = new Color();
      mesh.userData.__hadEmissiveMap = true;
      group.add(mesh);

      recolorAccentMeshes(group, '#aabbcc');
      expect(mat.emissive.getHexString()).toBe('aabbcc');
    });

    it('skips non-green, non-accent mesh', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial();
      mat.color.setHSL(0.0, 1.0, 0.5); // Red hue — not green
      const mesh = new Mesh(undefined, mat);
      mesh.userData.__originalEmissive = mat.emissive.clone();
      mesh.userData.__originalColor = mat.color.clone();
      group.add(mesh);

      const originalHex = mat.emissive.getHexString();
      recolorAccentMeshes(group, '#00ff00');
      // Should remain unchanged since it's not a green hue
      expect(mat.emissive.getHexString()).toBe(originalHex);
    });

    it('skips mesh without __originalEmissive', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial();
      const mesh = new Mesh(undefined, mat);
      group.add(mesh);

      // Should not crash
      recolorAccentMeshes(group, '#ff0000');
    });
  });

  describe('normalizeModel edge cases', () => {
    it('handles empty scene (no meshes)', () => {
      const group = new Group();
      normalizeModel(group, 2);
      // Should not crash, scale should remain at default 1
      expect(group.scale.x).toBe(1);
    });
  });

  describe('prepareForScreenBlend edge cases', () => {
    it('hides collision and proxy meshes', () => {
      const group = new Group();
      const collisionMesh = new Mesh(undefined, new MeshStandardMaterial());
      collisionMesh.name = 'collision_box';
      const proxyMesh = new Mesh(undefined, new MeshStandardMaterial());
      proxyMesh.name = 'proxy_geo';
      group.add(collisionMesh, proxyMesh);

      prepareForScreenBlend(group);
      expect(collisionMesh.visible).toBe(false);
      expect(proxyMesh.visible).toBe(false);
    });

    it('skips transparent mesh with very low opacity', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial({ transparent: true, opacity: 0.01 });
      const mesh = new Mesh(undefined, mat);
      group.add(mesh);

      prepareForScreenBlend(group);
      // Should not have set __originalEmissive since it was skipped
      expect(mesh.userData.__originalEmissive).toBeUndefined();
    });

    it('handles dark-colored MeshStandardMaterial', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial({ color: 0x111111 }); // Very dark
      const mesh = new Mesh(undefined, mat);
      group.add(mesh);

      prepareForScreenBlend(group);
      const hsl = { h: 0, s: 0, l: 0 };
      mat.color.getHSL(hsl);
      expect(hsl.l).toBeCloseTo(0.35);
    });

    it('handles transparent glass material without solid override', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial({ transparent: true, opacity: 0.5 });
      const mesh = new Mesh(undefined, mat);
      group.add(mesh);

      prepareForScreenBlend(group);
      // Glass should preserve original metalness/roughness
      expect(mesh.userData.__originalEmissive).toBeDefined();
    });

    it('handles UFO material with emissive map', () => {
      const group = new Group();
      const mat = new MeshStandardMaterial();
      mat.userData.isUfoMaterial = true;
      mat.emissiveMap = new Texture();
      const mesh = new Mesh(undefined, mat);
      group.add(mesh);

      prepareForScreenBlend(group);
      expect(mat.userData.__grayscaledEmissive).toBe(true);
    });
  });
});
