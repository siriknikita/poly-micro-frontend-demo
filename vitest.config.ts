import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/__tests__/**',
        '**/*.d.ts',
        '**/index.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@shared': resolve(__dirname, './src/components/shared'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@types': resolve(__dirname, './src/types'),
      '@helpers': resolve(__dirname, './src/helpers'),
      '@constants': resolve(__dirname, './src/helpers/constants.tsx'),
      '@data': resolve(__dirname, './src/data'),
      '@tests': resolve(__dirname, './src/__tests__'),
    },
  },
});
