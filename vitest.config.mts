import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const vitestConfig = defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['./tests/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup-test-environment.ts'],
    exclude: ['./src/**/*.*', './tests/e2e/**/*.*']
  }
});

export default vitestConfig;
