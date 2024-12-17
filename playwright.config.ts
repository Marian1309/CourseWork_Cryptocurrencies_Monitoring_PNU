import { type PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  testMatch: '**/*.test.ts',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:3000'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'safari',
      use: {
        ...devices['Desktop Safari']
      }
    }
  ],
  webServer: {
    command: 'bun run dev',
    port: 3000
  }
};

export default config;
