import { describe, it, expect, vi } from 'vitest'

vi.stubGlobal('defineEventHandler', (fn: any) => fn)
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { appVersion: '0.1.0' }
}))
vi.stubGlobal('readValidatedBody', vi.fn(async (event: any, validate: any) => {
  return validate(event.body)
}))
vi.stubGlobal('createError', (err: any) => err)
vi.stubGlobal('getRequestURL', (event: any) => new URL(`http://localhost${event.path}`))
vi.stubGlobal('getMethod', (event: any) => event.method)
vi.stubGlobal('getRequestIP', () => '127.0.0.1')

// dynamic imports are used inside the tests
// to ensure vi.stubGlobal is executed first.

vi.mock('../../server/database/db', () => ({
  checkDbHealth: vi.fn(() => Promise.resolve(true)),
  getDb: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => Promise.resolve([{ id: 1, username: 'testuser' }]))
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{ id: 2, username: 'newuser' }]))
      }))
    }))
  }))
}))

vi.mock('../../server/utils/redis', () => ({
  getRedisClient: vi.fn(() => ({
    ping: vi.fn(() => Promise.resolve('PONG')),
    incr: vi.fn(() => Promise.resolve(1)),
    expire: vi.fn(() => Promise.resolve(1))
  }))
}))

vi.mock('../../server/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn()
  }
}))

describe('API Handlers', () => {
  it('health endpoint returns ok', async () => {
    const { default: healthHandler } = await import('../../server/api/health.get')
    const res = await healthHandler({} as any)
    expect(res.status).toBe('ok')
    expect(res.database).toBe('ok')
    expect(res.redis).toBe('ok')
    expect(res.version).toBeDefined()
  })

  it('users GET returns list of users', async () => {
    const { default: usersGetHandler } = await import('../../server/api/users.get')
    const res = await usersGetHandler({} as any)
    expect(res).toEqual([{ id: 1, username: 'testuser' }])
  })

  it('users POST creates a new user', async () => {
    const { default: usersPostHandler } = await import('../../server/api/users.post')
    const res = await usersPostHandler({ body: { username: 'newuser', email: 'new@example.com' } } as any)
    expect(res).toEqual({ id: 2, username: 'newuser' })
  })

  it('users POST returns 409 on duplicate', async () => {
    const { default: usersPostHandler } = await import('../../server/api/users.post')
    // Mock db to throw 23505
    vi.mocked(await import('../../server/database/db')).getDb = vi.fn(() => ({
      insert: vi.fn(() => ({
        values: vi.fn(() => {
          const err = new Error('duplicate') as any
          err.code = '23505'
          throw err
        })
      }))
    })) as any

    try {
      await usersPostHandler({ body: { username: 'dup', email: 'dup@example.com' } } as any)
      expect.fail('Should throw')
    } catch (e: any) {
      expect(e.statusCode).toBe(409)
    }
  })

  it('logs POST handles a log event', async () => {
    const { default: logsPostHandler } = await import('../../server/api/logs.post')
    const res = await logsPostHandler({ body: { level: 'info', message: 'test log\nwith newline', timestamp: new Date().toISOString() } } as any)
    expect(res).toEqual({ success: true })
  })
})

describe('Rate Limit Middleware', () => {
  it('allows request within limit', async () => {
    const { default: rateLimitMiddleware } = await import('../../server/middleware/rate-limit')
    await rateLimitMiddleware({ path: '/api/logs', method: 'POST' } as any)
    expect(true).toBe(true) // Should not throw
  })

  it('throws 429 when limit exceeded', async () => {
    vi.mocked(await import('../../server/utils/redis')).getRedisClient = vi.fn(() => ({
      incr: vi.fn(() => Promise.resolve(61)), // exceeded
      expire: vi.fn(() => Promise.resolve(1))
    })) as any

    try {
      const { default: rateLimitMiddleware } = await import('../../server/middleware/rate-limit')
      await rateLimitMiddleware({ path: '/api/logs', method: 'POST' } as any)
      expect.fail('Should have thrown 429 error')
    } catch (e: any) {
      expect(e.statusCode).toBe(429)
    }
  })
})
