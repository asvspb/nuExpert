import { test, expect } from '@playwright/test'
import type { User } from '../../shared/schemas'

test.describe('Users API', () => {
  test('creates a user and retrieves it', async ({ request }) => {
    // 1. Create a user
    const postRes = await request.post('/api/users', {
      data: {
        username: 'e2e_user',
        email: 'e2e@example.com',
        fullName: 'E2E Tester'
      }
    })
    expect(postRes.ok()).toBeTruthy()
    const newUser = await postRes.json()
    expect(newUser.username).toBe('e2e_user')
    expect(newUser.fullName).toBe('E2E Tester')
    expect(newUser.id).toBeDefined()

    // 2. Fetch all users and verify
    const getRes = await request.get('/api/users')
    expect(getRes.ok()).toBeTruthy()
    const users = await getRes.json()
    
    // Validate the created user is in the list
    const foundUser = (users as User[]).find((u) => u.username === 'e2e_user')
    expect(foundUser).toBeDefined()
    expect(foundUser?.email).toBe('e2e@example.com')
    expect(foundUser?.fullName).toBe('E2E Tester')
  })
})
