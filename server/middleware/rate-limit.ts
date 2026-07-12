import { getRedisClient } from '../utils/redis'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  const method = getMethod(event)
  
  if (path === '/api/logs' && method === 'POST') {
    const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
    const key = `rate-limit:logs:${ip}`
    
    try {
      const redis = getRedisClient()
      const current = await redis.incr(key)
      
      if (current === 1) {
        await redis.expire(key, 60)
      }
      
      if (current > 60) {
        throw createError({
          statusCode: 429,
          statusMessage: 'Too Many Requests',
          message: 'Rate limit exceeded (60 requests per minute)'
        })
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'statusCode' in err && (err as { statusCode?: number }).statusCode === 429) {
        throw err
      }
      console.error('Redis rate limit error:', err)
    }
  }
})
