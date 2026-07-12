import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    exclude: ['node_modules', 'tests/e2e/**', '.nuxt/**', 'playwright-report/**', 'coverage/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['app/**', 'server/**', 'shared/**'],
      exclude: [
        '**/*.spec.ts', 
        'server/database/migrations/**',
        'app/pages/demo/**',
        'app/components/demo/**',
        'server/api/demo/**',
        'server/database/demo-schema.ts',
        'shared/schemas/demo.ts'
      ],
      all: true,
      thresholds: {
        lines: 50,
        functions: 40,
        branches: 40,
        statements: 50
      }
    }
  }
})
