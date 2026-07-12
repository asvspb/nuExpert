import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'NUXT_TELEMETRY_DISABLED=1 npm run build && NUXT_TELEMETRY_DISABLED=1 npm run preview',
    url: 'http://localhost:3000/api/health',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
})
