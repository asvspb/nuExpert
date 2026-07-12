import { describe, it, expect, vi } from 'vitest'
import { getDb, initDb, closeDb } from '../../server/database/db'
import { userCreateSchema } from '../../shared/schemas'

vi.mock('postgres', () => ({
  default: vi.fn(() => ({ end: vi.fn(), options: { parsers: {} } }))
}))

vi.mock('drizzle-orm/postgres-js', () => ({
  drizzle: vi.fn(() => ({}))
}))

describe('Zod Schemas Validation', () => {
  it('validates a correct user', () => {
    const result = userCreateSchema.safeParse({
      username: 'testuser',
      email: 'test@example.com'
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = userCreateSchema.safeParse({
      username: 'testuser',
      email: 'not-an-email'
    })
    expect(result.success).toBe(false)
  })
})

describe('Database Client', () => {
  it('throws an error if DB is not initialized', () => {
    expect(() => getDb()).toThrow('Database is not initialized')
  })

  it('can be initialized and closed', async () => {
    initDb('postgres://dummy')
    expect(getDb()).toBeDefined()
    await closeDb()
  })
})
