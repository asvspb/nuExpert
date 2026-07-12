import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    exclude: ['node_modules', 'tests/e2e/**', '.nuxt/**', 'playwright-report/**', 'coverage/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['app/**', 'server/**', 'shared/**'],
      exclude: ['**/*.spec.ts', 'server/database/migrations/**'],
      all: true,
      thresholds: {
        lines: 60,
        functions: 50,
        branches: 50,
        statements: 60
      }
    }
  }
})
