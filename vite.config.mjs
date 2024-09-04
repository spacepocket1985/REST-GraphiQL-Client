import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    watch: false,
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      extension: ['ts', 'tsx', 'js'],
      include: ['src'],
      exclude: ['src/constants', 'src/__tests__'],
      all: true,
    },
  },
});
