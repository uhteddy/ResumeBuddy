import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,svelte}'],
    exclude: ['**/node_modules/**', '**/build/**', '**/src-tauri/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/build/**', '**/src-tauri/**']
    }
  }
});