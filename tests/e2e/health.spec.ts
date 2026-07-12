import { test, expect } from '@playwright/test'

test('health endpoint returns ok status', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.ok()).toBeTruthy()
  const data = await response.json()
  
  expect(data.status).toBe('ok')
  expect(['error', 'ok']).toContain(data.database)
  expect(['error', 'ok']).toContain(data.redis)
  expect(data.version).toBeDefined()
})
