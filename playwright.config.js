import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 3000 * 1000,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'https://app.thetestingacademy.com/playwright/ttacart/',
  },
  projects: [
    {
      name: 'chromium',
      testDir: './tests',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
  ],
});