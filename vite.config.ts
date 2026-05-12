/// <reference types="vitest" />

import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { templateCompilerOptions } from '@tresjs/core';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue({
      ...templateCompilerOptions,
    }),
    tailwindcss(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@shaders': fileURLToPath(new URL('./src/shaders', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1050,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@tresjs')) {
            return 'three-vendor';
          }
        },
      },
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      exclude: [
        'src/components/layout/ResilienceLayer.vue',
        'src/components/layout/WebGLBackground.vue',
        'src/components/navigation/NavConveyor.vue',
        'src/components/features/HeroSection.vue',
        'src/components/features/ProjectsSection.vue',
        'src/components/features/SkillsAbout.vue',
        'src/components/navigation/BackToTop.vue',
        'src/types/webgl.ts',
        'src/components/layout/WebGLScene.vue',
        'src/shaders/**',
        'src/components/layout/BentoLayout.vue',
        'src/stores/viewport.ts',
      ],
    },
  },
});
