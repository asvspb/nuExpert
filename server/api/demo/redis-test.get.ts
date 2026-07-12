import { getRedisClient } from '../../utils/redis'

export default defineEventHandler(async () => {
  const redis = getRedisClient()
  await redis.set('demo:key', 'value', 'EX', 60)
  const echo = await redis.get('demo:key')
  
  return { ok: true, echo }
})
